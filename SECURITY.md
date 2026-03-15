# Security Policy

## Supported Versions

GitSimulator is a static front-end application with no back-end server,
no database, and no user authentication. There is no persistent data storage
beyond what your own browser handles locally.

| Version | Supported |
|---------|-----------|
| Latest (`main` branch) | ✅ |
| Older releases | ❌ |

## Scope

Because this is a pure static site, the security surface is limited to:

- **Dependencies** — npm packages used to build the app (React, Vite)
- **Content injection** — any XSS risk in rendered content
- **Third-party fonts** — Google Fonts loaded via `@import`

Dependabot is configured to flag outdated or vulnerable dependencies automatically.

## Reporting a Vulnerability

If you discover a security issue:

1. **Do not** open a public GitHub Issue
2. Open a **private** GitHub Issue (use the "Security" label if available) or
   contact the maintainers directly at the GitHub profile for
   [Jeethesh (@SiliconBeachIN)](https://github.com/SiliconBeachIN)
3. Include:
   - A clear description of the vulnerability
   - Steps to reproduce
   - The potential impact
   - (Optional) A suggested fix

You will receive a response within **7 days**. Publicly disclosing a
vulnerability before it is patched is not permitted.

## Out of Scope

The following are **not** considered security vulnerabilities for this project:

- The app running inside a sandboxed browser context (expected)
- Terminal simulator accepting arbitrary strings (it is a learning toy — no real commands execute)
- Google Fonts loading from an external CDN (intentional)
- Missing `Content-Security-Policy` headers (depends on hosting platform, not this repo)
