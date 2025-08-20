terraform {
  required_version = ">= 1.3"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = ">= 6.34"
    }
    google-beta = {
      source  = "hashicorp/google-beta"
      version = ">= 6.34"
    }
  }
  provider_meta "google" {
    module_name = "blueprints/terraform/fs-exported-1842df1f892e6d2b/v0.1.0"
  }
  provider_meta "google-beta" {
    module_name = "blueprints/terraform/fs-exported-1842df1f892e6d2b/v0.1.0"
  }
}
