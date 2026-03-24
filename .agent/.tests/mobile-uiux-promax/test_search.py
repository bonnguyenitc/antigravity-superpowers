#!/usr/bin/env python3
"""
Comprehensive test suite for mobile-search.py
Tests all 9 domains, 4 stacks, edge cases, and data integrity.
"""
import subprocess
import sys
import csv
from pathlib import Path

# Project root: 3 levels up (.agent/.tests/<skill>/test_*.py → project root)
BASE = str(Path(__file__).resolve().parents[3])
SCRIPT = f"{BASE}/.agent/.shared/mobile-uiux-promax/scripts/mobile-search.py"
DATA_DIR = f"{BASE}/.agent/.shared/mobile-uiux-promax/data"

passed = []
failed = []


def run(query, flag, target, n=3):
    return subprocess.run(
        ["python3", SCRIPT, query, flag, target, "-n", str(n)],
        capture_output=True, text=True, cwd=BASE
    )


def check(label, output, expected_kw, returncode=0):
    ok_code = (output.returncode == returncode)
    all_output = output.stdout + output.stderr
    ok_kw = expected_kw.lower() in all_output.lower() if expected_kw else True
    ok = ok_code and ok_kw
    if ok:
        passed.append(label)
        print(f"  ✅ {label}")
    else:
        failed.append(label)
        reasons = []
        if not ok_code:
            reasons.append(f"returncode={output.returncode} (expected {returncode})")
        if not ok_kw:
            reasons.append(f"keyword '{expected_kw}' not found")
        print(f"  ❌ {label}")
        for r in reasons:
            print(f"     → {r}")
        print(f"     → stdout[:300]: {output.stdout[:300]!r}")


# ═══════════════════════════════════════════════════════════
# GROUP 1: Navigation domain
# ═══════════════════════════════════════════════════════════
print("\n📍 GROUP 1: Navigation domain")
check("tab bar primary sections",    run("bottom tab bar primary sections", "--domain", "navigation"), "Tab Bar")
check("hamburger discoverability",   run("hamburger hidden navigation discoverability", "--domain", "navigation"), "discoverability")
check("thumb zone ergonomics",       run("thumb zone one handed ergonomics bottom", "--domain", "navigation"), "Thumb")
check("drawer sidebar menu",         run("drawer sidebar menu hamburger secondary", "--domain", "navigation"), "Drawer")
check("modal full screen overlay",   run("modal full screen immersive camera auth", "--domain", "navigation"), "Modal")
check("bottom sheet partial",        run("bottom sheet action partial overlay", "--domain", "navigation"), "Bottom Sheet")
check("deep link universal",         run("deep link universal link routing url", "--domain", "navigation"), "Deep Link")
check("back navigation ios swipe",   run("back navigation ios swipe gesture return", "--domain", "navigation"), "Back")

# ═══════════════════════════════════════════════════════════
# GROUP 2: Gestures domain
# ═══════════════════════════════════════════════════════════
print("\n📍 GROUP 2: Gestures domain")
check("swipe back ios edge",         run("swipe back dismiss ios edge left", "--domain", "gestures"), "Swipe")
check("pinch zoom two finger",       run("pinch zoom scale two finger gesture", "--domain", "gestures"), "Pinch")
check("long press context menu",     run("long press hold context menu action", "--domain", "gestures"), "Long")
check("pull to refresh scroll",      run("pull to refresh scroll top reload", "--domain", "gestures"), "Pull")
check("double tap zoom toggle",      run("double tap zoom toggle like", "--domain", "gestures"), "Double")

# ═══════════════════════════════════════════════════════════
# GROUP 3: Components domain
# ═══════════════════════════════════════════════════════════
print("\n📍 GROUP 3: Components domain")
check("bottom sheet component",      run("bottom sheet modal partial screen", "--domain", "components"), "Bottom Sheet")
check("FAB floating action button",  run("floating action button primary create", "--domain", "components"), "FAB")
check("skeleton loading shimmer",    run("skeleton loading placeholder shimmer", "--domain", "components"), "Skeleton")
check("snackbar toast feedback",     run("snackbar toast feedback notification", "--domain", "components"), "Snackbar")
check("chip filter tag",             run("chip filter tag selection category", "--domain", "components"), "Chip")

