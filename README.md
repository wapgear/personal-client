# Personal Client Website

A modern React-based personal website with automated AWS deployment.

## 🚀 Quick Start

### 1. One-Time Infrastructure Setup

Run the infrastructure setup script to create AWS resources (Route53, CloudFront, ACM certificates):

```bash
./aws/setup-infrastructure.sh
```

This script will:

- Prompt for AWS credentials and domain configuration
- Deploy CloudFormation stack with all necessary infrastructure
- Generate GitHub secrets configuration file
- Provide next steps for DNS and SSL setup

### 2. Configure GitHub Secrets

Add the generated secrets to your GitHub repository:

- Go to **Settings** > **Secrets and variables** > **Actions**
- Add all secrets from the generated `github-secrets.txt` file

### 3. Deploy Your App

Push to the `main` branch to trigger automatic deployment:

```bash
git push origin main
```

## 📁 Project Structure

```
personal-client/
├── src/                    # React application source
├── aws/                    # AWS infrastructure
│   ├── setup-infrastructure.sh    # One-time setup script
│   ├── cloudformation-template-*.yml  # CloudFormation templates
│   └── SETUP.md           # Detailed setup guide
├── .github/workflows/     # GitHub Actions
└── package.json          # Dependencies and scripts
```

## 🛠️ Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Run linter
npm run lint
```

## 🌐 Infrastructure

The setup creates:

- **S3 Bucket** - Static website hosting
- **CloudFront Distribution** - Global CDN
- **Route53 Hosted Zone** - DNS management
- **ACM Certificate** - SSL/TLS (optional)

## 📋 Deployment Process

1. **CI/CD Pipeline** runs on every push to `main`
2. **Build & Test** - Compiles and validates the application
3. **Deploy to S3** - Uploads files with optimized caching
4. **CloudFront Invalidation** - Clears CDN cache
5. **Deployment Summary** - Reports success and URLs

## 📖 Documentation

- [Detailed Setup Guide](aws/SETUP.md) - Complete infrastructure setup instructions
- [Troubleshooting](aws/SETUP.md#troubleshooting) - Common issues and solutions

## 🔧 Configuration

### Environment Variables (GitHub Secrets)

Required:

- `AWS_ACCESS_KEY_ID` - AWS access key
- `AWS_SECRET_ACCESS_KEY` - AWS secret key
- `S3_BUCKET_NAME` - S3 bucket for hosting
- `CLOUDFRONT_DISTRIBUTION_ID` - CloudFront distribution ID

Optional:

- `STACK_NAME` - CloudFormation stack name
- `DOMAIN_NAME` - Custom domain name
- `SUBDOMAIN_NAME` - Subdomain (e.g., www)
- `ENABLE_SSL` - SSL certificate configuration

## 🚨 Important Notes

1. **Run infrastructure setup once** - The setup script creates long-lived AWS resources
2. **GitHub Actions handle app deployment** - Automatic on every push to main
3. **DNS propagation takes time** - Custom domains may take up to 48 hours
4. **SSL validation required** - Manual step in AWS Certificate Manager if enabled

## 📞 Support

For issues:

1. Check the [Setup Guide](aws/SETUP.md)
2. Review GitHub Actions logs
3. Verify AWS resources in the console
4. Ensure all secrets are configured correctly
