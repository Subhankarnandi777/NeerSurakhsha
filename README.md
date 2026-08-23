# NeerSurakhsha

Early warning system for groundwater contamination and health risk in rural Northeast India. The model layer forecasts water-table depth (including for villages with no sensor at all) and flags sources where the water table has risen above the pit-latrine floor — the single biggest predictor of faecal contamination risk. A mobile app puts that forecast in the hands of ASHA health workers, offline-first, so it works in villages with no signal.

**Model notebook (public, reproducible):** https://www.kaggle.com/code/rishighosaltest/sih-model-v2

---

## Project status

| Layer | State |
|---|---|
| Model | ✅ Done — v2.1, five validated capabilities, public Kaggle notebook |
| Groundwater API | ✅ Done — 7 endpoints live under `/api/v1/groundwater` |
| Backend scaffold | 🟡 App boots, routers wired, `sources` / `sync` / `health` are stubs |
| Database | 🔴 Not connected — nothing persists |
| Frontend | 🟡 Expo app boots, fonts and routing set up, screens are stubs |
| PPT | 🟡 In progress — 16 slide images ready in `sih-model-slide-images.zip` |

The model and the app shell both work. The gap is the middle: three backend endpoints and five app screens that connect them.

---

## Before anything else

The backend will not start without config.

```bash
cd neersurakhsha-backend
cp .env.example .env   # Windows: copy .env.example .env
uvicorn app.main:app --port 8000
```

Then open `http://localhost:8000/docs` — you should see a groundwater section. If you don't, stop and fix that first; nothing else matters until the API runs.

---

## Sign convention (read before touching any depth code)

`depth_m` is **positive metres below ground**. Larger = deeper water table = safer from faecal contamination.

Get this backwards and every alert in the system inverts. The raw CGWB feed is negative-for-below-ground and is flipped on ingest.

---

## Frontend — the app

**Stack (already installed, do not add libraries):** Expo SDK 51, expo-router, react-native-maps, expo-camera, expo-location, expo-network, async-storage, Supabase.

### 1. Point the app at the API — `lib/api.ts`

```ts
import Constants from 'expo-constants';

// Physical device on the same wifi: use your laptop's LAN IP, not localhost.
// Find it with `ipconfig` (Windows) or `ifconfig` (Mac/Linux).
const HOST = Constants.expoConfig?.hostUri?.split(':')[0] ?? 'localhost';
export const API = `http://${HOST}:8000/api/v1`;

export async function get(path: string) {
  const r = await fetch(`${API}${path}`);
  if (!r.ok) throw new Error(`${r.status} ${path}`);
  return r.json();
}

