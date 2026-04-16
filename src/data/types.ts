export interface ShutoffRecord {
  state: string;
  year: number;
  month: number;
  electric_shutoff_notices: number;
  electric_shutoffs: number;
  electric_customers: number;
  electric_monthly_shutoff_rate: number;
  gas_shutoff_notices: number;
  gas_shutoffs: number;
  gas_customers: number;
  gas_monthly_shutoff_rate: number;
}

export type Shutoffs = ShutoffRecord[];
