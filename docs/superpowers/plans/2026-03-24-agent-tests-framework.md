# `.agent/.tests/` Framework Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a local-CI test framework at `.agent/.tests/` with a runner script, convention doc, and the first test suite (mobile-uiux-promax) — so the AI auto-runs relevant tests after modifying any `.agent/` skill or tool.

**Architecture:** A `run_tests.py` runner auto-discovers `test_*.py` files in a named skill folder and executes them, printing verbose pass/fail output. Trigger rules are embedded in `brainstorming/SKILL.md` and `verification-before-completion/SKILL.md`. The first test suite migrates from `/tmp/test_mobile_search.py`.

**Tech Stack:** Python 3 stdlib only (`subprocess`, `csv`, `pathlib`). No external dependencies.

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `.agent/.tests/run_tests.py` | Runner: auto-discover + execute test files, aggregate output |
| Create | `.agent/.tests/TESTS.md` | Convention doc: how to write tests for new skills |
| Create | `.agent/.tests/mobile-uiux-promax/test_search.py` | Full test suite for mobile-search.py (migrated + improved) |
| Modify | `.agent/skills/brainstorming/SKILL.md` | Add auto-run trigger rule after skill/tool modification |
| Modify | `.agent/skills/verification-before-completion/SKILL.md` | Add pre-completion check: run relevant `.agent/.tests/` |

---

## Task 1: Create `run_tests.py` runner

**Files:**
- Create: `.agent/.tests/run_tests.py`

- [ ] **Step 1: Create the runner script**

```python
#!/usr/bin/env python3
"""
.agent/.tests/run_tests.py
Auto-discover and run all test_*.py files for a given skill.

Usage:
  python3 .agent/.tests/run_tests.py mobile-uiux-promax
  python3 .agent/.tests/run_tests.py --all
"""
import sys
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent  # .agent/.tests/


def run_suite(skill_name: str) -> tuple[int, int]:
    """Run all test_*.py in .agent/.tests/<skill_name>/. Returns (passed_files, failed_files)."""
    suite_dir = ROOT / skill_name
    if not suite_dir.exists():
        print(f"  ⚠️  No test suite found for '{skill_name}' at {suite_dir}")
        return 0, 0

    test_files = sorted(suite_dir.glob("test_*.py"))
    if not test_files:
        print(f"  ⚠️  No test_*.py files found in {suite_dir}")
        return 0, 0

    passed_files = 0
    failed_files = 0

    for tf in test_files:
        print(f"   → {tf.name}")
        result = subprocess.run(
            ["python3", str(tf)],
            capture_output=False,   # let output stream directly (verbose)
            cwd=str(ROOT.parent.parent),  # project root
        )
        if result.returncode == 0:
            passed_files += 1
        else:
            failed_files += 1

    return passed_files, failed_files


def main():
    args = sys.argv[1:]

    if not args:
        print("Usage: python3 run_tests.py <skill-name>  OR  --all")
        sys.exit(1)

    if args[0] == "--all":
        skills = [d.name for d in ROOT.iterdir() if d.is_dir() and not d.name.startswith(".")]
        if not skills:
            print("No test suites found.")
            sys.exit(0)
    else:
        skills = [args[0]]

    total_passed = total_failed = 0

    for skill in skills:
        print(f"\n🧪 Running tests for: {skill}")
        p, f = run_suite(skill)
        total_passed += p
        total_failed += f

    total = total_passed + total_failed
    if total == 0:
        print("\nNo test files executed.")
        sys.exit(0)

    print(f"\n{'═' * 55}")
    if total_failed == 0:
        print(f"  ✅ ALL SUITES PASSED ({total_passed}/{total} files)")
    else:
        print(f"  ❌ {total_failed} SUITE(S) FAILED ({total_passed}/{total} files passed)")
    print(f"{'═' * 55}")

    sys.exit(0 if total_failed == 0 else 1)


if __name__ == "__main__":
    main()
```

- [ ] **Step 2: Verify runner works (no test suites yet)**

```bash
python3 .agent/.tests/run_tests.py nonexistent-skill
```
Expected output: `⚠️  No test suite found for 'nonexistent-skill'`

```bash
python3 .agent/.tests/run_tests.py --all
```
Expected output: `No test suites found.` and exit 0

---

