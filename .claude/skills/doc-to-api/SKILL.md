---
name: doc-to-api
description: Convert documentation into Python API stubs (.pyi) with function signatures and docstrings only.
---

# /doc-to-api

## Goal
Convert a documentation description into a Python stub (.pyi) file containing function signatures and docstrings only.

---

## Instructions

1. Parse the documentation:
   - Identify API endpoints
   - Extract inputs (parameters, types if possible)
   - Extract outputs

2. Generate Python function signatures:
   - Use type hints
   - Use `->` return types
   - No implementation body

3. Add docstrings:
   - Describe purpose
   - Document parameters
   - Document return value

---

## Constraints

- DO NOT implement any logic
- DO NOT include executable code
- ONLY function signatures + docstrings
- Use `pass` or `...` as body

---

## Output

Return a valid `.pyi`-style Python code block only.