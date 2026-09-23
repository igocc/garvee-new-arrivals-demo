# GARVEE New Arrivals offline prototype

A responsive, zero-server prototype for the redesigned GARVEE New Arrivals page.

## Open it

Double-click `index.html`. All catalog images, fonts, scripts, and layout code are local, so the page works without a network connection.

## Included interactions

- Three-slide featured banner with autoplay, arrows, touch swipe, dots, close, and restore
- One-row image category rail with desktop arrows and mobile horizontal swipe
- Trending, Newest, Best Deals, and Most Reviewed ranking tabs
- 30 / 60 / 90 day launch filters; the control is disabled and preserved on Newest
- Local product search, ten-item incremental loading, empty states, and result counts
- Local cart feedback and responsive desktop/mobile footer behavior
- Fixed 2026-09-23 snapshot date so the demo remains stable over time

## Data boundary

Product names, images, prices, availability, inventory, and visible review data are adapted from GARVEE's public New Arrivals page snapshot. Sales velocity, category revenue, and fallback launch age are deterministic demo values for interaction testing. They are not live GARVEE performance claims.

## Refresh the public snapshot

From the repository root:

```bash
python3 sites/garvee-new-arrivals-demo/scripts/sync-public-catalog.py
```

The script rebuilds `catalog.js` and downloads up to 50 product images into `assets/products/`.
