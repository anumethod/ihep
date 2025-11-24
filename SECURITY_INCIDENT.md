# Security Incident Report: Exposed Secrets in Git History

**Date**: November 24, 2025
**Severity**: HIGH
**Status**: REMEDIATED (Requires Key Rotation)

## Executive Summary

During a security audit, sensitive credentials were discovered in the Git repository history. While these secrets have been removed from the current codebase, they remain accessible in historical commits and require immediate rotation.

## Exposed Secrets

### 1. OpenAI API Key
- **Type**: OpenAI Project API Key
- **Pattern**: `sk-proj-rnb-8bJ8ygOZk...` (full key redacted)
- **Commit**: `359c4c5b183586d60f8f31a70588b88250a2c0ff`
- **File**: `.env.local`
- **Exposure Duration**: November 19, 2025 - November 24, 2025

### 2. Session Secret
- **Type**: Application Session Secret (JWT signing key)
- **Pattern**: `a3f5d6a1b2c8d9e0f1a2b3c4d5e6f7a8...` (redacted)
- **Commit**: `359c4c5b183586d60f8f31a70588b88250a2c0ff`
- **File**: `.env.local`
- **Exposure Duration**: November 19, 2025 - November 24, 2025

### 3. Potential GitHub PAT Reference
- **Type**: GitHub Personal Access Token reference in script
- **File**: `secrets.sh`
- **Note**: Script reads `GITHUB_PAT` from `.env.local` - verify if this was ever committed

## Root Cause

The `.env.local` file containing production secrets was committed to the repository before being added to `.gitignore`. This occurred during the Next.js migration in commit `359c4c5b183586d60f8f31a70588b88250a2c0ff`.

## Immediate Actions Taken

1. ✅ **Removed `.env.local` from git tracking** (2025-11-24)
2. ✅ **Removed `secrets.sh` from git tracking** (2025-11-24)
3. ✅ **Verified `.gitignore` includes `.env.local`** (already present)
4. ✅ **Replaced secrets with placeholders** (previously done in commit `d09a26a`)
5. ✅ **Created this incident report**

## Required Follow-up Actions

### Priority 1 - IMMEDIATE (Within 24 hours)

- [ ] **Rotate OpenAI API Key**
  - Log into OpenAI platform: https://platform.openai.com/api-keys
  - Revoke the exposed key: `sk-proj-rnb-8bJ8ygOZk...`
  - Generate a new project API key
  - Update Google Cloud Secret Manager with new key
  - Test application functionality

- [ ] **Regenerate Session Secret**
  - Generate new secure random string:
    ```bash
    openssl rand -base64 64
    ```
  - Update in Google Cloud Secret Manager
  - Note: This will invalidate all active user sessions

- [ ] **Check for Unauthorized API Usage**
  - Review OpenAI API usage logs for unusual activity
  - Check for unexpected charges or rate limit hits
  - Monitor for API calls from unknown IP addresses

### Priority 2 - URGENT (Within 72 hours)

- [ ] **Audit GitHub Repository Access**
  - Review who has cloned the repository
  - Check GitHub Insights > Traffic for clone metrics
  - Review collaborator access logs

- [ ] **Remove Secrets from Git History** (Optional but Recommended)

  ⚠️ **WARNING**: This requires force-pushing and will affect all collaborators

  ```bash
  # Option 1: Using git-filter-repo (recommended)
  pip install git-filter-repo
  git filter-repo --path .env.local --invert-paths
  git filter-repo --path secrets.sh --invert-paths

  # Option 2: Using BFG Repo-Cleaner
  bfg --delete-files .env.local
  bfg --delete-files secrets.sh
  git reflog expire --expire=now --all
  git gc --prune=now --aggressive

  # Force push (coordinate with team)
  git push origin --force --all
  git push origin --force --tags
  ```

- [ ] **Enable GitHub Secret Scanning**
  - Navigate to Repository Settings > Security > Code security and analysis
  - Enable "Secret scanning"
  - Enable "Push protection" to prevent future commits with secrets

### Priority 3 - IMPORTANT (Within 1 week)

- [ ] **Implement Pre-commit Hooks**
  ```bash
  # Install detect-secrets
  pip install detect-secrets

  # Add to .pre-commit-config.yaml
  - repo: https://github.com/Yelp/detect-secrets
    hooks:
      - id: detect-secrets
        args: ['--baseline', '.secrets.baseline']
  ```

- [ ] **Security Training**
  - Review with team: Never commit secrets to git
  - Use environment variables and secret management services
  - Always add `.env*` files to `.gitignore` BEFORE first commit

- [ ] **Update Deployment Documentation**
  - Document proper secret management workflow
  - Add section to CLAUDE.md about secret handling
  - Create runbook for secret rotation

## Prevention Measures Implemented

1. ✅ **Enhanced `.gitignore`** - Added comprehensive patterns for sensitive files
2. ✅ **Created `.env.example`** - Template for environment configuration
3. ✅ **Removed sensitive files from tracking** - `.env.local` and `secrets.sh`
4. ✅ **Documentation** - This incident report and remediation steps

## Additional Recommendations

### For Development Team

1. **Use Google Cloud Secret Manager** - Store all secrets in GCP Secret Manager
   ```bash
   # Store secrets securely
   echo -n "new-secret-value" | gcloud secrets create SECRET_NAME --data-file=-

   # Access in application via GCP SDK
   ```

2. **Use Environment Variables** - Never hardcode secrets
   ```typescript
   // ❌ BAD
   const apiKey = "sk-proj-abc123..."

   // ✅ GOOD
   const apiKey = process.env.OPENAI_API_KEY
   if (!apiKey) throw new Error("OPENAI_API_KEY not configured")
   ```

3. **Rotate Secrets Regularly** - Quarterly rotation of all production secrets

4. **Least Privilege Access** - Limit who can access production secrets

### For Repository Security

1. **Enable Branch Protection** - Require PR reviews for main branch
2. **CODEOWNERS File** - Require security team review for sensitive changes
3. **Dependabot Alerts** - Monitor for vulnerable dependencies
4. **GitHub Actions Security** - Use OpenID Connect, not long-lived tokens

## Timeline of Events

- **2025-11-19**: Initial commit of `.env.local` with secrets (commit `359c4c5`)
- **2025-11-19**: Attempted fix with `.env.local` update (commit `cefb9f5`)
- **2025-11-19**: Partial fix replacing OPENAI_API_KEY (commit `d09a26a`)
- **2025-11-19**: Merged PR #7 "Fixed exposed env variable issue" (commit `f87f874`)
- **2025-11-24**: Comprehensive security audit and remediation (this commit)

## Lessons Learned

1. **Always check `.gitignore` BEFORE first commit** of environment files
2. **Use placeholder values** in example files (`.env.example`)
3. **Implement pre-commit hooks** to catch secrets before commit
4. **Regular security audits** of repository history
5. **Secret rotation procedures** should be documented and tested

## Contact

For questions about this incident or secret rotation procedures:
- Security Team: [security@ihep-platform.org]
- DevOps Team: [devops@ihep-platform.org]
- On-call: Check internal documentation

## References

- [Git-filter-repo Documentation](https://github.com/newren/git-filter-repo)
- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)
- [Google Cloud Secret Manager](https://cloud.google.com/secret-manager/docs)
- [OWASP Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)

---

**Report prepared by**: Claude Code Security Audit
**Last updated**: 2025-11-24
