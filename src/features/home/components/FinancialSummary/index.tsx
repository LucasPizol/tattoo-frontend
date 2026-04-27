import { Card } from "@/components/ui/Card";
import { Loading } from "@/components/ui/Loading";
import type { FinancialSummaryData } from "../../types";
import { MdTrendingUp } from "react-icons/md";
import { Link } from "react-router-dom";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
  XAxis,
} from "recharts";
import styles from "./styles.module.scss";

type FinancialSummaryProps = {
  data: FinancialSummaryData | undefined;
  isLoading: boolean;
};

export const FinancialSummary = ({ data, isLoading }: FinancialSummaryProps) => {
  const chartData = data?.evolution.map((point) => ({
    day: point.day,
    value: point.value / 100,
  })) ?? [];

  return (
    <Card
      className={styles.cardRoot}
      contentClassName={styles.cardContent}
      title="Resumo financeiro (mês)"
      icon={<MdTrendingUp />}
      actions={
        <Link to="/relatorios" className={styles.headerLink}>
          Ver financeiro →
        </Link>
      }
    >
      {isLoading ? (
        <div className={styles.loadingContainer}>
          <Loading size={24} />
        </div>
      ) : !data ? (
        <p className={styles.empty}>Sem dados financeiros.</p>
      ) : (
        <div className={styles.inner}>
          <div className={styles.metrics}>
            <div className={styles.metric}>
              <span className={styles.metricLabel}>Faturamento</span>
              <span className={styles.metricValue}>{data.revenue.formatted}</span>
            </div>
            <div className={styles.metric}>
              <span className={styles.metricLabel}>Despesas</span>
              <span className={`${styles.metricValue} ${styles.expense}`}>
                {data.expenses.formatted}
              </span>
            </div>
            <div className={styles.metric}>
              <span className={styles.metricLabel}>Lucro líquido</span>
              <span className={`${styles.metricValue} ${styles.profit}`}>
                {data.profit.formatted}
              </span>
            </div>
          </div>

          {chartData.length > 1 && (
            <div className={styles.chartWrapper}>
              <ResponsiveContainer width="100%" height={80}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="homeChartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#D4AF37" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#D4AF37" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 10, fill: "var(--text-tertiary)" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    formatter={(value) =>
                      new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(Number(value ?? 0))
                    }
                    contentStyle={{
                      background: "var(--parchment-raised)",
                      border: "1px solid var(--border)",
                      borderRadius: 6,
                      color: "var(--text-primary)",
                      fontSize: 12,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#D4AF37"
                    strokeWidth={2}
                    fill="url(#homeChartGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};
