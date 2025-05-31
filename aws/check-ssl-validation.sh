#!/bin/bash

# SSL Certificate Validation Checker
# Usage: ./check-ssl-validation.sh [stack-name] [region]

STACK_NAME=${1:-"personal-website"}
REGION=${2:-"eu-west-1"}

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

echo "🔒 SSL Certificate Validation Checker"
echo "====================================="
echo "Stack: $STACK_NAME"
echo "Region: $REGION"
echo ""

# Check if AWS CLI is configured
if ! aws sts get-caller-identity >/dev/null 2>&1; then
    log_error "AWS CLI not configured or credentials invalid"
    echo "Please run: aws configure"
    exit 1
fi

# Get certificate ARN from stack
log_info "Getting SSL certificate ARN from stack..."
CERT_ARN=$(aws cloudformation describe-stacks \
    --stack-name "$STACK_NAME" \
    --region "$REGION" \
    --query 'Stacks[0].Outputs[?OutputKey==`SSLCertificateArn`].OutputValue' \
    --output text 2>/dev/null)

if [ -z "$CERT_ARN" ] || [ "$CERT_ARN" = "None" ]; then
    log_error "No SSL certificate found in stack outputs"
    echo "Make sure the stack was deployed with EnableSSL=true"
    exit 1
fi

log_success "Found certificate: $CERT_ARN"
echo ""

# Get certificate details
log_info "Checking certificate status..."
CERT_STATUS=$(aws acm describe-certificate \
    --certificate-arn "$CERT_ARN" \
    --region "$REGION" \
    --query 'Certificate.Status' \
    --output text)

DOMAIN_NAME=$(aws acm describe-certificate \
    --certificate-arn "$CERT_ARN" \
    --region "$REGION" \
    --query 'Certificate.DomainName' \
    --output text)

echo "📋 Certificate Details:"
echo "Domain: $DOMAIN_NAME"
echo "Status: $CERT_STATUS"
echo ""

case $CERT_STATUS in
    "ISSUED")
        log_success "Certificate is validated and issued!"
        echo "Your SSL certificate is ready to use."
        ;;
    "PENDING_VALIDATION")
        log_warning "Certificate is pending validation"
        echo ""
        echo "🔧 Validation Records Needed:"
        echo "=============================="
        
        # Get validation records
        aws acm describe-certificate \
            --certificate-arn "$CERT_ARN" \
            --region "$REGION" \
            --query 'Certificate.DomainValidationOptions[*].[DomainName,ResourceRecord.Name,ResourceRecord.Type,ResourceRecord.Value]' \
            --output table
        
        echo ""
        log_info "To validate your certificate:"
        echo "1. Add the CNAME records above to your DNS provider"
        echo "2. If using Route 53, the records should be added automatically"
        echo "3. Wait 5-30 minutes for validation to complete"
        echo ""
        echo "💡 Check validation status with:"
        echo "   $0 $STACK_NAME $REGION"
        ;;
    "VALIDATION_TIMED_OUT")
        log_error "Certificate validation timed out"
        echo "You may need to request a new certificate or check your DNS records"
        ;;
    "FAILED")
        log_error "Certificate validation failed"
        echo "Check your domain ownership and DNS configuration"
        ;;
    *)
        log_warning "Certificate status: $CERT_STATUS"
        ;;
esac

echo ""

# Check if using Route 53 for automatic validation
log_info "Checking Route 53 hosted zone..."
HOSTED_ZONE_ID=$(aws cloudformation describe-stacks \
    --stack-name "$STACK_NAME" \
    --region "$REGION" \
    --query 'Stacks[0].Outputs[?OutputKey==`HostedZoneId`].OutputValue' \
    --output text 2>/dev/null)

if [ -n "$HOSTED_ZONE_ID" ] && [ "$HOSTED_ZONE_ID" != "None" ]; then
    log_success "Route 53 hosted zone found: $HOSTED_ZONE_ID"
    
    # Check if validation records exist
    VALIDATION_RECORDS=$(aws route53 list-resource-record-sets \
        --hosted-zone-id "$HOSTED_ZONE_ID" \
        --query 'ResourceRecordSets[?Type==`CNAME` && contains(Name, `_acme-challenge`)]' \
        --output text)
    
    if [ -n "$VALIDATION_RECORDS" ]; then
        log_success "DNS validation records found in Route 53"
        echo "Validation should complete automatically within 5-10 minutes"
    else
        log_warning "No validation records found in Route 53"
        echo "You may need to add them manually or wait for automatic creation"
    fi
else
    log_warning "No Route 53 hosted zone found"
    echo "You'll need to add DNS validation records manually to your DNS provider"
fi

echo ""
echo "🔧 Useful Commands:"
echo "=================="
echo "Check certificate: aws acm describe-certificate --certificate-arn $CERT_ARN --region $REGION"
echo "List certificates: aws acm list-certificates --region $REGION"
echo "Check DNS records: dig _acme-challenge.$DOMAIN_NAME"
echo "" 