# Editing Guide for Non-Technical Copy Editors

You are a copy editor. This guide shows you how to fix typos and rewrite sentences on the State of Shutoffs site using GitHub.com. No code knowledge required.

---

## The branch rules — read this first

> **These rules protect the live site. Please read them before touching any file.**

- You edit **ONLY** on the `copy-edits` branch.
- You do **NOT** edit on `main` (the live production site) or `dev` (staging). Commits to those branches go live or into review immediately.
- When you finish, you will open a **Pull Request**. You will **NOT** merge it — a developer reviews and merges.
- GitHub is configured so you cannot merge directly to `main` or `dev`. If you see a "permission denied" or "protected branch" error, that is the system working as designed — switch to `copy-edits` and try again.

---

## The three files you can edit

| File | What's in it |
|---|---|
| `src/data/insights.ts` | The 10 numbered insights (headline, stat paragraph, "why this matters" paragraph) |
| `src/components/Introduction.astro` | The opening section under the headline "Energy is a human right" |
| `src/components/Conclusion.astro` | The closing section + "What you can do right now" list |

If you want to change anything else — citations, the explore page, totals, endnotes — **stop and contact a developer**.

---

## Step-by-step: making your first edit on github.com

1. Go to the repo on github.com.

2. Click the **branch dropdown** (top-left of the file list — it currently shows `main` or `dev`). Type `copy-edits` and select it. **Verify the dropdown now reads `copy-edits` before doing anything else.**

3. Navigate to the file you want to edit using the folder list. For example: click `src` → `data` → `insights.ts`.

4. Click the **pencil icon** (top-right of the file view, labeled "Edit this file").

5. Make your changes. See "What you CAN change" and "What NEVER to touch" below before editing.

6. Scroll down to **"Commit changes."** Write a short, descriptive commit message. Examples:
   - `fix typo in insight 3 headline`
   - `rewrite intro second paragraph`

7. Confirm **"Commit directly to the `copy-edits` branch"** is selected. Click **"Commit changes."**

8. Repeat for any other files. All your edits accumulate on `copy-edits` until you open a PR.

---

## Opening a Pull Request when you're done

1. Go to the repo's **"Pull requests"** tab.
2. Click **"New pull request."**
3. Set **base** = `dev` and **compare** = `copy-edits`.
4. Write a title and short description summarizing what changed.
5. Click **"Create pull request."** A developer will review and merge.
6. **Do not click "Merge."** GitHub may show the button, but you do not have permission and pressing it will fail.

---

## What you CAN change

### Example A: fixing a typo in an insight headline (`insights.ts`)

```ts
// Before
headline: "The scale is worse than we thought",

// After (added "far")
headline: "The scale is far worse than we thought",
```

**Highlights note:** The `headlineHighlights` array for this insight contains `["worse than we thought"]`. That phrase still appears verbatim in the new headline, so it does not need updating. But if you change a word that's inside the highlights array, you must update the array too — see Example C.

---

### Example B: rewriting a sentence inside a `stat` paragraph (`insights.ts`)

```ts
// Before
stat: "In 2024, utilities in the United States executed 15.1 million shutoffs — about 13.4 million electric (89%) and 1.5 million gas (11%). That is one shutoff every 2.1 seconds, every day, all year. Overall 2 million households were never reconnected.",

// After (reworded for clarity)
stat: "In 2024, utilities executed 15.1 million shutoffs across the United States — 13.4 million electric (89%) and 1.5 million gas (11%). That works out to one shutoff every 2.1 seconds, every day, all year. 2 million households were never reconnected.",
```

**The rails:** notice the `"` at the very start and the `",` at the very end were not touched. Those are the rails — keep them exactly as they are.

---

### Example C: updating a highlight phrase after rewording

If you rewrote a `stat` so the phrase `"executed 15.1 million shutoffs"` no longer appears verbatim, update `statHighlights` to match your new wording:

```ts
// Before
statHighlights: ["executed 15.1 million shutoffs"],

// After (if you changed the verb)
statHighlights: ["15.1 million shutoffs"],
```

The rule: every phrase inside `headlineHighlights` or `statHighlights` must appear **word-for-word** somewhere in the `headline` or `stat` above it. If it doesn't match, the yellow highlighting on the site will break silently.

---

### Example D: rewriting a paragraph in `Introduction.astro` or `Conclusion.astro`

