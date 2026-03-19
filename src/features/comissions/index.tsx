import { useState } from "react";
import { PageWrapper } from "@/components/PageWrapper";
import { Button } from "@/components/ui/Button";
import {
  DateRangePicker,
  type DateRange,
} from "@/components/ui/DateRangePicker";
import { Modal } from "@/components/ui/Modal";
import { useModalNoForm } from "@/components/ui/Modal/useModalNoForm";
import { MdPictureAsPdf } from "react-icons/md";
import { useComissions } from "./hooks/useComissions";
import { ComissionSummary } from "./components/ComissionSummary";
import { ComissionTable } from "./components/ComissionTable";
import { generateComissionPdf } from "./components/ComissionPdf";
import styles from "./styles.module.scss";

const getDefaultDateRange = (): DateRange => {
  const now = new Date();
  return {
    startDate: new Date(now.getFullYear(), now.getMonth(), 1),
    endDate: new Date(now.getFullYear(), now.getMonth() + 1, 0),
  };
};

export const Comissions = () => {
  const [dateRange, setDateRange] = useState<DateRange>(getDefaultDateRange());
  const { data, isLoading, filters, onChangeFilters } = useComissions();
  const [pdfLoading, setPdfLoading] = useState(false);
  const {
    open: openPdfModal,
    close: closePdfModal,
    modalProps,
  } = useModalNoForm({});

  const handleDateChange = (range: DateRange) => {
    setDateRange(range);
    onChangeFilters({
      paid_at_gteq: range.startDate?.toISOString(),
      paid_at_lteq: range.endDate?.toISOString(),
    });
  };

  const handleGeneratePdf = async (detailed: boolean) => {
    if (!data) return;

    setPdfLoading(true);
    closePdfModal();

    try {
      await generateComissionPdf({
        data,
        detailed,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      });
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <PageWrapper
      title="Comissões"
      subtitle="Relatório de comissões por usuário no período selecionado"
      actions={
        <Button
          prefixIcon={<MdPictureAsPdf />}
          onClick={() => openPdfModal()}
          disabled={!data || data.users.length === 0 || pdfLoading}
        >
          {pdfLoading ? "Gerando..." : "Gerar PDF"}
        </Button>
      }
    >
      <div className={styles.content}>
        <div className={styles.filtersRow}>
          <DateRangePicker
            label="Período"
            placeholder="Selecione o período"
            value={dateRange}
            onChange={handleDateChange}
          />
        </div>

        <ComissionSummary summary={data?.summary} loading={isLoading} />

        <ComissionTable users={data?.users ?? []} loading={isLoading} />
      </div>

      <Modal {...modalProps} title="Gerar Relatório PDF" size="small">
        <div className={styles.pdfModalContent}>
          <p className={styles.pdfModalDescription}>
            Selecione o tipo de relatório que deseja gerar:
          </p>
          <div className={styles.pdfModalActions}>
            <Button
              variant="secondary"
              onClick={() => handleGeneratePdf(false)}
              className={styles.pdfModalButton}
            >
              Simplificado
            </Button>
            <Button
              onClick={() => handleGeneratePdf(true)}
              className={styles.pdfModalButton}
            >
              Detalhado
            </Button>
          </div>
          <div className={styles.pdfModalHints}>
            <p>
              <strong>Simplificado:</strong> Resumo com totais por usuário
            </p>
            <p>
              <strong>Detalhado:</strong> Inclui lista de pedidos de cada
              usuário
            </p>
          </div>
        </div>
      </Modal>
    </PageWrapper>
  );
};
