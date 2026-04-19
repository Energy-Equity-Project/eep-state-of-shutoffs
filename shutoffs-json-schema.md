# `shutoffs.json` — Payload Reference

**Public URL:** `https://eep-state-of-shutoffs-s3.s3.us-east-2.amazonaws.com/2024/shutoffs.json`

This document describes every key in the JSON object served to the `eep-state-of-shutoffs` frontend. The payload has six top-level keys.

---

## Top-level envelope

```json
{
  "generated_at": "2026-04-17T16:18:49.239659+00:00",
  "source_file": "16-04-2026-eia-112-shutoffs.csv",
  "year": 2024,
  "records": [...],
  "aggregates": {...},
  "cost_metrics": {...},
  "household_metrics": {...}
}
```

| Key | Type | Description |
|-----|------|-------------|
| `generated_at` | ISO 8601 string (UTC) | Timestamp when the pipeline last ran |
| `source_file` | string | Filename of the EIA-112 shutoff CSV that produced `records` and `aggregates` |
| `year` | integer | Reporting year (currently 2024) |
| `records` | array | Raw monthly shutoff data — one entry per state × month |
| `aggregates` | object | Pre-computed summaries: state annual totals, national monthly totals, rankings |
| `cost_metrics` | object | Average monthly utility cost estimates per state × year (2020–2024) with 2020→2024 change calculations |
| `household_metrics` | object | ACS-derived occupied housing unit counts per state, used as the denominator for the shutoff pipeline |

---

## `records`

One entry per state per month. 612 entries total (51 states × 12 months).

```json
{
  "state": "Alabama",
  "year": 2024,
  "month": 1,
  "electric_shutoff_notices": 145028,
  "electric_shutoffs": 26000,
  "electric_customers": 2384730,
  "electric_monthly_shutoff_rate": 0.0109,
  "gas_shutoff_notices": 70940,
  "gas_shutoffs": 6775,
  "gas_customers": 807384,
  "gas_monthly_shutoff_rate": 0.0084
}
```

| Field | Type | Description |
|-------|------|-------------|
| `state` | string | Full state name |
| `year` | integer | Reporting year |
| `month` | integer | Month (1–12) |
| `electric_shutoff_notices` | integer \| null | Number of shutoff notices issued to residential electric customers |
| `electric_shutoffs` | integer \| null | Number of residential electric accounts actually disconnected |
| `electric_customers` | integer \| null | Total residential electric customers (denominator for rate) |
| `electric_monthly_shutoff_rate` | float \| null | `electric_shutoffs / electric_customers` for that month |
| `gas_shutoff_notices` | integer \| null | Number of shutoff notices issued to residential gas customers |
| `gas_shutoffs` | integer \| null | Number of residential gas accounts actually disconnected |
| `gas_customers` | integer \| null | Total residential gas customers |
| `gas_monthly_shutoff_rate` | float \| null | `gas_shutoffs / gas_customers` for that month |
| `electric_reconnections` | integer \| null | Number of residential electric accounts reconnected that month |
| `electric_net_shutoffs` | integer \| null | `electric_shutoffs - electric_reconnections` for that month |
| `gas_reconnections` | integer \| null | Number of residential gas accounts reconnected that month |
| `gas_net_shutoffs` | integer \| null | `gas_shutoffs - gas_reconnections` for that month |

Null values occur where a state did not report data for that month or utility type.

---

## `aggregates`

Four sub-keys, all pre-computed from `records`. Use these instead of aggregating `records` yourself.

### `aggregates.state_annual`

One entry per state (51 entries). Annual rollup of shutoff activity.

```json
{
  "state": "Alabama",
  "electric_shutoff_notices_total": 1830067,
  "electric_shutoffs_total": 454814,
  "electric_avg_customers": 2398847.42,
  "electric_annual_shutoff_rate": 0.1896,
  "gas_shutoff_notices_total": 628173,
  "gas_shutoffs_total": 80654,
  "gas_avg_customers": 802419.0,
  "gas_annual_shutoff_rate": 0.1005
}
```

| Field | Type | Description |
|-------|------|-------------|
| `state` | string | Full state name |
| `electric_shutoff_notices_total` | integer \| null | Sum of monthly electric shutoff notices across all 12 months |
| `electric_shutoffs_total` | integer \| null | Sum of monthly electric shutoffs across all 12 months |
| `electric_avg_customers` | float \| null | Average monthly residential electric customer count |
| `electric_annual_shutoff_rate` | float \| null | `electric_shutoffs_total / electric_avg_customers` — annual share of customers shut off |
| `gas_shutoff_notices_total` | integer \| null | Sum of monthly gas shutoff notices |
| `gas_shutoffs_total` | integer \| null | Sum of monthly gas shutoffs |
| `gas_avg_customers` | float \| null | Average monthly residential gas customer count |
| `gas_annual_shutoff_rate` | float \| null | `gas_shutoffs_total / gas_avg_customers` |
| `electric_reconnections_total` | integer \| null | Sum of monthly electric reconnections across all 12 months |
| `electric_net_shutoffs_total` | integer \| null | `electric_shutoffs_total - electric_reconnections_total` |
| `gas_reconnections_total` | integer \| null | Sum of monthly gas reconnections across all 12 months |
| `gas_net_shutoffs_total` | integer \| null | `gas_shutoffs_total - gas_reconnections_total` |

