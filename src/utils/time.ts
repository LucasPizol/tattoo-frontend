export const Time = {
  minutes: (minutes: number) => {
    return minutes * 60 * 1000;
  },
  hours: (hours: number) => {
    return hours * 60 * 60 * 1000;
  },
  days: (days: number) => {
    return days * 24 * 60 * 60 * 1000;
  },
  weeks: (weeks: number) => {
    return weeks * 7 * 24 * 60 * 60 * 1000;
  },
  months: (months: number) => {
    return months * 30 * 24 * 60 * 60 * 1000;
  },
  years: (years: number) => {
    return years * 365 * 24 * 60 * 60 * 1000;
  },
};
