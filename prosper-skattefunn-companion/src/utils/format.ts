import { format, parseISO } from 'date-fns';

export function formatDate(isoDate: string): string {
  try {
    return format(parseISO(isoDate), 'yyyy-MM-dd');
  } catch {
    return isoDate;
  }
}

export function formatDateTime(isoDateTime: string): string {
  try {
    return format(parseISO(isoDateTime), 'yyyy-MM-dd HH:mm');
  } catch {
    return isoDateTime;
  }
}

export function formatPercent(value: number, fractionDigits = 0): string {
  return `${(value * 100).toFixed(fractionDigits)}%`;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}