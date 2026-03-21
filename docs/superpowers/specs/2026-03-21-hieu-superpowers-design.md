# Hiểu Rõ Superpowers — Mental Model Map

> **Mục tiêu:** Hiểu triết lý và kiến trúc của superpowers đủ để giải thích lại được — biết tại sao mỗi thành phần tồn tại.
>
> **Đối tượng:** Người mới bắt đầu, chưa dùng bất kỳ skill hay workflow nào.

---

## Section 1: Kiến trúc tổng thể

Superpowers không phải là một tool — nó là một **hệ thống tư duy** được encode thành các file mà AI đọc và tuân theo.

```
┌─────────────────────────────────────────────────────┐
│                  SUPERPOWERS                        │
│                                                     │
│  ┌──────────┐   ┌──────────┐   ┌──────────────┐    │
│  │  RULES   │   │  SKILLS  │   │  WORKFLOWS   │    │
│  │          │   │          │   │              │    │
│  │ "Luôn    │   │ "Làm thế │   │ "Chuỗi bước  │    │
│  │  làm X   │   │  nào để  │   │  cho task    │    │
│  │  trước   │   │  làm X   │   │  lặp lại"    │    │
│  │  khi Y"  │   │  đúng"   │   │              │    │
│  └──────────┘   └──────────┘   └──────────────┘    │
│                                                     │
│           Tất cả phục vụ 4 nguyên lý:               │
│   TDD · YAGNI · Systematic · Evidence-first         │
└─────────────────────────────────────────────────────┘
```

### 3 lớp cấu thành

| Lớp | Thành phần | Tác dụng | Analogy |
|-----|-----------|----------|---------|
| **1. Ràng buộc bất biến** | Rules | Định nghĩa *những gì không được phép* | Luật giao thông |
| **2. Kiến thức chuyên sâu** | Skills | Dạy *cách làm đúng* từng loại việc | Sách giáo khoa chuyên ngành |
| **3. Quy trình có cấu trúc** | Workflows | Chuỗi bước *đã được kiểm chứng* | Checklist phi công |

### Tại sao cần cả 3?

- Nếu chỉ có **Rules** → AI biết đừng làm gì sai, nhưng không biết cách làm đúng
- Nếu chỉ có **Skills** → AI biết kỹ thuật, nhưng không có kỷ luật bắt buộc áp dụng
- Nếu chỉ có **Workflows** → AI làm theo quy trình, nhưng thiếu kiến thức xử lý edge case

**3 lớp kết hợp = AI có kỷ luật + kiến thức + quy trình**

---

## Section 2: Vòng lặp phát triển & cách Skills liên kết nhau

### Vòng lặp cốt lõi

```
💡 Ý tưởng
    │
    ▼
┌─────────────┐     Vấn đề: Làm ngay sẽ bỏ sót yêu cầu, làm sai hướng
│ /brainstorm │────► Skill: brainstorming → hỏi làm rõ → ra spec
└─────────────┘
    │
    ▼
┌─────────────┐     Vấn đề: Spec quá trừu tượng, không biết bắt đầu từ đâu
│ /write-plan │────► Skill: writing-plans → chia thành task 2-5 phút
└─────────────┘
    │
    ▼
┌──────────────┐    Vấn đề: Thực thi lộn xộn, không có checkpoint
│ /execute-plan│────► Skill: executing-plans + subagent-driven-development
└──────────────┘
    │
    ▼
┌──────────────┐    Vấn đề: Code xong nhưng không chắc đúng không
│ /code-review │────► Skill: requesting-code-review + receiving-code-review
└──────────────┘
    │
    ▼
┌──────────────┐    Vấn đề: Branch xong, merge hay PR hay discard?
│  (auto)      │────► Skill: finishing-a-development-branch
└──────────────┘
    │
    ▼
   ✅ Done
```

### Skills "vệ tinh" — kích hoạt trong suốt vòng lặp

