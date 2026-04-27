export type MoneyValue = {
  value: number;
  currency: string;
  formatted: string;
};

export type HomeStats = {
  todayAppointments: number;
  activeClients: number;
  monthlyRevenue: MoneyValue;
  pendingOrders: number;
};

export type ScheduleItem = {
  id: number;
  startAt: string;
  clientName: string;
  title: string;
  description: string;
  artistName: string | null;
  status: "pending" | "completed" | "canceled";
};

export type RecentOrder = {
  id: number;
  clientName: string | null;
  totalValue: MoneyValue;
  status: string;
  createdAt: string;
};

export type LowStockProduct = {
  id: number;
  name: string;
  sku: string;
  quantity: number;
};

export type FinancialEvolutionPoint = {
  day: string;
  value: number;
};

export type FinancialSummaryData = {
  revenue: MoneyValue;
  expenses: MoneyValue;
  profit: MoneyValue;
  evolution: FinancialEvolutionPoint[];
};

export type BirthdayClient = {
  id: number;
  name: string;
  birthDate: string;
  day: number;
};

export type HomeDashboardResponse = {
  stats: HomeStats;
  todaySchedule: ScheduleItem[];
  recentOrders: RecentOrder[];
  lowStockProducts: LowStockProduct[];
  financialSummary: FinancialSummaryData;
  birthdays: BirthdayClient[];
};
