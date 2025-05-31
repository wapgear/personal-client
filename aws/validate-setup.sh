#!/bin/bash

# Infrastructure Validation Script
# This script helps validate that your AWS infrastructure and GitHub secrets are properly configured

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 AWS Infrastructure Validation${NC}"
echo -e "${BLUE}================================${NC}"
echo ""

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to prompt for input
prompt_input() {
    local prompt="$1"
    local var_name="$2"
    
    echo -ne "${YELLOW}$prompt: ${NC}"
    read -r input
    eval "$var_name='$input'"
}

# Check prerequisites
echo -e "${BLUE}📋 Checking Prerequisites${NC}"
echo -e "${BLUE}========================${NC}"

if ! command_exists aws; then
    echo -e "${RED}❌ AWS CLI not found${NC}"
    echo -e "${YELLOW}Please install AWS CLI: https://aws.amazon.com/cli/${NC}"
    exit 1
fi
echo -e "${GREEN}✅ AWS CLI found${NC}"

if ! command_exists git; then
    echo -e "${RED}❌ Git not found${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Git found${NC}"

echo ""

# Get configuration
echo -e "${BLUE}📝 Configuration${NC}"
echo -e "${BLUE}===============${NC}"

prompt_input "AWS Region (e.g., eu-west-1)" AWS_REGION
prompt_input "Stack Name" STACK_NAME
prompt_input "S3 Bucket Name" S3_BUCKET
prompt_input "CloudFront Distribution ID" CLOUDFRONT_ID

echo ""

# Validate AWS credentials
echo -e "${BLUE}🔐 Validating AWS Credentials${NC}"
echo -e "${BLUE}==============================${NC}"

if ! aws sts get-caller-identity --region "$AWS_REGION" >/dev/null 2>&1; then
    echo -e "${RED}❌ AWS credentials invalid or not configured${NC}"
    echo -e "${YELLOW}Please configure AWS credentials:${NC}"
    echo -e "${YELLOW}  aws configure${NC}"
    echo -e "${YELLOW}Or set environment variables:${NC}"
    echo -e "${YELLOW}  export AWS_ACCESS_KEY_ID=your-key${NC}"
    echo -e "${YELLOW}  export AWS_SECRET_ACCESS_KEY=your-secret${NC}"
    exit 1
fi

CALLER_IDENTITY=$(aws sts get-caller-identity --region "$AWS_REGION" --output text --query 'Arn')
echo -e "${GREEN}✅ AWS credentials valid${NC}"
echo -e "${BLUE}   Identity: $CALLER_IDENTITY${NC}"

echo ""

# Validate CloudFormation stack
echo -e "${BLUE}📦 Validating CloudFormation Stack${NC}"
echo -e "${BLUE}==================================${NC}"

if aws cloudformation describe-stacks --stack-name "$STACK_NAME" --region "$AWS_REGION" >/dev/null 2>&1; then
    STACK_STATUS=$(aws cloudformation describe-stacks \
        --stack-name "$STACK_NAME" \
        --region "$AWS_REGION" \
        --query 'Stacks[0].StackStatus' \
        --output text)
    
    if [[ "$STACK_STATUS" == "CREATE_COMPLETE" ]] || [[ "$STACK_STATUS" == "UPDATE_COMPLETE" ]]; then
        echo -e "${GREEN}✅ CloudFormation stack exists and is healthy${NC}"
        echo -e "${BLUE}   Status: $STACK_STATUS${NC}"
    else
        echo -e "${YELLOW}⚠️  CloudFormation stack exists but status is: $STACK_STATUS${NC}"
    fi
else
    echo -e "${RED}❌ CloudFormation stack '$STACK_NAME' not found${NC}"
    echo -e "${YELLOW}Please run the infrastructure setup script first:${NC}"
    echo -e "${YELLOW}  ./aws/setup-infrastructure.sh${NC}"
    exit 1
fi

echo ""

# Validate S3 bucket
echo -e "${BLUE}🪣 Validating S3 Bucket${NC}"
echo -e "${BLUE}=======================${NC}"

if aws s3 ls "s3://$S3_BUCKET" >/dev/null 2>&1; then
    echo -e "${GREEN}✅ S3 bucket '$S3_BUCKET' exists and is accessible${NC}"
    
    # Check bucket website configuration
    if aws s3api get-bucket-website --bucket "$S3_BUCKET" >/dev/null 2>&1; then
        echo -e "${GREEN}✅ S3 bucket website configuration enabled${NC}"
    else
        echo -e "${YELLOW}⚠️  S3 bucket website configuration not found${NC}"
    fi
else
    echo -e "${RED}❌ S3 bucket '$S3_BUCKET' not found or not accessible${NC}"
    exit 1
fi

echo ""

# Validate CloudFront distribution
echo -e "${BLUE}🌐 Validating CloudFront Distribution${NC}"
echo -e "${BLUE}====================================${NC}"

if aws cloudfront get-distribution --id "$CLOUDFRONT_ID" >/dev/null 2>&1; then
    DISTRIBUTION_STATUS=$(aws cloudfront get-distribution \
        --id "$CLOUDFRONT_ID" \
        --query 'Distribution.Status' \
        --output text)
    
    DISTRIBUTION_DOMAIN=$(aws cloudfront get-distribution \
        --id "$CLOUDFRONT_ID" \
        --query 'Distribution.DomainName' \
        --output text)
    
    echo -e "${GREEN}✅ CloudFront distribution exists${NC}"
    echo -e "${BLUE}   Status: $DISTRIBUTION_STATUS${NC}"
    echo -e "${BLUE}   Domain: $DISTRIBUTION_DOMAIN${NC}"
    echo -e "${BLUE}   URL: https://$DISTRIBUTION_DOMAIN${NC}"
