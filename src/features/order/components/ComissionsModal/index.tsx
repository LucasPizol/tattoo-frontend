import { Input } from "@/components/ui/Input";
import { Modal, type ModalPropsForm } from "@/components/ui/Modal";
import { Tabs } from "@/components/ui/Tabs";
import { type ComissionForm } from "@/schemas/comission";
import type { Comission } from "@/services/requests/orders/comissions/types";
import { masks } from "@/utils/masks";
import { useState } from "react";
import styles from "./styles.module.scss";

type ComissionsModalProps = ModalPropsForm<ComissionForm, Comission>;

export const ComissionsModal = (props: ComissionsModalProps) => {
  const [activeTab, setActiveTab] = useState<"value" | "percentage">("value");

  return (
    <Modal {...props} title="Comissão">
      <div className={styles.comissionsModal}>
        <Input field="name" label="Nome" type="text" autoFocus />

        <Tabs
          className={styles.tabs}
          activeTab={activeTab === "value" ? 0 : 1}
          onChange={(tab) => setActiveTab(tab === 0 ? "value" : "percentage")}
        >
          <Tabs.Tab label="Valor">
            <Input label="Valor" field="value" mask={masks.formatCurrency} />
          </Tabs.Tab>
          <Tabs.Tab label="Percentual">
            <Input
              label="Percentual"
              field="percentage"
              type="number"
              mask={masks.formatPercentage}
            />
          </Tabs.Tab>
        </Tabs>
      </div>
    </Modal>
  );
};