## Task 2: Create `TESTS.md` convention doc

**Files:**
- Create: `.agent/.tests/TESTS.md`

- [ ] **Step 1: Create the convention doc**

```markdown
# `.agent/.tests/` — Test Convention

## Purpose
Lightweight local-CI for AI-modified tools. When the AI modifies any `.agent/skills/<skill>/`
or `.agent/.shared/<tool>/`, it runs the relevant test suite before claiming work is done.

## Directory Layout
```
.agent/.tests/
├── run_tests.py                     ← entry point
├── TESTS.md                         ← this file
└── <skill-name>/
    ├── test_search.py               ← one file per concern
    └── test_data_integrity.py
```

## Trigger Rules (when AI auto-runs)
| Change made to | Tests to run |
|----------------|-------------|
| `.agent/.shared/<tool>/` | `.agent/.tests/<tool>/` |
| `.agent/skills/<skill>/SKILL.md` | `.agent/.tests/<skill>/` (if exists) |
| Any CSV in a data folder | The skill that owns that folder |
| `.agent/.tests/run_tests.py` | `--all` |

## Running
```bash
python3 .agent/.tests/run_tests.py <skill-name>
python3 .agent/.tests/run_tests.py --all
```

## Writing a New Test File

### Required contract
- Filename: `test_*.py`
- Standalone Python 3 script (stdlib only — no pytest/unittest required)
- Exit 0 = all pass, exit 1 = any fail
- Print `✅ label` or `❌ label` for each test case

### Minimal template
```python
#!/usr/bin/env python3
"""Tests for <skill-name>"""
import subprocess, sys
from pathlib import Path

# Project root: 3 levels up (.agent/.tests/<skill>/test_*.py)
BASE = str(Path(__file__).resolve().parents[3])
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
            print(f"     → expected keyword: '{expected_kw}'")
        print(f"     → stdout[:300]: {(output.stdout + output.stderr)[:300]!r}")


# ─── GROUPS ───────────────────────────────────────────────
print("\n📍 GROUP 1: <Group Name>")
# r = subprocess.run(["python3", "path/to/script.py", "query", "--flag", "value"],
#                    capture_output=True, text=True, cwd=BASE)
# check("test label", r, "expected keyword in output")

# ─── FINAL REPORT ─────────────────────────────────────────
total = len(passed) + len(failed)
pct = int(100 * len(passed) / total) if total else 0
print(f"\n{'═' * 55}")
print(f"  TOTAL: {total}  PASSED: {len(passed)} ({pct}%)  FAILED: {len(failed)}")
if failed:
    print(f"\n  ❌ FAILED TESTS:")
    for f in failed:
        print(f"     - {f}")
print(f"{'═' * 55}")
sys.exit(0 if not failed else 1)
```

### Data integrity pattern
```python
import csv
from pathlib import Path

DATA_DIR = Path(__file__).resolve().parents[3] / ".agent/.shared/<tool>/data"

print("\n📍 DATA INTEGRITY")
for fname, min_rows in {
    "navigation.csv": 20,
    "gestures.csv": 20,
}.items():
    fpath = DATA_DIR / fname
    if not fpath.exists():
        failed.append(f"file exists: {fname}")
        print(f"  ❌ MISSING: {fname}")
        continue
    with open(fpath) as f:
        rows = list(csv.reader(f))
    data_rows = len(rows) - 1
    ok = data_rows >= min_rows
    (passed if ok else failed).append(f"row count: {fname}")
    print(f"  {'✅' if ok else '❌'} {fname}: {data_rows} rows (min {min_rows})")
```

## Skill Mapping Reference
| Test folder | Triggered by |
|-------------|-------------|
| `mobile-uiux-promax/` | `.agent/.shared/mobile-uiux-promax/` · `.agent/skills/mobile-uiux-promax/` |
| *(add new rows here as new skills gain test suites)* | |
```

- [ ] **Step 2: Verify TESTS.md exists and is readable**

```bash
head -5 .agent/.tests/TESTS.md
```
Expected: first 5 lines of the convention doc

---

## Task 3: Create `mobile-uiux-promax/test_search.py`

**Files:**
- Create: `.agent/.tests/mobile-uiux-promax/test_search.py`

