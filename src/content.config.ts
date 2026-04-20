import { defineCollection, z } from 'astro:content';

const flagSchema = z.union([z.literal('Q'), z.literal('R'), z.null()]);

export const shutoffsSchema = z.object({
  state: z.string(),
  year: z.number(),
  month: z.number(),
  electric_shutoff_notices: z.number().nullable(),
  electric_shutoff_notices_flag: flagSchema,
  electric_shutoffs: z.number().nullable(),
  electric_shutoffs_flag: flagSchema,
  electric_customers: z.number(),
  electric_monthly_shutoff_rate: z.number(),
  gas_shutoff_notices: z.number().nullable(),
  gas_shutoff_notices_flag: flagSchema,
  gas_shutoffs: z.number().nullable(),
  gas_shutoffs_flag: flagSchema,
  gas_customers: z.number(),
  gas_monthly_shutoff_rate: z.number(),
  electric_reconnections: z.number().nullable(),
  electric_reconnections_flag: flagSchema,
  electric_net_shutoffs: z.number().nullable(),
  gas_reconnections: z.number().nullable(),
  gas_reconnections_flag: flagSchema,
  gas_net_shutoffs: z.number().nullable(),
});

const shutoffs = defineCollection({
  loader: async () => {
    const res = await fetch(
      'https://eep-state-of-shutoffs-s3.s3.us-east-2.amazonaws.com/2024/shutoffs.json'
    );
    if (!res.ok) throw new Error(`Failed to fetch shutoffs data: ${res.status} ${res.statusText}`);
    const { records }: { records: any[] } = await res.json();
    return records.map((r) => ({ id: `${r.state}-${r.year}-${r.month}`, ...r }));
  },
  schema: shutoffsSchema,
});

export const collections = { shutoffs };
