#!/bin/bash

# CloudFormation Stack Debugging Script
# Usage: ./debug-stack.sh [stack-name] [region]

STACK_NAME=${1:-"personal-website"}
REGION=${2:-"eu-west-1"}

echo "🔍 CloudFormation Stack Debugger"
echo "================================="
echo "Stack Name: $STACK_NAME"
echo "Region: $REGION"
echo ""

# Check if AWS CLI is configured
if ! aws sts get-caller-identity >/dev/null 2>&1; then
    echo "❌ AWS CLI not configured or credentials invalid"
    echo "Please run: aws configure"
    exit 1
fi

echo "✅ AWS credentials valid"
echo "Account: $(aws sts get-caller-identity --query Account --output text)"
echo ""

# Check if stack exists
if aws cloudformation describe-stacks --stack-name "$STACK_NAME" --region "$REGION" >/dev/null 2>&1; then
    echo "📦 Stack exists"
    
    # Get stack status
    STACK_STATUS=$(aws cloudformation describe-stacks \
        --stack-name "$STACK_NAME" \
        --region "$REGION" \
        --query 'Stacks[0].StackStatus' \
        --output text)
    
    echo "Status: $STACK_STATUS"
    
    # Get stack creation time
    CREATION_TIME=$(aws cloudformation describe-stacks \
        --stack-name "$STACK_NAME" \
        --region "$REGION" \
        --query 'Stacks[0].CreationTime' \
        --output text)
    
    echo "Created: $CREATION_TIME"
    echo ""
    
    # Show recent events
    echo "📋 Recent Stack Events (last 10):"
    echo "=================================="
    aws cloudformation describe-stack-events \
        --stack-name "$STACK_NAME" \
        --region "$REGION" \
        --query 'StackEvents[:10].[Timestamp,LogicalResourceId,ResourceStatus,ResourceStatusReason]' \
        --output table
    
    echo ""
    
    # Show failed events if any
    echo "❌ Failed Events:"
    echo "================="
    FAILED_EVENTS=$(aws cloudformation describe-stack-events \
        --stack-name "$STACK_NAME" \
        --region "$REGION" \
        --query 'StackEvents[?ResourceStatus==`CREATE_FAILED` || ResourceStatus==`UPDATE_FAILED`].[Timestamp,LogicalResourceId,ResourceStatusReason]' \
        --output table)
    
    if [ -z "$FAILED_EVENTS" ] || [ "$FAILED_EVENTS" = "None" ]; then
        echo "No failed events found"
    else
        echo "$FAILED_EVENTS"
    fi
    
    echo ""
    
    # Show stack outputs if available
    echo "📊 Stack Outputs:"
    echo "================="
    aws cloudformation describe-stacks \
        --stack-name "$STACK_NAME" \
        --region "$REGION" \
        --query 'Stacks[0].Outputs[*].[OutputKey,OutputValue]' \
        --output table 2>/dev/null || echo "No outputs available"
    
    echo ""
    
    # Show stack resources
    echo "🏗️  Stack Resources:"
    echo "==================="
    aws cloudformation describe-stack-resources \
        --stack-name "$STACK_NAME" \
        --region "$REGION" \
        --query 'StackResources[*].[LogicalResourceId,ResourceType,ResourceStatus]' \
        --output table
    
    echo ""
    
    # Recommendations based on status
    case $STACK_STATUS in
        "CREATE_IN_PROGRESS")
            echo "💡 Stack is currently being created. This can take 15-45 minutes for CloudFront."
            echo "   Monitor progress with: aws cloudformation describe-stack-events --stack-name $STACK_NAME --region $REGION"
            ;;
        "CREATE_FAILED"|"ROLLBACK_COMPLETE")
            echo "💡 Stack creation failed. Check the failed events above for details."
            echo "   To retry: aws cloudformation delete-stack --stack-name $STACK_NAME --region $REGION"
            echo "   Then wait for deletion and redeploy."
            ;;
        "UPDATE_IN_PROGRESS")
            echo "💡 Stack is currently being updated."
            ;;
        "CREATE_COMPLETE"|"UPDATE_COMPLETE")
            echo "✅ Stack is healthy and complete!"
            ;;
        *)
            echo "⚠️  Stack is in state: $STACK_STATUS"
            ;;
    esac
    
else
    echo "❌ Stack '$STACK_NAME' does not exist in region '$REGION'"
    echo ""
    echo "💡 To create the stack, run:"
    echo "   aws cloudformation deploy \\"
    echo "     --template-file aws/cloudformation-template-reliable.yml \\"
    echo "     --stack-name $STACK_NAME \\"
    echo "     --parameter-overrides DomainName=yourdomain.com SubdomainName=www EnableSSL=false \\"
    echo "     --capabilities CAPABILITY_IAM \\"
    echo "     --region $REGION"
fi

echo ""
echo "🔧 Useful Commands:"
echo "=================="
echo "Monitor events: aws cloudformation describe-stack-events --stack-name $STACK_NAME --region $REGION"
echo "Delete stack: aws cloudformation delete-stack --stack-name $STACK_NAME --region $REGION"
echo "Validate template: aws cloudformation validate-template --template-body file://aws/cloudformation-template-reliable.yml"
echo "" 