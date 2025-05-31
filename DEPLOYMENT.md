# 🚀 Automated CI/CD Deployment Guide

This project features a fully automated CI/CD pipeline that deploys to AWS after tests pass. No local AWS setup required!

## 🎯 How It Works

```
Push to main → Run Tests → Deploy Infrastructure → Deploy App → Live Website
```

The pipeline automatically:

- ✅ Runs linting and tests
- ✅ Builds your React app
- ✅ Creates/updates AWS infrastructure
- ✅ Deploys to S3 + CloudFront
- ✅ Invalidates CDN cache

## 🔧 One-Time Setup

### 1. Configure GitHub Secrets

Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions**

Add these **Repository Secrets**:

| Secret Name             | Value                      | Example          | Required    |
| ----------------------- | -------------------------- | ---------------- | ----------- |
| `AWS_ACCESS_KEY_ID`     | Your AWS Access Key        | `AKIA...`        | ✅          |
| `AWS_SECRET_ACCESS_KEY` | Your AWS Secret Key        | `wJalr...`       | ✅          |
| `DOMAIN_NAME`           | Your domain from Namecheap | `yourdomain.com` | ✅          |
| `SUBDOMAIN_NAME`        | Subdomain for website      | `www`            | ⚠️ Optional |
| `STACK_NAME`            | CloudFormation stack name  | `my-website`     | ⚠️ Optional |

### 2. Create AWS IAM User

1. Go to AWS Console → **IAM** → **Users** → **Create User**
2. Attach these policies:
   - `AmazonS3FullAccess`
   - `CloudFrontFullAccess`
   - `AmazonRoute53FullAccess`
   - `AWSCertificateManagerFullAccess`
   - `CloudFormationFullAccess`
3. Create access keys and add to GitHub secrets

### 3. Deploy!

```bash
git add .
git commit -m "Setup automated deployment"
git push origin main
```

## 🔄 How Deployments Work

### On Every Push to `main`:

1. **CI Stage**: Lint → Test → Build
2. **Infrastructure Stage**: Deploy/update AWS resources
3. **App Stage**: Upload files to S3 + invalidate CDN

### On Pull Requests:

- Only runs CI (lint, test, build)
- No deployment to AWS

### Branch Strategy:

- `main` → Production deployment
- `develop` → CI only (no deployment)
- Feature branches → CI only via PR

## 📋 Pipeline Stages

### 🧪 CI Stage (Always Runs)

```yaml
✅ Checkout code
✅ Setup Node.js 22
✅ Install dependencies
✅ Run ESLint
✅ Run Vitest tests with coverage
✅ Build React app
✅ Upload build artifacts
```

### 🏗️ Infrastructure Stage (Main branch only)

```yaml
✅ Validate AWS credentials
✅ Deploy CloudFormation stack
✅ Create/update S3 bucket
✅ Setup CloudFront distribution
✅ Configure Route 53 DNS
✅ Generate SSL certificate
```

### 🚀 App Deployment Stage (Main branch only)

```yaml
✅ Download build artifacts
✅ Upload to S3 with optimized caching
✅ Invalidate CloudFront cache
✅ Display deployment summary
```

## 🌐 DNS Configuration

After first deployment, update your Namecheap nameservers:

1. Check GitHub Actions logs for nameservers
2. Go to Namecheap → Domain List → Manage
3. Set **Custom DNS** with the Route 53 nameservers
4. Wait up to 48 hours for propagation

## 📊 Monitoring Deployments

### GitHub Actions Dashboard

- Go to your repo → **Actions** tab
- View real-time deployment progress
- Check logs for any issues

### AWS Console

- **CloudFormation**: View stack status
- **S3**: Check uploaded files
- **CloudFront**: Monitor distribution
- **Route 53**: Verify DNS records

## 🔧 Customization

### Environment-Specific Deployments

```yaml
# Add to secrets for different environments
DOMAIN_NAME: "staging.yourdomain.com"  # Staging
DOMAIN_NAME: "yourdomain.com"          # Production
```

### Custom Stack Names

```yaml
STACK_NAME: "my-app-staging"  # For staging
STACK_NAME: "my-app-prod"     # For production
```

## 🐛 Troubleshooting

### Common Issues

**❌ Tests Failing**

- Check test output in Actions logs
- Fix failing tests before deployment

**❌ AWS Permissions Error**

- Verify IAM user has required policies
- Check AWS credentials in secrets

**❌ Domain Already Exists**

- Use different `STACK_NAME` secret
- Or delete existing Route 53 hosted zone

**❌ SSL Certificate Pending**

- Ensure DNS is configured correctly
- Wait up to 30 minutes for validation

### Useful Commands (Local Debug)

```bash
# Run tests locally
npm test

# Build locally
npm run build

# Check AWS credentials (if needed)
aws sts get-caller-identity
```

## 💰 Cost Estimate

**Monthly AWS costs:**

- S3 Storage: ~$0.50
- CloudFront: ~$1-3
- Route 53: ~$0.50
- **Total: $2-4/month**

## 🔒 Security Features

- ✅ No AWS credentials stored locally
- ✅ Infrastructure as Code (CloudFormation)
- ✅ Automated SSL certificates
- ✅ CDN with security headers
- ✅ S3 bucket secured via CloudFront

## 📈 Next Steps

1. **Custom Domain**: Configure Namecheap DNS
2. **Monitoring**: Set up AWS CloudWatch alerts
3. **Staging**: Create staging environment
4. **Analytics**: Add Google Analytics/tracking

---

**🎉 Your site deploys automatically on every push to main!**
