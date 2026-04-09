# HW 5 Retrospective

## 1. How did the custom skill change your workflow?

Before introducing custom skills, my workflow with Claude was largely prompt-driven and ad hoc. Each task required re-explaining constraints, expected output format, and design intent. This often led to inconsistent outputs—for example, sometimes the model would generate full implementations when I only needed an interface, or mix explanations with code in ways that were not directly usable.

The introduction of custom skills—particularly /analyze-diff and /doc-to-api—fundamentally changed this workflow by turning repeated prompting into structured, reusable commands.

The most immediate improvement was output consistency. By enforcing strict constraints (e.g., JSON-only output or code-only output with embedded docstrings), the results became directly consumable without post-processing. This eliminated a common friction point where I had to manually clean or adapt generated content before using it.

Another key improvement was separation of concerns. For example, in the /doc-to-api skill, I explicitly shifted from “generate code” to “generate API contracts.” This made the workflow more aligned with real-world engineering practices (interface-first design), and prevented the model from overreaching into implementation details. As a result, I could use the output as a stable contract layer between components.

Tasks that became significantly easier include:

Converting informal documentation into structured API definitions
Generating consistent type-safe interfaces (Python stubs / TypeScript contracts)
Performing semantic diff analysis with predictable output schema
Iterating on designs without rewriting prompts each time

Overall, custom skills transformed Claude from a general-purpose assistant into a task-specific toolchain component, closer to a programmable system than a conversational interface.

## 2. What did MCP integration enable that wasn't possible before?

Before MCP integration, Claude was limited to static reasoning and code generation. It could suggest how to test an API or interact with a system, but it could not actually execute those actions.

MCP integration—using a Playwright-based server—introduced a critical new capability: execution in an external environment.

This enabled several things that were not previously possible:

### 1. End-to-end validation

Instead of reasoning about whether an API “should work,” Claude could:

Send real HTTP requests
Inspect actual responses
Verify conditions (e.g., whether "c" appears in added)

This turns Claude from a speculative assistant into something closer to a testing agent.

### 2. Bridging design and execution

With custom skills, I defined:

API contracts (/doc-to-api)
Expected behaviors (/analyze-diff)

With MCP, I could validate those contracts against a running system.

This creates a loop:

design → generate contract → run system → verify behavior

Previously, Claude could only operate on the “design” side. MCP connects it to the “runtime” side.

### 3. Automation of real workflows

Using Playwright MCP, Claude can:

Open pages
Send requests
Validate outputs

This effectively allows it to perform automated testing workflows, which are normally outside the scope of LLMs.

Even in a minimal setup (mock Express server), this demonstrates:

real environment interaction
real data flow
real validation

### 4. Shift in role: from assistant → agent

The combination of skills + MCP changes Claude’s role:

Before: suggest what to do
After: do it and verify

This is a qualitative shift, not just a feature addition.

## 3. What would you build next?

Given more time, I would extend this system in three directions:

### 1. Skill composition and chaining

Right now, skills are used independently. A natural next step is to chain them:

/doc-to-api → generate contract
→ /analyze-diff → analyze changes between versions
→ MCP → validate behavior

This would create a multi-step automated pipeline, where each skill feeds into the next.

### 2. Hooks (event-driven automation)

I would add hooks such as:

On API change → automatically run /analyze-diff
On contract update → trigger MCP test
On test failure → generate report

This would turn the system into something closer to a lightweight CI pipeline driven by AI.

### 3. Sub-agents (specialized roles)

Instead of a single general agent, I would define specialized sub-agents:

Design agent → generates API contracts
Analysis agent → evaluates changes and risks
Execution agent (MCP) → runs tests and validations

Each would use different skills and constraints, improving reliability and separation of concerns.

### 4. Schema unification (advanced)

Currently, API contracts exist as Python types or TypeScript interfaces. A stronger design would unify them into:

JSON Schema / OpenAPI
Generated Python + TS types
Shared validation layer

This would make the system:

language-agnostic
easier to integrate
closer to production-grade tooling
Final Reflection

The most important takeaway from this project is that:

The value of LLMs increases significantly when they are constrained and connected.

Custom skills provide constraint and structure
MCP provides execution and grounding

Together, they transform the workflow from:

prompt → response

into:

defined task → structured output → real-world execution → verification

This moves the system closer to a reliable engineering tool, rather than a conversational assistant.
