---
name: analyze-diff
description: Generate strictly structured semantic diff analysis for DocuTrace with deterministic output and machine-readable schema.
---

# /analyze-diff

## Goal
Produce a fully structured, machine-consumable diff analysis that can be directly used by backend and frontend systems.

---

## Instructions

### Step 1: Identify Changes
Compare Version A and Version B and extract ALL changes.

Each change MUST include:
- type: "addition" | "deletion" | "modification"
- location: string (API, function, section, etc.)
- description: precise explanation
- breaking: true | false

---

### Step 2: Breaking Change Rules

Mark `breaking: true` if ANY of:
- API signature changes (parameters, return type)
- Required fields added/removed
- Behavior changes affecting existing usage

Otherwise:
- breaking: false

---

### Step 3: Risk Scoring

Compute numeric score:

- Start at 0
- +0.6 if any breaking change
- +0.2 if multiple changes (>2)
- +0.1 if structural change (API/function)

Clamp to [0,1]

Map:
- 0–0.3 → low
- 0.3–0.7 → medium
- 0.7–1 → high

---

### Step 4: STRICT Output Format (MANDATORY)

Return ONLY valid JSON. No extra text.

```json
{
  "summary": "string (<=120 words)",
  "changes": [
    {
      "type": "addition|deletion|modification",
      "location": "string",
      "description": "string",
      "breaking": true
    }
  ],
  "metrics": {
    "total_changes": 0,
    "breaking_changes": 0
  },
  "risk_score": 0.0,
  "risk_level": "low|medium|high"
}
```