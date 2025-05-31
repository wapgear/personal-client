#!/bin/bash

# Comprehensive CloudFormation deployment script with SSL support
# Usage: ./deploy-with-ssl.sh [domain-name] [enable-ssl] [stack-name]

set -e  # Exit on any error

DOMAIN_NAME=${1}
ENABLE_SSL=${2:-"false"}
STACK_NAME=${3:-"personal-website"}
SUBDOMAIN_NAME="www"
REGION="eu-west-1"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Validate inputs
if [ -z "$DOMAIN_NAME" ]; then
    log_error "Domain name is required!"
    echo "Usage: $0 <domain-name> [enable-ssl] [stack-name]"
    echo "Example: $0 yourdomain.com true personal-website"
    exit 1
fi

echo "🚀 CloudFormation Deployment with SSL Support"
echo "=============================================="
echo "Domain: $DOMAIN_NAME"
echo "Subdomain: $SUBDOMAIN_NAME"
echo "Enable SSL: $ENABLE_SSL"
echo "Stack Name: $STACK_NAME"
echo "Region: $REGION"
echo ""

# Check AWS credentials
log_info "Validating AWS credentials..."
if ! aws sts get-caller-identity >/dev/null 2>&1; then
    log_error "AWS CLI not configured or credentials invalid"
    echo "Please run: aws configure"
    exit 1
fi

ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
log_success "AWS credentials valid (Account: $ACCOUNT_ID)"
echo ""

# Validate CloudFormation template
log_info "Validating CloudFormation template..."
aws cloudformation validate-template \
    --template-body file://aws/cloudformation-template-ssl.yml \
    --region $REGION >/dev/null

if [ $? -ne 0 ]; then
    log_error "Template validation failed!"
    exit 1
fi
log_success "Template validation successful"
echo ""

# Check if stack exists and handle accordingly
if aws cloudformation describe-stacks --stack-name "$STACK_NAME" --region "$REGION" >/dev/null 2>&1; then
    STACK_STATUS=$(aws cloudformation describe-stacks \
        --stack-name "$STACK_NAME" \
        --region "$REGION" \
        --query 'Stacks[0].StackStatus' \
        --output text)
    
    log_info "Stack exists with status: $STACK_STATUS"
    
    if [[ "$STACK_STATUS" == *"FAILED"* ]] || [[ "$STACK_STATUS" == *"ROLLBACK_COMPLETE"* ]]; then
        log_warning "Stack is in failed state, deleting and recreating..."
        aws cloudformation delete-stack --stack-name "$STACK_NAME" --region "$REGION"
        
        log_info "Waiting for stack deletion to complete..."
        aws cloudformation wait stack-delete-complete --stack-name "$STACK_NAME" --region "$REGION"
        log_success "Stack deleted successfully"
    fi
else
    log_info "Creating new stack..."
fi

echo ""

# Deploy the stack
log_info "Deploying CloudFormation stack..."
if [ "$ENABLE_SSL" = "true" ]; then
    log_warning "SSL is enabled - this will create an SSL certificate that requires validation"
    log_warning "You'll need to validate the certificate in AWS Certificate Manager"
fi

echo ""
log_info "Starting deployment (this may take 15-45 minutes for CloudFront)..."

# Deploy with monitoring
aws cloudformation deploy \
    --template-file aws/cloudformation-template-ssl.yml \
    --stack-name "$STACK_NAME" \
    --parameter-overrides \
        DomainName="$DOMAIN_NAME" \
        SubdomainName="$SUBDOMAIN_NAME" \
        EnableSSL="$ENABLE_SSL" \
        CertificateValidationMethod="DNS" \
    --capabilities CAPABILITY_IAM \
    --region "$REGION" \
    --no-fail-on-empty-changeset &

# Store the deployment PID for monitoring
DEPLOY_PID=$!

