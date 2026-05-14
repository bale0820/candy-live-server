export const toCamel = <T>(obj: Record<string, any>) : T => {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      key.replace(/_([a-z])/g, (_, c) => c.toUpperCase()),
      value
    ])
  ) as T;
};