| Skill | Kích hoạt khi... | Giải quyết vấn đề gì? |
|-------|-----------------|----------------------|
| `test-driven-development` | Bắt đầu viết bất kỳ code nào | Ngăn viết code không có test → sau này không dám refactor |
| `systematic-debugging` | Gặp bất kỳ bug nào | Ngăn "đoán mò" → sửa bug có hệ thống |
| `verification-before-completion` | Trước khi nói "xong rồi" | Ngăn claim sai → phải có evidence |
| `using-git-worktrees` | Bắt đầu feature mới | Giữ main branch sạch, isolate work |
| `dispatching-parallel-agents` | Có 2+ task độc lập | Chạy song song thay vì tuần tự |

### Tại sao thứ tự này là bắt buộc?

Mỗi bước **ngăn một loại sai lầm cụ thể** mà nếu bỏ qua, cost sẽ tăng theo cấp số nhân:

```
Bỏ brainstorm → Làm sai yêu cầu   → Phải làm lại 100%
Bỏ write-plan → Mất phương hướng  → Làm lại 50%
Bỏ TDD        → Không dám refactor → Tech debt tích lũy
Bỏ verify     → Claim sai          → Mất trust
```

**Superpowers = bộ "safety net" ngăn mỗi loại sai lầm tại đúng thời điểm nó có thể xảy ra.**

---

## Section 3: 4 Nguyên lý cốt lõi — Nền tảng triết học

Mỗi skill trong superpowers **không phải ngẫu nhiên** — tất cả đều phục vụ 4 nguyên lý này.

### 1. 🔴 Test-Driven Development (TDD)

**Vấn đề:** AI (và developer) có xu hướng "viết code rồi nghĩ sau" — kết quả là code chạy được nhưng không ai dám sửa vì không có lưới an toàn.

**Nguyên lý:** Viết test thất bại TRƯỚC, rồi mới viết code để test pass.

```
❌ Thông thường:  Code → (có thể có) Test → "Xong!"
✅ TDD:           Test (RED) → Code (GREEN) → Refactor → Lặp lại
```

**Tại sao superpowers enforce điều này:** Vì AI rất giỏi tạo ra code *trông có vẻ đúng* — TDD là cách duy nhất để verify nó thực sự đúng.

---

### 2. 🟡 YAGNI — "You Ain't Gonna Need It"

**Vấn đề:** AI (và developer) có xu hướng over-engineer — thêm features "phòng khi cần", tạo abstractions sớm, build cái chưa được yêu cầu.

**Nguyên lý:** Chỉ build đúng thứ được yêu cầu *ngay bây giờ*.

**Ảnh hưởng lên skills:**
- `brainstorming` có HARD-GATE: không code gì trước khi design được approve
- `writing-plans` chia task nhỏ 2-5 phút để luôn focused
- Mọi design doc đều yêu cầu *loại bỏ* features không cần thiết

---

### 3. 🔵 Systematic over Ad-hoc

**Vấn đề:** Khi gặp vấn đề, reflexes mặc định là "đoán mò" và "thử đại" — đặc biệt nguy hiểm với AI vì nó rất tự tin khi đoán sai.

**Nguyên lý:** Luôn có process rõ ràng, không bao giờ improvise.

| Tình huống | Ad-hoc (nguy hiểm) | Systematic (đúng) |
|-----------|-------------------|------------------|
| Gặp bug | Thử sửa ngẫu nhiên | `systematic-debugging`: 4 giai đoạn có cấu trúc |
| Có ý tưởng | Code luôn | `brainstorming` → spec → plan → execute |
| Hoàn thành task | Nói "xong" | `verification-before-completion`: chạy lệnh verify trước |

---

### 4. 🟢 Evidence over Claims

**Vấn đề:** AI rất dễ nói "đã sửa xong", "test pass rồi" — *mà không thực sự chạy verify*. Đây là lỗi phổ biến và nguy hiểm nhất.

**Nguyên lý:** Không được claim thành công mà không có evidence — phải chạy lệnh, thấy output, rồi mới báo cáo.

**Skills enforce nguyên lý này:**
- `verification-before-completion` — bắt buộc chạy verify commands trước khi nói "done"
- `requesting-code-review` — phải có checklist evidence trước khi submit
- Mọi skill đều yêu cầu "show your work"

---

### Sơ đồ 4 nguyên lý ↔ Skills

