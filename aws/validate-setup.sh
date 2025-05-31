#!/bin/bash

# AWS Setup Validation Script
# This script validates that all prerequisites are met for deployment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[CHECK]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[⚠]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

echo "🔍 AWS Deployment Prerequisites Validation"
echo "=========================================="
echo ""

# Check if AWS CLI is installed
print_status "Checking AWS CLI installation..."
if command -v aws &> /dev/null; then
    AWS_VERSION=$(aws --version 2>&1 | cut -d/ -f2 | cut -d' ' -f1)
    print_success "AWS CLI installed (version: $AWS_VERSION)"
else
    print_error "AWS CLI is not installed"
    echo "Install with: brew install awscli (macOS) or follow AWS documentation"
    exit 1
fi

# Check AWS credentials
print_status "Checking AWS credentials..."
if aws sts get-caller-identity &> /dev/null; then
    AWS_ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
    AWS_USER=$(aws sts get-caller-identity --query Arn --output text | cut -d'/' -f2)
    print_success "AWS credentials configured (Account: $AWS_ACCOUNT, User: $AWS_USER)"
else
    print_error "AWS credentials not configured"
    echo "Run: aws configure"
    exit 1
fi

# Check required permissions (basic check)
print_status "Checking basic AWS permissions..."

# Test S3 permissions
if aws s3 ls &> /dev/null; then
    print_success "S3 permissions available"
else
    print_warning "S3 permissions may be limited"
fi

# Test CloudFormation permissions
if aws cloudformation list-stacks --max-items 1 &> /dev/null; then
    print_success "CloudFormation permissions available"
else
    print_warning "CloudFormation permissions may be limited"
fi

# Check if Node.js and npm are available
print_status "Checking Node.js and npm..."
if command -v node &> /dev/null && command -v npm &> /dev/null; then
    NODE_VERSION=$(node --version)
    NPM_VERSION=$(npm --version)
    print_success "Node.js ($NODE_VERSION) and npm ($NPM_VERSION) available"
else
    print_error "Node.js or npm not found"
    exit 1
fi

# Check if package.json exists
print_status "Checking project structure..."
if [ -f "../package.json" ]; then
    print_success "package.json found"
else
    print_error "package.json not found in project root"
    exit 1
fi

# Check if build script exists
if grep -q '"build"' ../package.json; then
    print_success "Build script found in package.json"
else
    print_warning "Build script not found in package.json"
fi

# Check GitHub repository (if .git exists)
print_status "Checking Git repository..."
if [ -d "../.git" ]; then
    if git remote get-url origin &> /dev/null; then
        REPO_URL=$(git remote get-url origin)
        print_success "Git repository configured ($REPO_URL)"
    else
        print_warning "Git repository found but no origin remote configured"
    fi
else
    print_warning "Not a Git repository - GitHub Actions won't work"
fi

echo ""
echo "🎯 VALIDATION SUMMARY"
echo "===================="

# Check if all critical requirements are met
CRITICAL_CHECKS=0

if command -v aws &> /dev/null; then
    ((CRITICAL_CHECKS++))
fi

if aws sts get-caller-identity &> /dev/null; then
    ((CRITICAL_CHECKS++))
fi

if command -v node &> /dev/null && command -v npm &> /dev/null; then
    ((CRITICAL_CHECKS++))
fi

if [ -f "../package.json" ]; then
    ((CRITICAL_CHECKS++))
fi

if [ $CRITICAL_CHECKS -eq 4 ]; then
    print_success "All critical prerequisites met! Ready for deployment."
    echo ""
    echo "🚀 NEXT STEPS:"
    echo "1. Run: ./deploy-infrastructure.sh"
    echo "2. Configure GitHub Secrets (see README.md)"
    echo "3. Update Namecheap DNS settings"
    echo "4. Push to GitHub to trigger deployment"
else
    print_error "Some critical prerequisites are missing. Please fix the issues above."
    exit 1
fi 