```astro
<!-- Before -->
<p>
  At the Energy Equity Project we believe every person in this country deserves uninterruptible power in their home — the lights, the heat and hot water, the oxygen concentrator, the fridge for food and insulin, the air conditioner in August.
</p>

<!-- After (comma added, wording tightened) -->
<p>
  At the Energy Equity Project, we believe every person in this country deserves uninterrupted power in their home — the lights, the heat and hot water, the oxygen concentrator, the fridge for food and insulin, the air conditioner in August.
</p>
```

**Only change what's between `<p>` and `</p>`.** Do not delete the tags or add new ones.

---

## What NEVER to touch

### 1. The quotes that wrap a string

In `insights.ts`, every value starts with `"` (or `` ` ``) and ends with a matching mark. Deleting either one breaks the file.

```ts
stat: "...your text here...",     // keep the outer " ... "
frame: `...your text here...`,    // backticks are fine — just don't delete them
```

### 2. Commas between fields

The `,` after a closing `"` separates one field from the next. Don't delete it.

```ts
headline: "The scale is worse than we thought",   // ← this comma is required
stat: "In 2024...",
```

### 3. Citation markers like `[^eia-112-2024]`

These connect a sentence to a footnote at the bottom of the page. They look like noise but they are doing real work. Leave them in place. If you rewrite a sentence that contains one, keep the `[^...]` attached to whichever new sentence the citation belongs to.

```ts
stat: "The EIA 112 report is the first comprehensive national survey of shutoffs capturing shutoff data for 95% of Americans[^eia-112-2024].",
//                                                                                                                            ↑ leave this
```

### 4. `<Note id="..." registry={registry}/>` tags in `.astro` files

Same idea as citation markers — these render as footnotes. Move them with the sentence they belong to; never delete them.

```astro
<p>
  Fifteen million times in 2024, somebody in America lost access to energy<Note id="umich-roadmap-ending-shutoffs-2026" registry={registry}/>.
</p>
```

### 5. Field names

Do not rename `number:`, `headline:`, `stat:`, `frame:`, `headlineHighlights:`, or `statHighlights:`. These are the structure of the data — changing them breaks the site.

### 6. The `number:` value on each insight

Each insight has `number: 1` through `number: 10`. Do not change these.

### 7. The `---` block at the top of `.astro` files

Both `Introduction.astro` and `Conclusion.astro` open with a block between two `---` lines:

```astro
---
import type { EndnoteRegistry } from '../lib/endnotes';
import AnimateOnEnter from './AnimateOnEnter';
import Note from './Note.astro';
...
---
```

This is configuration, not content. Do not touch it.

### 8. URLs inside `<a href="...">` tags

You can edit the **visible link text** (between `>` and `</a>`), but do not change the URL inside the `href="..."` quotes unless a developer gives you a new one.

```astro
<!-- Safe to edit: the visible text -->
<a href="https://www.eia.gov/..." class="highlight-link">New data from the US Energy Information Administration</a>
<!--                                                      ↑ you can reword this ↑                            ↑ but not this URL ↑ -->
```

### 9. `<span class="highlight">`, `<strong>`, and similar tags

You can move text in or out of these tags to change what's visually highlighted, but do not delete or rename the tags themselves.

---

## Special characters and smart quotes

- Curly quotes (" " ' ') and em dashes (—) inside the prose are fine. Many existing strings use them.
- Apostrophes inside a `"`-wrapped string are fine: `"America's"`.
- The one combination to avoid: a straight `"` inside a `"`-wrapped string. If you need quotation marks around a phrase inside a `"`-wrapped value, use curly quotes ("like this") instead of straight ones.

---

## What to do if something goes wrong

| Situation | What to do |
|---|---|
| You committed something and aren't sure if it broke | Don't panic. Open a PR anyway — a developer will review before anything goes live. |
| You can't find `copy-edits` in the branch dropdown | Ask a developer to create the branch for you. |
| You see "permission denied" or "protected branch" | You tried to commit to `main` or `dev`. Switch to `copy-edits` and try again. |
| You deleted text you needed | Use "History" on GitHub to find the previous version and copy it back. |

Everything you commit to `copy-edits` stays there until a PR is reviewed and merged. **Production will not update from your commits alone.**

---

## Cheat sheet

```
1. Switch branch → copy-edits
2. Find the file → pencil icon → edit
3. Commit directly to copy-edits
4. When done → Pull Request → base: dev, compare: copy-edits
```