```
TDD ──────────────► test-driven-development
                    verification-before-completion

YAGNI ────────────► brainstorming (HARD-GATE)
                    writing-plans (task nhỏ, focused)

Systematic ───────► systematic-debugging
                    executing-plans
                    all workflows (có cấu trúc bước rõ)

Evidence-first ───► verification-before-completion
                    requesting-code-review
                    receiving-code-review
```

---

## Section 4: Anatomy từng Skill — Mental Model Map

Framework cho mỗi skill: **Vấn đề → Giải pháp → Dấu hiệu dùng → Hậu quả nếu bỏ**

---

### 🟦 Nhóm 1: Vòng lặp chính (theo thứ tự)

#### `brainstorming`
- **Vấn đề:** AI làm ngay mà không hiểu đúng yêu cầu → xây nhầm thứ
- **Giải pháp:** HARD-GATE — không code gì cho đến khi spec được approve; hỏi từng câu một để làm rõ
- **Dấu hiệu dùng:** Bất cứ khi nào tạo feature, component mới, hoặc thay đổi behavior
- **Bỏ qua:** Xây xong mới biết sai hướng → làm lại 100%

#### `writing-plans`
- **Vấn đề:** Spec đã có nhưng quá lớn → AI mất phương hướng khi thực thi
- **Giải pháp:** Chia spec thành task 2-5 phút với file path cụ thể và acceptance criteria
- **Dấu hiệu dùng:** Sau khi brainstorming approve design
- **Bỏ qua:** Thực thi lan man, không có checkpoint, dễ drift khỏi spec

#### `executing-plans`
- **Vấn đề:** Có plan nhưng thực thi lộn xộn — làm nhiều task cùng lúc, không review
- **Giải pháp:** Chạy từng batch task, có human checkpoint, không bỏ qua bước nào
- **Dấu hiệu dùng:** Khi bắt đầu thực thi implementation plan
- **Bỏ qua:** Task chạy mà không ai kiểm soát → lỗi tích lũy mà không phát hiện sớm

#### `requesting-code-review`
- **Vấn đề:** Submit code mà chưa tự kiểm tra → reviewer phải catch những lỗi cơ bản
- **Giải pháp:** Checklist pre-review: test chạy chưa? edge case nghĩ đến chưa? naming rõ chưa?
- **Dấu hiệu dùng:** Trước khi submit code cho review
- **Bỏ qua:** Reviewer tốn thời gian vào lỗi trivial thay vì logic

#### `receiving-code-review`
- **Vấn đề:** AI nhận feedback và "agree" mà không đánh giá xem feedback có đúng không
- **Giải pháp:** Đánh giá kỹ từng feedback — verify trước khi implement, không blind-agree
- **Dấu hiệu dùng:** Khi nhận được code review comments
- **Bỏ qua:** Implement feedback sai → tệ hơn code trước review

#### `finishing-a-development-branch`
- **Vấn đề:** Xong code rồi không biết bước tiếp theo — merge? PR? discard? clean up gì?
- **Giải pháp:** Structured options: merge, tạo PR, hoặc cleanup — với checklist cho từng lựa chọn
- **Dấu hiệu dùng:** Khi tất cả task đã complete và test pass
- **Bỏ qua:** Branch bị bỏ lơ lửng, không clean, history lộn xộn

---

### 🟨 Nhóm 2: Safety net (luôn hoạt động song song)

#### `test-driven-development`
- **Vấn đề:** Code "trông đúng" nhưng không có gì chứng minh nó đúng
- **Giải pháp:** RED → GREEN → REFACTOR. Test thất bại trước, rồi mới code
- **Dấu hiệu dùng:** Trước khi viết BẤT KỲ dòng implementation code nào
- **Bỏ qua:** Không dám refactor sau này → tech debt cố định mãi mãi

#### `systematic-debugging`
- **Vấn đề:** AI đoán nguyên nhân bug rồi thử sửa ngẫu nhiên — confident mà sai
- **Giải pháp:** 4 giai đoạn: Observe → Hypothesize → Test hypothesis → Fix
- **Dấu hiệu dùng:** Khi gặp bất kỳ bug, test failure, hoặc unexpected behavior
- **Bỏ qua:** "Fix" bug mà không hiểu nguyên nhân → bug quay lại dưới dạng khác

