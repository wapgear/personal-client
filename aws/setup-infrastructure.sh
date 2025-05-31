#!/bin/bash

# One-time AWS Infrastructure Setup Script
# This script sets up Route53, CloudFront, and ACM certificates
# Run this once manually, then use GitHub Actions for app deployments

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 AWS Infrastructure Setup for Static Website${NC}"
echo -e "${BLUE}================================================${NC}"
echo ""

# Function to prompt for input with validation
prompt_input() {
    local prompt="$1"
    local var_name="$2"
    local validation_regex="$3"
    local error_msg="$4"
    
    while true; do
        echo -ne "${YELLOW}$prompt: ${NC}"
        read -r input
        
        if [[ -z "$input" ]]; then
            echo -e "${RED}❌ This field is required${NC}"
            continue
        fi
        
        if [[ -n "$validation_regex" ]] && ! [[ "$input" =~ $validation_regex ]]; then
            echo -e "${RED}❌ $error_msg${NC}"
            continue
        fi
        
        eval "$var_name='$input'"
        break
    done
}

# Function to prompt for sensitive input (hidden)
prompt_secret() {
    local prompt="$1"
    local var_name="$2"
    
    while true; do
        echo -ne "${YELLOW}$prompt: ${NC}"
        read -rs input
        echo ""
        
        if [[ -z "$input" ]]; then
            echo -e "${RED}❌ This field is required${NC}"
            continue
        fi
        
        eval "$var_name='$input'"
        break
    done
}

# Collect AWS credentials
echo -e "${BLUE}📋 AWS Credentials${NC}"
echo -e "${BLUE}==================${NC}"
prompt_input "AWS Access Key ID" AWS_ACCESS_KEY_ID "^AKIA[0-9A-Z]{16}$" "Invalid AWS Access Key ID format"
prompt_secret "AWS Secret Access Key" AWS_SECRET_ACCESS_KEY
prompt_input "AWS Region" AWS_REGION "^[a-z]{2}-[a-z]+-[0-9]$" "Invalid AWS region format (e.g., us-east-1)"

echo ""

# Collect domain information
echo -e "${BLUE}🌐 Domain Configuration${NC}"
echo -e "${BLUE}========================${NC}"
prompt_input "Domain Name (e.g., yourdomain.com)" DOMAIN_NAME "^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$" "Invalid domain name format"
prompt_input "Subdomain (e.g., www)" SUBDOMAIN_NAME "^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]$" "Invalid subdomain format"
prompt_input "Stack Name" STACK_NAME "^[a-zA-Z][a-zA-Z0-9-]*$" "Stack name must start with a letter and contain only letters, numbers, and hyphens"

echo ""

# SSL Configuration
echo -e "${BLUE}🔒 SSL Configuration${NC}"
echo -e "${BLUE}===================${NC}"
echo -e "${YELLOW}Do you want to enable SSL certificate? (y/n): ${NC}"
read -r ssl_choice

if [[ "$ssl_choice" =~ ^[Yy]$ ]]; then
    ENABLE_SSL="true"
    echo -e "${GREEN}✅ SSL will be enabled${NC}"
    echo -e "${YELLOW}⚠️  Note: You'll need to manually validate the certificate in AWS Certificate Manager${NC}"
else
    ENABLE_SSL="false"
    echo -e "${YELLOW}⚠️  SSL disabled - site will use CloudFront default certificate${NC}"
fi

echo ""

# Summary
echo -e "${BLUE}📋 Configuration Summary${NC}"
echo -e "${BLUE}========================${NC}"
echo -e "Domain: ${GREEN}${SUBDOMAIN_NAME}.${DOMAIN_NAME}${NC}"
echo -e "Region: ${GREEN}${AWS_REGION}${NC}"
echo -e "Stack: ${GREEN}${STACK_NAME}${NC}"
echo -e "SSL: ${GREEN}${ENABLE_SSL}${NC}"
echo ""

echo -e "${YELLOW}Do you want to proceed with the deployment? (y/n): ${NC}"
read -r confirm

if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
    echo -e "${RED}❌ Deployment cancelled${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}🚀 Starting Infrastructure Deployment${NC}"
echo -e "${BLUE}=====================================${NC}"

# Configure AWS credentials
export AWS_ACCESS_KEY_ID="$AWS_ACCESS_KEY_ID"
export AWS_SECRET_ACCESS_KEY="$AWS_SECRET_ACCESS_KEY"
export AWS_DEFAULT_REGION="$AWS_REGION"

# Validate AWS credentials
echo -e "${BLUE}🔐 Validating AWS credentials...${NC}"
if ! aws sts get-caller-identity >/dev/null 2>&1; then
    echo -e "${RED}❌ Invalid AWS credentials${NC}"
    exit 1
