# CloudFormation Deployment Troubleshooting Guide

## Issue: Stack Gets Stuck on "Deploy CloudFormation stack"

### Problem Description

Your CloudFormation deployment is hanging at the "Deploy CloudFormation stack" step, specifically during SSL certificate creation and validation.

### Root Cause

The issue occurs because:

1. **SSL Certificate Validation**: The `AWS::CertificateManager::Certificate` resource uses DNS validation
2. **Circular Dependency**: The certificate validation requires DNS records that may not be properly configured
3. **Manual Intervention Required**: AWS Certificate Manager is waiting for you to manually validate the certificate through DNS records

### Solutions

#### Option 1: Cancel Current Stack and Use Quick Deployment (Recommended)

1. **Cancel the stuck deployment** (if you have AWS CLI access):

   ```bash
   aws cloudformation delete-stack --stack-name personal-website --region eu-west-1
   ```

2. **Use the fixed deployment script**:
   ```bash
   cd aws
   ./deploy-infrastructure-fixed.sh
   ```
3. **Choose option 1** (Quick deployment without SSL) when prompted

#### Option 2: Use AWS Console to Cancel

1. Go to [AWS CloudFormation Console](https://console.aws.amazon.com/cloudformation/)
2. Select your region (eu-west-1)
3. Find the `personal-website` stack
4. Click "Delete" to cancel the stuck deployment
5. Wait for deletion to complete
6. Run the fixed deployment script

#### Option 3: Manual Certificate Validation (Advanced)

If you want to keep the SSL certificate in the deployment:

1. Go to [AWS Certificate Manager Console](https://console.aws.amazon.com/acm/)
2. Find your certificate request
3. Click on the certificate
4. Copy the DNS validation records
5. Add these records to your Route 53 hosted zone
6. Wait for validation to complete

### Files Created to Fix This Issue

1. **`cloudformation-template.yml`** (Modified)

   - Removed automatic DNS validation options that cause hanging
   - Certificate will require manual validation

2. **`cloudformation-template-no-ssl.yml`** (New)

   - Quick deployment option without SSL certificate
   - Uses CloudFront default certificate
   - Can add SSL later manually

3. **`deploy-infrastructure-fixed.sh`** (New)
   - Improved deployment script with options
   - Checks for existing stuck stacks
   - Provides choice between quick and full deployment

### Recommended Workflow

1. **Start with Quick Deployment**:

   - Use `cloudformation-template-no-ssl.yml`
   - Get your infrastructure up and running quickly
   - Test your website deployment

2. **Add SSL Later**:
   - Request certificate in AWS Certificate Manager
   - Validate using DNS (after Route 53 is configured)
   - Update CloudFront distribution to use the certificate

### Prevention

To avoid this issue in the future:

- Always use the fixed deployment script
- Start with quick deployment for testing
- Add SSL certificates manually after DNS is properly configured
- Monitor CloudFormation events in AWS Console during deployment

### Common Stack States and Actions

| Stack State            | Description                | Action                         |
| ---------------------- | -------------------------- | ------------------------------ |
| `CREATE_IN_PROGRESS`   | Stack is being created     | Wait or cancel if stuck        |
| `CREATE_COMPLETE`      | Stack created successfully | Ready to use                   |
| `CREATE_FAILED`        | Stack creation failed      | Check events, delete and retry |
| `DELETE_IN_PROGRESS`   | Stack is being deleted     | Wait for completion            |
| `ROLLBACK_IN_PROGRESS` | Stack is rolling back      | Wait for completion            |

### Useful AWS CLI Commands

```bash
# Check stack status
aws cloudformation describe-stacks --stack-name personal-website --region eu-west-1

# Get stack events (to see what's happening)
aws cloudformation describe-stack-events --stack-name personal-website --region eu-west-1

# Cancel/delete stuck stack
aws cloudformation delete-stack --stack-name personal-website --region eu-west-1

# Wait for stack deletion
aws cloudformation wait stack-delete-complete --stack-name personal-website --region eu-west-1
```

### Next Steps After Successful Deployment

1. Configure GitHub Secrets with the output values
2. Update Namecheap DNS with Route 53 nameservers
3. Wait for DNS propagation (up to 48 hours)
4. Test your website deployment
5. Add SSL certificate if using the no-SSL template