### `aggregates.national_monthly`

One entry per month (12 entries). National totals summed across all reporting states.

```json
{
  "month": 1,
  "electric_shutoffs_total": 977487,
  "electric_customers_total": 142357851,
  "electric_national_shutoff_rate": 0.006866,
  "gas_shutoffs_total": 74597,
  "gas_customers_total": 73945545,
  "gas_national_shutoff_rate": 0.001009
}
```

| Field | Type | Description |
|-------|------|-------------|
| `month` | integer | Month (1–12) |
| `electric_shutoffs_total` | integer \| null | National electric shutoffs in that month |
| `electric_customers_total` | integer \| null | Sum of all state electric customer counts in that month |
| `electric_national_shutoff_rate` | float \| null | `electric_shutoffs_total / electric_customers_total` |
| `gas_shutoffs_total` | integer \| null | National gas shutoffs in that month |
| `gas_customers_total` | integer \| null | Sum of all state gas customer counts in that month |
| `gas_national_shutoff_rate` | float \| null | `gas_shutoffs_total / gas_customers_total` |
| `electric_reconnections_total` | integer \| null | National electric reconnections in that month |
| `electric_net_shutoffs_total` | integer \| null | `electric_shutoffs_total - electric_reconnections_total` for that month |
| `gas_reconnections_total` | integer \| null | National gas reconnections in that month |
| `gas_net_shutoffs_total` | integer \| null | `gas_shutoffs_total - gas_reconnections_total` for that month |

### `aggregates.national_totals`

Single object with full-year national figures.

```json
{
  "electric_shutoffs_total": 13446051,
  "electric_shutoff_notices_total": 88557619,
  "gas_shutoffs_total": 1515849,
  "gas_shutoff_notices_total": 27032261,
  "avg_electric_customers": 2804587.97,
  "avg_gas_customers": 1450982.37
}
```

| Field | Type | Description |
|-------|------|-------------|
| `electric_shutoffs_total` | integer \| null | National residential electric shutoffs for the full year |
| `electric_shutoff_notices_total` | integer \| null | National electric shutoff notices for the full year |
| `gas_shutoffs_total` | integer \| null | National residential gas shutoffs for the full year |
| `gas_shutoff_notices_total` | integer \| null | National gas shutoff notices for the full year |
| `avg_electric_customers` | float \| null | Average number of residential electric customers across all state-months |
| `avg_gas_customers` | float \| null | Average number of residential gas customers across all state-months |
| `electric_reconnections_total` | integer \| null | National electric reconnections for the full year |
| `electric_net_shutoffs_total` | integer \| null | `electric_shutoffs_total - electric_reconnections_total` |
| `gas_reconnections_total` | integer \| null | National gas reconnections for the full year |
| `gas_net_shutoffs_total` | integer \| null | `gas_shutoffs_total - gas_reconnections_total` |

### `aggregates.state_rankings`

Two ordered arrays of state names, sorted descending by annual shutoff rate. States without enough data to compute a rate are excluded.

```json
{
  "electric_annual_shutoff_rate_desc": ["Oklahoma", "Texas", "Florida", ...],
  "gas_annual_shutoff_rate_desc": ["...", ...]
}
```

| Field | Type | Description |
|-------|------|-------------|
| `electric_annual_shutoff_rate_desc` | string[] | State names ordered from highest to lowest electric annual shutoff rate |
| `gas_annual_shutoff_rate_desc` | string[] | State names ordered from highest to lowest gas annual shutoff rate |

The index position (0-based) is the rank. Use this array to render a ranked table or choropleth without re-sorting.

---

## `cost_metrics`

Average monthly residential utility costs by state and year, derived from EIA-861 (electric) and EIA-176 (gas). Covers 2020–2024 so the frontend can show both current costs and cost growth over time alongside shutoff data.

### Envelope

```json
{
  "source_files": {
    "electric": "14-02-2026-eia-861-sales.csv",
    "gas": "15-04-2026-eia-176-residential-natural-gas.csv"
  },
  "year_range": [2020, 2024],
  "state_annual_costs": [...],
  "cost_changes_2020_to_2024": [...]
}
```

| Field | Type | Description |
|-------|------|-------------|
| `source_files.electric` | string | EIA-861 filename that produced the electric cost estimates |
| `source_files.gas` | string | EIA-176 filename that produced the gas cost estimates |
| `year_range` | [integer, integer] | Inclusive start/end years covered in `state_annual_costs` |
| `state_annual_costs` | array | One entry per state × year — 255 entries (51 states × 5 years) |
| `cost_changes_2020_to_2024` | array | One entry per state — 51 entries — with percent and dollar change from 2020 to 2024 |