export async function post(path: string, body: unknown) {
  const r = await fetch(`${API}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(`${r.status} ${path}`);
  return r.json();
}
```

Test immediately with a throwaway button calling `get('/groundwater/stations')`. 15 stations back means the plumbing works. If not, it's almost always the LAN IP — `localhost` on a phone means the phone itself.

### 2. Map screen — build this first (`app/map.tsx`)

Uses `react-native-maps`, already installed.

```ts
const { stations } = await get('/groundwater/stations');
```

Each station returns:

```json
{
  "station": "W.R.D., Shillong",
  "district": "East Khasi Hills",
  "lat": 25.5788, "lon": 91.8933,
  "depth_now_m": 1.65,
  "buffer_margin_m": -0.35,
  "flag": "AMBER_C (contamination risk)",
  "volatility_m": 0.16,
  "routed_method": "persistence",
  "vulnerability": "VERY HIGH"
}
```

**Render rules:**
- Marker colour from `flag` (table below).
- Marker size scales with shallowness so dangerous wells are visibly bigger: `radius = 8 + max(0, 12 - min(depth_now_m, 12)) * 1.2`.
- Tap a marker → bottom sheet with depth, `buffer_margin_m`, vulnerability band.
- If `buffer_margin_m` is negative, show a red warning block — that's the whole project in one number: the water table is above the pit-latrine floor.

| `flag` starts with | Colour |
|---|---|
| RED | `#A32D2D` |
| AMBER_C | `#B5730E` |
| AMBER_A | `#2B4A7D` |
| WATCH | `#D98514` |
| GREEN | `#4E8B2C` |
| NO DATA | `#8A9299` |

### 3. ASHA report screen (`app/report.tsx`)

The data-entry flow. Fields:
- Water source picker — populate from `/groundwater/stations`
- Symptom counters, big tap targets: diarrhoea, vomiting, fever, jaundice
- Water test result: three buttons — Positive / Negative / Unclear
- Rope reading: numeric input, "metres from ground to water"
- Photo button (`expo-camera`) — capture and store the URI for now

**Design constraint that matters:** assume the user cannot read well. Icons over text everywhere. One question per screen. Large buttons.

### 4. Offline queue — this is the differentiator

Do not skip this. Offline-first is the strongest claim in the project for rural Northeast India, and it's visible in ten seconds on stage.

```ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Network from 'expo-network';

const KEY = 'pending_reports';

export async function queue(report: any) {
  const raw = await AsyncStorage.getItem(KEY);
  const list = raw ? JSON.parse(raw) : [];
  list.push({ ...report, id: `${Date.now()}-${Math.random()}`, queued_at: new Date().toISOString() });
  await AsyncStorage.setItem(KEY, JSON.stringify(list));
  return list.length;
}

export async function sync() {
  const { isInternetReachable } = await Network.getNetworkStateAsync();
  if (!isInternetReachable) return { synced: 0, offline: true };

  const raw = await AsyncStorage.getItem(KEY);
  const list = raw ? JSON.parse(raw) : [];
  const failed: any[] = [];
  let synced = 0;

  for (const item of list) {
    try { await post('/sources/vwsi/evaluate', item); synced++; }
    catch { failed.push(item); }
  }

  await AsyncStorage.setItem(KEY, JSON.stringify(failed));
  return { synced, offline: false };
}
```

Show a "N pending" badge in the header. Judges need to see the queue. Submitting in airplane mode and watching the counter tick up is the demo moment.

### 5. Ungauged village screen — the strongest feature (`app/village.tsx`)

This is what separates the project from a monitoring dashboard. Most villages have no sensor — a health worker drops a marked rope into the well every couple of weeks. Six readings is enough.

```ts
const result = await post('/groundwater/ungauged/forecast', {
  village: 'Kartik Chapori',
  horizon_days: 60,
  readings: [
    { date: '2025-06-01', depth_m: 5.10 },
    { date: '2025-07-01', depth_m: 4.15 },
    { date: '2025-08-01', depth_m: 3.05 },
    { date: '2025-09-01', depth_m: 2.55 },
    { date: '2025-10-01', depth_m: 2.30 },
    { date: '2025-10-15', depth_m: 2.25 },
  ],
});
```

Returns:

```json
{
  "method": "regional_seasonal",
  "rationale": "These readings show 1.18 m of movement. Applying the regional seasonal shape...",
  "depth_forecast_m": 3.83,
  "interval_lower_m": 2.32,
  "interval_upper_m": 5.35,
  "confidence_pct": 90,
  "c_buffer_forecast": 39.0,
  "c_buffer_worst_case": 89.3,
  "advisory": "Forecast crosses the pit-latrine safety line. Schedule a water test and pre-position ORS."
}
```

Display all four:
1. The forecast **with its interval** — never a bare number
2. `rationale` verbatim — the model explains its own reasoning, use it
3. `advisory` as the headline
4. `c_buffer_worst_case` next to `c_buffer_forecast`

That last pair matters: the point estimate (39) says "fine," the worst case (89) says "act." The advisory fires on the worst case because acting on the plausible worst case is the correct public-health posture.

### 6. Alerts list (`app/alerts.tsx`)

`GET /alerts` → state, station, margin, a plain-language explanation, and an `actions` array. Render actions as a checklist. No business logic needed client-side — the API already decided.

---

## Backend — the API

The groundwater router is done and needs nothing further. Three stubs remain.

### 1. `POST /sources/vwsi/evaluate`

Called after every app sync. Port from the reference implementation into `app/api/v1/sources.py`:

```python
from app.engines.aquifer_engine import AquiferEngine
from app.engines import vwsi_engine as vwsi

engine = AquiferEngine()

@router.post("/vwsi/evaluate")
def evaluate(report: HealthReport):
    s = engine.get(report.source_id)
    if s is None:
        raise HTTPException(404, f"unknown source: {report.source_id}")

    result = vwsi.evaluate(
        s["depth_now_m"],
        faecal_presence=report.faecal_presence,
        days_since_test=report.days_since_test,
        observed_cases=report.observed_cases,
        baseline_mean=report.baseline_mean,
        baseline_sd=report.baseline_sd,
        days_to_critical=engine.days_to_critical(report.source_id),
        trend=s.get("trend"),
        vulnerability_measured=s.get("vulnerability_measured"),
        rainfall_72h_mm=report.rainfall_72h_mm,
        flood_flag=report.flood_flag,
        sensor_ok=(s.get("sensor") != "UNUSABLE"),
    )
    result["station"] = report.source_id
    return result
```

`vwsi.evaluate()` returns `state`, `C`, `H`, `A`, `buffer_margin_m`, a plain-language `explanation`, and an `actions` list. The frontend renders it directly.

### 2. `GET /alerts`

Everything not GREEN, ordered by severity. Loop `engine.list_stations()`, call `vwsi.evaluate()` on each, filter, sort by `{RED:0, AMBER_C:1, AMBER_A:2, WATCH:3, NO_DATA:4}`.

### 3. `POST /sync`

Accepts a batch of queued reports from the app.
- Deduplicate on a client-generated UUID — the phone will retry, duplicates will happen. Not optional.
- Return the updated state for every affected source so the app can refresh in one round trip.
- Accept a partial batch: if 3 of 10 fail, commit the 7 and return which failed.

### 4. Database — only if time allows

Skip this for the prototype. The model serves from precomputed artifacts in-memory and doesn't need a database. A working demo without persistence beats a half-finished migration.

If there's spare time, the minimum tables are: `water_source`, `health_report`, `water_test`, `response_task`.

---

## The one thing that must work on demo day

1. Open the app in airplane mode
2. Log 3 diarrhoea cases against a water source
3. Photograph a test vial
4. Enter a rope reading
5. Show "3 pending" in the header
6. Turn the network on → queue drains → alert appears
7. Open the map → that source is red
8. Tap it → `buffer_margin_m: -0.35`, water table above the latrine floor

Rehearse this end to end at least three times before the day. Every demo failure in history was something that worked on someone else's machine.

Keep the standalone console HTML on a USB stick as backup — no server, no internet, double-click and it works.

---

## Endpoint reference

All prefixed `/api/v1`.

| Method | Path | Returns |
|---|---|---|
| GET | `/groundwater/stations` | 15 stations: lat/lon, depth, margin, flag, vulnerability |
| GET | `/groundwater/{station}/forecast?horizon_days=60` | Forecast + 90% interval + method + rationale |
| GET | `/groundwater/{station}/series?limit=180` | Daily depth series for charts |
| GET | `/groundwater/sensor-health` | Which DWLR sensors to distrust |
| GET | `/groundwater/vulnerability` | Measured rainfall-response lag per aquifer |
| POST | `/groundwater/ungauged/forecast` | Forecast a village with no sensor |
| GET | `/groundwater/model/card` | Capabilities and limitations, as data |
| POST | `/sources/vwsi/evaluate` | 🔴 to build — full health evaluation |
| GET | `/alerts` | 🔴 to build — ops queue |
| POST | `/sync` | 🔴 to build — batch upload from the app |

---

## Model numbers (for UI use, if needed)

| Metric | Value |
|---|---|
| Feed rejected by QC | 12.5% |
| LOSO skill, 60 / 90 days | +18.4% / +23.6% |
| Prediction-interval coverage | 89.0% against a 90% target |
| Aquifers with significant rainfall response | 7 of 14 tested |

All reproduced by the public Kaggle notebook: https://www.kaggle.com/code/rishighosaltest/sih-model-v2

---

## Cut list — do not build these

Every hour here is an hour not spent on the demo.

- Authentication beyond a hardcoded role toggle
- Real-time websockets
- Push notifications
- Blockchain, in any form, for any reason
- A chatbot
- Offline map tiles in the app — `react-native-maps` uses the OS map layer already
- Full database migrations, unless the demo path is finished first
- Any screen not in the demo sequence above

Build one screen that works completely rather than five that half-work.

---

## Priority order

If time is short, in this order:

1. `.env` → backend boots → `/docs` shows groundwater
2. `lib/api.ts` → app can reach the API
3. Map screen with real markers
4. Offline queue with the pending badge
5. `POST /sources/vwsi/evaluate` on the backend
6. Report screen
7. Ungauged village screen
8. Alerts list
9. Everything else

Stop wherever you run out of time. Items 1–4 alone are a credible demo.

