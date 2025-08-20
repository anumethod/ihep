# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Common Commands

### Terraform Operations
```bash
# Initialize Terraform with backend configuration
cd terraform && terraform init

# Select or create workspace for different environments
terraform workspace select dev || terraform workspace new dev
terraform workspace select staging || terraform workspace new staging
terraform workspace select prod || terraform workspace new prod

# Plan infrastructure changes
terraform plan -var enable_network=true -var enable_service_account=true

# Apply infrastructure changes
terraform apply -auto-approve -var enable_network=true -var enable_service_account=true

# Format Terraform files
terraform fmt -recursive .

# Validate Terraform configuration
terraform validate

# Show current state
terraform show

# Destroy infrastructure (use with caution)
terraform destroy
```

### Node.js Web Application
```bash
# Install dependencies
npm ci

# Start development server
npm start

# Build Docker image
docker build -t ihep-web:latest .

# Run Docker container locally
docker run -p 8080:8080 -e NODE_ENV=development ihep-web:latest
```

### Google Cloud Operations
```bash
# Authenticate with Google Cloud
gcloud auth login
gcloud auth application-default login

# Set up service account impersonation for Terraform
gcloud auth application-default login --impersonate-service-account terraform-deployer@PROJECT_ID.iam.gserviceaccount.com

# Configure Docker for Artifact Registry
gcloud auth configure-docker us-docker.pkg.dev --quiet

# Deploy to Cloud Run manually
gcloud run deploy web-dev \
  --project ihep-app \
  --region us-central1 \
  --image us-docker.pkg.dev/ihep-app/ihep/web:latest \
  --allow-unauthenticated

# List current projects
gcloud projects list

# Set active project
gcloud config set project PROJECT_ID
```

### Git and CI/CD Operations
```bash
# Push to trigger dev deployment
git push origin dev

# Push to trigger staging deployment  
git push origin staging

# Push to trigger production deployment
git push origin main

# Check workflow status
gh workflow list
gh run list
```

## Architecture Overview

### Project Structure

This repository implements Google Cloud Foundation Blueprint, an enterprise-grade infrastructure-as-code solution that provisions a secure, scalable Google Cloud environment following Google Cloud best practices.

**Key Components:**

- **`terraform/`**: Contains all Terraform infrastructure code
- **Node.js Web Application**: Simple Express.js server for the IHEP (Integrated Health Empowerment Program) web component
- **GitHub Actions Workflows**: CI/CD pipelines for automated deployments
- **Docker Configuration**: Containerization for the web application

### Terraform Architecture

The Terraform configuration implements a hierarchical folder structure with:

**Organizational Structure:**
- **Root Organization**: Contains all resources
- **Common Folder**: Shared infrastructure (VPC hosts, logging, monitoring)
- **Business Unit Folders**: LifeSciences, Technologies, Entertainment, Governmental, Creative, B2B, Commerce, Financial, Logistics, Procurement, PartnerNet
- **Environment Sub-folders**: Each business unit has Concept/Planning/Resourcing/Project/Sanitation/Maintenance phases
- **Environment Types**: Production, Testing, Development within each phase

**Infrastructure Components:**
- **Folders (`folders.tf`)**: 3-level hierarchical organization structure
- **Projects (`projects.tf`)**: VPC host projects for prod/non-prod, centralized logging/monitoring
- **Network (`network.tf`)**: Shared VPCs with subnets in us-central1 and us-east1, firewall rules
- **IAM (`iam.tf`)**: Identity and access management at organization/folder/project levels
- **Groups (`groups.tf`)**: Google Groups for simplified permission management
- **Service Projects (`service-projects.tf`)**: Application hosting projects
- **Logging (`log-export.tf`)**: Centralized log aggregation and export
- **Monitoring (`monitoring.tf`)**: Centralized metrics and monitoring
- **Org Policies (`org-policy.tf`)**: Security and compliance policies
- **CMEK Autokey (`autokey.tf`)**: Customer-managed encryption keys automation

