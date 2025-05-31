# AWS Infrastructure Deployment Guide

This directory contains CloudFormation templates and deployment scripts for hosting a static website on AWS with S3, CloudFront, and Route 53.

## 📁 Files Overview

### CloudFormation Templates

- `cloudformation-template-simple.yml` - Basic hosting without SSL (fastest deployment)
- `cloudformation-template-ssl.yml` - Full hosting with SSL certificate support
- `cloudformation-template-reliable.yml` - Legacy template (use simple or ssl instead)

### Deployment Scripts

- `deploy-with-ssl.sh` - Comprehensive deployment script with SSL support
- `test-deploy.sh` - Test deployment script for validation
- `debug-stack.sh` - Debug existing CloudFormation stacks

## 🚀 Quick Start

### Option 1: Simple Deployment (No SSL)

For fastest deployment without custom domain SSL:

```bash
# Make scripts executable
chmod +x aws/*.sh

# Deploy without SSL
./aws/deploy-with-ssl.sh yourdomain.com false
```

### Option 2: SSL-Enabled Deployment

For full production deployment with SSL:

```bash
# Deploy with SSL
./aws/deploy-with-ssl.sh yourdomain.com true
```

## 🔧 GitHub Actions Setup

### Required Secrets

Set these in your GitHub repository secrets:

| Secret                  | Description               | Required | Example                      |
| ----------------------- | ------------------------- | -------- | ---------------------------- |
| `AWS_ACCESS_KEY_ID`     | AWS Access Key            | ✅       | `AKIA...`                    |
| `AWS_SECRET_ACCESS_KEY` | AWS Secret Key            | ✅       | `wJalr...`                   |
| `DOMAIN_NAME`           | Your domain name          | ✅       | `yourdomain.com`             |
| `SUBDOMAIN_NAME`        | Subdomain prefix          | ❌       | `www` (default)              |
| `STACK_NAME`            | CloudFormation stack name | ❌       | `personal-website` (default) |
| `ENABLE_SSL`            | Enable SSL certificate    | ❌       | `false` (default)            |

### Deployment Modes

#### Simple Mode (Default)

- No SSL certificate
- Uses CloudFront default domain
- Fastest deployment (~15-20 minutes)
- Immediate access via CloudFront URL

```yaml
# In GitHub Secrets
ENABLE_SSL: false # or omit this secret
```

#### SSL Mode

- Creates SSL certificate
- Requires manual validation
- Custom domain support
- Longer deployment (~30-45 minutes)

```yaml
# In GitHub Secrets
ENABLE_SSL: true
```

## 📋 Deployment Process

### 1. Infrastructure Creation

The deployment creates:

- **S3 Bucket** - Stores your website files
- **CloudFront Distribution** - CDN for global delivery
- **Route 53 Hosted Zone** - DNS management
- **SSL Certificate** (if enabled) - HTTPS support
- **DNS Records** (if SSL enabled) - Domain routing

### 2. SSL Certificate Validation (SSL Mode Only)

When SSL is enabled:

1. Certificate is created in AWS Certificate Manager
2. **Manual validation required** - you must add CNAME records
3. CloudFront waits for certificate validation
4. Custom domain becomes active after validation

### 3. DNS Configuration

Update your domain registrar (e.g., Namecheap) nameservers to the Route 53 nameservers provided in the deployment output.

## 🛠️ Local Development & Testing

### Test Template Validation

```bash
# Test simple template
./aws/test-deploy.sh yourdomain.com

# Validate SSL template
aws cloudformation validate-template \
  --template-body file://aws/cloudformation-template-ssl.yml
```

### Debug Existing Stack

```bash
# Debug current stack
./aws/debug-stack.sh personal-website eu-west-1

# Check stack events
aws cloudformation describe-stack-events \
  --stack-name personal-website \
  --region eu-west-1
```

### Manual Deployment

```bash
# Deploy simple stack
aws cloudformation deploy \
  --template-file aws/cloudformation-template-simple.yml \
  --stack-name personal-website \
  --parameter-overrides DomainName=yourdomain.com SubdomainName=www \
  --capabilities CAPABILITY_IAM \
  --region eu-west-1

# Deploy SSL stack
aws cloudformation deploy \
  --template-file aws/cloudformation-template-ssl.yml \
  --stack-name personal-website \
  --parameter-overrides DomainName=yourdomain.com SubdomainName=www EnableSSL=true \
  --capabilities CAPABILITY_IAM \
  --region eu-west-1
```

