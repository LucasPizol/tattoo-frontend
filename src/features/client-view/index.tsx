import { Button } from "@/components/ui/Button";
import { ImagePreview } from "@/components/ui/ImageUpload/ImagePreview";
import { Loading } from "@/components/ui/Loading";
import { Tabs } from "@/components/ui/Tabs";
import type {
  Client,
  ClientShowResponse,
} from "@/features/clients/types";
import { masks } from "@/utils/masks";
import { useEffect, useState } from "react";
import { FaInstagram } from "react-icons/fa";
import {
  MdArrowBack,
  MdBadge,
  MdCalendarToday,
  MdEdit,
  MdEmail,
  MdFavorite,
  MdHealthAndSafety,
  MdImage,
  MdPerson,
  MdPhone,
  MdShoppingCart,
  MdSupervisorAccount,
  MdVisibility,
  MdWc,
} from "react-icons/md";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Indications } from "./components/Indications";
import { useClientView } from "./hooks/useClientView";
import styles from "./styles.module.scss";

type Order = ClientShowResponse["client"]["orders"][0];

const ClientProfileCard = ({
  client,
  onEdit,
  totalOrders,
  totalValue,
}: {
  client: Client & { age?: number };
  onEdit: () => void;
  totalOrders: number;
  totalValue: number;
}) => {
  const getStatusColor = () => {
    if (totalOrders === 0) return styles.statusInactive;
    if (totalOrders >= 5) return styles.statusVip;
    return styles.statusActive;
  };

  const getStatusLabel = () => {
    if (totalOrders === 0) return "Sem Pedidos";
    if (totalOrders >= 5) return "Cliente VIP";
    return "Ativo";
  };

  return (
    <div className={styles.profileCard}>
      <div className={styles.profileAvatar}>
        <div className={styles.avatarCircle}>
          <MdPerson />
        </div>
      </div>

      <div className={styles.profileInfo}>
        <h2 className={styles.profileName}>{client.name}</h2>
        <div className={`${styles.statusBadge} ${getStatusColor()}`}>
          <div className={styles.statusDot} />
          {getStatusLabel()}
        </div>
      </div>

      <div className={styles.profileActions}>
        <Button
          className={styles.actionButton}
          onClick={onEdit}
          prefixIcon={<MdEdit />}
        >
          Editar
        </Button>
        <Button
          className={styles.actionButtonSecondary}
          disabled
          prefixIcon={<MdVisibility />}
        >
          Observar
        </Button>
      </div>

      <div className={styles.profileStats}>
        <div className={styles.statItem}>
          <div className={styles.statLabel}>Pedido Médio</div>
          <div className={styles.statValue}>
            R${" "}
            {totalOrders > 0 ? (totalValue / totalOrders).toFixed(2) : "0,00"}
          </div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statLabel}>Total</div>
          <div className={styles.statValue}>R$ {totalValue.toFixed(2)}</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statLabel}>Pedidos</div>
          <div className={styles.statValue}>{totalOrders}</div>
        </div>
      </div>
    </div>
  );
};

const OrderCardColored = ({
  order,
  onOrderClick,
}: {
  order: Order;
  onOrderClick: (route: string) => void;
}) => {
  const getOrderStatusLabel = (status: string) => {
    const statusLabels = {
      pending: "Pendente",
      paid: "Pago",
      canceled: "Cancelado",
      reopened: "Reaberto",
    };
    return statusLabels[status as keyof typeof statusLabels] || status;
  };

  const getColorThemeClass = (status: string) => {
    const colorMap = {
      paid: styles.orderCardGreen,
      pending: styles.orderCardYellow,
      canceled: styles.orderCardRed,
      reopened: styles.orderCardBlue,
    };
    return colorMap[status as keyof typeof colorMap] || styles.orderCardBlue;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
    });
  };

  // Pegar até 4 produtos com imagens para exibir

  return (
    <div
      className={`${styles.orderCardColored} ${getColorThemeClass(
        order.status,
      )}`}
      onClick={() => onOrderClick(`/pedidos/${order.id}`)}
    >
      <div className={styles.orderCardHeader}>
        <div className={styles.orderCardBadge}>
          {getOrderStatusLabel(order.status)}
        </div>
        <button
          className={styles.orderCardMenu}
          onClick={(e) => e.stopPropagation()}
        >
          ⋯
        </button>
      </div>

      <div className={styles.orderCardTitle}>Pedido #{order.id}</div>

      {order.orderProducts.length > 0 && (
        <div className={styles.orderProductGallery}>
          {order.orderProducts.map((orderProduct) => {
            if (orderProduct.product.images.length === 0)
              return (
                <div
                  key={orderProduct.product.id}
                  className={styles.productImagePlaceholder}
                >
                  <MdImage size={24} />
                </div>
              );

            return (
              <ImagePreview
                key={orderProduct.product.id}
                size="small"
                className={styles.productImage}
                images={orderProduct.product.images.map((image) => ({
                  url: image.url,
                  id: image.id,
                  thumbnailUrl: image.thumbnailUrl,
                }))}
                clickable
              />
            );
          })}
          {order.orderProducts.length > 4 && (
            <div className={styles.productThumbMore}>
              +{order.orderProducts.length - 4}
            </div>
          )}
        </div>
      )}

      <div className={styles.orderCardFooter}>
        <div className={styles.orderCardDate}>
          <MdCalendarToday />
          {formatDate(order.createdAt)}
        </div>
        <div className={styles.orderCardValue}>{order.totalValue}</div>
      </div>

      <div className={styles.orderProductCount}>
        {order.orderProducts.length}{" "}
        {order.orderProducts.length === 1 ? "produto" : "produtos"}
      </div>
    </div>
  );
};

