# AWS Infrastructure Setup Guide

This guide explains how to set up your AWS infrastructure once and then use GitHub Actions for automatic deployments.

## Overview

The deployment process is now split into two parts:

1. **One-time Infrastructure Setup** (manual) - Creates Route53, CloudFront, and ACM certificates
2. **Automatic App Deployment** (GitHub Actions) - Deploys your application to the existing infrastructure

## 🚀 One-Time Infrastructure Setup

### Prerequisites

- AWS CLI installed on your local machine
- An AWS account with appropriate permissions
- A domain name (optional, but recommended)

### Step 1: Run the Infrastructure Setup Script

```bash
# Make sure you're in the project root
cd /path/to/your/project

# Run the setup script
./aws/setup-infrastructure.sh
```

The script will prompt you for:

- **AWS Access Key ID** - Your AWS access key
- **AWS Secret Access Key** - Your AWS secret key (hidden input)
- **AWS Region** - e.g., `eu-west-1`, `us-east-1`
- **Domain Name** - e.g., `yourdomain.com`
- **Subdomain** - e.g., `www`
- **Stack Name** - e.g., `personal-website`
- **SSL Configuration** - Whether to enable SSL certificates

### Step 2: Configure GitHub Secrets

After the script completes, it will generate a `github-secrets.txt` file. Add these secrets to your GitHub repository:

1. Go to your GitHub repository
2. Navigate to **Settings** > **Secrets and variables** > **Actions**
3. Click **New repository secret** for each secret in the file:

Required secrets:

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `S3_BUCKET_NAME`
- `CLOUDFRONT_DISTRIBUTION_ID`

Optional secrets (for enhanced functionality):

- `STACK_NAME`
- `DOMAIN_NAME`
- `SUBDOMAIN_NAME`
- `ENABLE_SSL`

### Step 3: DNS Configuration (If Using Custom Domain)

If you enabled a custom domain:

1. **Update nameservers** at your domain registrar (e.g., Namecheap) with the values provided by the script
2. **Wait for DNS propagation** (up to 48 hours)

### Step 4: SSL Certificate Validation (If SSL Enabled)

If you enabled SSL:

1. Go to [AWS Certificate Manager Console](https://console.aws.amazon.com/acm/)
2. Find your certificate
3. Complete the DNS validation by adding the required CNAME records
4. Wait for validation to complete (5-30 minutes)

## 🔄 Automatic Deployments

Once the infrastructure is set up, every push to the `main` branch will automatically:

1. **Build** your application
2. **Test** your application
3. **Deploy** to S3
4. **Invalidate** CloudFront cache
5. **Report** deployment status

## 🛠️ Infrastructure Components

The setup creates:

### Core Infrastructure

- **S3 Bucket** - Hosts your static website files
- **CloudFront Distribution** - Global CDN for fast content delivery
- **Route53 Hosted Zone** - DNS management for your domain

### Optional Components (if SSL enabled)

- **ACM Certificate** - SSL/TLS certificate for HTTPS
- **Route53 Records** - DNS records pointing to CloudFront

## 📋 Troubleshooting

### Common Issues

#### 1. "S3 bucket not found" error in GitHub Actions

**Solution**: Ensure the `S3_BUCKET_NAME` secret is correctly set in GitHub.

#### 2. "CloudFront distribution not found" error

**Solution**: Ensure the `CLOUDFRONT_DISTRIBUTION_ID` secret is correctly set in GitHub.

#### 3. SSL certificate validation stuck

**Solution**:

1. Check AWS Certificate Manager console
2. Manually add DNS validation records if auto-validation failed
3. Ensure your domain's nameservers are updated

#### 4. Custom domain not working

**Solution**:

1. Verify nameservers are updated at your domain registrar
2. Check DNS propagation: `dig yourdomain.com`
3. Wait up to 48 hours for full propagation

### Useful Commands

```bash
# Check stack status
aws cloudformation describe-stacks --stack-name your-stack-name --region eu-west-1

# Check certificate status
aws acm list-certificates --region eu-west-1

# Check S3 bucket
aws s3 ls s3://your-bucket-name

# Check CloudFront distribution
aws cloudfront get-distribution --id YOUR_DISTRIBUTION_ID
```

## 🔧 Advanced Configuration

### Updating Infrastructure

To update your infrastructure (e.g., enable SSL later):

1. Run the setup script again with new parameters
2. The script will update the existing stack
3. Update GitHub secrets if needed

### Multiple Environments

To set up multiple environments (staging, production):

1. Run the setup script multiple times with different stack names
2. Use different GitHub repositories or branches
3. Configure separate secrets for each environment

### Custom Domain Later

To add a custom domain to an existing setup:

1. Run the setup script again with SSL enabled
2. Update your domain's nameservers
3. Complete SSL certificate validation

## 📞 Support

If you encounter issues:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review AWS CloudFormation events in the AWS Console
3. Check GitHub Actions logs for deployment issues
4. Ensure all required secrets are properly configured

## 🔒 Security Best Practices

1. **Use IAM roles** with minimal required permissions
2. **Rotate AWS keys** regularly
3. **Enable CloudTrail** for audit logging
4. **Use SSL/HTTPS** for production websites
5. **Keep secrets secure** - never commit them to your repository
