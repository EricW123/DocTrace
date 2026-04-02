---
name: analyze-diff
description: Analyze differences between two document versions and generate semantic insights with risk assessment.
---

# /analyze-diff

## Goal
Given two versions of a document or code, produce:

1. Structured diff
2. Semantic summary
3. Risk assessment

## Instructions

1. Identify input:
   - Version A (old)
   - Version B (new)

2. Generate diff:
   - Line-level differences
   - Highlight added, removed, modified sections

3. Perform semantic analysis:
   - Summarize key changes
   - Detect breaking changes
   - Identify important modifications

4. Assign risk score:
   - High if API/structure changes
   - Medium if logic changes
   - Low if formatting/text changes

5. Output JSON:
```json
{
  "summary": "...",
  "changes": [...],
  "risk": "low|medium|high"
}
```
