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
}
