# Product Requirements Document (PRD)
## AI-Based Traffic Risk Heatmap & Police Deployment Decision Support — Nagpur City
### Hackathon Build Version

**Version:** 2.0 (Hackathon-Optimized)
**Date:** August 15, 2026
**Purpose:** Build guide to design, prioritize, and demo a winning hackathon project

---

## 1. Why This Version Is Different From a Standard PRD

A normal PRD lists everything a full product needs. A **hackathon-winning PRD** does something different: it tells you exactly what to build deeply, what to build shallowly, and what to fake — so that in a limited time window you produce something that *feels* real and *stands out*, instead of nine half-finished features.

This document is organized around that principle. Every requirement below is tagged:

- 🟢 **CORE** — build this fully, this is what wins you the demo
- 🟡 **SUPPORTING** — build a working but simple version
- ⚪ **SIMULATE** — fake/mock this convincingly, don't over-engineer it

---

## 2. Problem Statement

Nagpur's Traffic Police have limited officers and no data-driven way to decide where to deploy them. Citizens have no simple way to report traffic issues (jams, accidents, rash driving, parking violations) and get no visibility into what happens after. This project bridges both gaps with one connected system: citizens feed real-world signal in, and an explainable AI engine turns that signal into a live, justifiable deployment plan for police.

---

## 3. Your Winning Differentiators (build these deepest)

Based on what most competing teams will *not* do well:

1. **Explainability-first design** — every AI output shows its reasoning in plain language, not just a score.
2. **True dynamic redeployment** — a live, simulated incident that visibly triggers real-time reassignment and shows the coverage gap left behind.
3. **Citizen feedback loop** — citizens see their complaint reflected in action, not a black-hole submission form.
4. **Baseline vs. AI comparison with a real number** — quantify improvement, don't just claim it.

Keep these four in mind while reading the requirements below — they determine what gets your full attention.

---

## 4. MVP Scope & Priority Tiers

### 🟢 CORE (build fully — this is your demo's spine)

| # | Feature | What "done" looks like |
|---|---|---|
| C1 | Citizen complaint form (category, description, photo upload, location pin) | Working form → saves to database → shows on map |
| C2 | Risk scoring model (simple weighted formula, not deep ML) | Score = w1×complaint_density + w2×accident_history + w3×time_of_day + w4×other_factor, recalculated per location |
| C3 | Interactive heatmap (red/amber/green) | Map library (Leaflet/Google Maps) showing color-coded markers, clickable |
| C4 | Ranked list of top-risk locations | Sortable table, auto-generated from scores |
| C5 | Explainability panel | Click any location → shows factor breakdown (bar chart or simple %s) in plain language |
| C6 | Personnel allocation algorithm | Simple greedy/bipartite matching: assign N officers to top-N risk locations by proximity |
| C7 | Live incident simulation + redeployment | Button: "Simulate Incident at Location X" → score spikes → nearest officer reassigned → old post flagged as gap |
| C8 | Manual override control | Dropdown/button to reassign an officer manually, logged with reason |
| C9 | Baseline vs. recommended comparison view | Side-by-side numbers: coverage % of high-risk zones under baseline vs. AI plan |
| C10 | Control room dashboard | One screen combining map + ranked list + alerts + comparison |

### 🟡 SUPPORTING (working, but keep simple)

| # | Feature | Simple approach |
|---|---|---|
| S1 | Complaint status tracking | 3-state status (Received/Assigned/Resolved), citizen sees it via tracking ID |
| S2 | Unmanned high-risk alert | Simple rule: if top-5 risk location has no officer within X distance → red banner alert |
| S3 | Officer roster/shift data | Hardcode or CSV-load 10–15 sample officers with starting locations |
| S4 | Notifications | Even a simple in-app status update counts — skip SMS/push for hackathon |

### ⚪ SIMULATE (don't over-build, just make it convincing)

| # | Item | How to fake it well |
|---|---|---|
| M1 | Historical accident data | Generate a realistic synthetic dataset for 15–20 real Nagpur junctions (Google "Nagpur accident-prone junctions" for real names to use — adds credibility) |
| M2 | Live traffic/GPS feed | Not needed for MVP — complaint density + accident history is enough signal |
| M3 | Large citizen user base | Pre-seed the database with 40–60 realistic sample complaints before the demo, submit 1–2 live during the demo |
| M4 | City-wide coverage | Focus your whole demo on ONE real zone/ward of Nagpur (e.g., Sitabuldi, Sadar, or Dharampeth) — deeper and more credible than a thin citywide layer |

---

## 5. Suggested Tech Stack (fast to build, easy to demo)

