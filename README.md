# DSA WIZARD

> A web page which consists the whole content of DSA. Made to work as a one-stop solution for all DSA related queries.

An interactive, zero-build learning site for **data structures and algorithms**. Every structure gets the same
treatment: the concept in plain English *and* in precise terms, an animated playground you can poke, the operations
with their real cost, working code in **four languages**, a complexity chart, a printable cheat sheet, the pitfalls
that cost people interviews, and a curated practice set.

**Live pages:** open `index.html` in any browser — there is no build step, no bundler and no npm install.

---

## What's inside

| Structure | Page | Playground lets you… |
|---|---|---|
| Array | `array.html` | insert/delete at any index, linear vs **binary search**, animated bubble sort |
| Linked List | `ll.html` | insert head/tail/position, delete, traverse, **reverse one pointer at a time** |
| Trees (BST) | `trees.html` | insert with the descend path shown, search, **all four traversals** animated |
| Hash Table | `hash_table.html` | watch the **hash being computed**, land in a bucket, force a **collision**, track load factor |
| String | `string.html` | two-pointer reverse, palindrome check, frequency chart, **naive pattern search** |
| Stack | `stack.html` | push/pop/peek with real **overflow and underflow** guards |
| Queue | `queue.html` | enqueue/dequeue with live front/rear, and a **circular vs linear** mode toggle |
| Graphs | `graphs.html` | **BFS and DFS side by side** with the live queue/stack, plus BFS shortest path |
| Cheat sheets | `cheatsheet.html` | all eight sheets + complexity charts, filterable and printable |

Every topic page carries: `#concept` · `#playground` · `#features` · `#types` · `#operations` · `#code` ·
`#complexity` · `#cheat` · `#pitfalls` · `#practice`.

## Features

- **8 interactive playgrounds** — each animation narrates *why* the cost is what it is, with a speed control.
- **136 code snippets** — 34 operations × C++ / Java / Python / JavaScript, with a self-contained syntax
  highlighter, line numbers, one-click copy, and your language choice remembered across pages.
- **Real complexity tables** (not screenshots) with colour-coded Big-O badges: O(1) → O(n²).
- **64 curated practice problems** with difficulty and a one-line hint, linked to LeetCode.
- **Printable cheat sheets** — filter by topic, then `Print / save as PDF`.
- **Command palette** — `Ctrl`/`⌘` + `K` (or `/`) to jump to any structure or section; `[` and `]` page between topics.
- **Progress tracking** — mark a structure as mastered; the home page shows a progress ring. Stored in
  `localStorage`, so it never leaves your browser.
- **Animated 3D theme** — perspective grid floor, drifting node-network canvas, aurora background, tilting cards,
  flipping brand chip, scroll-reveal on every section. All of it respects `prefers-reduced-motion`.
- **Responsive** down to 390 px, and print-friendly.

## Project layout

```
index.html          Home — hero, structure grid, roadmap, why-DSA, tips
array.html  ll.html  trees.html  hash_table.html
string.html stack.html queue.html graphs.html      The eight topic pages
cheatsheet.html     Printable all-topics reference

theme.css           Design system: tokens, background, nav, footer, terminal, buttons
topic.css           Topic-page layout, data widgets and every visualizer style
style.css           Home-page only

topics.js           Content data: registry, complexity charts, practice sets, cheat sheets, pitfalls
code.js             The code library — 8 topics × operations × 4 languages
viz.js              The eight interactive visualizers + animation engine
wizard.js           Shared runtime: page shell, animations, terminal, widgets, palette

*.png               Original hand-made reference diagrams
```

### How a page is assembled

Topic pages contain only their own prose. Everything repeated is injected or rendered at runtime:

- `wizard.js` builds the navbar, background layers, command palette, footer, back-to-top and toast.
- `<body data-topic="stack">` tells it which topic it is — that drives the nav, pager and every widget.
- `<div data-widget="…">` placeholders are filled from `topics.js` / `code.js`:
  `stats`, `features`, `types`, `terminal`, `complexity`, `cheatsheet`, `pitfalls`, `questions`, `pager`.
- `<div data-viz="stack">` mounts the matching playground from `viz.js`.

So adding a structure means: one entry in `DSA.topics`, its data in `topics.js` / `code.js`, and a page that
follows the same skeleton.

## Running it

```bash
# simplest — just open it
open index.html

# or serve it (needed only if your browser blocks local file access)
python3 -m http.server 8000
# → http://localhost:8000
```

No dependencies are bundled. The only network requests are Google Fonts (Orbitron, Rajdhani, JetBrains Mono);
the page still works without them thanks to fallback font stacks.

## Keyboard shortcuts

| Key | Action |
|---|---|
| `Ctrl`/`⌘` + `K` or `/` | open the command palette |
| `↑` `↓` `↵` | navigate and open a palette result |
| `[` `]` | previous / next structure |
| `Esc` | close the palette or an image lightbox |

## Contributing / extending

- **New practice problem?** add it to `DSA.questions` in `topics.js`.
- **New code snippet?** add an op to the relevant topic in `code.js` — the terminal dropdown picks it up automatically.
- **New playground?** add a builder to `window.DSAVizBuilders` in `viz.js` and a `data-viz` div on the page.

## Credits

Built by **Harsh Ranjan**. Diagrams are hand-made and included in the repo.

Queries & suggestions — [harshranjan1111@gmail.com](mailto:harshranjan1111@gmail.com)

> *Fuel your coding journey with the power of DSA.*
