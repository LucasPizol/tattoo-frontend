import { Modal } from "@/components/ui/Modal";
import { Tag } from "@/components/ui/Tag";
import { Loading } from "@/components/ui/Loading";
import { useContractDetail } from "@/features/users/http/queries/useContractDetail";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styles from "./styles.module.scss";

type UserContractModalProps = {
  contractId: number | null;
  isOpen: boolean;
  onClose: () => void;
};

export const UserContractModal = ({ contractId, isOpen, onClose }: UserContractModalProps) => {
  const { contract, isLoading } = useContractDetail(isOpen ? contractId : null);

  const statusLabel = contract?.status === "signed" ? "Assinado" : "Pendente";
  const statusColor = contract?.status === "signed" ? "green" : "yellow";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Contrato" size="large" showFooter={false}>
      {isLoading ? (
        <div className={styles.loadingWrapper}>
          <Loading size={32} />
        </div>
      ) : contract ? (
        <div className={styles.wrapper}>
          <div className={styles.meta}>
            <div className={styles.metaRow}>
              <span className={styles.metaLabel}>Colaborador</span>
              <span className={styles.metaValue}>{contract.user.name}</span>
            </div>
            <div className={styles.metaRow}>
              <span className={styles.metaLabel}>Status</span>
              <Tag color={statusColor} size="small">{statusLabel}</Tag>
            </div>
            <div className={styles.metaRow}>
              <span className={styles.metaLabel}>Versão</span>
              <span className={styles.metaValue}>v{contract.version}</span>
            </div>
            <div className={styles.metaRow}>
              <span className={styles.metaLabel}>Emitido em</span>
              <span className={styles.metaValue}>
                {new Date(contract.created_at).toLocaleDateString("pt-BR", {
                  day: "2-digit", month: "2-digit", year: "numeric",
                })}
              </span>
            </div>
            {contract.signed_at && (
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Assinado em</span>
                <span className={styles.metaValue}>
                  {new Date(contract.signed_at).toLocaleString("pt-BR")}
                </span>
              </div>
            )}
            {contract.signer_ip && (
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>IP</span>
                <span className={styles.metaValue}>{contract.signer_ip}</span>
              </div>
            )}
            {contract.signer_user_agent && (
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Dispositivo</span>
                <span className={styles.metaValueSmall}>{contract.signer_user_agent}</span>
              </div>
            )}
          </div>

          <div className={styles.contentBox}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {contract.content}
            </ReactMarkdown>
          </div>

          {contract.signature_url && (
            <div className={styles.signatureBox}>
              <p className={styles.signatureLabel}>Assinatura</p>
              <img
                src={contract.signature_url}
                alt="Assinatura do colaborador"
                className={styles.signatureImage}
              />
            </div>
          )}
        </div>
      ) : (
        <p className={styles.empty}>Nenhum contrato encontrado.</p>
      )}
    </Modal>
  );
};
