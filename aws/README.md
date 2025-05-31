# AWS Static Website Hosting Setup

This guide will help you deploy your React application to AWS using S3, CloudFront, and Route 53 with your custom Namecheap domain.

## Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Namecheap     │    │   AWS Route 53   │    │   CloudFront    │
│   (Domain)      │───▶│   (DNS)          │───▶│   (CDN)         │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                                         │
                                                         ▼
                                               ┌─────────────────┐
                                               │   S3 Bucket     │
                                               │   (Static Site) │
                                               └─────────────────┘
```

## Features

- ✅ **S3 Static Website Hosting** - Cost-effective hosting
- ✅ **CloudFront CDN** - Global content delivery and caching
- ✅ **Custom Domain** - Your Namecheap domain with HTTPS
- ✅ **SSL Certificate** - Automatic SSL via AWS Certificate Manager
- ✅ **GitHub Actions** - Automated deployment pipeline
- ✅ **SPA Support** - Proper routing for React Router

## Prerequisites

1. **AWS Account** with appropriate permissions
2. **AWS CLI** installed and configured
3. **Domain** registered with Namecheap
4. **GitHub Repository** for your project

## Step 1: Install AWS CLI

### macOS

```bash
brew install awscli
```

### Linux/Windows

Follow the [official AWS CLI installation guide](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)

## Step 2: Configure AWS Credentials

1. Create an IAM user in AWS Console with these policies:

   - `AmazonS3FullAccess`
   - `CloudFrontFullAccess`
   - `AmazonRoute53FullAccess`
   - `AWSCertificateManagerFullAccess`
   - `CloudFormationFullAccess`

2. Configure AWS CLI:

```bash
aws configure
```

Enter your:

- AWS Access Key ID
- AWS Secret Access Key
- Default region (recommend: `us-east-1`)
- Default output format: `json`

## Step 3: Deploy AWS Infrastructure

1. Navigate to the aws directory:

```bash
cd aws
```

2. Make the deployment script executable:

```bash
chmod +x deploy-infrastructure.sh
```

3. Run the deployment script:

```bash
./deploy-infrastructure.sh
```

4. Follow the prompts:
   - Enter your domain name (e.g., `yourdomain.com`)
   - Enter subdomain (default: `www`)
   - Enter AWS region (default: `us-east-1`)
   - Enter stack name (default: `personal-website`)

## Step 4: Configure GitHub Secrets

After the infrastructure deployment completes, add these secrets to your GitHub repository:

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Add these repository secrets:

| Secret Name                  | Value                  | Description                |
| ---------------------------- | ---------------------- | -------------------------- |
| `AWS_ACCESS_KEY_ID`          | Your AWS Access Key    | IAM user access key        |
| `AWS_SECRET_ACCESS_KEY`      | Your AWS Secret Key    | IAM user secret key        |
| `S3_BUCKET_NAME`             | From deployment output | S3 bucket name             |
| `CLOUDFRONT_DISTRIBUTION_ID` | From deployment output | CloudFront distribution ID |

## Step 5: Configure Namecheap DNS

1. Log in to your Namecheap account
2. Go to **Domain List** → **Manage** for your domain
3. Navigate to **Nameservers** section
4. Select **Custom DNS**
5. Replace the nameservers with the AWS Route 53 nameservers from the deployment output

**Example nameservers (yours will be different):**

```
ns-1234.awsdns-12.org
ns-5678.awsdns-34.net
ns-9012.awsdns-56.com
ns-3456.awsdns-78.co.uk
```

## Step 6: Deploy Your Application

1. Push your code to the `main` branch:

```bash
git add .
git commit -m "Add AWS deployment configuration"
git push origin main
```

2. The GitHub Actions workflow will automatically:
   - Build your React application
   - Upload files to S3
   - Invalidate CloudFront cache
   - Your site will be live!

## Step 7: Verify Deployment

1. **Check GitHub Actions**: Ensure the workflow completed successfully
2. **Test CloudFront URL**: Visit the CloudFront distribution URL
3. **Test Custom Domain**: Visit your custom domain (may take up to 48 hours for DNS propagation)

## Monitoring and Maintenance

### View Deployment Logs

```bash
# Check CloudFormation stack status
aws cloudformation describe-stacks --stack-name personal-website

# View CloudFront distribution
aws cloudfront list-distributions
```

### Manual Deployment (if needed)

```bash
# Build the application
npm run build

# Upload to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

### Update Infrastructure

To modify the infrastructure, edit `cloudformation-template.yml` and run:

```bash
./deploy-infrastructure.sh
```

## Troubleshooting

### Common Issues

1. **DNS not resolving**

   - Wait up to 48 hours for DNS propagation
   - Verify nameservers are correctly set in Namecheap

2. **SSL Certificate pending validation**

   - Ensure DNS is properly configured
   - Certificate validation can take 30+ minutes

3. **GitHub Actions failing**

   - Verify all secrets are correctly set
   - Check AWS permissions for the IAM user

4. **404 errors on refresh**
   - The CloudFormation template includes error page redirects for SPA routing

### Useful Commands

```bash
# Check certificate status
aws acm list-certificates --region us-east-1

# View Route 53 hosted zones
aws route53 list-hosted-zones

# Check S3 bucket website configuration
aws s3api get-bucket-website --bucket your-bucket-name
```

## Cost Estimation

**Monthly costs (approximate):**

- S3 Storage: $0.023/GB
- CloudFront: $0.085/GB (first 10TB)
- Route 53: $0.50/hosted zone + $0.40/million queries
- Certificate Manager: Free

**Typical small website: $1-5/month**

## Security Features

- ✅ HTTPS enforced via CloudFront
- ✅ Security headers via CloudFront response headers policy
- ✅ Origin Access Control (OAC) for S3 bucket security
- ✅ Public access blocked on S3 (access only via CloudFront)

## Support

For issues with this setup:

1. Check the troubleshooting section above
2. Review AWS CloudFormation events in the AWS Console
3. Check GitHub Actions logs for deployment issues

---

**Happy deploying! 🚀**
