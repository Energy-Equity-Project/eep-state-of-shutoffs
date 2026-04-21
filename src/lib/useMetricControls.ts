import { useState, useEffect, useCallback } from 'react';
import type { MetricControls, Fuel, Metric, Unit } from './national-constants';

const DEFAULT: MetricControls = { fuel: 'electric', metric: 'shutoffs', unit: 'rate' };
const SESSION_KEY = 'eep.metricControls';

const VALID_FUELS: readonly Fuel[] = ['electric', 'gas', 'combined'];
const VALID_METRICS: readonly Metric[] = ['shutoffs', 'finalNotices', 'reconnections'];
const VALID_UNITS: readonly Unit[] = ['rate', 'count'];

function parseControls(obj: unknown): MetricControls {
  if (!obj || typeof obj !== 'object') return DEFAULT;
  const o = obj as Record<string, unknown>;
  const fuel = (VALID_FUELS as readonly string[]).includes(o.fuel as string)
    ? (o.fuel as Fuel)
    : DEFAULT.fuel;
  const metric = (VALID_METRICS as readonly string[]).includes(o.metric as string)
    ? (o.metric as Metric)
    : DEFAULT.metric;
  const unit = (VALID_UNITS as readonly string[]).includes(o.unit as string)
    ? (o.unit as Unit)
    : DEFAULT.unit;
  return { fuel, metric, unit };
}

function readFromSession(): MetricControls {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (raw) return parseControls(JSON.parse(raw));
  } catch {}
  return DEFAULT;
}

function readFromUrl(): Partial<MetricControls> {
  try {
    const params = new URLSearchParams(window.location.search);
    const result: Partial<MetricControls> = {};
    const fuel = params.get('fuel');
    const metric = params.get('metric');
    const unit = params.get('unit');
    if (fuel && (VALID_FUELS as readonly string[]).includes(fuel)) result.fuel = fuel as Fuel;
    if (metric && (VALID_METRICS as readonly string[]).includes(metric)) result.metric = metric as Metric;
    if (unit && (VALID_UNITS as readonly string[]).includes(unit)) result.unit = unit as Unit;
    return result;
  } catch {
    return {};
  }
}

export function useMetricControls() {
  const [controls, setControls] = useState<MetricControls>(DEFAULT);

  useEffect(() => {
    const merged = { ...readFromSession(), ...readFromUrl() };
    setControls(parseControls(merged));
  }, []);

  const onChange = useCallback((next: MetricControls) => {
    setControls(next);
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(next));
      const params = new URLSearchParams(window.location.search);
      params.set('fuel', next.fuel);
      params.set('metric', next.metric);
      params.set('unit', next.unit);
      window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`);
    } catch {}
  }, []);

  return { controls, onChange };
}
