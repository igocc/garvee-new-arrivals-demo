# Garvee New Arrivals redesign demo

An interactive static prototype that restructures Garvee's New Arrivals page around a single product-discovery model.

## What changes

- Replaces the oversized promotional banner with a compact, utility-led introduction.
- Replaces repeated vertical category shelves with one top-level category tab bar.
- Gives shoppers four explicit discovery views: 30-day trending, just in, best deals, and highly rated.
- Uses availability, inventory, delivery, review confidence, freshness, and promotion quality as merchandising guardrails.
- Keeps the first mobile swipe focused on products instead of an email gate or modal.

## Important data note

Product names, imagery, prices, links, and visible review context are adapted from the live public Garvee New Arrivals page. Sales velocity, conversion rate, inventory values, launch age, and the resulting ranking score are simulated for interaction design purposes. They are not live Garvee performance claims.

## Local preview

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

## Production ranking contract

The demo uses the following directional weighting:

- Sales velocity: 35%
- Conversion quality: 20%
- Freshness: 20%
- Review confidence: 10%
- Inventory health: 10%
- Promotion value: 5%

Production implementation should define each metric's authority source, timezone, grain, exclusions, update cadence, price-history rule, and fallback behavior before use.

## Technology

Vanilla HTML, CSS, and JavaScript. Text relayout uses [Pretext](https://github.com/chenglou/pretext) from esm.sh, with a graceful CSS fallback if the module is unavailable.
