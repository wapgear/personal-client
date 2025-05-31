#!/bin/bash

# AWS Infrastructure Deployment Script (Fixed Version)
# This script deploys the CloudFormation template for static website hosting
# with options to handle SSL certificate validation issues

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    print_error "AWS CLI is not installed. Please install it first."
    exit 1
fi

# Check if user is logged in to AWS
if ! aws sts get-caller-identity &> /dev/null; then
    print_error "AWS credentials not configured. Please run 'aws configure' first."
    exit 1
fi

# Check if there's an existing stuck stack
print_status "Checking for existing CloudFormation stacks..."
read -p "Enter stack name to check (default: personal-website): " STACK_NAME
STACK_NAME=${STACK_NAME:-personal-website}

read -p "Enter AWS region (default: eu-west-1): " AWS_REGION
AWS_REGION=${AWS_REGION:-eu-west-1}

# Check stack status
STACK_STATUS=$(aws cloudformation describe-stacks --stack-name "${STACK_NAME}" --region "${AWS_REGION}" --query 'Stacks[0].StackStatus' --output text 2>/dev/null || echo "STACK_NOT_FOUND")

if [ "$STACK_STATUS" != "STACK_NOT_FOUND" ]; then
    print_warning "Found existing stack: ${STACK_NAME} with status: ${STACK_STATUS}"
    
    if [ "$STACK_STATUS" = "CREATE_IN_PROGRESS" ] || [ "$STACK_STATUS" = "UPDATE_IN_PROGRESS" ]; then
        print_error "Stack is currently in progress. You have several options:"
        echo "1. Wait for it to complete (may take a long time due to SSL certificate validation)"
        echo "2. Cancel the stack creation and start over"
        echo "3. Use the AWS Console to check the stack events and see what's stuck"
        echo ""
        read -p "Do you want to cancel the current stack creation? (y/N): " CANCEL_STACK
        
        if [[ $CANCEL_STACK =~ ^[Yy]$ ]]; then
            print_status "Cancelling stack creation..."
            aws cloudformation cancel-update-stack --stack-name "${STACK_NAME}" --region "${AWS_REGION}" 2>/dev/null || \
            aws cloudformation delete-stack --stack-name "${STACK_NAME}" --region "${AWS_REGION}"
            
            print_status "Waiting for stack deletion to complete..."
            aws cloudformation wait stack-delete-complete --stack-name "${STACK_NAME}" --region "${AWS_REGION}"
            print_success "Stack cancelled/deleted successfully!"
        else
            print_warning "Exiting. Please wait for the current operation to complete or cancel it manually."
            exit 1
        fi
    fi
fi

# Get deployment parameters
read -p "Enter your domain name (e.g., yourdomain.com): " DOMAIN_NAME
read -p "Enter subdomain (default: www): " SUBDOMAIN_NAME
SUBDOMAIN_NAME=${SUBDOMAIN_NAME:-www}

# Choose deployment type
echo ""
print_status "Choose deployment type:"
echo "1. Quick deployment without SSL (recommended for testing)"
echo "2. Full deployment with SSL (may hang during certificate validation)"
echo ""
read -p "Enter your choice (1 or 2): " DEPLOYMENT_TYPE

case $DEPLOYMENT_TYPE in
    1)
        TEMPLATE_FILE="cloudformation-template-no-ssl.yml"
        print_status "Using template without SSL certificate for quick deployment"
        ;;
    2)
        TEMPLATE_FILE="cloudformation-template.yml"
        print_warning "Using template with SSL certificate - this may hang during validation"
        print_warning "If it hangs, you'll need to manually validate the certificate in AWS Console"
        ;;
    *)
        print_error "Invalid choice. Exiting."
        exit 1
        ;;
esac

print_status "🚀 Deploying CloudFormation stack: ${STACK_NAME}"
print_status "🌐 Domain: ${SUBDOMAIN_NAME}.${DOMAIN_NAME}"
print_status "📍 Region: ${AWS_REGION}"
print_status "📄 Template: ${TEMPLATE_FILE}"

# Deploy the CloudFormation stack
aws cloudformation deploy \
    --template-file "${TEMPLATE_FILE}" \
    --stack-name "${STACK_NAME}" \
    --parameter-overrides \
        DomainName="${DOMAIN_NAME}" \
        SubdomainName="${SUBDOMAIN_NAME}" \
    --capabilities CAPABILITY_IAM \
    --region "${AWS_REGION}"

if [ $? -eq 0 ]; then
    print_success "CloudFormation stack deployed successfully!"
    
    # Get stack outputs
    print_status "Retrieving stack outputs..."
    
    S3_BUCKET=$(aws cloudformation describe-stacks \
        --stack-name "${STACK_NAME}" \
        --region "${AWS_REGION}" \
        --query 'Stacks[0].Outputs[?OutputKey==`S3BucketName`].OutputValue' \
        --output text)
    
    CLOUDFRONT_ID=$(aws cloudformation describe-stacks \
        --stack-name "${STACK_NAME}" \
        --region "${AWS_REGION}" \
        --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDistributionId`].OutputValue' \
        --output text)
    
    NAME_SERVERS=$(aws cloudformation describe-stacks \
        --stack-name "${STACK_NAME}" \
        --region "${AWS_REGION}" \
        --query 'Stacks[0].Outputs[?OutputKey==`NameServers`].OutputValue' \
        --output text)
    
    WEBSITE_URL=$(aws cloudformation describe-stacks \
        --stack-name "${STACK_NAME}" \
        --region "${AWS_REGION}" \
        --query 'Stacks[0].Outputs[?OutputKey==`WebsiteURL`].OutputValue' \
        --output text)
    
    print_success "Infrastructure deployed successfully!"
    echo ""
    echo "📋 DEPLOYMENT SUMMARY"
    echo "===================="
    echo "🌐 Website URL: ${WEBSITE_URL}"
    echo "📦 S3 Bucket: ${S3_BUCKET}"
    echo "🚀 CloudFront Distribution ID: ${CLOUDFRONT_ID}"
    echo ""
    echo "🔧 NEXT STEPS:"
    echo "1. Configure these GitHub Secrets:"
    echo "   - AWS_ACCESS_KEY_ID"
    echo "   - AWS_SECRET_ACCESS_KEY"
    echo "   - S3_BUCKET_NAME: ${S3_BUCKET}"
    echo "   - CLOUDFRONT_DISTRIBUTION_ID: ${CLOUDFRONT_ID}"
    echo ""
    echo "2. Update your Namecheap DNS settings:"
    echo "   Replace the nameservers with these AWS Route 53 nameservers:"
    echo "   ${NAME_SERVERS}"
    echo ""
    
    if [ "$DEPLOYMENT_TYPE" = "1" ]; then
        echo "3. To add SSL later:"
        echo "   - Request an SSL certificate in AWS Certificate Manager"
        echo "   - Validate it using DNS validation"
        echo "   - Update your CloudFront distribution to use the certificate"
        echo ""
    fi
    
    echo "4. Wait for DNS propagation (can take up to 48 hours)"
    echo "5. Push your code to trigger the GitHub Actions deployment"
    
else
    print_error "CloudFormation deployment failed!"
    exit 1
fi 