# ═══════════════════════════════════════════════════════════
# GROUP 4: Layout domain
# ═══════════════════════════════════════════════════════════
print("\n📍 GROUP 4: Layout domain")
check("safe area notch inset",       run("safe area notch inset dynamic island", "--domain", "layout"), "Safe Area")
check("touch target 44pt 48dp",     run("touch target minimum size 44pt 48dp", "--domain", "layout"), "44")
check("thumb zone bottom reach",     run("thumb zone reachability bottom reach", "--domain", "layout"), "Thumb")
check("keyboard avoidance input",    run("keyboard avoidance input scroll TextField", "--domain", "layout"), "Keyboard")
check("spacing design system 8pt",  run("spacing 8pt grid system padding margin", "--domain", "layout"), "8")

# ═══════════════════════════════════════════════════════════
# GROUP 5: Platform domain
# ═══════════════════════════════════════════════════════════
print("\n📍 GROUP 5: Platform domain")
check("dark mode system appearance", run("dark mode night system appearance adaptive", "--domain", "platform"), "Dark Mode")
check("haptic feedback vibration",   run("haptic feedback vibration taptic engine", "--domain", "platform"), "Haptic")
check("typography font system",      run("typography font ios android system native", "--domain", "platform"), "Typography")
check("navigation ios android diff", run("navigation back button ios android differ", "--domain", "platform"), "Navigation")
check("status bar appearance",       run("status bar color tint appearance", "--domain", "platform"), "Status Bar")

# ═══════════════════════════════════════════════════════════
# GROUP 6: Onboarding domain
# ═══════════════════════════════════════════════════════════
print("\n📍 GROUP 6: Onboarding domain")
check("permission priming camera",   run("permission priming rationale camera notification", "--domain", "onboarding"), "Permission")
check("paywall timing subscription", run("paywall timing subscription trial premium", "--domain", "onboarding"), "Paywall")
check("sign in apple social",        run("sign in with apple social login auth", "--domain", "onboarding"), "Sign in with Apple")
check("value proposition screen",    run("value proposition benefit feature showcase", "--domain", "onboarding"), "Value")
check("progress step indicator",     run("onboarding step indicator progress multi", "--domain", "onboarding"), "Step")

# ═══════════════════════════════════════════════════════════
# GROUP 7: Animation domain
# ═══════════════════════════════════════════════════════════
print("\n📍 GROUP 7: Animation domain")
check("spring animation modal",      run("spring animation modal sheet natural", "--domain", "animation"), "Spring")
check("skeleton shimmer loading",    run("skeleton shimmer loading placeholder animation", "--domain", "animation"), "Shimmer")
check("reduce motion accessibility", run("reduce motion accessibility preference disable", "--domain", "animation"), "Reduce")
check("page transition navigation",  run("page transition navigation push slide", "--domain", "animation"), "Transition")
check("haptic sync animation",       run("haptic feedback sync animation success", "--domain", "animation"), "Haptic")

# ═══════════════════════════════════════════════════════════
# GROUP 8: Accessibility domain
# ═══════════════════════════════════════════════════════════
print("\n📍 GROUP 8: Accessibility domain")
check("touch target 44pt minimum",   run("touch target size minimum 44pt", "--domain", "accessibility"), "Touch Target")
check("screen reader label name",    run("screen reader voiceover label accessible name", "--domain", "accessibility"), "Screen Reader")
check("view-tap asymmetry small",    run("view tap asymmetry visible untappable small dot", "--domain", "accessibility"), "Asymmetry")
check("color contrast ratio 4.5:1",  run("color contrast ratio 4.5 text background", "--domain", "accessibility"), "Contrast")
check("dynamic type font scaling",   run("dynamic type font scaling text size large", "--domain", "accessibility"), "Dynamic Type")
check("NNGroup 1cm physical touch",  run("NNGroup physical 1cm touch target research", "--domain", "accessibility"), "NNGroup")
check("coach mark single tip",       run("coach mark single tip one at a time overlay", "--domain", "accessibility"), "Coach Mark")