> Migrate and improve from `/tmp/test_mobile_search.py`.  
> Key improvement: use dynamic `BASE` path (`Path(__file__).resolve().parents[3]`) instead of hardcoded path.

- [ ] **Step 1: Create the test file**

Copy the full content of `/tmp/test_mobile_search.py` into `.agent/.tests/mobile-uiux-promax/test_search.py`.  
Then apply these two changes:

1. Replace the hardcoded `BASE` line:
```python
# OLD (remove this):
BASE = "/Users/thoaint/Documents/workspace/indie-hacker/antigravity-superpowers"

# NEW (use this):
BASE = str(Path(__file__).resolve().parents[3])
```

2. Add `from pathlib import Path` import if not already present.

- [ ] **Step 2: Run the test suite directly to verify 92/92 pass**

```bash
python3 .agent/.tests/mobile-uiux-promax/test_search.py
```
Expected: all 92 tests pass, exit code 0

```
═══════════════════════════════════════════════════════
  TOTAL TESTS : 92
  PASSED      : 92  (100%)
  FAILED      : 0
═══════════════════════════════════════════════════════
```

- [ ] **Step 3: Run via runner to verify discovery works**

```bash
python3 .agent/.tests/run_tests.py mobile-uiux-promax
```
Expected: discovers `test_search.py`, runs it, shows verbose output, exits 0

---

## Task 4: Update `brainstorming/SKILL.md` — add trigger rule

**Files:**
- Modify: `.agent/skills/brainstorming/SKILL.md`

- [ ] **Step 1: Add trigger rule to the "After the Design" section**

Find the section `## After the Design` and add this block after the Documentation subsection (after the auto_commit block, before the Spec Review Loop section):

```markdown
**Test verification (if `.agent/.tests/<skill>/` exists):**

After modifying any `.agent/skills/<skill>/` or `.agent/.shared/<tool>/`, check if a test suite exists:

```bash
python3 .agent/.tests/run_tests.py <skill-name>
```

- All pass → include full verbose output in response, continue
- Any fail → include full verbose output in response, stop and fix before proceeding
```

- [ ] **Step 2: Verify the rule is present**

```bash
grep -n "run_tests.py" .agent/skills/brainstorming/SKILL.md
```
Expected: at least 1 matching line

---

## Task 5: Update `verification-before-completion/SKILL.md` — add pre-completion check

**Files:**
- Modify: `.agent/skills/verification-before-completion/SKILL.md`

- [ ] **Step 1: Read the current file to find the right insertion point**

```bash
cat .agent/skills/verification-before-completion/SKILL.md
```

- [ ] **Step 2: Add `.agent/.tests/` check as a verification step**

Find the checklist/verification steps section and add:

```markdown
### `.agent/.tests/` check (if applicable)
If the work involved modifying any `.agent/skills/<skill>/` or `.agent/.shared/<tool>/`, run:
```bash
python3 .agent/.tests/run_tests.py <skill-name>
```
All tests must pass before claiming completion. Paste full verbose output in response.
```

- [ ] **Step 3: Verify the rule is present**

```bash
grep -n "run_tests.py" .agent/skills/verification-before-completion/SKILL.md
```
Expected: at least 1 matching line

---

## Task 6: End-to-End verification

- [ ] **Step 1: Run full test suite via runner**

```bash
python3 .agent/.tests/run_tests.py mobile-uiux-promax
```
Expected: all 92 tests pass, runner exits 0

- [ ] **Step 2: Run `--all` flag**

```bash
python3 .agent/.tests/run_tests.py --all
```
Expected: discovers `mobile-uiux-promax/`, runs `test_search.py`, all pass

- [ ] **Step 3: Verify file structure is complete**

```bash
find .agent/.tests -type f | sort
```
Expected output:
```
.agent/.tests/TESTS.md
.agent/.tests/mobile-uiux-promax/test_search.py
.agent/.tests/run_tests.py
```

- [ ] **Step 4: Verify brainstorming trigger rule**

```bash
grep -n "run_tests.py" .agent/skills/brainstorming/SKILL.md
grep -n "run_tests.py" .agent/skills/verification-before-completion/SKILL.md
```
Expected: each grep returns ≥ 1 line

- [ ] **Step 5: Skip commit (auto_commit: false)**

Print: `"Skipping commit (auto_commit: false in .agent/config.yml). Files are ready for manual commit."`
