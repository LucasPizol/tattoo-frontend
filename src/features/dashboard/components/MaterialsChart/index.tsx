import { Card } from "@/components/ui/Card";
import { Loading } from "@/components/ui/Loading";
import type { MaterialsResponse } from "@/services/requests/dashboard/types";
import { MdPieChart } from "react-icons/md";
import {
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
} from "recharts";
import styles from "./styles.module.scss";

interface CategoriesChartProps {
  data?: MaterialsResponse;
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
  "#e2e8f0",
];

export const CategoriesChart = ({ data, isLoading }: CategoriesChartProps) => {
  const chartData = data?.materials
    ? Object.entries(data.materials).map(([name, value]) => ({
        name,
        value,
      }))
    : [];

  if (isLoading) {
    return (
      <Card title="Categorias" icon={<MdPieChart />} className={styles.card}>
        <div className={styles.loading}>
          <Loading size={48} />
        </div>
      </Card>
    );
  }

  if (!chartData.length) {
    return (
      <Card title="Categorias" icon={<MdPieChart />} className={styles.card}>
        <div className={styles.empty}>Nenhum dado encontrado</div>
      </Card>
    );
  }

  return (
    <Card title="Materiais" icon={<MdPieChart />} className={styles.card}>
      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name} ${((percent || 0) * 100).toFixed(0)}%`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
