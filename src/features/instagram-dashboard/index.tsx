import { PageWrapper } from "@/components/PageWrapper";
import { Card } from "@/components/ui/Card";
import { Loading } from "@/components/ui/Loading";
import {
  MdCameraAlt,
  MdComment,
  MdFavorite,
  MdPeople,
} from "react-icons/md";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useInstagramDashboard } from "./http/queries/useInstagramDashboard";
import styles from "./styles.module.scss";

const WEEKDAY_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const formatMonth = (month: string) => {
  const [year, m] = month.split("-");
  const date = new Date(Number(year), Number(m) - 1);
  return date.toLocaleDateString("pt-BR", { month: "short", year: "numeric" });
};

type StatCardProps = {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
};

const StatCard = ({ label, value, icon, iconBg, iconColor }: StatCardProps) => (
  <div className={styles.statCard}>
    <div className={styles.statTop}>
      <div
        className={styles.statIcon}
        style={{ backgroundColor: iconBg, color: iconColor }}
      >
        {icon}
      </div>
    </div>
    <div className={styles.statValue}>{value.toLocaleString("pt-BR")}</div>
    <div className={styles.statLabel}>{label}</div>
  </div>
);

const CHART_COLORS = { likes: "#E1306C", comments: "#833AB4" };

export const InstagramDashboard = () => {
  const { data, isLoading } = useInstagramDashboard();

  if (isLoading) {
    return (
      <PageWrapper
        title="Instagram Dashboard"
        subtitle="Métricas de engajamento dos seus posts publicados"
      >
        <div className={styles.loadingWrapper}>
          <Loading size={48} />
        </div>
      </PageWrapper>
    );
  }

  const totalPosts = data?.byHour.reduce((s, r) => s + r.postCount, 0) ?? 0;
  const totalLikes = data?.byHour.reduce((s, r) => s + r.totalLikes, 0) ?? 0;
  const totalComments = data?.byHour.reduce((s, r) => s + r.totalComments, 0) ?? 0;
  const uniqueCommenters = data?.topCommenters.length ?? 0;

  const hourData = data?.byHour.map((r) => ({
    name: `${String(r.hour).padStart(2, "0")}h`,
    Curtidas: r.totalLikes,
    Comentários: r.totalComments,
  }));

  const weekdayData = data?.byWeekday.map((r) => ({
    name: WEEKDAY_LABELS[r.weekday],
    Curtidas: r.totalLikes,
    Comentários: r.totalComments,
  }));

  const monthData = data?.byMonth.map((r) => ({
    name: formatMonth(r.month),
    Curtidas: r.totalLikes,
    Comentários: r.totalComments,
  }));

  const commentsByHourData = data?.commentsByHour.map((r) => ({
    name: `${String(r.hour).padStart(2, "0")}h`,
    Comentários: r.commentCount,
  }));

  const topCommentersData = data?.topCommenters.map((r) => ({
    name: `@${r.username}`,
    Comentários: r.commentCount,
  }));

  return (
    <PageWrapper
      title="Instagram Dashboard"
      subtitle="Métricas de engajamento dos seus posts publicados"
    >
      <div className={styles.wrapper}>
        {/* ── Stats ── */}
        <div className={styles.statsGrid}>
          <StatCard
            label="Posts Publicados"
            value={totalPosts}
            icon={<MdCameraAlt size={20} />}
            iconBg="#EFF6FF"
            iconColor="#3B82F6"
          />
          <StatCard
            label="Total de Curtidas"
            value={totalLikes}
            icon={<MdFavorite size={20} />}
            iconBg="#FFF0F5"
            iconColor="#E1306C"
          />
          <StatCard
            label="Total de Comentários"
            value={totalComments}
            icon={<MdComment size={20} />}
            iconBg="#F5F0FF"
            iconColor="#833AB4"
          />
          <StatCard
            label="Comentaristas Únicos"
            value={uniqueCommenters}
            icon={<MdPeople size={20} />}
            iconBg="#F0FFF4"
            iconColor="#10B981"
          />
        </div>

        {/* ── Row 1: hora do dia ── */}
        <div className={styles.chartsRow}>
          <Card title="Engajamento por Hora do Dia">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={hourData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="Curtidas" fill={CHART_COLORS.likes} radius={[3, 3, 0, 0]} />
                <Bar dataKey="Comentários" fill={CHART_COLORS.comments} radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card title="Comentários por Hora do Dia">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={commentsByHourData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="Comentários" fill={CHART_COLORS.comments} radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* ── Row 2: dia da semana + top comentaristas ── */}
        <div className={styles.chartsRow}>
          <Card title="Engajamento por Dia da Semana">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={weekdayData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="Curtidas" fill={CHART_COLORS.likes} radius={[3, 3, 0, 0]} />
                <Bar dataKey="Comentários" fill={CHART_COLORS.comments} radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card title="Top Comentaristas">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={topCommentersData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="Comentários" fill={CHART_COLORS.comments} radius={[0, 3, 3, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* ── Row 3: mês (full width) ── */}
        <div className={styles.chartsFull}>
          <Card title="Engajamento por Mês">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={monthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="Curtidas" fill={CHART_COLORS.likes} radius={[3, 3, 0, 0]} />
                <Bar dataKey="Comentários" fill={CHART_COLORS.comments} radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
};
