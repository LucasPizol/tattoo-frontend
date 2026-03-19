import { useState } from "react";
import { MdArrowUpward, MdArrowDownward, MdClose } from "react-icons/md";
import { Table, type Column } from "@/components/ui/Table";
import { Tag } from "@/components/ui/Tag";
import { IconButton } from "@/components/ui/IconButton";
import type { ComissionOrder, ComissionUser } from "../../types";
import styles from "./styles.module.scss";

type ComissionTableProps = {
  users: ComissionUser[];
  loading?: boolean;
};

type UserRow = ComissionUser & { id: number };
type OrderRow = ComissionOrder & { id: number };

const userColumns: Column<UserRow>[] = [
  {
    key: "name",
    label: "Usuário",
    minWidth: "160px",
    render: (user) => <span className={styles.userName}>{user.name}</span>,
  },
  {
    key: "payer",
    label: "Tipo",
    width: "120px",
    render: (user) => {
      const isCompany = user.payer === "company";
      return (
        <Tag color={isCompany ? "green" : "red"}>
          <span className={styles.tagContent}>
            {isCompany ? (
              <>
                <MdArrowDownward size={14} /> Recebe
              </>
            ) : (
              <>
                <MdArrowUpward size={14} /> Paga
              </>
            )}
          </span>
        </Tag>
      );
    },
  },
  {
    key: "commission_percentage",
    label: "Percentual",
    width: "100px",
    align: "right",
    render: (user) => <span>{user.commission_percentage}%</span>,
  },
  {
    key: "total_value",
    label: "Total Comissão",
    minWidth: "140px",
    align: "right",
    render: (user) => (
      <span
        className={
          user.payer === "company" ? styles.valuePositive : styles.valueNegative
        }
      >
        {user.total_value.formatted}
      </span>
    ),
  },
  {
    key: "orders_count",
    label: "Pedidos",
    width: "80px",
    align: "center",
  },
];

const orderColumns: Column<OrderRow>[] = [
  {
    key: "id",
    label: "ID",
    width: "60px",
    render: (order) => <span>#{order.id}</span>,
  },
  {
    key: "client_name",
    label: "Cliente",
    minWidth: "160px",
  },
  {
    key: "product_value",
    label: "Valor do Pedido",
    minWidth: "130px",
    align: "right",
    render: (order) => <span>{order.product_value.formatted}</span>,
  },
  {
    key: "commission_percentage",
    label: "Comissão (%)",
    width: "110px",
    align: "right",
    render: (order) => <span>{order.commission_percentage}%</span>,
  },
  {
    key: "commission_value",
    label: "Valor Comissão",
    minWidth: "130px",
    align: "right",
    render: (order) => <span>{order.commission_value.formatted}</span>,
  },
  {
    key: "paid_at",
    label: "Data Pagamento",
    width: "140px",
    hideOnMobile: true,
  },
];

export const ComissionTable = ({ users, loading }: ComissionTableProps) => {
  const [selectedUser, setSelectedUser] = useState<ComissionUser | null>(null);

  const handleRowClick = (user: UserRow) => {
    setSelectedUser((prev) => (prev?.id === user.id ? null : user));
  };

  return (
    <div className={styles.container}>
      <Table
        columns={userColumns}
        data={users}
        loading={loading}
        onRowClick={handleRowClick}
      />

      {selectedUser && (
        <div className={styles.detailSection}>
          <div className={styles.detailHeader}>
            <h3>
              Pedidos de <strong>{selectedUser.name}</strong>
            </h3>
            <IconButton onClick={() => setSelectedUser(null)}>
              <MdClose size={20} />
            </IconButton>
          </div>
          <Table columns={orderColumns} data={selectedUser.orders} />
        </div>
      )}
    </div>
  );
};
