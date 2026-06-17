# XLR8 Continuity

**Research-supply continuity subscription — MVP prototype**

XLR8 Continuity is a subscription-management MVP that ensures research labs and independent researchers never experience a supply interruption. The app models recurring membership tiers, auto-ship cadence selection, and per-protocol cost tracking — all scoped strictly to **research use only**.

## What it demonstrates

| Feature | Description |
|---|---|
| Membership tiers | Monthly and annual plans with member-rate pricing on catalogue items |
| Protocol builder | Add / remove research compounds to a personal protocol; quantities auto-aggregate |
| Auto-ship cadence | 30 / 60 / 90-day shipment intervals; runway indicator counts down to next dispatch |
| Cost summary | Live per-shipment and amortised monthly cost breakdown |
| Supply runway | Visual progress bar showing days remaining in the current cycle |

## Scope & disclaimers

All products shown are **for research purposes only**. This prototype does not facilitate personal consumption, dispensing, or dosing. Pricing, inventory, and shipment data are illustrative placeholders for UX evaluation.

## Running locally

Open `index.html` directly in a browser — no build step required. React 18 and ReactDOM are bundled inline.

## Live demo

[jared42.github.io/xlr8-protoype](https://jared42.github.io/xlr8-protoype)

> **GitHub Pages setup**: deploy from the `main` branch, root (`/`) folder. The `.nojekyll` file in the repo root disables Jekyll processing so the single-file React app is served as-is.
