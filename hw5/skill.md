# Creating and improving skill

Due to file length limit, not all testing logs are included here. Testing cases are selected randomly from my previous personal project or the skill file itself.

## 1. Analyze Diff Skill

### Version 1: Initial Implementation

#### Behavior

Mostly workable, can give a JSON formatted output with one or a few lines of extra explaining.

e.g.

```json
{
    "summary": "The POST /login endpoint now requires an additional 'token' parameter. This is a breaking change for any existing clients
  that do not send a token.",
    "changes": [
      {
        "type": "modified",
        "location": "POST /login — request parameters",
        "old": "POST /login (username, password)",
        "new": "POST /login (username, password, token)",
        "description": "Added 'token' parameter to the login request signature"
      }
    ],
    "risk": "high"
  }

  Risk: High

  - Breaking change — existing clients calling POST /login with only username and password will fail if token is required.
  - Likely introduces a second authentication factor (MFA/2FA) or CSRF protection, which changes the auth flow contract.
  - All API consumers, SDKs, and integration tests must be updated.

  Recommendations:
  - Clarify whether token is required or optional — making it optional is a non-breaking path.
  - Version the endpoint (e.g., POST /v2/login) if backwards compatibility must be preserved.
  - Update API documentation and notify downstream consumers before deploying.
```

#### Issue

However, the explaining line is not required or asked to be generated, and although it's verbose, it's not structured and inconsistent. The ideally output of this skill should be a plain JSON without any extra text, so can be passed to some JSON parser or other skills for further processing.

And also, the risk level is only categorized into three levels (low, medium, high), which is hard to quantify and scale. A more granular numeric risk score (e.g., 0 to 1) would be better by allowing adding up multiple risky changes and give an overall risk score.

### Version 2: Improved Output Format and Risk Scoring

#### Behavior

The first testing example is the skill file itself. The output looks better and solves the issues mentioned above: (only part of output is shown here)

```json
{
    "summary": "The analyze-diff SKILL.md was significantly restructured from a loose instructional format to a strictly defined,
  machine-readable schema. The description was updated to reference DocuTrace and deterministic output. Instruction steps were rewritten
  with explicit field requirements, breaking change rules, a numeric risk scoring algorithm, and a mandatory JSON output schema. The old
  output schema was replaced with a richer structure including metrics, risk_score, and risk_level fields.",
    "changes": [
      ...,
      {
        "type": "modification",
        "location": "SKILL.md — Output JSON schema",
        "description": "Output schema expanded from 3 fields (summary, changes, risk) to 5 fields (summary, changes array with typed
  objects, metrics object with total_changes and breaking_changes, risk_score float, risk_level). Old 'risk' string field removed.",
        "breaking": true
      }
    ],
    "metrics": {
      "total_changes": 6,
      "breaking_changes": 3
    },
    "risk_score": 0.9,
    "risk_level": "high"
  }
```

#### Analysis

As it shows, the risk score is given as 0.9, since 3 out of 6 changes (only 1 shown above) are marked as breaking, hence considered as highly risky. And this makes sense since changing skill instructions and output format is truly a breaking change.

## 2. Documentation API-lization Skill

I also create another skill that will be used in the future. It's designed to take natural language documentation and convert it into a structured API, should contain empty function body but with function signatures and docstrings.

### Version 1: Initial Implementation

#### Behavior

Pretty good, has basic type hints and docstrings.

```python
# POST /api/compare
# Takes two versions of text (v1, v2)
# Returns added lines, removed lines, and summary

# AI response:

def compare(v1: str, v2: str) -> dict:
    """
    Compare two versions of text and return a diff summary.

    Parameters:
        v1 (str): The original version of the text.
        v2 (str): The updated version of the text.

    Returns:
        dict: A dictionary containing:
            - added_lines (list[str]): Lines present in v2 but not in v1.
            - removed_lines (list[str]): Lines present in v1 but not in v2.
            - summary (str): A human-readable summary of the differences.
    """
    ...
```

#### Issue

However, the type hinting is too basic, it's just "usable" not "good". There are lots of new Python features that can be used to make the API more robust and self-documenting, especially from latest versions of Python such as Py3.13.

### Version 2

Much better. It's utilizing new features like `Protocol` class from `typing` lib or `dataclass` feature to improve the generated function signature.

```python
from typing import Protocol
from dataclasses import dataclass


@dataclass
class CompareRequest:
    """
    Request body for POST /api/compare.

    Fields:
        v1: The original version of the text to compare from.
        v2: The updated version of the text to compare against.
    """
    v1: str
    v2: str


@dataclass
class CompareResponse:
    """
    Response body returned by POST /api/compare.

    Fields:
        added_lines:   Lines present in v2 but not in v1.
        removed_lines: Lines present in v1 but not in v2.
        summary:       Human-readable description of the overall diff.
    """
    added_lines: list[str]
    removed_lines: list[str]
    summary: str


class CompareAPI(Protocol):
    """
    Contract for POST /api/compare.

    Accepts two versions of a text body and returns a structured diff
    describing which lines were added, which were removed, and a
    plain-language summary of the changes.
    """

    def compare(self, request: CompareRequest) -> CompareResponse:
        """
        Submit two text versions for comparison.

        Args:
            request: A CompareRequest containing the original (v1)
                    and updated (v2) text bodies.

        Returns:
            A CompareResponse with added_lines, removed_lines, and
            a summary of the differences between v1 and v2.
        """
        ...
```

There are still space to improve, such as it's generating a class but didn't give a corresponding stub constructor method, and the class docstring doesn't contain with constructor usage instruction. But I think it's good enough for use.
