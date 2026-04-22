# DocuDiif: Semantic Commit Analysis System

![thumbnail](logo.png)

## Final (3rd) Project Report

---

## 1. Introduction

This project started from a simple observation: traditional tools like `git diff` are extremely precise but not very helpful when trying to understand *what actually changed* at a higher level. For example, identifying whether a change is breaking, estimating its risk, or understanding which parts of the system might be affected still requires manual reasoning.

DocuDiif was designed to bridge this gap by combining:

* structured software engineering practices
* full-stack application architecture
* and large language model (LLM)–based semantic reasoning

The goal was not to build a demo that “uses AI”, but to construct a system where AI outputs are **structured, validated, and integrated into a reliable pipeline**.

Note: The project was initially named `DocuTrace`, and was changed to `DocuDiff` very late, so this old name might still appear in some corners of the project, like the name of this repo.

---

## 2. System Overview

At a high level, DocuDiif takes two GitHub commits and produces a structured analysis of their differences.

### Input

* Repository (`owner/repo`)
* Base commit SHA
* Target commit SHA

### Output

* Semantic summary of changes
* Breaking change detection
* Risk score
* Impact analysis (affected areas, severity)
* Structured change list

---

## 3. Architecture

The system is implemented as a full-stack application using Next.js with the App Router.

### Data Flow

```text
User Input (UI)
    ↓
API Route (/api/compare)
    ↓
GitHub Compare API
    ↓
Diff Extraction + Preprocessing
    ↓
LLM Skills
   ├─ analyze-diff
   └─ impact-analysis
    ↓
Zod Validation
    ↓
Database (PostgreSQL via Prisma)
    ↓
Frontend Rendering + History
```

---

### Tech Stack

* Frontend + Backend: Next.js
* Database: PostgreSQL (Supabase hosted)
* ORM: Prisma
* LLM API: Gemini API
* Styling: Tailwind CSS
* Deployment: Vercel

---

## 4. Core Design Philosophy

A key design decision was to treat LLM output as **untrusted structured data**, not free-form text.

This led to several constraints:

* All LLM outputs must be valid JSON
* Outputs must conform to predefined schemas
* No explanations are allowed outside the schema
* Validation is enforced at runtime

This approach ensures that the system behaves deterministically even when using probabilistic models.

---

## 5. LLM Skills

Two custom skills were implemented.

---

### 5.1 `/analyze-diff`

This skill converts raw code changes into a structured semantic representation.

#### Input

* Preprocessed file-level changes

#### Output

```json
{
  "summary": "...",
  "breaking": true,
  "risk_score": 0.78,
  "changes": [...]
}
```

#### Key Improvements (v1 → v2)

* Removed all free-form text
* Enforced strict JSON schema
* Added numeric risk scoring
* Introduced structured `changes[]` array

This iteration significantly improved downstream reliability.

---

### 5.2 `/impact-analysis`

This skill evaluates the broader implications of changes.

#### Output includes:

* impact_level (low → critical)
* affected_areas
* suggested_actions

This extends the system from describing changes to **reasoning about consequences**, which is a more realistic developer use case.

---

## 6. Diff Preprocessing

Feeding raw Git diffs directly into an LLM quickly leads to poor results due to noise and token limits.

To address this:

* Only lines starting with `+` or `-` are kept
* File count is limited
* Patch size is truncated

This preprocessing step significantly improves both performance and output quality.

---

## 7. Validation Layer (Zod)

All LLM outputs are validated using runtime schemas.

Example:

```ts
DiffSchema.parse(result)
```

If validation fails:

* The response is rejected
* The request is retried

This ensures that:

> The system never operates on malformed AI output.

---

## 8. Agent Design

A sub-agent (`diff-reviewer`) was implemented to simulate a real review workflow.

### Responsibilities

* Evaluate diff consistency
* Check alignment between breaking flag and risk
* Produce approval decisions

This creates a pipeline:

```text
analyze → impact → review
```

This approach is more scalable than single-prompt designs and aligns better with real engineering processes.

---

## 9. Hooks

Two hooks were implemented to enforce system constraints.

---

### 9.1 PreToolUse Hook

* Ensures outputs are valid JSON
* Enforces schema compliance

---

### 9.2 Stop Hook

Runs before commits or PR completion:

* ESLint
* Type checking
* Tests
* Security audit

These hooks enforce both **data correctness** and **code quality**.

---

## 10. Caching and Data Lifecycle

To reduce cost and latency, a caching layer was introduced.

### Strategy

* Cache key: `(repo, baseCommit, targetCommit)`
* TTL: 3 minutes
* Expired results ignored

### Behavior

```text
Cache hit → return immediately  
Cache miss → run analysis → store result  
```

This significantly reduces repeated LLM calls.

---

## 11. Database Design

Data is stored in PostgreSQL using Prisma.

### Key tables

* Comparison
* Change

Each record includes:

* commit pair
* summary
* risk and impact
* expiration timestamp

---

## 12. Frontend

The UI was designed to prioritize clarity over complexity.

### Features

* Input form for repo and commits
* Summary card with risk indicators
* Change list
* History page
* Detail view

Tailwind CSS is used for a lightweight but structured layout.

---

## 13. CI/CD Pipeline

A full CI/CD pipeline was implemented using GitHub Actions.

### Pipeline Steps

* Lint (ESLint + Prettier)
* Type checking (`tsc --noEmit`)
* Unit and integration tests
* E2E tests (Playwright)
* Security scan (`npm audit`)
* AI PR review
* Preview deployment (Vercel)
* Production deployment on merge

This ensures that all changes are validated before deployment.

---

## 14. Security

Security was enforced at multiple layers.

---

### 14.1 Secrets Detection

Pre-commit scanning using Gitleaks prevents accidental leakage of API keys.

---

### 14.2 Dependency Scanning

`npm audit` is run in CI to detect vulnerable packages.

---

### 14.3 Static Analysis

Security-focused ESLint rules detect unsafe patterns.

---

### 14.4 Security Sub-Agent

A dedicated agent (`security-reviewer`) analyzes code for:

* injection risks
* secret exposure
* unsafe API usage

---

### 14.5 OWASP Awareness

The system design follows OWASP Top 10 principles, including:

* input validation
* no hardcoded secrets
* controlled external API usage

---

### 14.6 Definition of Done

Security is explicitly included in completion criteria:

* no secrets detected
* no high vulnerabilities
* schema validation passes
* tests pass

---

## 15. Challenges

### 1. LLM Output Instability

Resolved using strict prompts + schema validation.

### 2. Large Diff Size

Solved via preprocessing and truncation.

### 3. Integration Complexity

Multiple layers (GitHub API, LLM, DB) required careful debugging.

### 4. Framework Changes

Next.js async `params` behavior required adaptation.

---

## 16. Lessons Learned

* LLMs should be used for reasoning, not validation
* Structured output is essential for reliability
* Preprocessing dramatically improves results
* Engineering constraints make AI systems usable
* Agent-based workflows are more scalable

---

## 17. Conclusion

DocuDiif demonstrates how LLMs can be integrated into a structured software system rather than used as standalone tools.

The project combines:

* semantic analysis
* strict validation
* full-stack architecture
* CI/CD and security practices

to create a system that transforms:

```text
raw code changes → structured insights → actionable understanding
```