fi
echo -e "${GREEN}✅ AWS credentials validated${NC}"

# Choose template based on SSL setting
if [ "$ENABLE_SSL" = "true" ]; then
    TEMPLATE_FILE="aws/cloudformation-template-ssl.yml"
    echo -e "${BLUE}📋 Using SSL-enabled template${NC}"
else
    TEMPLATE_FILE="aws/cloudformation-template-simple.yml"
    echo -e "${BLUE}📋 Using simple template (no SSL)${NC}"
fi

# Check if template exists
if [ ! -f "$TEMPLATE_FILE" ]; then
    echo -e "${RED}❌ Template file not found: $TEMPLATE_FILE${NC}"
    exit 1
fi

# Check if stack exists
echo -e "${BLUE}🔍 Checking if stack exists...${NC}"
if aws cloudformation describe-stacks --stack-name "$STACK_NAME" --region "$AWS_REGION" >/dev/null 2>&1; then
    STACK_STATUS=$(aws cloudformation describe-stacks \
        --stack-name "$STACK_NAME" \
        --region "$AWS_REGION" \
        --query 'Stacks[0].StackStatus' \
        --output text)
    
    echo -e "${YELLOW}⚠️  Stack exists with status: $STACK_STATUS${NC}"
    
    if [[ "$STACK_STATUS" == *"FAILED"* ]] || [[ "$STACK_STATUS" == *"ROLLBACK"* ]]; then
        echo -e "${YELLOW}🗑️  Deleting failed stack...${NC}"
        aws cloudformation delete-stack --stack-name "$STACK_NAME" --region "$AWS_REGION"
        echo -e "${BLUE}⏳ Waiting for stack deletion...${NC}"
        aws cloudformation wait stack-delete-complete --stack-name "$STACK_NAME" --region "$AWS_REGION"
        echo -e "${GREEN}✅ Stack deleted${NC}"
    else
        echo -e "${YELLOW}Do you want to update the existing stack? (y/n): ${NC}"
        read -r update_choice
        if [[ ! "$update_choice" =~ ^[Yy]$ ]]; then
            echo -e "${RED}❌ Deployment cancelled${NC}"
            exit 1
        fi
    fi
fi

# Validate template
echo -e "${BLUE}🔍 Validating CloudFormation template...${NC}"
aws cloudformation validate-template \
    --template-body file://$TEMPLATE_FILE \
    --region "$AWS_REGION" >/dev/null

echo -e "${GREEN}✅ Template validation successful${NC}"

# Deploy stack
echo -e "${BLUE}🚀 Deploying infrastructure (this may take 15-30 minutes)...${NC}"

# Prepare parameters
if [ "$ENABLE_SSL" = "true" ]; then
    PARAMETERS="DomainName=$DOMAIN_NAME SubdomainName=$SUBDOMAIN_NAME EnableSSL=true"
else
    PARAMETERS="DomainName=$DOMAIN_NAME SubdomainName=$SUBDOMAIN_NAME"
fi

# Deploy with monitoring
aws cloudformation deploy \
    --template-file "$TEMPLATE_FILE" \
    --stack-name "$STACK_NAME" \
    --parameter-overrides $PARAMETERS \
    --capabilities CAPABILITY_IAM \
    --region "$AWS_REGION" \
    --no-fail-on-empty-changeset &

DEPLOY_PID=$!

# Monitor deployment
echo -e "${BLUE}📊 Monitoring deployment progress...${NC}"
COUNTER=0
while kill -0 $DEPLOY_PID 2>/dev/null; do
    sleep 60
    COUNTER=$((COUNTER + 1))
    
    if aws cloudformation describe-stacks --stack-name "$STACK_NAME" --region "$AWS_REGION" >/dev/null 2>&1; then
        CURRENT_STATUS=$(aws cloudformation describe-stacks \
            --stack-name "$STACK_NAME" \
            --region "$AWS_REGION" \
            --query 'Stacks[0].StackStatus' \
            --output text)
        echo -e "${BLUE}⏱️  [$COUNTER min] Status: $CURRENT_STATUS${NC}"
        
        if [[ "$CURRENT_STATUS" == *"FAILED"* ]] || [[ "$CURRENT_STATUS" == *"ROLLBACK"* ]]; then
            echo -e "${RED}❌ Deployment failed: $CURRENT_STATUS${NC}"
            kill $DEPLOY_PID 2>/dev/null
            exit 1
        fi
    fi
    
    if [ $COUNTER -ge 40 ]; then
        echo -e "${RED}⏰ Deployment timeout (40 minutes)${NC}"
        kill $DEPLOY_PID 2>/dev/null
        exit 1
    fi
done

