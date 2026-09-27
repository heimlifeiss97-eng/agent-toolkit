# Security Policy

## Overview

This document outlines security best practices for the PayPal Agent Toolkit project, with a focus on preventing the exposure of sensitive credentials, API keys, and tokens.

## Critical Rules

### 🚫 NEVER DO THIS:

```python
# ❌ BAD: Hardcoded credentials in URL
url = "https://api.example.com/v2/api?module=contract&apikey=YOUR_ACTUAL_API_KEY"
requests.get(url)

# ❌ BAD: Hardcoded credentials in code
PAYPAL_CLIENT_SECRET = "actual_secret_value_here"
API_KEY = "5FQkDMA9aM8NXWs4DDuJHUXfjxTvRoj6ah6hx1Mcpump"
```

### ✅ ALWAYS DO THIS:

```python
# ✅ GOOD: Use environment variables
import os
PAYPAL_CLIENT_SECRET = os.getenv("PAYPAL_CLIENT_SECRET")
API_KEY = os.getenv("API_KEY")

# Validate that required environment variables are set
if not PAYPAL_CLIENT_SECRET:
    raise ValueError("PAYPAL_CLIENT_SECRET environment variable is required")
```

## Handling Credentials

### 1. Environment Variables

All sensitive credentials must be stored in environment variables:

- **PayPal credentials**: `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`
- **AWS credentials**: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`
- **API keys**: Follow the naming convention `EXTERNAL_SERVICE_API_KEY`
- **Tokens**: Follow the naming convention `EXTERNAL_SERVICE_TOKEN`

### 2. .env Files

- Create a `.env.sample` file showing the required variables **without values**
- Add `.env` to `.gitignore` to prevent accidental commits
- Never commit actual `.env` files with real credentials
- Document all required environment variables in README

Example `.env.sample`:
```
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
API_KEY=
DATABASE_URL=
```

### 3. Environment Variable Validation

Always validate that required environment variables are set before using them:

```python
def get_required_env(var_name: str) -> str:
    """Get a required environment variable.
    
    Args:
        var_name: Name of the environment variable
        
    Returns:
        The environment variable value
        
    Raises:
        ValueError: If the environment variable is not set
    """
    value = os.getenv(var_name)
    if not value:
        raise ValueError(f"Required environment variable '{var_name}' is not set")
    return value
```

## Logging and Debugging

### Safe Logging Practices

**Never log sensitive information:**

```python
# ❌ BAD: Logs the full token
logger.info(f"Authorization header: {authorization_header}")

# ✅ GOOD: Masks sensitive parts
def mask_token(token: str, visible_chars: int = 8) -> str:
    """Mask a token for safe logging."""
    if len(token) <= visible_chars:
        return "***"
    return token[:visible_chars] + "*" * (len(token) - visible_chars)

logger.info(f"Authorization header: ******")
```

See `python/paypal_agent_toolkit/shared/logger_util.py` for the implemented masking utility.

## Pre-commit Security Checks

To prevent accidental commits of secrets, configure `detect-secrets`:

### Installation

```bash
pip install detect-secrets
```

### Pre-commit Configuration

Create `.pre-commit-config.yaml`:

```yaml
repos:
  - repo: https://github.com/Yelp/detect-secrets
    rev: v1.5.0
    hooks:
      - id: detect-secrets
        args: ['scan', '--baseline', '.secrets.baseline']
        exclude: package.lock.json
```

### Setup Pre-commit Hook

```bash
pre-commit install
pre-commit run --all-files
```

## Files to Never Commit

Add these patterns to `.gitignore`:

```
# Environment files
.env
.env.local
.env.*.local
.env.development.local

# Credentials and secrets
*.key
*.pem
*.p12
secrets.json
credentials.json

# IDE files that might contain credentials
.vscode/settings.json
.idea/misc.xml

# Temporary/backup files
*.backup
*.bak
```

## Code Review Guidelines

When reviewing code, watch for:

1. **Hardcoded strings** that look like credentials (API keys, tokens, secrets)
2. **URL query parameters** containing sensitive data
3. **Configuration files** committed with real values
4. **Logging statements** that might expose sensitive information
5. **Default values** in code that contain actual credentials

## If a Secret is Accidentally Committed

If you accidentally commit a secret:

1. **Immediately rotate the credential** in your service provider
2. **Create a new pull request** removing the secret
3. **Rewrite git history** if necessary (consult team lead)
4. **Notify the security team** about the exposure

```bash
# To remove a file from git history
git filter-branch --tree-filter 'rm -f <file_path>' HEAD
git push --force
```

## Scanning for Secrets

To check if secrets exist in the repository:

```bash
# Run detect-secrets scan
detect-secrets scan .

# Check git history for secrets
detect-secrets scan --baseline .secrets.baseline

# To update baseline after fixing issues
detect-secrets scan --baseline .secrets.baseline > .secrets.baseline
```

## Dependencies and Vulnerabilities

- Regularly update dependencies to patch security vulnerabilities
- Use `pip audit` for Python packages
- Use `npm audit` for JavaScript packages
- Address high-severity vulnerabilities immediately

```bash
# Python: Check for vulnerable dependencies
pip install pip-audit
pip-audit

# Update vulnerable packages
pip install --upgrade <package-name>
```

## External API Integration

When integrating with external APIs:

1. **Use API keys from environment variables only**
2. **Never expose API keys in URLs** - use headers instead
3. **Rotate API keys regularly**
4. **Use API key scoping** if the service supports it
5. **Monitor API usage** for unusual activity

Example - Using API key in headers instead of URL:

```python
# ❌ BAD: API key in URL
headers = {}
url = f"https://api.example.com/data?apikey={api_key}"
response = requests.get(url, headers=headers)

# ✅ GOOD: API key in headers
headers = {"Authorization": f"******"}
url = "https://api.example.com/data"
response = requests.get(url, headers=headers)
```

## Multi-Environment Setup

Maintain separate credentials for different environments:

- **Development**: Use sandbox/testing credentials
- **Staging**: Use staging environment credentials
- **Production**: Use production credentials with restricted access

Document this in environment setup instructions.

## References

- [OWASP: Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [Yelp detect-secrets](https://github.com/Yelp/detect-secrets)
- [GitHub: Security best practices](https://docs.github.com/en/code-security)

## Questions or Issues?

If you discover a security vulnerability or have questions about these practices, please:

1. **Do not** open a public issue
2. Contact the security team directly
3. Follow responsible disclosure practices

---

**Last Updated**: 2026-09-27
**Version**: 1.0
