export type DashboardMetricEntry = {
  totalLikes: number;
  totalComments: number;
  postCount: number;
};

export type InstagramDashboardResponse = {
  byHour: (DashboardMetricEntry & { hour: number })[];
  byWeekday: (DashboardMetricEntry & { weekday: number })[];
  byMonth: (DashboardMetricEntry & { month: string })[];
  commentsByHour: { hour: number; commentCount: number }[];
  topCommenters: { username: string; commentCount: number }[];
};
