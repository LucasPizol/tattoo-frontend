import { useSessionContext } from "@/context/useSession";
import { Button } from "@/components/ui/Button";
import { FinancialSummary } from "./components/FinancialSummary";
import { LowStock } from "./components/LowStock";
import { MonthBirthdays } from "./components/MonthBirthdays";
import { RecentOrders } from "./components/RecentOrders";
import { StatCards } from "./components/StatCards";
import { TodaySchedule } from "./components/TodaySchedule";
import { useHomeDashboard } from "./hooks/useHomeDashboard";
import styles from "./styles.module.scss";
import { PageWrapper } from "@/components/PageWrapper";
import { MdAdd, MdCalendarToday } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { session } = useSessionContext();
  const { data, isLoading } = useHomeDashboard();
  const navigate = useNavigate();

  const firstName = session.user?.name?.split(" ")[0] ?? "";

  const isEmpty =
    !isLoading &&
    data &&
    data.stats.todayAppointments === 0 &&
    data.recentOrders.length === 0 &&
    data.stats.activeClients === 0;

  return (
    <PageWrapper
      title={`Bem-vindo(a), ${firstName}!`}
      subtitle="Resumo do seu estúdio hoje"
    >
      {isEmpty && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
            padding: "48px 24px",
            textAlign: "center",
            borderRadius: "var(--border-radius)",
            background: "var(--parchment-raised)",
            border: "1px solid var(--border)",
            marginBottom: 24,
          }}
        >
          <MdCalendarToday size={40} style={{ color: "var(--amber)" }} />
          <p
            style={{
              fontSize: "var(--font-size-body2)",
              color: "var(--text-secondary)",
              margin: 0,
            }}
          >
            Tudo pronto! Comece criando seu primeiro agendamento.
          </p>
          <Button
            prefixIcon={<MdAdd />}
            onClick={() => navigate("/agenda")}
          >
            Criar agendamento
          </Button>
        </div>
      )}
      <StatCards stats={data?.stats} isLoading={isLoading} />

      <div className={styles.middleRow}>
        <div className={styles.scheduleCol}>
          <TodaySchedule items={data?.todaySchedule} isLoading={isLoading} />
        </div>
        <div className={styles.ordersCol}>
          <RecentOrders orders={data?.recentOrders} isLoading={isLoading} />
        </div>
      </div>

      <div className={styles.bottomRow}>
        <div className={styles.bottomCol}>
          <LowStock products={data?.lowStockProducts} isLoading={isLoading} />
        </div>
        <div className={styles.bottomCol}>
          <FinancialSummary
            data={data?.financialSummary}
            isLoading={isLoading}
          />
        </div>
        <div className={styles.bottomCol}>
          <MonthBirthdays birthdays={data?.birthdays} isLoading={isLoading} />
        </div>
      </div>
    </PageWrapper>
  );
};

export default Home;
