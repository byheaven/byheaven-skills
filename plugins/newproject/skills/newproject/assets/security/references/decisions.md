# Design Decisions & Alternatives

---

## Why CodeQL over Semgrep, SonarQube, or Snyk?

**CodeQL** is GitHub's native static analysis tool, available for free on all
public repositories and included in GitHub Advanced Security for private repos.
It integrates directly with the Security tab, has no external service dependency,
and is maintained by GitHub/Microsoft with rules for common CWEs.

**Semgrep** is excellent and has a generous free tier, but requires a separate
account and service dependency. Better for custom rule authoring.

**SonarQube / SonarCloud** is comprehensive but adds significant setup complexity
and has more aggressive gating that can frustrate teams new to security scanning.

**Snyk** focuses on dependency vulnerabilities (covered by dependency-review in
this setup) rather than code-level issues.

**Choose CodeQL if:** you want the simplest security scanning setup with
zero external dependencies. It's the right default for most projects.

---

## Why run CodeQL on a weekly schedule?

A new CVE may be disclosed for a library that was safe when it was committed.
A weekly run ensures the codebase is scanned against the latest vulnerability
database even when there are no code changes.

The `cron: '30 1 * * 1'` schedule runs at 01:30 UTC Monday, offset from the
top of the hour to reduce GitHub infrastructure load.

---

## Why `fail-on-severity: high` in dependency-review?

Critical and high severity CVEs represent genuine risks (RCE, data exposure,
authentication bypass). Blocking PRs on these is the right default.

Medium and low severity findings are informational but common enough that
blocking on them creates alert fatigue. Start with `high`, then adjust as
the team becomes familiar with the tool's output.

---

## Why separate dependency-review from CodeQL?

They solve different problems:

- **CodeQL**: finds vulnerabilities in *your code* (logic bugs, injection, etc.)
- **dependency-review**: finds vulnerabilities in *your dependencies* (CVEs)

They run at different times:

- **CodeQL**: on push to main and weekly
- **dependency-review**: on PRs only (catches new dependencies before they merge)

Combining them would require one to run on a schedule that doesn't make sense
for the other.

---

## Why not include Trivy or similar container scanning?

Container scanning is only relevant for projects that build Docker images.
Adding it to a base template would add noise for the majority of projects.

For projects that do use Docker, add Trivy as a separate step in the CI workflow
or as a standalone workflow:

```yaml
- name: Scan container image
  uses: aquasecurity/trivy-action@master
  with:
    image-ref: 'my-image:latest'
    severity: 'CRITICAL,HIGH'
```

---

## Why guide manual setup for secret scanning instead of automating it?

Secret scanning and push protection are repository settings, not workflow files.
They can only be enabled via the GitHub UI or the REST API with admin credentials.
Automating this would require the user to provide a personal access token with
admin scope — a poor security/UX trade-off for a one-time setup step.

The manual path is: Settings → Security & analysis → Enable → done.