wait $DEPLOY_PID
DEPLOY_EXIT_CODE=$?

if [ $DEPLOY_EXIT_CODE -ne 0 ]; then
    echo -e "${RED}❌ Deployment failed${NC}"
    exit 1
fi

# Get outputs
echo -e "${BLUE}📊 Retrieving deployment outputs...${NC}"

S3_BUCKET=$(aws cloudformation describe-stacks \
    --stack-name "$STACK_NAME" \
    --region "$AWS_REGION" \
    --query 'Stacks[0].Outputs[?OutputKey==`S3BucketName`].OutputValue' \
    --output text)

CLOUDFRONT_ID=$(aws cloudformation describe-stacks \
    --stack-name "$STACK_NAME" \
    --region "$AWS_REGION" \
    --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDistributionId`].OutputValue' \
    --output text)

WEBSITE_URL=$(aws cloudformation describe-stacks \
    --stack-name "$STACK_NAME" \
    --region "$AWS_REGION" \
    --query 'Stacks[0].Outputs[?OutputKey==`WebsiteURL`].OutputValue' \
    --output text)

CLOUDFRONT_URL=$(aws cloudformation describe-stacks \
    --stack-name "$STACK_NAME" \
    --region "$AWS_REGION" \
    --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontURL`].OutputValue' \
    --output text 2>/dev/null || echo "$WEBSITE_URL")

NAME_SERVERS=$(aws cloudformation describe-stacks \
    --stack-name "$STACK_NAME" \
    --region "$AWS_REGION" \
    --query 'Stacks[0].Outputs[?OutputKey==`NameServers`].OutputValue' \
    --output text)

# Create GitHub secrets file
echo -e "${BLUE}📝 Creating GitHub secrets configuration...${NC}"

cat > github-secrets.txt << EOF
# GitHub Repository Secrets Configuration
# Add these secrets to your GitHub repository:
# Settings > Secrets and variables > Actions > New repository secret

AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY
STACK_NAME=$STACK_NAME
DOMAIN_NAME=$DOMAIN_NAME
SUBDOMAIN_NAME=$SUBDOMAIN_NAME
ENABLE_SSL=$ENABLE_SSL
S3_BUCKET_NAME=$S3_BUCKET
CLOUDFRONT_DISTRIBUTION_ID=$CLOUDFRONT_ID
EOF

echo ""
echo -e "${GREEN}🎉 Infrastructure Deployment Completed!${NC}"
echo -e "${GREEN}=======================================${NC}"
echo ""
echo -e "${BLUE}📦 Infrastructure Details:${NC}"
echo -e "S3 Bucket: ${GREEN}$S3_BUCKET${NC}"
echo -e "CloudFront ID: ${GREEN}$CLOUDFRONT_ID${NC}"
echo -e "Website URL: ${GREEN}$WEBSITE_URL${NC}"
echo -e "CloudFront URL: ${GREEN}$CLOUDFRONT_URL${NC}"
echo ""

if [ "$ENABLE_SSL" = "true" ]; then
    SSL_CERT_ARN=$(aws cloudformation describe-stacks \
        --stack-name "$STACK_NAME" \
        --region "$AWS_REGION" \
        --query 'Stacks[0].Outputs[?OutputKey==`SSLCertificateArn`].OutputValue' \
        --output text 2>/dev/null || echo "Not available")
    
    echo -e "${YELLOW}🔒 SSL Certificate Information:${NC}"
    echo -e "Certificate ARN: ${GREEN}$SSL_CERT_ARN${NC}"
    echo ""
    echo -e "${RED}🚨 IMPORTANT: Certificate Validation Required!${NC}"
    echo -e "1. Go to AWS Certificate Manager console"
    echo -e "2. Find your certificate and complete DNS validation"
    echo -e "3. Add the CNAME records to your DNS provider"
    echo ""
fi

echo -e "${BLUE}🌍 DNS Configuration:${NC}"
echo -e "Update your domain nameservers to:"
echo -e "${GREEN}$NAME_SERVERS${NC}"
echo ""

echo -e "${BLUE}📋 Next Steps:${NC}"
echo -e "1. ${GREEN}Add GitHub secrets${NC} from the generated file: ${YELLOW}github-secrets.txt${NC}"
echo -e "2. ${GREEN}Update domain nameservers${NC} (if using custom domain)"
if [ "$ENABLE_SSL" = "true" ]; then
    echo -e "3. ${GREEN}Validate SSL certificate${NC} in AWS Certificate Manager"
fi
echo -e "4. ${GREEN}Push to main branch${NC} to trigger automatic deployments"
echo ""

echo -e "${GREEN}✅ Your infrastructure is ready for CI/CD deployments!${NC}" 