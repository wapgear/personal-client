#!/bin/bash

# AWS Infrastructure Deployment Script
# This script deploys the CloudFormation template for static website hosting

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

# Get parameters
read -p "Enter your domain name (e.g., yourdomain.com): " DOMAIN_NAME
read -p "Enter subdomain (default: www): " SUBDOMAIN_NAME
SUBDOMAIN_NAME=${SUBDOMAIN_NAME:-www}

read -p "Enter AWS region (default: eu-west-1): " AWS_REGION
AWS_REGION=${AWS_REGION:-eu-west-1}

read -p "Enter stack name (default: personal-website): " STACK_NAME
STACK_NAME=${STACK_NAME:-personal-website}

print_status "Deploying CloudFormation stack..."
print_status "Domain: ${SUBDOMAIN_NAME}.${DOMAIN_NAME}"
print_status "Region: ${AWS_REGION}"
print_status "Stack: ${STACK_NAME}"

# Deploy the CloudFormation stack
aws cloudformation deploy \
    --template-file cloudformation-template.yml \
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
    echo "3. Wait for DNS propagation (can take up to 48 hours)"
    echo "4. Push your code to trigger the GitHub Actions deployment"
    
else
    print_error "CloudFormation deployment failed!"
    exit 1
fi 