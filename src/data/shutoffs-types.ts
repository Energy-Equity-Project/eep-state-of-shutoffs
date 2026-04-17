export interface ShutoffRecord {
  state: string;
  year: number;
  month: number;
  electric_shutoff_notices: number | null;
  electric_shutoffs: number | null;
  electric_customers: number | null;
  electric_monthly_shutoff_rate: number;
  gas_shutoff_notices: number | null;
  gas_shutoffs: number | null;
  gas_customers: number | null;
  gas_monthly_shutoff_rate: number;
}

export interface StateAnnual {
  state: string;
  electric_shutoff_notices_total: number;
  electric_shutoffs_total: number;
  electric_avg_customers: number;
  electric_annual_shutoff_rate: number;
  gas_shutoff_notices_total: number;
  gas_shutoffs_total: number;
  gas_avg_customers: number;
  gas_annual_shutoff_rate: number;
}

export interface NationalMonthly {
  month: number;
  electric_shutoffs_total: number;
  electric_customers_total: number;
  electric_national_shutoff_rate: number;
  gas_shutoffs_total: number;
  gas_customers_total: number;
  gas_national_shutoff_rate: number;
}

export interface StateRankings {
  electric_annual_shutoff_rate_desc: string[];
  gas_annual_shutoff_rate_desc: string[];
}

export interface NationalTotals {
  electric_shutoffs_total: number;
  electric_shutoff_notices_total: number;
  gas_shutoffs_total: number;
  gas_shutoff_notices_total: number;
  avg_electric_customers: number;
  avg_gas_customers: number;
}

export interface CostAnnual {
  state: string;
  year: number;
  avg_monthly_electric_cost: number | null;
  avg_monthly_gas_cost: number | null;
  avg_monthly_total_utility_cost: number | null;
  gas_data_available: boolean;
}

export interface CostChange {
  state: string;
  electric_pct_change: number | null;
  electric_dollar_change: number | null;
  gas_pct_change: number | null;
  gas_dollar_change: number | null;
  total_pct_change: number | null;
  total_dollar_change: number | null;
  gas_data_available: boolean;
}

export interface CostMetrics {
  source_files: { electric: string; gas: string };
  year_range: [number, number];
  state_annual_costs: CostAnnual[];
  cost_changes_2020_to_2024: CostChange[];
}

export interface ShutoffsData {
  generated_at: string;
  source_file: string;
  year: number;
  records: ShutoffRecord[];
  aggregates: {
    state_annual: StateAnnual[];
    national_monthly: NationalMonthly[];
    state_rankings: StateRankings;
    national_totals: NationalTotals;
  };
  cost_metrics: CostMetrics;
}