# ═══════════════════════════════════════════════════════════
# GROUP 9: UX Laws domain
# ═══════════════════════════════════════════════════════════
print("\n📍 GROUP 9: UX Laws domain")
check("Fitts touch target size",     run("touch target size placement distance primary", "--domain", "ux-laws"), "Fitts")
check("Hick choices decision time",  run("choices menu options decision time complexity", "--domain", "ux-laws"), "Hick")
check("Jakob mental model familiar", run("mental model convention familiar platform", "--domain", "ux-laws"), "Jakob")
check("Goal-Gradient progress bar",  run("progress steps completion motivation reward", "--domain", "ux-laws"), "Goal-Gradient")
check("Peak-End memorable delight",  run("memorable experience delight success moment", "--domain", "ux-laws"), "Peak")
check("Doherty 400ms threshold",     run("400ms response time loading feedback threshold", "--domain", "ux-laws"), "Doherty")
check("Miller 7 items memory",       run("7 chunks working memory cognitive load limit", "--domain", "ux-laws"), "Miller")
check("Zeigarnik streak incomplete", run("streak incomplete task engagement retention", "--domain", "ux-laws"), "Zeigarnik")
check("Von Restorff standout color", run("standout highlight color accent primary call", "--domain", "ux-laws"), "Von Restorff")
check("Serial Position first last",  run("first last item serial position memory recall", "--domain", "ux-laws"), "Serial Position")
check("Proximity grouping related",  run("proximity grouping related elements spacing", "--domain", "ux-laws"), "Proximity")
check("Common Region card container",run("card container region visual grouping border", "--domain", "ux-laws"), "Common Region")
check("Paradox coach mark tutorial", run("tutorial coach mark skip learn by doing", "--domain", "ux-laws"), "Paradox")

# ═══════════════════════════════════════════════════════════
# GROUP 10: Stack — React Native
# ═══════════════════════════════════════════════════════════
print("\n📍 GROUP 10: Stack — React Native")
check("FlatList performance",        run("FlatList list performance rendering key", "--stack", "react-native"), "FlatList")
check("Reanimated animations",       run("Reanimated animation gesture performant", "--stack", "react-native"), "Reanimated")
check("accessibilityLabel VoiceOver",run("accessibilityLabel accessible name VoiceOver", "--stack", "react-native"), "accessibilityLabel")
check("Metro bundler fast refresh",  run("Metro bundler fast refresh hot reload", "--stack", "react-native"), "Metro")

# ═══════════════════════════════════════════════════════════
# GROUP 11: Stack — Flutter
# ═══════════════════════════════════════════════════════════
print("\n📍 GROUP 11: Stack — Flutter")
check("GoRouter navigation",         run("GoRouter routing navigation deep link", "--stack", "flutter"), "GoRouter")
check("ListView.builder lazy",       run("ListView builder lazy performance list", "--stack", "flutter"), "ListView")
check("Riverpod state management",   run("Riverpod state management provider", "--stack", "flutter"), "Riverpod")
check("MediaQuery safe area",        run("MediaQuery safe area padding inset", "--stack", "flutter"), "MediaQuery")

# ═══════════════════════════════════════════════════════════
# GROUP 12: Stack — SwiftUI
# ═══════════════════════════════════════════════════════════
print("\n📍 GROUP 12: Stack — SwiftUI")
check("NavigationStack push view",   run("NavigationStack navigation push screen iOS", "--stack", "swiftui"), "NavigationStack")
check("@StateObject ViewModel",      run("StateObject ViewModel lifecycle init", "--stack", "swiftui"), "StateObject")
check("reduce motion isReduceMotion",run("reduce motion isReduceMotionEnabled animation", "--stack", "swiftui"), "reduceMotion")
check("task modifier async load",    run("task async await data loading onAppear", "--stack", "swiftui"), "task")

