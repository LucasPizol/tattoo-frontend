import { Loading } from "@/components/ui/Loading";
import type { ValuesEvolutionResponse } from "@/services/requests/dashboard/types";
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import styles from "./styles.module.scss";

interface ValuesEvolutionChartProps {
  data?: ValuesEvolutionResponse;
  isLoading: boolean;
}

const COLORS = [
  "#40184d",
  "#faac60",
  "#e53e3e",
  "#38a169",
  "#3182ce",
  "#805ad5",
  "#d69e2e",
  "#a0aec0",
];

export const ValuesEvolutionChart = ({
  data,
  isLoading,
}: ValuesEvolutionChartProps) => {
  const users = Object.keys(data?.usersEvolution || {});

  const chartData = data?.valuesEvolution
    ? Object.entries(data.valuesEvolution)
        .map(([date, totalValue]) => {
          const objectData: Record<string, any> = {
            month: formatMonth(date),
            total: totalValue,
            fullDate: date,
          };

          users.forEach((user) => {
            objectData[user as unknown as keyof typeof objectData] =
              data?.usersEvolution?.[user]?.[date] || 0;
          });

          return objectData;
        })
        .sort((a, b) => a.fullDate.localeCompare(b.fullDate))
    : [];

  function formatMonth(dateString: string) {
    const [year, month] = dateString.split("-");
    const monthNames = [
      "Jan",
      "Fev",
      "Mar",
      "Abr",
      "Mai",
      "Jun",
      "Jul",
      "Ago",
      "Set",
      "Out",
      "Nov",
      "Dez",
    ];
    return `${monthNames[parseInt(month) - 1]}/${year}`;
  }

  function formatCurrency(value: number) {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <Loading size={48} />
      </div>
    );
  }

  if (!chartData.length) {
    return <div className={styles.empty}>Nenhum dado encontrado</div>;
  }

  return (
    <div className={styles.chartContainer}>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} tickFormatter={formatCurrency} />
          <Tooltip
            formatter={(
              value: number | undefined,
              name: string | undefined
            ) => {
              if (!value || !name) return ["", ""];

              return [
                formatCurrency(value),
                name === "Total" ? "Faturamento Total" : name,
              ];
            }}
            labelStyle={{ color: "#333" }}
          />
          <Line
            type="monotone"
            dataKey="total"
            name="Total"
            stroke={COLORS[COLORS.length - 1]}
            strokeWidth={3}
            dot={{ fill: COLORS[COLORS.length - 1], strokeWidth: 2, r: 4 }}
            activeDot={{
              r: 6,
              stroke: COLORS[COLORS.length - 1],
              strokeWidth: 2,
            }}
          />

          {Object.keys(data?.usersEvolution || {}).map((user) => (
            <Line
              key={user}
              type="monotone"
              dataKey={user}
              name={user}
              stroke={
                COLORS[
                  Object.keys(data?.usersEvolution || {}).indexOf(user) %
                    COLORS.length
                ]
              }
              strokeWidth={2}
              dot={{
                fill: COLORS[
                  Object.keys(data?.usersEvolution || {}).indexOf(user) %
                    COLORS.length
                ],
                strokeWidth: 2,
                r: 3,
              }}
              activeDot={{
                r: 5,
                stroke:
                  COLORS[
                    Object.keys(data?.usersEvolution || {}).indexOf(user) %
                      COLORS.length
                  ],
                strokeWidth: 2,
              }}
              strokeDasharray="5 5"
            />
          ))}
          <Legend />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