| Layer | Suggestion | Why |
|---|---|---|
| Frontend/Dashboard | React + Leaflet.js (or Google Maps API) | Fast to build maps + dashboards, huge community support |
| Backend | Node.js/Express or Python/FastAPI | Quick REST API setup |
| Database | Firebase/Firestore or PostgreSQL | Firebase = fastest for hackathon (real-time updates built in, great for live redeployment demo) |
| Risk Scoring | Plain Python/JS weighted formula | Don't over-invest in ML for a 24–48hr hackathon — a well-explained formula beats an unexplainable black-box model for this use case |
| Allocation Algorithm | Simple greedy nearest-available-officer matching, or `scipy.optimize.linear_sum_assignment` if you want to look more sophisticated | Explainable and fast to implement |
| Media Upload | Firebase Storage / Cloudinary | Drag-and-drop photo/video upload, minimal setup |
| Hosting | Vercel/Netlify (frontend) + Render/Railway (backend) | Free tier, fast deploy for demo day |

---

## 6. Risk Scoring Model — Simple, Explainable Formula

Keep this simple and transparent (judges will ask "how does it work" — a formula you can explain in one sentence beats a model you can't):

```
Risk Score (0–100) =
   (0.35 × Complaint Density Score) +
   (0.30 × Historical Accident Score) +
   (0.20 × Time-of-Day Risk Multiplier) +
   (0.15 × Road Attribute Score — e.g., no signal, poor visibility, known blackspot)
```

Each sub-score normalized 0–100. Store the sub-score breakdown alongside the total — this breakdown IS your explainability feature (C5).

---

## 7. Personnel Allocation Logic — Simple, Explainable Version

1. Rank all locations by risk score (highest first).
2. For each officer (in order of current availability), assign them to the highest-ranked unassigned location within a reasonable travel radius.
3. Repeat until officers run out.
4. On incident trigger: insert the incident location at the top of the ranking, re-run steps 2–3, and diff the new assignment against the old one to show what moved and what gap opened up.

This is a **greedy nearest-highest-risk matching** — simple to build, easy to explain live, and good enough to produce a compelling before/after number.

---

## 8. Demo Flow (ties directly to this PRD)

Use the 8-step, ~4-minute demo flow already planned:
1. Problem statement (20s)
2. Citizen reporting app (30s)
3. Heatmap reveal (40s)
4. Explainability panel (30s)
5. Baseline vs. AI deployment (30s)
6. Live incident + redeployment (60s) — **your centerpiece**
7. Manual override (15s)
8. Close with an impact number (20s)

Every step in this flow maps to a 🟢 CORE feature above — if you run out of time, cut 🟡/⚪ items first, never a 🟢 item.

---

## 9. Success Metrics for the Demo (what to actually calculate and show)

- **Coverage %**: (# high-risk locations with an officer assigned) ÷ (total high-risk locations) — show baseline vs. AI-recommended
- **Response distance/time saved**: average distance from officer's old post to new post during redeployment vs. distance if using baseline plan
- **Unmanned hotspots caught**: count of high-risk zones baseline missed that your system flagged

Pick ONE of these to be your headline "wow number" in the closing slide.

---

## 10. Build Timeline (assuming a 24–48 hour hackathon)

| Time Block | Focus |
|---|---|
| Hours 0–4 | Set up repo, database schema, seed synthetic data (M1, M3), basic map rendering |
| Hours 4–10 | Build citizen complaint form (C1) + risk scoring formula (C2) |
| Hours 10–16 | Build heatmap (C3) + ranked list (C4) + explainability panel (C5) |
| Hours 16–22 | Build allocation algorithm (C6) + incident simulation/redeployment (C7) |
| Hours 22–28 | Build override controls (C8) + baseline comparison (C9) |
| Hours 28–34 | Assemble control room dashboard (C10), wire everything together |
| Hours 34–40 | Polish UI, add S1–S4 if time allows |
| Hours 40–48 | Rehearse demo flow, fix bugs, prepare backup video of the incident-trigger step |

---

## 11. What NOT to Do

- Don't build a real ML model unless you have someone confident in it AND time to explain it well — a clear formula beats an unexplainable model for this specific use case (judges want to trust it).
- Don't try to cover all of Nagpur — one real, well-chosen zone with a believable dataset looks more credible than a thin citywide layer.
- Don't skip the explainability panel to save time — it's your single highest-leverage differentiator relative to effort required.
- Don't leave the "unmanned hotspot" and "override" features for last — they're small to build but big in judge perception ("the human is still in control").

---

## 12. Presentation Tips (from your demo plan)

- Open with the problem, not the tech.
- Narrate the live incident-redeployment moment slowly and clearly — this is your standout moment.
- Close on a number, not a feature list.
- Have a backup recorded video of the live demo in case of technical issues on stage.

---

*End of Document*