else
    echo -e "${RED}❌ CloudFront distribution '$CLOUDFRONT_ID' not found or not accessible${NC}"
    exit 1
fi

echo ""

# Get stack outputs if available
echo -e "${BLUE}📊 Stack Outputs${NC}"
echo -e "${BLUE}===============${NC}"

WEBSITE_URL=$(aws cloudformation describe-stacks \
    --stack-name "$STACK_NAME" \
    --region "$AWS_REGION" \
    --query 'Stacks[0].Outputs[?OutputKey==`WebsiteURL`].OutputValue' \
    --output text 2>/dev/null || echo "Not available")

CLOUDFRONT_URL=$(aws cloudformation describe-stacks \
    --stack-name "$STACK_NAME" \
    --region "$AWS_REGION" \
    --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontURL`].OutputValue' \
    --output text 2>/dev/null || echo "https://$DISTRIBUTION_DOMAIN")

NAME_SERVERS=$(aws cloudformation describe-stacks \
    --stack-name "$STACK_NAME" \
    --region "$AWS_REGION" \
    --query 'Stacks[0].Outputs[?OutputKey==`NameServers`].OutputValue' \
    --output text 2>/dev/null || echo "Not available")

echo -e "${BLUE}Website URL: ${GREEN}$WEBSITE_URL${NC}"
echo -e "${BLUE}CloudFront URL: ${GREEN}$CLOUDFRONT_URL${NC}"
echo -e "${BLUE}Name Servers: ${GREEN}$NAME_SERVERS${NC}"

echo ""

# Check SSL certificate if available
SSL_CERT_ARN=$(aws cloudformation describe-stacks \
    --stack-name "$STACK_NAME" \
    --region "$AWS_REGION" \
    --query 'Stacks[0].Outputs[?OutputKey==`SSLCertificateArn`].OutputValue' \
    --output text 2>/dev/null || echo "")

if [ -n "$SSL_CERT_ARN" ] && [ "$SSL_CERT_ARN" != "None" ]; then
    echo -e "${BLUE}🔒 SSL Certificate${NC}"
    echo -e "${BLUE}=================${NC}"
    
    CERT_STATUS=$(aws acm describe-certificate \
        --certificate-arn "$SSL_CERT_ARN" \
        --region "$AWS_REGION" \
        --query 'Certificate.Status' \
        --output text 2>/dev/null || echo "Unknown")
    
    echo -e "${BLUE}Certificate ARN: ${GREEN}$SSL_CERT_ARN${NC}"
    echo -e "${BLUE}Certificate Status: ${GREEN}$CERT_STATUS${NC}"
    
    if [ "$CERT_STATUS" = "ISSUED" ]; then
        echo -e "${GREEN}✅ SSL certificate is valid and issued${NC}"
    elif [ "$CERT_STATUS" = "PENDING_VALIDATION" ]; then
        echo -e "${YELLOW}⚠️  SSL certificate is pending validation${NC}"
        echo -e "${YELLOW}   Go to AWS Certificate Manager to complete validation${NC}"
    else
        echo -e "${YELLOW}⚠️  SSL certificate status: $CERT_STATUS${NC}"
    fi
    
    echo ""
fi

# GitHub secrets validation
echo -e "${BLUE}📝 GitHub Secrets Checklist${NC}"
echo -e "${BLUE}===========================${NC}"
echo -e "${YELLOW}Ensure these secrets are configured in your GitHub repository:${NC}"
echo -e "${YELLOW}Settings > Secrets and variables > Actions${NC}"
echo ""
echo -e "${BLUE}Required secrets:${NC}"
echo -e "  ${GREEN}AWS_ACCESS_KEY_ID${NC} - Your AWS access key"
echo -e "  ${GREEN}AWS_SECRET_ACCESS_KEY${NC} - Your AWS secret key"
echo -e "  ${GREEN}S3_BUCKET_NAME${NC} = $S3_BUCKET"
echo -e "  ${GREEN}CLOUDFRONT_DISTRIBUTION_ID${NC} = $CLOUDFRONT_ID"
echo ""
echo -e "${BLUE}Optional secrets:${NC}"
echo -e "  ${GREEN}STACK_NAME${NC} = $STACK_NAME"
echo -e "  ${GREEN}DOMAIN_NAME${NC} - Your domain name"
echo -e "  ${GREEN}SUBDOMAIN_NAME${NC} - Your subdomain (e.g., www)"
echo -e "  ${GREEN}ENABLE_SSL${NC} - true/false"

echo ""

# Final summary
echo -e "${GREEN}🎉 Validation Complete!${NC}"
echo -e "${GREEN}=======================${NC}"
echo ""
echo -e "${GREEN}✅ Your AWS infrastructure appears to be properly configured${NC}"
echo -e "${GREEN}✅ Ready for GitHub Actions deployment${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo -e "1. ${GREEN}Configure GitHub secrets${NC} (see checklist above)"
echo -e "2. ${GREEN}Push to main branch${NC} to trigger deployment"
echo -e "3. ${GREEN}Monitor GitHub Actions${NC} for deployment status"
echo ""
echo -e "${BLUE}Your site will be available at:${NC}"
echo -e "🔗 ${GREEN}$CLOUDFRONT_URL${NC}"
if [ "$WEBSITE_URL" != "Not available" ] && [ "$WEBSITE_URL" != "$CLOUDFRONT_URL" ]; then
    echo -e "🔗 ${GREEN}$WEBSITE_URL${NC} (after DNS propagation)"
fi 