export const ClientView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const clientId = id ? Number(id) : null;
  const [activeTab, setActiveTab] = useState(0);

  const { client, isLoading, error } = useClientView(clientId);

  useEffect(() => {
    const storedTab = sessionStorage.getItem("clientViewTab");
    if (storedTab) {
      setActiveTab(Number(storedTab));
      sessionStorage.removeItem("clientViewTab");
    }
  }, []);

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Loading size={40} />
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className={styles.errorContainer}>
        <p>Não foi possível carregar os dados do cliente.</p>
        <Button onClick={() => navigate("/clientes")}>
          Voltar para Clientes
        </Button>
      </div>
    );
  }

  const handleBack = () => {
    const canGoBack = window.history.state.idx > 0;

    if (canGoBack) {
      navigate(-1);
    } else {
      navigate("/clientes");
    }

    sessionStorage.removeItem("clientViewTab");
  };

  const totalOrders = client.orders?.length || 0;
  const totalValue =
    client.orders?.reduce((acc, order) => {
      const value = parseFloat(
        order.totalValue.replace("R$", "").replace(",", ".").trim(),
      );
      return acc + (isNaN(value) ? 0 : value);
    }, 0) || 0;

  return (
    <div className={styles.modernContainer}>
      {/* Header com botão voltar */}
      <div className={styles.header}>
        <Button
          variant="secondary"
          onClick={handleBack}
          className={styles.backButton}
          prefixIcon={<MdArrowBack />}
        >
          Voltar
        </Button>
      </div>

      {/* Layout Principal */}
      <div className={styles.mainLayout}>
        {/* Sidebar com perfil */}
        <aside className={styles.sidebar}>
          <ClientProfileCard
            client={client}
            onEdit={() => navigate(`/clientes/${client.id}/editar`)}
            totalOrders={totalOrders}
            totalValue={totalValue}
          />
        </aside>

        {/* Conteúdo Principal */}
        <main className={styles.mainContent}>
          <Tabs
            activeTab={activeTab}
            onChange={(tab) => {
              sessionStorage.setItem("clientViewTab", tab.toString());
              setActiveTab(tab);
            }}
          >
            <Tabs.Tab label="Visão Geral">
              <div className={styles.tabContent}>
                {/* Dados Pessoais */}
                <h3 className={styles.sectionTitle}>Dados Pessoais</h3>
                <div className={styles.infoGrid}>
                  {client.email && (
                    <div className={styles.infoCard}>
                      <div className={styles.infoIcon}>
                        <MdEmail />
                      </div>
                      <div className={styles.infoDetails}>
                        <div className={styles.infoLabel}>Email</div>
                        <div className={styles.infoValue}>{client.email}</div>
                      </div>
                    </div>
                  )}

                  {client.phone && (
                    <div className={styles.infoCard}>
                      <div className={styles.infoIcon}>
                        <MdPhone />
                      </div>
                      <div className={styles.infoDetails}>
                        <div className={styles.infoLabel}>Telefone</div>
                        <div className={styles.infoValue}>
                          {masks.formatPhone(client.phone ?? "")}
                        </div>
                      </div>
                    </div>
                  )}

                  {client.indicatedBy?.id && (
                    <div className={styles.infoCard}>
                      <div className={styles.infoIcon}>
                        <MdPerson />
                      </div>
                      <div className={styles.infoDetails}>
                        <div className={styles.infoLabel}>Indicado por</div>
                        <div className={styles.infoValue}>
                          <Link
                            to={`/clientes/${client.indicatedBy.id}/visualizar`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveTab(0);
                              sessionStorage.removeItem("clientViewTab");
                            }}
                          >
                            {client.indicatedBy.name}
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}

                  {client.cpf && (
                    <div className={styles.infoCard}>
                      <div className={styles.infoIcon}>
                        <MdBadge />
                      </div>
                      <div className={styles.infoDetails}>
                        <div className={styles.infoLabel}>CPF</div>
                        <div className={styles.infoValue}>{client.cpf}</div>
                      </div>
                    </div>
                  )}

                  {client.rg && (
                    <div className={styles.infoCard}>
                      <div className={styles.infoIcon}>
                        <MdBadge />
                      </div>
                      <div className={styles.infoDetails}>
                        <div className={styles.infoLabel}>RG</div>
                        <div className={styles.infoValue}>{client.rg}</div>
                      </div>
                    </div>
                  )}

                  {client.birthDate && (
                    <div className={styles.infoCard}>
                      <div className={styles.infoIcon}>
                        <MdCalendarToday />
                      </div>
                      <div className={styles.infoDetails}>
                        <div className={styles.infoLabel}>
                          Data de Nascimento
                        </div>
                        <div className={styles.infoValue}>
                          {masks.formatDate(client.birthDate)} ({client.age}{" "}
                          anos)
                        </div>
                      </div>
                    </div>
                  )}

                  {client.gender && (
                    <div className={styles.infoCard}>
                      <div className={styles.infoIcon}>
                        <MdWc />
                      </div>
                      <div className={styles.infoDetails}>
                        <div className={styles.infoLabel}>Gênero</div>
                        <div className={styles.infoValue}>{client.gender}</div>
                      </div>
                    </div>
                  )}

                  {client.maritalStatus && (
                    <div className={styles.infoCard}>
                      <div className={styles.infoIcon}>
                        <MdFavorite />
                      </div>
                      <div className={styles.infoDetails}>
                        <div className={styles.infoLabel}>Estado Civil</div>
                        <div className={styles.infoValue}>
                          {client.maritalStatus}
                        </div>
                      </div>
                    </div>
                  )}

                  {client.instagramProfile && (
                    <div className={styles.infoCard}>
                      <div className={styles.infoIcon}>
                        <FaInstagram />
                      </div>
                      <div className={styles.infoDetails}>
                        <div className={styles.infoLabel}>Instagram</div>
                        <div className={styles.infoValue}>
                          @{client.instagramProfile}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Condições de Saúde */}

                {client.hasHealthConditions && (
                  <>
                    <h3 className={styles.sectionTitle}>
                      <MdHealthAndSafety /> Condições de Saúde
                    </h3>
                    {client.healthConditions?.map((condition) => (
                      <div className={styles.healthTag}>{condition.name}</div>
                    ))}
                  </>
                )}

                {client.responsible && (
                  <>
                    <h3 className={styles.sectionTitle}>
                      <MdSupervisorAccount /> Responsável Legal
                    </h3>
                    <div className={styles.infoGrid}>
                      <div className={styles.infoCard}>
                        <div className={styles.infoIcon}>
                          <MdPerson />
                        </div>
                        <div className={styles.infoDetails}>
                          <div className={styles.infoLabel}>Nome</div>
                          <div className={styles.infoValue}>
                            {client.responsible.name}
                          </div>
                        </div>
                      </div>

                      {client.responsible.email && (
                        <div className={styles.infoCard}>
                          <div className={styles.infoIcon}>
                            <MdEmail />
                          </div>
                          <div className={styles.infoDetails}>
                            <div className={styles.infoLabel}>Email</div>
                            <div className={styles.infoValue}>
                              {client.responsible.email}
                            </div>
                          </div>
                        </div>
                      )}

                      {client.responsible.phone && (
                        <div className={styles.infoCard}>
                          <div className={styles.infoIcon}>
                            <MdPhone />
                          </div>
                          <div className={styles.infoDetails}>
                            <div className={styles.infoLabel}>Telefone</div>
                            <div className={styles.infoValue}>
                              {masks.formatPhone(client.responsible.phone)}
                            </div>
                          </div>
                        </div>
                      )}

                      {client.responsible.cpf && (
                        <div className={styles.infoCard}>
                          <div className={styles.infoIcon}>
                            <MdBadge />
                          </div>
                          <div className={styles.infoDetails}>
                            <div className={styles.infoLabel}>CPF</div>
                            <div className={styles.infoValue}>
                              {client.responsible.cpf}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </Tabs.Tab>
            <Tabs.Tab label="Pedidos">
              <div className={styles.tabContent}>
                <h3 className={styles.sectionTitle}>
                  Pedidos Recentes ({totalOrders})
                </h3>

                {client.orders && client.orders.length > 0 ? (
                  <div className={styles.ordersGrid}>
                    {client.orders.map((order) => (
                      <OrderCardColored
                        key={order.id}
                        order={order}
                        onOrderClick={(route: string) => navigate(route)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className={styles.emptyState}>
                    <MdShoppingCart className={styles.emptyIcon} />
                    <p>Nenhum pedido encontrado</p>
                  </div>
                )}
              </div>
            </Tabs.Tab>
            <Tabs.Tab label="Indicações">
              <Indications
                setActiveTab={(tab) => {
                  setActiveTab(tab);
                  sessionStorage.setItem("clientViewTab", tab.toString());
                }}
              />
            </Tabs.Tab>
          </Tabs>
        </main>
      </div>
    </div>
  );
};
