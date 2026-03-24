# `.agent/.tests/` Framework Design Spec
*Date: 2026-03-24*

## Overview

A lightweight local-CI framework that lives inside `.agent/.tests/`. When the AI modifies any skill or shared tool, it automatically runs the relevant test suite and includes results in its response. All pass → silent mention. Any fail → full verbose output + stop before claiming completion.

---

## Goals

- Give the AI a self-verification loop: every change to `.agent/` is tested before being considered done
- Establish a consistent convention so any new skill/tool can have tests added alongside it
- Keep it simple: pure Python, no test framework dependencies, no external runners

---

## Non-Goals

- Not a CI/CD pipeline (no GitHub Actions, no pre-commit hooks)
- Not a type-checker or linter runner
- Not for testing product code — only for `.agent/` skills, shared tools, and scripts

---

## Directory Structure

```
.agent/
└── .tests/
    ├── run_tests.py                    ← single entry point
    ├── TESTS.md                        ← convention doc for writing new tests
    └── mobile-uiux-promax/
        └── test_search.py              ← migrated from /tmp/test_mobile_search.py
```

**Naming convention:**
- Folder name = skill/tool name (matches `.agent/skills/<name>` or `.agent/.shared/<name>`)
- Test files = `test_*.py` (auto-discovered by runner)
- A skill may have multiple test files: `test_search.py`, `test_data_integrity.py`, etc.

---

## Runner Script — `run_tests.py`

### Invocation

```bash
# Run tests for a specific skill/tool
python3 .agent/.tests/run_tests.py mobile-uiux-promax

# Run all test suites
python3 .agent/.tests/run_tests.py --all
```

### Behavior

1. Auto-discover all `test_*.py` files under `.agent/.tests/<skill-name>/`
2. Execute each file as a subprocess
3. Collect and print output verbosely (each `✅ / ❌` line)
4. Summarize at end: total / passed / failed
5. Exit code `0` = all pass, `1` = any failure

### Output Format (verbose)

```
🧪 Running tests for: mobile-uiux-promax
   → test_search.py

📍 GROUP 1: Navigation domain
  ✅ tab bar primary sections
  ✅ hamburger discoverability
  ❌ thumb zone ergonomics
     → keyword 'Thumb' not found
     → stdout[:300]: '...'

═══════════════════════════════════════════════════════
  TOTAL TESTS : 92
  PASSED      : 91  (98%)
  FAILED      : 1
  ❌ FAILED TESTS:
     - thumb zone ergonomics
═══════════════════════════════════════════════════════
❌ Tests FAILED — fix before continuing.
```

---

## Trigger Rule — When AI Auto-Runs Tests

The AI MUST run relevant tests in the following situations:

| When | Which tests to run |
|------|--------------------|
| Modifying `.agent/.shared/<tool>/` | `.agent/.tests/<tool>/` |
| Modifying `.agent/skills/<skill>/SKILL.md` | `.agent/.tests/<skill>/` (if exists) |
| Adding rows to a CSV data file | The skill that owns that data file |
| Modifying `run_tests.py` itself | `--all` |

**AI Response Behavior:**

| Result | Action |
|--------|--------|
| All pass | Paste **full verbose output** in response, continue with task |
| Any fail | Paste **full verbose output** in response, stop and fix before claiming done |


This rule is added to:
1. `brainstorming/SKILL.md` — under "After the Design" → verification step
2. `verification-before-completion/SKILL.md` — as an explicit pre-completion check

---

## Test File Convention (`TESTS.md`)

Each test file must:

1. Be a **standalone Python script** (no pytest, no unittest imports required)
2. Exit `0` when all tests pass, `1` when any fail
3. Print each test result as `✅ label` or `❌ label` with failure details
4. Be runnable from the project root: `python3 .agent/.tests/<skill>/test_<name>.py`

### Minimal Template

```python
#!/usr/bin/env python3
"""Tests for <skill-name>"""
import subprocess, sys
from pathlib import Path

# Resolve project root dynamically (2 levels up from test file: .tests/<skill>/test_*.py)
BASE = str(Path(__file__).resolve().parents[2])
passed, failed = [], []


def check(label, output, expected_kw, returncode=0):
    ok_code = output.returncode == returncode
    ok_kw = expected_kw.lower() in (output.stdout + output.stderr).lower() if expected_kw else True
    if ok_code and ok_kw:
        passed.append(label)
        print(f"  ✅ {label}")
    else:
        failed.append(label)
        print(f"  ❌ {label}")
        if not ok_kw:
            print(f"     → expected '{expected_kw}'")
        print(f"     → stdout: {(output.stdout + output.stderr)[:200]!r}")

# --- Tests go here ---
# print("\n📍 GROUP 1: <Group Name>")
# r = subprocess.run([...], capture_output=True, text=True, cwd=BASE)
# check("label", r, "expected keyword")

# --- Final report ---
total = len(passed) + len(failed)
pct = int(100 * len(passed) / total) if total else 0
print(f"\n{'═'*55}")
print(f"  TOTAL: {total}  PASSED: {len(passed)} ({pct}%)  FAILED: {len(failed)}")
if failed:
    for f in failed: print(f"     - {f}")
print(f"{'═'*55}")
sys.exit(0 if not failed else 1)
```

### Data Integrity Pattern

For CSV-based tools, include a data integrity group:

```python
import csv
from pathlib import Path

print("\n📍 DATA INTEGRITY")
for fname, min_rows in {"navigation.csv": 20, "gestures.csv": 20}.items():
    rows = list(csv.reader(open(Path(DATA_DIR) / fname)))
    ok = len(rows) - 1 >= min_rows
    (passed if ok else failed).append(f"row count: {fname}")
    print(f"  {'✅' if ok else '❌'} {fname}: {len(rows)-1} rows (min {min_rows})")
```

---

## Skill Mapping Reference

| Folder in `.agent/.tests/` | Triggered by changes to |
|----------------------------|------------------------|
| `mobile-uiux-promax/` | `.agent/.shared/mobile-uiux-promax/` · `.agent/skills/mobile-uiux-promax/` |
| `ui-ux-pro-max/` *(future)* | `.agent/.shared/ui-ux-pro-max/` |
| `brainstorming/` *(future)* | `.agent/skills/brainstorming/` |

---

## Implementation Plan (high level)

1. Create `.agent/.tests/run_tests.py` — runner script (~60 lines)
2. Create `.agent/.tests/TESTS.md` — convention doc
3. Create `.agent/.tests/mobile-uiux-promax/test_search.py` — migrate from `/tmp/test_mobile_search.py`
4. Update `brainstorming/SKILL.md` — add trigger rule
5. Update `verification-before-completion/SKILL.md` — add pre-completion check  
   *(this skill already exists at `.agent/skills/verification-before-completion/SKILL.md`; if absent, skip and add only to `brainstorming/SKILL.md`)*


---

## Success Criteria

- `python3 .agent/.tests/run_tests.py mobile-uiux-promax` runs and exits 0
- `python3 .agent/.tests/run_tests.py --all` discovers and runs all test suites
- AI correctly auto-runs tests after any `.agent/.shared/mobile-uiux-promax/` modification
- New skill can have tests added by creating a folder + `test_*.py` with no other setup
