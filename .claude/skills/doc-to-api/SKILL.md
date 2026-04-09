---
name: doc-to-api
description: Convert documentation into strongly-typed Python API contracts with precise type definitions and fully embedded documentation.
---

# /doc-to-api

## Goal
Generate a Python API contract with strong typing and complete in-code documentation. All explanations must be embedded inside the code as docstrings or comments.

---

## Instructions

### Step 1: Parse Documentation

Extract:
- endpoint purpose
- inputs (fields, types, constraints)
- outputs (structure, fields)

---

### Step 2: Define Structured Types

Use appropriate constructs such as:
- TypedDict
- dataclasses
- Protocol
- generics (when useful)

Avoid untyped containers like `dict`.

---

### Step 3: Define API Contract

Define a callable interface using function signature or Protocol.

---

### Step 4: Documentation Placement (MANDATORY)

All explanations MUST be placed inside the code:

- Use docstrings (`""" ... """`) for:
  - types
  - functions
  - API contracts

- Use inline comments (`# ...`) only when necessary

- DO NOT write any explanation outside the code block

---

## Constraints

- DO NOT implement any logic
- DO NOT output any text outside the code block
- EVERY type and interface MUST include a docstring
- Types must be explicit and structured (no raw dict unless unavoidable)
- Prefer reusable and composable types

---

## Output

Return a single valid Python code block only.
No explanation outside the code.