### Web Application Architecture

**Technology Stack:**
- **Runtime**: Node.js 24 (Alpine Linux)
- **Framework**: Express.js
- **Deployment**: Google Cloud Run
- **Container Registry**: Google Artifact Registry
- **Build**: Docker multi-stage builds

**Application Structure:**
- **`server.js`**: Main Express application with health check and SSR placeholder
- **`package.json`**: Dependencies and npm scripts
- **`Dockerfile`**: Container build configuration
- **Security Headers**: Includes X-Content-Type-Options and Referrer-Policy

### CI/CD Pipeline Architecture

**Terraform Workflows:**
- **`tf-dev.yml`**: Deploys infrastructure to development workspace on dev branch pushes
- **`tf-staging.yml`**: Deploys infrastructure to staging workspace on staging branch pushes  
- **`tf-prod.yml`**: Deploys infrastructure to production workspace on main branch pushes

**Web Application Workflows:**
- **`web-deploy-dev.yml`**: Builds and deploys web app to Cloud Run dev service
- **`web-deploy-staging.yml`**: Builds and deploys web app to Cloud Run staging service
- **`web-deploy-prod.yml`**: Builds and deploys web app to Cloud Run production service

**Authentication**: Uses Workload Identity Federation (OIDC) for secure, keyless authentication to Google Cloud

### Key Configuration Files

- **`terraform/cloud-setup.auto.tfvars`**: Organization ID, billing account, and extensive folder structure configuration
- **`terraform/backends.tf`**: GCS backend for Terraform state storage
- **`terraform/versions.tf`**: Terraform and provider version constraints
- **`terraform/variables.tf`**: Input variable definitions

### Environment Management

The repository supports three environments managed through Terraform workspaces:
- **dev**: Development environment with relaxed security policies
- **staging**: Pre-production environment for testing
- **prod**: Production environment with strict security and compliance

### Security and Compliance Features

- **Shared VPC Architecture**: Centralized network management and security
- **Private Google Access**: Subnets configured with private access to Google APIs
- **VPC Flow Logs**: Network traffic logging for security monitoring  
- **Firewall Rules**: Restrictive ingress rules (ICMP, SSH, RDP from IAP ranges only)
- **CMEK Autokey**: Automatic customer-managed encryption key generation
- **Org Policies**: Organization-wide security and compliance policies
- **IAM Best Practices**: Principle of least privilege with group-based permissions

### Data Flow

1. **Code Changes**: Developers push to feature branches, create PRs to dev/staging/main
2. **CI/CD Triggers**: GitHub Actions workflows triggered by branch pushes
3. **Infrastructure Deployment**: Terraform applies changes to appropriate workspace
4. **Application Deployment**: Docker image built, pushed to Artifact Registry, deployed to Cloud Run
5. **Monitoring**: Centralized logging and monitoring captures application and infrastructure metrics

## Development Workflow

When modifying the folder structure in `cloud-setup.auto.tfvars`:
1. Update the `folders` variable with new structure
2. Update `cmek_autokey_folders` to include paths requiring encryption
3. Update `application_enabled_folder_paths` for resource manager capability
4. Search for hardcoded folder references in `iam.tf`, `service-projects.tf`, and `projects.tf`
5. Update references like `module.cs-folders-level-1["Team 1/Production"].ids["Production"]` to match new names

## Prerequisites for Deployment

- Google Cloud Organization with billing enabled
- Terraform service account with appropriate IAM roles:
  - `roles/billing.projectManager`
  - `roles/resourcemanager.folderCreator`
  - `roles/resourcemanager.projectCreator`
  - `roles/orgpolicy.policyAdmin`
  - Additional roles as documented in terraform/README.md
- GCS bucket for Terraform state backend (configured in `backends.tf`)
- Workload Identity Federation configured for GitHub Actions
