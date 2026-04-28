import { useSessionContext } from "@/context/useSession";
import { EmptyHome } from "./components/EmptyHome";
import { FinancialSummary } from "./components/FinancialSummary";
import { LowStock } from "./components/LowStock";
import { MonthBirthdays } from "./components/MonthBirthdays";
import { OnboardingBanner } from "./components/OnboardingBanner";
import { RecentOrders } from "./components/RecentOrders";
import { StatCards } from "./components/StatCards";
import { TodaySchedule } from "./components/TodaySchedule";
import { useHomeDashboard } from "./hooks/useHomeDashboard";
import { cn } from "@/utils/cn";
import styles from "./styles.module.scss";
import { PageWrapper } from "@/components/PageWrapper";

const Home = () => {
  const { session } = useSessionContext();
  const { data, isLoading } = useHomeDashboard();

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
      <OnboardingBanner />

      {isEmpty && <EmptyHome />}

      <div className={styles.dashboardBody}>
        <div className={styles.statsBlock}>
          <StatCards stats={data?.stats} isLoading={isLoading} />
        </div>

        <div className={cn(styles.middleRow, styles.todayBlock)}>
          <div className={styles.scheduleCol}>
            <TodaySchedule items={data?.todaySchedule} isLoading={isLoading} />
          </div>
          <div className={styles.ordersCol}>
            <RecentOrders orders={data?.recentOrders} isLoading={isLoading} />
          </div>
        </div>

        <div className={cn(styles.bottomRow, styles.bottomBlock)}>
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
      </div>
    </PageWrapper>
  );
};

export default Home;
