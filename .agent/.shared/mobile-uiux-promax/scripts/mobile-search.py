#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Mobile UI/UX Pro Max - BM25 search for mobile design patterns.
Reuses the BM25 engine from the sibling ui-ux-pro-max tool.
"""

import sys
import argparse
from pathlib import Path

# Import the BM25 engine from the sibling web tool (no duplication)
_CORE_PATH = Path(__file__).resolve().parent.parent.parent / "ui-ux-pro-max" / "scripts"
sys.path.insert(0, str(_CORE_PATH))
from core import _search_csv, _load_csv

DATA_DIR = Path(__file__).resolve().parent.parent / "data"
MAX_RESULTS = 3

MOBILE_CONFIG = {
    "navigation": {
        "file": "navigation.csv",
        "search_cols": ["Pattern Name", "Keywords", "Pattern Type", "When to Use", "iOS Convention", "Android Convention"],
        "output_cols": ["Pattern Name", "Keywords", "Pattern Type", "When to Use", "When to Avoid", "iOS Convention", "Android Convention", "Cross-Platform Note", "Accessibility"]
    },
    "gestures": {
        "file": "gestures.csv",
        "search_cols": ["Gesture Name", "Keywords", "Platform", "Trigger", "Expected Response"],
        "output_cols": ["Gesture Name", "Keywords", "Platform", "Trigger", "Expected Response", "Conflicts", "iOS Hint", "Android Hint", "Accessibility Alternative"]
    },
    "components": {
        "file": "components.csv",
        "search_cols": ["Component Name", "Keywords", "Platform Variants", "Purpose"],
        "output_cols": ["Component Name", "Keywords", "Platform Variants", "Purpose", "Do", "Don't", "Haptic Feedback", "Animation Spec", "Accessibility"]
    },
    "layout": {
        "file": "layout.csv",
        "search_cols": ["Topic", "Keywords", "Platform", "Rule"],
        "output_cols": ["Topic", "Keywords", "Platform", "Rule", "Value/Spec", "Do", "Don't", "Code Example"]
    },
    "onboarding": {
        "file": "onboarding.csv",
        "search_cols": ["Pattern Name", "Keywords", "Stage", "Purpose", "When to Use"],
        "output_cols": ["Pattern Name", "Keywords", "Stage", "Purpose", "When to Use", "Conversion Impact", "iOS Convention", "Android Convention", "Anti-Pattern"]
    },
    "animation": {
        "file": "animation.csv",
        "search_cols": ["Animation Type", "Keywords", "Platform", "Do", "Don't"],
        "output_cols": ["Animation Type", "Keywords", "Platform", "Duration (ms)", "Easing", "Do", "Don't", "Performance Impact", "Reduced Motion Handling"]
    },
    "platform": {
        "file": "platform.csv",
        "search_cols": ["Topic", "Keywords", "iOS Convention", "Android Convention"],
        "output_cols": ["Topic", "Keywords", "iOS Convention", "Android Convention", "Cross-Platform Recommendation", "When to Deviate"]
    },
    "accessibility": {
        "file": "accessibility.csv",
        "search_cols": ["Category", "Issue", "Platform", "Description"],
        "output_cols": ["Category", "Issue", "Platform", "iOS Tool", "Android Tool", "Minimum Spec", "Do", "Don't", "Code Example", "WCAG Level"]
    },
    "ux-laws": {
        "file": "ux-laws.csv",
        "search_cols": ["Law", "Keywords", "Core Principle", "Mobile Application", "Design Pattern", "Do", "Don't"],
        "output_cols": ["Law", "Keywords", "Core Principle", "Mobile Application", "Design Pattern", "Do", "Don't", "Research Source"]
    },
}


MOBILE_STACK_CONFIG = {
    "react-native":    {"file": "stacks/react-native.csv"},
    "flutter":         {"file": "stacks/flutter.csv"},
    "swiftui":         {"file": "stacks/swiftui.csv"},
    "jetpack-compose": {"file": "stacks/jetpack-compose.csv"},
}

_STACK_COLS = {
    "search_cols": ["Category", "Guideline", "Description", "Do", "Don't"],
    "output_cols": ["Category", "Guideline", "Description", "Do", "Don't", "Code Good", "Code Bad", "Severity", "Docs URL"]
}

AVAILABLE_DOMAINS = list(MOBILE_CONFIG.keys())
AVAILABLE_STACKS = list(MOBILE_STACK_CONFIG.keys())


def _format_result(result, index):
    lines = [f"\n### Result {index + 1}"]
    for key, value in result.items():
        if value:
            lines.append(f"- **{key}:** {value}")
    return "\n".join(lines)


def search(query, domain, max_results=MAX_RESULTS):
    if domain not in MOBILE_CONFIG:
        print(f"Error: Unknown domain '{domain}'. Available: {', '.join(AVAILABLE_DOMAINS)}")
        sys.exit(1)

    config = MOBILE_CONFIG[domain]
    filepath = DATA_DIR / config["file"]

    if not filepath.exists():
        print(f"Error: Data file not found: {filepath}")
        sys.exit(1)

    results = _search_csv(filepath, config["search_cols"], config["output_cols"], query, max_results)

    print(f"## Mobile UI Pro Max Search Results")
    print(f"**Domain:** {domain} | **Query:** {query}")
    print(f"**Source:** {config['file']} | **Found:** {len(results)} results")

    for i, result in enumerate(results):
        print(_format_result(result, i))

    if not results:
        print("\nNo results found. Try different keywords.")


def search_stack(query, stack, max_results=MAX_RESULTS):
    if stack not in MOBILE_STACK_CONFIG:
        print(f"Error: Unknown stack '{stack}'. Available: {', '.join(AVAILABLE_STACKS)}")
        sys.exit(1)

    filepath = DATA_DIR / MOBILE_STACK_CONFIG[stack]["file"]

    if not filepath.exists():
        print(f"Error: Stack file not found: {filepath}")
        sys.exit(1)

    results = _search_csv(filepath, _STACK_COLS["search_cols"], _STACK_COLS["output_cols"], query, max_results)

    print(f"## Mobile UI Pro Max Search Results")
    print(f"**Stack:** {stack} | **Query:** {query}")
    print(f"**Found:** {len(results)} results")

    for i, result in enumerate(results):
        print(_format_result(result, i))


def main():
    parser = argparse.ArgumentParser(description="Mobile UI/UX Pro Max - Search mobile design patterns")
    parser.add_argument("query", help="Search query")
    parser.add_argument("--domain", "-d", choices=AVAILABLE_DOMAINS, help="Domain to search")
    parser.add_argument("--stack", "-s", choices=AVAILABLE_STACKS, help="Stack-specific guidelines")
    parser.add_argument("-n", "--max-results", type=int, default=MAX_RESULTS, help="Max results (default: 3)")

    args = parser.parse_args()

    if args.stack:
        search_stack(args.query, args.stack, args.max_results)
    elif args.domain:
        search(args.query, args.domain, args.max_results)
    else:
        parser.error("Provide either --domain or --stack")


if __name__ == "__main__":
    main()
