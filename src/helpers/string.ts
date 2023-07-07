export const parseIntOrUndefined = (str: string): number => {
  const res = parseInt(str, 10);
  return res || res === 0 ? res : undefined;
};

export const parseIntOrDefault = (envString: string, defaultValue: number): number => {
  const parsed = parseIntOrUndefined(envString);
  return typeof parsed !== 'undefined' ? parsed : defaultValue;
};