### `cost_metrics.state_annual_costs`

255 entries sorted by state name then year ascending. Use this to plot cost trends over time per state.

```json
{
  "state": "Alabama",
  "year": 2020,
  "avg_monthly_electric_cost": 144.52,
  "avg_monthly_gas_cost": 48.36,
  "avg_monthly_total_utility_cost": 192.88,
  "gas_data_available": true
}
```

| Field | Type | Description |
|-------|------|-------------|
| `state` | string | Full state name |
| `year` | integer | Year (2020–2024) |
| `avg_monthly_electric_cost` | float \| null | Average monthly residential electric bill in dollars. Customer-weighted from EIA-861: `(sum residential revenue) / (sum residential customers) / 12` |
| `avg_monthly_gas_cost` | float \| null | Average monthly residential natural gas bill in dollars. Taken directly from EIA-176 pre-computed field |
| `avg_monthly_total_utility_cost` | float \| null | `electric + gas` when both are available; `electric` only when `gas_data_available` is false |
| `gas_data_available` | boolean | Whether EIA-176 reported gas cost data for this state and year. False means `avg_monthly_gas_cost` is null and `avg_monthly_total_utility_cost` reflects electricity only |

### `cost_metrics.cost_changes_2020_to_2024`

51 entries (one per state, sorted alphabetically). Use this for "bills have grown X% since 2020" callouts or a ranked view of cost growth.

```json
{
  "state": "Alabama",
  "electric_pct_change": 20.59,
  "electric_dollar_change": 29.76,
  "gas_pct_change": 18.44,
  "gas_dollar_change": 8.92,
  "total_pct_change": 20.05,
  "total_dollar_change": 38.68,
  "gas_data_available": true
}
```

| Field | Type | Description |
|-------|------|-------------|
| `state` | string | Full state name |
| `electric_pct_change` | float \| null | `(cost_2024 - cost_2020) / cost_2020 × 100`. Null if 2020 or 2024 data is missing |
| `electric_dollar_change` | float \| null | `cost_2024 - cost_2020` in dollars |
| `gas_pct_change` | float \| null | Same formula for gas. Null if gas data is unavailable for 2020 or 2024 |
| `gas_dollar_change` | float \| null | Dollar change in average monthly gas bill |
| `total_pct_change` | float \| null | Percent change in combined electric + gas total bill |
| `total_dollar_change` | float \| null | Dollar change in combined electric + gas total bill |
| `gas_data_available` | boolean | Whether gas cost data existed for this state in the end year (2024). Mirrors the flag in `state_annual_costs` |

---

## `household_metrics`

ACS (American Community Survey) occupied housing unit counts per state, used as the Stage 01 "Households" denominator in the shutoff pipeline visualization.

### Envelope

```json
{
  "source_file": "...",
  "year": 2023,
  "survey": "ACS 1-Year",
  "variable": "B25001_001E",
  "state_households": [...]
}
```

| Field | Type | Description |
|-------|------|-------------|
| `source_file` | string | Source filename for the ACS pull |
| `year` | integer | ACS survey year |
| `survey` | string | ACS survey variant (e.g. "ACS 1-Year") |
| `variable` | string | Census variable code for occupied housing units |
| `state_households` | array | One entry per state (51 entries) |

### `household_metrics.state_households`

```json
{
  "state": "Michigan",
  "households": 4130000,
  "moe": 12500
}
```

| Field | Type | Description |
|-------|------|-------------|
| `state` | string | Full state name |
| `households` | integer | Estimated number of occupied housing units |
| `moe` | integer | Margin of error at 90% confidence level |

---

## Null handling

Several fields can be null. This happens when:
- A state did not report data for a given month (EIA-112 reporting is voluntary for some utilities)
- A state has no residential piped-gas customers (affects gas fields)
- A state is missing from EIA-861 or EIA-176 for a specific year (affects cost change fields)

The frontend should treat null as "data not available" and render accordingly (e.g., "N/A" in tables, excluded from ranked lists).

---

## Common access patterns

**Show a state's full year shutoff summary:**
```
aggregates.state_annual  →  filter by state
```

**Show national monthly trend chart:**
```
aggregates.national_monthly  →  all 12 entries, ordered by month
```

**Show top 10 states by shutoff rate:**
```
aggregates.state_rankings.electric_annual_shutoff_rate_desc  →  first 10 entries
```

**Show a state's average utility bill over time (line chart):**
```
cost_metrics.state_annual_costs  →  filter by state, order by year
```

**Show "bills are X% higher than in 2020" callout for a state:**
```
cost_metrics.cost_changes_2020_to_2024  →  filter by state  →  electric_pct_change / total_pct_change
```

**Join shutoff rate with utility costs for a scatter plot:**
```
aggregates.state_annual (electric_annual_shutoff_rate)
  + cost_metrics.cost_changes_2020_to_2024 (total_pct_change)
  →  join on state name
```
