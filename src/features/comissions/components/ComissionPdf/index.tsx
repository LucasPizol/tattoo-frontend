import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";
import type { ComissionsResponse, ComissionUser } from "../../types";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 11,
    color: "#666",
  },
  summaryRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  summaryCard: {
    flex: 1,
    padding: 12,
    borderRadius: 4,
    border: "1px solid #ddd",
  },
  summaryLabel: {
    fontSize: 9,
    color: "#666",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  summaryValue: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    marginBottom: 8,
    marginTop: 16,
  },
  table: {
    width: "100%",
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  tableHeaderCell: {
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
    textTransform: "uppercase",
    color: "#666",
  },
  tableCell: {
    fontSize: 9,
  },
  colName: { flex: 2 },
  colType: { flex: 1 },
  colPercentage: { flex: 1, textAlign: "right" },
  colValue: { flex: 1.5, textAlign: "right" },
  colCount: { flex: 0.8, textAlign: "center" },
  ordersSubtitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    marginTop: 12,
    marginBottom: 4,
    color: "#444",
  },
  orderTableHeader: {
    flexDirection: "row",
    backgroundColor: "#fafafa",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  orderTableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    paddingVertical: 3,
    paddingHorizontal: 6,
  },
  orderColId: { flex: 0.5 },
  orderColClient: { flex: 2 },
  orderColProductValue: { flex: 1.2, textAlign: "right" },
  orderColPercentage: { flex: 0.8, textAlign: "right" },
  orderColCommission: { flex: 1.2, textAlign: "right" },
  orderColDate: { flex: 1 },
  positiveText: { color: "#2e7d32" },
  negativeText: { color: "#c62828" },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 40,
    right: 40,
    fontSize: 8,
    color: "#999",
    textAlign: "center",
  },
});

const formatPeriod = (startDate: Date | null, endDate: Date | null) => {
  const fmt = (d: Date) =>
    d.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  if (startDate && endDate) return `${fmt(startDate)} a ${fmt(endDate)}`;
  if (startDate) return `A partir de ${fmt(startDate)}`;
  if (endDate) return `Até ${fmt(endDate)}`;
  return "Todos os períodos";
};

type ComissionPdfProps = {
  data: ComissionsResponse;
  detailed: boolean;
  startDate: Date | null;
  endDate: Date | null;
};

const UserSummaryTable = ({ users }: { users: ComissionUser[] }) => (
  <View style={styles.table}>
    <View style={styles.tableHeader}>
      <Text style={[styles.tableHeaderCell, styles.colName]}>Usuário</Text>
      <Text style={[styles.tableHeaderCell, styles.colType]}>Tipo</Text>
      <Text style={[styles.tableHeaderCell, styles.colPercentage]}>%</Text>
      <Text style={[styles.tableHeaderCell, styles.colValue]}>Total</Text>
      <Text style={[styles.tableHeaderCell, styles.colCount]}>Pedidos</Text>
    </View>
    {users.map((user) => (
      <View key={user.id} style={styles.tableRow}>
        <Text style={[styles.tableCell, styles.colName]}>{user.name}</Text>
        <Text style={[styles.tableCell, styles.colType]}>
          {user.payer === "company" ? "Recebe" : "Paga"}
        </Text>
        <Text style={[styles.tableCell, styles.colPercentage]}>
          {user.commission_percentage}%
        </Text>
        <Text
          style={[
            styles.tableCell,
            styles.colValue,
            user.payer === "company" ? styles.positiveText : styles.negativeText,
          ]}
        >
          {user.total_value.formatted}
        </Text>
        <Text style={[styles.tableCell, styles.colCount]}>
          {user.orders_count}
        </Text>
      </View>
    ))}
  </View>
);

const UserOrdersDetail = ({ user }: { user: ComissionUser }) => (
  <View wrap={false}>
    <Text style={styles.ordersSubtitle}>
      {user.name} — {user.payer === "company" ? "Recebe" : "Paga"} (
      {user.commission_percentage}%)
    </Text>
    <View style={styles.table}>
      <View style={styles.orderTableHeader}>
        <Text style={[styles.tableHeaderCell, styles.orderColId]}>ID</Text>
        <Text style={[styles.tableHeaderCell, styles.orderColClient]}>
          Cliente
        </Text>
        <Text style={[styles.tableHeaderCell, styles.orderColProductValue]}>
          Valor Pedido
        </Text>
        <Text style={[styles.tableHeaderCell, styles.orderColPercentage]}>
          %
        </Text>
        <Text style={[styles.tableHeaderCell, styles.orderColCommission]}>
          Comissão
        </Text>
        <Text style={[styles.tableHeaderCell, styles.orderColDate]}>Data</Text>
      </View>
      {user.orders.map((order) => (
        <View key={order.id} style={styles.orderTableRow}>
          <Text style={[styles.tableCell, styles.orderColId]}>
            #{order.id}
          </Text>
          <Text style={[styles.tableCell, styles.orderColClient]}>
            {order.client_name}
          </Text>
          <Text style={[styles.tableCell, styles.orderColProductValue]}>
            {order.product_value.formatted}
          </Text>
          <Text style={[styles.tableCell, styles.orderColPercentage]}>
            {order.commission_percentage}%
          </Text>
          <Text style={[styles.tableCell, styles.orderColCommission]}>
            {order.commission_value.formatted}
          </Text>
          <Text style={[styles.tableCell, styles.orderColDate]}>
            {order.paid_at}
          </Text>
        </View>
      ))}
    </View>
  </View>
);

const ComissionPdfDocument = ({
  data,
  detailed,
  startDate,
  endDate,
}: ComissionPdfProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Relatório de Comissões</Text>
        <Text style={styles.subtitle}>
          Período: {formatPeriod(startDate, endDate)}
        </Text>
      </View>

      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total a Pagar</Text>
          <Text style={[styles.summaryValue, styles.negativeText]}>
            {data.summary.total_to_pay.formatted}
          </Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total a Receber</Text>
          <Text style={[styles.summaryValue, styles.positiveText]}>
            {data.summary.total_to_receive.formatted}
          </Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Saldo</Text>
          <Text
            style={[
              styles.summaryValue,
              data.summary.balance.value >= 0
                ? styles.positiveText
                : styles.negativeText,
            ]}
          >
            {data.summary.balance.formatted}
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Comissões por Usuário</Text>
      <UserSummaryTable users={data.users} />

      {detailed &&
        data.users.map((user) => (
          <UserOrdersDetail key={user.id} user={user} />
        ))}

      <Text
        style={styles.footer}
        render={({ pageNumber, totalPages }) =>
          `Gerado em ${new Date().toLocaleDateString("pt-BR")} — Página ${pageNumber} de ${totalPages}`
        }
        fixed
      />
    </Page>
  </Document>
);

export const generateComissionPdf = async (props: ComissionPdfProps) => {
  const blob = await pdf(<ComissionPdfDocument {...props} />).toBlob();

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;

  const periodStr = props.startDate
    ? `${props.startDate.toLocaleDateString("pt-BR").replace(/\//g, "-")}_${props.endDate?.toLocaleDateString("pt-BR").replace(/\//g, "-") ?? ""}`
    : "todos";

  link.download = `comissoes_${periodStr}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