# Monitor the deployment
log_info "Monitoring deployment progress..."
COUNTER=0
while kill -0 $DEPLOY_PID 2>/dev/null; do
    sleep 60  # Check every minute
    COUNTER=$((COUNTER + 1))
    
    # Get current stack status
    if aws cloudformation describe-stacks --stack-name "$STACK_NAME" --region "$REGION" >/dev/null 2>&1; then
        CURRENT_STATUS=$(aws cloudformation describe-stacks \
            --stack-name "$STACK_NAME" \
            --region "$REGION" \
            --query 'Stacks[0].StackStatus' \
            --output text)
        log_info "[$COUNTER min] Current status: $CURRENT_STATUS"
        
        # Check for failed states
        if [[ "$CURRENT_STATUS" == *"FAILED"* ]] || [[ "$CURRENT_STATUS" == *"ROLLBACK"* ]]; then
            log_error "Stack deployment failed with status: $CURRENT_STATUS"
            log_info "Checking stack events for errors..."
            aws cloudformation describe-stack-events \
                --stack-name "$STACK_NAME" \
                --region "$REGION" \
                --query 'StackEvents[?ResourceStatus==`CREATE_FAILED` || ResourceStatus==`UPDATE_FAILED`].[LogicalResourceId,ResourceStatusReason]' \
                --output table
            kill $DEPLOY_PID 2>/dev/null
            exit 1
        fi
    fi
    
    # Timeout after 45 minutes
    if [ $COUNTER -ge 45 ]; then
        log_error "Deployment timeout reached (45 minutes)"
        kill $DEPLOY_PID 2>/dev/null
        exit 1
    fi
done

# Wait for the deployment command to complete
wait $DEPLOY_PID
DEPLOY_EXIT_CODE=$?

if [ $DEPLOY_EXIT_CODE -ne 0 ]; then
    log_error "CloudFormation deployment failed"
    exit 1
fi

echo ""
log_success "Infrastructure deployment completed!"

# Get stack outputs
log_info "Retrieving stack outputs..."

S3_BUCKET=$(aws cloudformation describe-stacks \
    --stack-name "$STACK_NAME" \
    --region "$REGION" \
    --query 'Stacks[0].Outputs[?OutputKey==`S3BucketName`].OutputValue' \
    --output text)

CLOUDFRONT_ID=$(aws cloudformation describe-stacks \
    --stack-name "$STACK_NAME" \
    --region "$REGION" \
    --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDistributionId`].OutputValue' \
    --output text)

WEBSITE_URL=$(aws cloudformation describe-stacks \
    --stack-name "$STACK_NAME" \
    --region "$REGION" \
    --query 'Stacks[0].Outputs[?OutputKey==`WebsiteURL`].OutputValue' \
    --output text)

CLOUDFRONT_URL=$(aws cloudformation describe-stacks \
    --stack-name "$STACK_NAME" \
    --region "$REGION" \
    --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontURL`].OutputValue' \
    --output text)

NAME_SERVERS=$(aws cloudformation describe-stacks \
    --stack-name "$STACK_NAME" \
    --region "$REGION" \
    --query 'Stacks[0].Outputs[?OutputKey==`NameServers`].OutputValue' \
    --output text)

echo ""
echo "🎉 Deployment Summary"
echo "===================="
echo "📦 S3 Bucket: $S3_BUCKET"
echo "🌐 CloudFront ID: $CLOUDFRONT_ID"
echo "🔗 CloudFront URL: $CLOUDFRONT_URL"

if [ "$ENABLE_SSL" = "true" ]; then
    SSL_CERT_ARN=$(aws cloudformation describe-stacks \
        --stack-name "$STACK_NAME" \
        --region "$REGION" \
        --query 'Stacks[0].Outputs[?OutputKey==`SSLCertificateArn`].OutputValue' \
        --output text 2>/dev/null || echo "Not available")
    
    echo "🔒 SSL Certificate ARN: $SSL_CERT_ARN"
    echo "🔗 Custom Domain URL: $WEBSITE_URL"
    echo ""
    echo "🚨 IMPORTANT: SSL Certificate Validation Required!"
    echo "================================================="
    echo "1. Go to AWS Certificate Manager in the AWS Console"
    echo "2. Find your certificate for $DOMAIN_NAME"
    echo "3. Complete the DNS validation by adding the CNAME records"
    echo "4. Or use the automated validation script below:"
    echo ""
    echo "   aws acm describe-certificate --certificate-arn $SSL_CERT_ARN --region $REGION"
    echo ""
    echo "⏱️  After validation, your custom domain will be accessible at: $WEBSITE_URL"
else
    echo "🔗 Website URL: $WEBSITE_URL"
fi

echo ""
echo "🌍 DNS Configuration:"
echo "Update your domain's nameservers to:"
echo "$NAME_SERVERS"
echo ""
echo "🚀 Your site is immediately accessible at: $CLOUDFRONT_URL"

if [ "$ENABLE_SSL" = "true" ]; then
    echo ""
    log_warning "Next steps for SSL:"
    echo "1. Validate the SSL certificate in AWS Certificate Manager"
    echo "2. Update your domain's nameservers"
    echo "3. Wait for DNS propagation (up to 48 hours)"
    echo "4. Your site will then be accessible via HTTPS at your custom domain"
fi

echo ""
log_success "Deployment completed successfully!" 