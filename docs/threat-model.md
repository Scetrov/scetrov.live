# Threat model

## Scope

This repository contains the public `scetrov.live` homepage and a small Go program that serves the working directory over HTTP. This document covers the versioned source and its build and review paths. DNS, TLS, CDN, hosting, deployment credentials, and provider configuration are outside this repository and must be confirmed by their owners.

## Assets and security objectives

- Preserve the integrity of the published HTML, CSS, JavaScript, image, and Go server source.
- Keep deployment credentials and provider configuration out of the served directory and repository history.
- Protect visitor privacy and site availability.
- Ensure links and third-party resources presented to visitors are intentional.

## Trust boundaries

- Visitors' browsers cross from the public internet to the deployed static-file server.
- The Go `http.FileServer` serves the deployment working directory; deployment tooling must ensure that directory contains only intended public files.
- The homepage loads a stylesheet from Google Fonts and links to third-party sites. Those services and their content are outside this repository's control.
- The homepage states that the host and intermediate services may log IP addresses. The named provider and logging behavior are operational assumptions to be confirmed by the deployment owner.
- GitHub contributors and Actions workflows can change or analyze source; protected-branch and review controls are repository-settings decisions.

## Threats and mitigations

| Threat | Mitigation in this repository | Operational follow-up |
| --- | --- | --- |
| Unauthorized or unsafe source changes | CodeQL and Scorecard workflows analyze changes with pinned action revisions. | Require pull requests, reviews, and appropriate status checks on `main`. |
| A deployment exposes a secret or unintended file | Keep secrets and deployment configuration outside the served working directory. | Review deployment packaging and hosting configuration before each release. |
| Third-party resources or links are compromised or unavailable | External resources and links are visible in source for review; links that use `target="_blank"` should retain `rel="noopener noreferrer"`. | Periodically review third-party domains and decide whether a local font strategy is needed. |
| Provider or network logging affects privacy | The public page discloses possible provider/intermediary IP logging. | Confirm the current host, CDN, retention, and privacy notice with the deployment owner. |

## Review triggers

Update this model when the site adds user input, authentication, analytics, dependency manifests, server-side behavior, deployment automation, or new external services.
