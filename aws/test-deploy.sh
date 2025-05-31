#!/bin/bash

# Test CloudFormation deployment script
# Usage: ./test-deploy.sh [domain-name]

DOMAIN_NAME=${1:-"example.com"}
STACK_NAME="personal-website-test"
REGION="eu-west-1"

echo "🧪 Testing CloudFormation Deployment"
echo "===================================="
echo "Domain: $DOMAIN_NAME"
echo "Stack: $STACK_NAME"
echo "Region: $REGION"
echo ""

# Validate template first
echo "🔍 Validating template..."
aws cloudformation validate-template \
  --template-body file://aws/cloudformation-template-simple.yml \
  --region $REGION

if [ $? -ne 0 ]; then
  echo "❌ Template validation failed!"
  exit 1
fi

echo "✅ Template validation successful!"
echo ""

# Check if test stack exists and delete it
if aws cloudformation describe-stacks --stack-name "$STACK_NAME" --region "$REGION" >/dev/null 2>&1; then
  echo "🗑️  Deleting existing test stack..."
  aws cloudformation delete-stack --stack-name "$STACK_NAME" --region "$REGION"
  aws cloudformation wait stack-delete-complete --stack-name "$STACK_NAME" --region "$REGION"
  echo "✅ Test stack deleted"
fi

echo ""
echo "🚀 Deploying test stack..."
echo "This will take 15-30 minutes for CloudFront distribution..."

# Deploy with dry-run first
echo "📋 Creating change set..."
aws cloudformation deploy \
  --template-file aws/cloudformation-template-simple.yml \
  --stack-name "$STACK_NAME" \
  --parameter-overrides \
    DomainName="$DOMAIN_NAME" \
    SubdomainName="www" \
  --capabilities CAPABILITY_IAM \
  --region "$REGION" \
  --no-execute-changeset

if [ $? -eq 0 ]; then
  echo "✅ Change set created successfully!"
  echo ""
  echo "💡 To execute the deployment, run:"
  echo "aws cloudformation execute-change-set --change-set-name $(aws cloudformation list-change-sets --stack-name $STACK_NAME --region $REGION --query 'Summaries[0].ChangeSetName' --output text) --stack-name $STACK_NAME --region $REGION"
  echo ""
  echo "💡 To clean up the test stack later:"
  echo "aws cloudformation delete-stack --stack-name $STACK_NAME --region $REGION"
else
  echo "❌ Change set creation failed!"
  exit 1
fi 