# ═══════════════════════════════════════════════════════════
# GROUP 13: Stack — Jetpack Compose
# ═══════════════════════════════════════════════════════════
print("\n📍 GROUP 13: Stack — Jetpack Compose")
check("LazyColumn list performance", run("LazyColumn list performance lazy scroll", "--stack", "jetpack-compose"), "LazyColumn")
check("sealed UiState data class",   run("sealed class UiState loading error success", "--stack", "jetpack-compose"), "sealed")
check("WindowInsets edge-to-edge",   run("WindowInsets edge to edge insets system bar", "--stack", "jetpack-compose"), "WindowInsets")
check("remember derivedStateOf",     run("remember derivedStateOf state performance recomposition", "--stack", "jetpack-compose"), "derivedStateOf")

# ═══════════════════════════════════════════════════════════
# GROUP 14: Edge Cases
# ═══════════════════════════════════════════════════════════
print("\n📍 GROUP 14: Edge Cases")

# -n flag returns correct count
r = run("navigation tab bottom bar", "--domain", "navigation", n=5)
count = r.stdout.count("### Result")
ok = count == 5
(passed if ok else failed).append("navigation: -n 5 returns 5 results")
print(f"  {'✅' if ok else '❌'} -n 5 flag returns 5 results (got {count})")

# invalid domain → non-zero exit
r_bad = subprocess.run(["python3", SCRIPT, "test", "--domain", "foobar"],
                       capture_output=True, text=True, cwd=BASE)
check("invalid domain → error exit",  r_bad, None, returncode=2)

# invalid stack → non-zero exit
r_bad2 = subprocess.run(["python3", SCRIPT, "test", "--stack", "xamarin"],
                        capture_output=True, text=True, cwd=BASE)
check("invalid stack → error exit",   r_bad2, None, returncode=2)

# no flag → non-zero exit
r_bad3 = subprocess.run(["python3", SCRIPT, "hello"],
                         capture_output=True, text=True, cwd=BASE)
check("no --domain/--stack → error",  r_bad3, None, returncode=2)

# zero results for nonsense query → "No results" message
r_zero = run("xyzxyzxyz_gibberish_asdfqwer", "--domain", "navigation")
check("gibberish query → no crash",  r_zero, "results", returncode=0)

# ═══════════════════════════════════════════════════════════
# GROUP 15: Data Integrity
# ═══════════════════════════════════════════════════════════
print("\n📍 GROUP 15: Data Integrity (row counts)")

expected_min_rows = {
    "navigation.csv":             20,
    "gestures.csv":               20,
    "components.csv":             15,
    "layout.csv":                 15,
    "platform.csv":               15,
    "onboarding.csv":             12,
    "animation.csv":              15,
    "accessibility.csv":          20,
    "ux-laws.csv":                12,
    "stacks/react-native.csv":    15,
    "stacks/flutter.csv":         15,
    "stacks/swiftui.csv":         14,
    "stacks/jetpack-compose.csv": 14,
}

for fname, min_rows in expected_min_rows.items():
    fpath = Path(DATA_DIR) / fname
    if not fpath.exists():
        failed.append(f"file exists: {fname}")
        print(f"  ❌ file exists: {fname} → FILE MISSING")
        continue
    with open(fpath, encoding="utf-8") as f:
        rows = list(csv.reader(f))
    data_rows = len(rows) - 1  # minus header
    ok = data_rows >= min_rows
    (passed if ok else failed).append(f"row count: {fname}")
    print(f"  {'✅' if ok else '❌'} {fname}: {data_rows} rows (min {min_rows})")

# ═══════════════════════════════════════════════════════════
# FINAL REPORT
# ═══════════════════════════════════════════════════════════
total = len(passed) + len(failed)
pct = int(100 * len(passed) / total) if total else 0
print(f"\n{'═'*55}")
print(f"  TOTAL TESTS : {total}")
print(f"  PASSED      : {len(passed)}  ({pct}%)")
print(f"  FAILED      : {len(failed)}")
if failed:
    print(f"\n  ❌ FAILED TESTS:")
    for f in failed:
        print(f"     - {f}")
print(f"{'═'*55}")
sys.exit(0 if not failed else 1)