#### `verification-before-completion`
- **Vấn đề:** AI nói "xong rồi", "test pass rồi" — mà chưa thực sự chạy verify
- **Giải pháp:** Bắt buộc chạy verification commands, thấy output, rồi mới report
- **Dấu hiệu dùng:** Trước khi claim bất cứ thứ gì "đã hoàn thành" hoặc "đã sửa"
- **Bỏ qua:** Lỗi không được phát hiện, trust bị phá vỡ

---

### 🟩 Nhóm 3: Kỹ thuật nâng cao

#### `using-git-worktrees`
- **Vấn đề:** Feature work làm bẩn main branch, khó switch context
- **Giải pháp:** Tạo isolated worktree cho mỗi feature — làm việc song song mà không ảnh hưởng nhau
- **Dấu hiệu dùng:** Bắt đầu feature work cần isolation

#### `dispatching-parallel-agents`
- **Vấn đề:** 2+ task độc lập chạy tuần tự → tốn thời gian
- **Giải pháp:** Dispatch subagent riêng cho mỗi task — chạy song song
- **Dấu hiệu dùng:** Khi có 2+ task không có shared state hay dependency

#### `subagent-driven-development`
- **Vấn đề:** Executing plan với nhiều task phức tạp trong cùng session
- **Giải pháp:** Mỗi task được xử lý bởi subagent riêng với two-stage review
- **Dấu hiệu dùng:** Trong quá trình executing-plans với task phức tạp

---

### 🟪 Nhóm 4: Meta skills

#### `writing-skills`
- **Vấn đề:** Muốn tạo skill mới nhưng không biết format, structure cần gì
- **Giải pháp:** Hướng dẫn tạo SKILL.md đúng chuẩn, deploy và verify
- **Dấu hiệu dùng:** Khi muốn tạo hoặc sửa skills

#### `using-superpowers`
- **Vấn đề:** AI không biết có skills nào tồn tại hoặc khi nào dùng
- **Giải pháp:** Rule always-on — bắt buộc check skill trước mỗi hành động
- **Dấu hiệu dùng:** Bắt đầu mỗi conversation (tự động, không cần gọi thủ công)

---

## Mental Model Map tổng hợp

```
                    💡 Ý tưởng
                        │
              [using-superpowers]  ← luôn ON
                        │
              ┌─────────▼──────────┐
              │    brainstorming   │ ← YAGNI gate
              └─────────┬──────────┘
                        │
              ┌─────────▼──────────┐
              │    writing-plans   │ ← chia nhỏ
              └─────────┬──────────┘
                        │
              ┌─────────▼──────────┐
              │   executing-plans  │◄──[dispatching-parallel-agents]
              │                    │◄──[subagent-driven-development]
              │   [TDD] ←inside→   │◄──[using-git-worktrees]
              └─────────┬──────────┘
                        │
              ┌─────────▼──────────┐
              │  [systematic-      │ ← khi gặp bug
              │   debugging]       │
              │  [verification]    │ ← trước mỗi claim
              └─────────┬──────────┘
                        │
              ┌─────────▼──────────┐
              │  requesting-review │
              │  receiving-review  │
              └─────────┬──────────┘
                        │
              ┌─────────▼──────────┐
              │  finishing-branch  │
              └─────────┬──────────┘
                        │
                    ✅ Done
```

---

## Checklist tự kiểm tra "Tôi đã master superpowers chưa?"

- [ ] Giải thích được tại sao cần cả 3 lớp: rules + skills + workflows
- [ ] Nói được 4 nguyên lý cốt lõi và ví dụ cụ thể cho mỗi nguyên lý
- [ ] Với mỗi skill, trả lời được: vấn đề gì? dấu hiệu nào để dùng? bỏ qua thì sao?
- [ ] Vẽ lại được mental model map không cần nhìn tài liệu
- [ ] Giải thích được tại sao thứ tự brainstorm → write-plan → execute-plan là bắt buộc