## 🔒 SSL Certificate Management

### Automatic DNS Validation

When using Route 53 for DNS, the certificate can auto-validate:

1. Certificate creates DNS validation records
2. Route 53 hosted zone automatically validates
3. Certificate becomes active within 5-10 minutes

### Manual Validation Steps

If auto-validation fails:

1. Go to AWS Certificate Manager console
2. Find your certificate
3. Copy the CNAME validation records
4. Add them to your DNS provider
5. Wait for validation (5-30 minutes)

### Check Certificate Status

```bash
# Get certificate ARN from stack outputs
CERT_ARN=$(aws cloudformation describe-stacks \
  --stack-name personal-website \
  --query 'Stacks[0].Outputs[?OutputKey==`SSLCertificateArn`].OutputValue' \
  --output text)

# Check certificate status
aws acm describe-certificate \
  --certificate-arn $CERT_ARN \
  --region eu-west-1
```

## 🌍 DNS Configuration

### Nameserver Update

After deployment, update your domain's nameservers:

1. **Get nameservers** from deployment output
2. **Login to your domain registrar** (e.g., Namecheap)
3. **Update nameservers** to the Route 53 values
4. **Wait for propagation** (up to 48 hours)

### Verify DNS Propagation

```bash
# Check nameservers
dig NS yourdomain.com

# Check A record
dig yourdomain.com
dig www.yourdomain.com
```

## 🚨 Troubleshooting

### Common Issues

#### 1. CloudFront SSL Error

```
Error: To add an alternate domain name (CNAME) to a CloudFront distribution,
you must attach a trusted certificate
```

**Solution**: Use simple template first, then upgrade to SSL

#### 2. Stack Creation Timeout

**Symptoms**: Stack hangs on "CREATE_IN_PROGRESS"
**Solution**:

- Check CloudFormation events
- Use debug script: `./aws/debug-stack.sh`
- CloudFront can take 15-45 minutes

#### 3. Certificate Validation Stuck

**Symptoms**: Certificate stays in "Pending validation"
**Solution**:

- Check DNS records are added correctly
- Ensure nameservers are updated
- Wait up to 30 minutes for validation

#### 4. S3 Bucket Name Conflict

**Symptoms**: Bucket already exists error
**Solution**: Bucket names include account ID for uniqueness

### Debug Commands

```bash
# Check stack status
aws cloudformation describe-stacks --stack-name personal-website

# View stack events
aws cloudformation describe-stack-events --stack-name personal-website

# Check failed resources
aws cloudformation describe-stack-events \
  --stack-name personal-website \
  --query 'StackEvents[?ResourceStatus==`CREATE_FAILED`]'

# Delete failed stack
aws cloudformation delete-stack --stack-name personal-website
```

## 📊 Cost Estimation

### Monthly Costs (Approximate)

- **Route 53 Hosted Zone**: $0.50/month
- **CloudFront**: $0.085/GB + $0.0075/10k requests
- **S3 Storage**: $0.023/GB
- **SSL Certificate**: Free (AWS Certificate Manager)

**Typical small website**: $1-5/month

### Cost Optimization

- Use `PriceClass_100` (default) for CloudFront
- Enable S3 versioning cleanup
- Monitor CloudFront usage

## 🔄 Updates & Maintenance

### Update Website Content

1. Upload files to S3 bucket
2. Invalidate CloudFront cache
3. Changes are live immediately

### Update Infrastructure

1. Modify CloudFormation template
2. Run deployment script
3. Stack updates automatically

### Enable SSL Later

1. Set `ENABLE_SSL=true` in GitHub secrets
2. Trigger new deployment
3. Complete certificate validation

## 📚 Additional Resources

- [AWS CloudFormation Documentation](https://docs.aws.amazon.com/cloudformation/)
- [AWS Certificate Manager](https://docs.aws.amazon.com/acm/)
- [CloudFront Documentation](https://docs.aws.amazon.com/cloudfront/)
- [Route 53 Documentation](https://docs.aws.amazon.com/route53/)

## 🆘 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Run the debug script: `./aws/debug-stack.sh`
3. Review CloudFormation events in AWS Console
4. Check GitHub Actions logs for CI/CD issues

---

**Happy deploying! 🚀**
