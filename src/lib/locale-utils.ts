export function readPath(source: Record<string, unknown>, path: string): string | undefined {
  const value = path.split('.').reduce((current: Record<string, unknown> | undefined, key) => current?.[key] as Record<string, unknown> | undefined, source);
  return typeof value === 'string' ? value : undefined;
}
