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
