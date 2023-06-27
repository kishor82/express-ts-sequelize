export const timeElapsed = (dateFrom: Date, dateTo: Date = new Date()): number => {
  return (dateTo.getTime() - dateFrom.getTime()) / 1000;
};
