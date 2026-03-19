import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/Button";
import { DrawableSignature } from "@/components/ui/DrawableSignature";
import { api } from "@/services/api";
import type { Contract } from "./types";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import styles from "./styles.module.scss";

type ContractModalProps = {
  contract: Contract;
  onSigned: () => void;
};

export const ContractModal = ({ contract, onSigned }: ContractModalProps) => {
  const [signature, setSignature] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const handleSign = async () => {
    if (!signature) {
      toast.error("Por favor, assine o contrato antes de confirmar.");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post(`/api/contracts/${contract.id}/sign`, { signature });
      toast.success("Contrato assinado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["session"] });
      onSigned();
    } catch {
      toast.error("Erro ao assinar o contrato. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>Contrato Pendente</h2>
            <p className={styles.subtitle}>
              Você possui um contrato pendente de assinatura. Leia atentamente e
              assine para continuar.
            </p>
          </div>
        </div>

        <div className={styles.body}>
          <div className={styles.contentWrapper}>
            <div className={styles.markdown}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {contract.content}
              </ReactMarkdown>
            </div>
          </div>

          <div className={styles.signatureSection}>
            <h3 className={styles.signatureTitle}>Assinatura</h3>
            <p className={styles.signatureHint}>
              Desenhe sua assinatura no campo abaixo para confirmar que leu e
              concordou com os termos.
            </p>
            <DrawableSignature onChange={setSignature} />
          </div>
        </div>

        <div className={styles.footer}>
          <Button
            onClick={handleSign}
            loading={isSubmitting}
            disabled={!signature}
          >
            Assinar e Continuar
          </Button>
        </div>
      </div>
    </div>
  );
};
