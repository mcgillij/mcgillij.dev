# Blog Modernization Plan

## Current State

- Pelican static site generator with custom theme in `theme/`
- Old simplegrid 12-column CSS grid system (fixed 10/12 + 2/12 layout)
- Dracula dark color scheme throughout
- jQuery + magnific-popup for photo galleries
- Utterances comments (archived project — needs migration)
- `extract_toc` plugin renders TOC in sidebar, causing overflow/crunching issues
- No responsive/mobile-first design
- Inline styles scattered across templates

## Issues to Fix

### 1. Sidebar/TOC Overflow (Priority: High)
The table of contents in the article sidebar bleeds out or gets crunched when section titles are long. The fixed 2-column grid doesn't handle variable content widths well.

### 2. No Responsive Design
Layout breaks on mobile/tablet with no media queries or fluid layout handling.

---

## Implementation Plan

### Phase 1: Fix TOC/Sidebar Overflow (High Priority)

**Goal:** Make the sidebar contain its content properly without bleeding or crunching text.

- [x] Replace simplegrid CSS with modern CSS Grid/Flexbox
- [x] Give sidebar a `max-height` with `overflow-y: auto` for scrollable TOC
- [x] Set proper `word-wrap` / `overflow-wrap` on sidebar links to prevent horizontal overflow
- [x] Make layout responsive — stack content/sidebar vertically on narrow screens
- [x] Remove fixed column classes (`col-10-12`, `col-2-12`) in favor of fluid widths

### Phase 2: Template Restructure

**Goal:** Clean up template inheritance and eliminate duplication.

- [ ] Consolidate `base.html` and `main.html` into a single base template (they're nearly identical right now)
- [ ] Move Google Analytics script to base, use `{% block analytics %}` for overrides
- [ ] Extract repeated OG meta tags into reusable blocks or macros
- [ ] Standardize article listing layout across `index.html`, `blog.html`
- [ ] Fix `tags.html` — currently just says "tags", needs proper implementation

### Phase 3: CSS Modernization

**Goal:** Cleaner, maintainable styles with modern CSS features.

- [ ] Convert all hardcoded colors to CSS custom properties (variables) for easy theming
- [ ] Add light mode support via `prefers-color-scheme` and/or toggle button
- [ ] Improve typography — web fonts (Inter + JetBrains Mono or similar), fluid type scaling, better line-heights
- [ ] Modernize code block styling (pygment.css is already in place, just needs refinement)
- [ ] Add smooth transitions for hover states, theme switching
- [ ] Remove `simplegrid.css` entirely

### Phase 4: JavaScript Cleanup

**Goal:** Remove unnecessary dependencies.

- [ ] Remove jQuery dependency (`jquery.min.js`)
- [ ] Replace magnific-popup with a lighter vanilla JS lightbox or use native `<dialog>` element
- [ ] Defer non-critical JS loading
- [ ] Add theme toggle functionality (if Phase 3 light mode is implemented)

### Phase 5: Comments Migration

**Goal:** Migrate from archived Utterances to an active alternative.

- [ ] Replace Utterances with giscus (GitHub Discussions-based, actively maintained, drop-in replacement)
- [ ] Update `article.html` comments block with giscus config
- [ ] Test comment rendering on article pages

### Phase 6: Performance & Polish

**Goal:** Optimize loading and add finishing touches.

- [ ] Add `font-display: swap` for web fonts
- [ ] Preconnect to font CDN URLs
- [ ] Add reading progress bar at top of articles
- [ ] Improve cover image handling with lazy loading
- [ ] Add smooth scroll behavior
- [ ] Optimize footer layout
- [ ] Ensure all Pelican plugins still work: `pelican-cover-image`, `readtime`, `pelican_youtube`, `extract_toc`, `better_figures_and_images`, `sitemap`, `better_tables`, `tag_cloud`, `image_process`, `photos`

---

## Pelican Compatibility Notes

All changes must remain compatible with Pelican's template system:
- Jinja2 templating syntax stays the same
- All existing template variables (`article`, `pages`, `SITENAME`, `SITEURL`, etc.) preserved
- Plugin outputs (`article.toc`, `article.readtime`, `article.cover_image_url`, `photo_gallery`, `tag_cloud`) must still render correctly
- Feed generation, sitemap, and relative URLs unaffected

## File Change Summary

| File | Changes |
|------|---------|
| `theme/templates/base.html` | Consolidate with main.html, modern layout structure, CSS Grid |
| `theme/templates/main.html` | Likely removed (merged into base) |
| `theme/templates/article.html` | Fix TOC sidebar overflow, migrate comments to giscus |
| `theme/templates/index.html` | Clean up article listing, responsive grid |
| `theme/templates/blog.html` | Align with index.html layout |
| `theme/templates/page.html` | Minor styling updates |
| `theme/templates/author.html` | No structural changes needed |
| `theme/templates/category.html` | No structural changes needed |
| `theme/templates/tag.html` | No structural changes needed |
| `theme/templates/tags.html` | Implement proper tags listing page |
| `theme/static/css/main.css` | Complete rewrite — CSS Grid, custom properties, responsive |
| `theme/static/css/simplegrid.css` | Remove (no longer needed) |
| `theme/static/css/custom.css` | Update for new layout |
| `theme/static/js/` | Remove jQuery, replace magnific-popup with vanilla JS lightbox |

## Suggested Order of Operations

1. **Phase 1** first — this fixes the immediate pain point (sidebar overflow)
2. **Phase 2** next — clean up templates while we're touching them
3. **Phase 3-4** together — CSS and JS modernization
4. **Phase 5** — comments migration (standalone, low risk)
5. **Phase 6** — polish after everything else is in place
