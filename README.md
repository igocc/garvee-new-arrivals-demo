# GARVEE collection pages offline prototype

A responsive, zero-server prototype for four redesigned GARVEE collection experiences.

## Open it

Double-click any page. All catalog images, scripts, and layout code are local, so the experience works without a network connection.

- `index.html` — New Arrivals
- `best-sellers.html` — ranked demand discovery
- `flash-deals.html` — time-bound promotion discovery
- `clearance.html` — final-markdown inventory discovery

## Included interactions

- Three-slide featured banner with autoplay, arrows, touch swipe, dots, close, and restore
- One-row image category rail with desktop arrows and mobile horizontal swipe
- Trending, Newest, Best Deals, and Most Reviewed ranking tabs
- 30 / 60 / 90 day launch filters; the control is disabled and preserved on Newest
- Local product search, ten-item incremental loading, empty states, and result counts
- Local cart feedback and responsive desktop/mobile footer behavior
- Fixed 2026-09-23 snapshot date so the demo remains stable over time
- Desktop sidebar and mobile filter drawer with page-specific filters and sorting
- Best Sellers Top 3 and auditable ranking presentation
- Flash Deals shared campaign countdown and truthful low-stock language
- Clearance quick filters, no-restock language, and no artificial countdown

## Data boundary

Product names, images, prices, availability, inventory, and visible review data are adapted from GARVEE's public New Arrivals page snapshot. Sales velocity, category revenue, and fallback launch age are deterministic demo values for interaction testing. They are not live GARVEE performance claims.

## Refresh the public snapshot

From the repository root:

```bash
python3 sites/garvee-new-arrivals-demo/scripts/sync-public-catalog.py
```

The script rebuilds `catalog.js` and downloads up to 50 product images into `assets/products/`.
