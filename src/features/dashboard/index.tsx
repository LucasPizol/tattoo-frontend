import { ConfirmModal } from "@/components/ConfirmModal";
import { PageWrapper } from "@/components/PageWrapper";
import { Card } from "@/components/ui/Card";
import { Divider } from "@/components/ui/Divider";
import type { DashboardFilter } from "@/services/requests/dashboard/types";
import { useCallback, useState } from "react";
import { MdTrendingUp } from "react-icons/md";
import { TagsChart } from "./components/CategoriesChart";
import { CategoriesChart } from "./components/MaterialsChart";
import { ClientSalesCard } from "./components/ClientSalesCard";
import { DashboardFilters } from "./components/DashboardFilters";
import { ProductSalesCard } from "./components/ProductSalesCard";
import { ProductTypesChart } from "./components/ProductTypesChart";
import { TotalizerCard } from "./components/TotalizerCard";
import { ValuesEvolutionChart } from "./components/ValuesEvolutionChart";
import { useTags } from "./hooks/useTags";
import { useClientSells } from "./hooks/useClientSells";
import { getDefaultFilters } from "./hooks/useDashboardFilter";
import { useCategories } from "./hooks/useCategories";
import { useOrderCount } from "./hooks/useOrderCount";
import { useProductSells } from "./hooks/useProductSells";
import { useProductTypes } from "./hooks/useProductTypes";
import { useSellers } from "./hooks/useSellers";
import { useSummaries } from "./hooks/useSummaries";
import { useValuesEvolution } from "./hooks/useValuesEvolution";
import styles from "./styles.module.scss";

const Dashboard = () => {
  const [submittedFilters, setSubmittedFilters] =
    useState<DashboardFilter>(getDefaultFilters);

  const handleFiltersChange = useCallback((filters: DashboardFilter) => {
    setSubmittedFilters(filters);
  }, []);
  const { tags, isLoading: tagsLoading } = useTags(submittedFilters);
  const { orderCount, isLoading: orderCountLoading } =
    useOrderCount(submittedFilters);
  const { productSells, isLoading: productSellsLoading } =
    useProductSells(submittedFilters);
  const { valuesEvolution, isLoading: valuesEvolutionLoading } =
    useValuesEvolution(submittedFilters);
  const { categories, isLoading: categoriesLoading } =
    useCategories(submittedFilters);
  const { clientSells, isLoading: clientSellsLoading } =
    useClientSells(submittedFilters);
  const { summary, isLoading: summaryLoading } = useSummaries(submittedFilters);
  const { sellers, isLoading: sellersLoading } = useSellers(submittedFilters);
  const { productTypes, isLoading: productTypesLoading } =
    useProductTypes(submittedFilters);

  return (
    <PageWrapper
      title="Dashboard"
      subtitle="Visão geral dos dados do seu negócio"
    >
      <DashboardFilters onFiltersChange={handleFiltersChange} />
      <div className={styles.chartCard}>
        <Card
          title="Faturamento"
          icon={<MdTrendingUp />}
          className={styles.card}
        >
          <div className={styles.sellersList}>
            <div className={styles.sellersListContent}>
              <TotalizerCard
                data={orderCount?.orderCount.toString() ?? "0"}
                isLoading={orderCountLoading}
                label="Pedidos"
              />
              <TotalizerCard
                data={summary?.summary ?? "0"}
                isLoading={summaryLoading}
                label="Total de Vendas"
              />
              {sellers?.sellers.map((seller) => {
                return (
                  <TotalizerCard
                    key={seller.name}
                    data={seller.productIncome.formatted}
                    label={`Total ${seller.name.split(" ")[0]}`}
                    isLoading={sellersLoading}
                    info={
                      <div className={styles.sellerInfo}>
                        <span
                          style={{
                            color: "red",
                            fontSize: 13,
                          }}
                        >
                          {seller.comissionToPay.formatted}
                        </span>
                      </div>
                    }
                  />
                );
              })}
            </div>
          </div>
          <Divider />
          <ValuesEvolutionChart
            data={valuesEvolution}
            isLoading={valuesEvolutionLoading}
          />
        </Card>
      </div>

      <div className={styles.metricsRow}>
        <div className={styles.metricCard}>
          <ClientSalesCard data={clientSells} isLoading={clientSellsLoading} />
        </div>
        <div className={styles.metricCard}>
          <ProductSalesCard
            data={productSells}
            isLoading={productSellsLoading}
          />
        </div>
      </div>

      {/* Segunda linha - Gráficos */}
      <div className={styles.chartsRow}>
        <div className={styles.chartCard}>
          <TagsChart data={tags} isLoading={tagsLoading} />
        </div>
        <div className={styles.chartCard}>
          <CategoriesChart data={categories} isLoading={categoriesLoading} />
        </div>
        <div className={styles.chartCard}>
          <ProductTypesChart
            data={productTypes}
            isLoading={productTypesLoading}
          />
        </div>
      </div>

      {/* <div className={styles.reportContainer}>
        <div className={styles.reportWrapper}>
          <Markdown>{report?.content ?? ""}</Markdown>
        </div>
      </div> */}
    </PageWrapper>
  );
};

export default Dashboard;
