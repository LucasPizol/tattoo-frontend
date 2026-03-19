import { Form } from "@/components/Form";
import { PageWrapper } from "@/components/PageWrapper";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { DateRangePicker } from "@/components/ui/DateRangePicker";
import { Input } from "@/components/ui/Input";
import { Tag } from "@/components/ui/Tag";
import type { SelectedProductInOrder } from "@/features/order/components/ProductSelectionModal";
import { LazyProductSelectionModal } from "@/features/order/components/ProductSelectionModal/LazyProductSelectionModal";
import { useRaffleForm } from "../../hooks/useRaffleForm";
import { Suspense } from "react";
import {
  MdCalendarMonth,
  MdCameraAlt,
  MdCasino,
  MdClose,
  MdComment,
  MdFavorite,
  MdFilterList,
  MdPeople,
  MdShoppingBag,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.scss";
import { masks } from "@/utils/masks";
import { InstagramPostSelectionModal } from "./InstagramPostSelectionModal";

export const RaffleForm = () => {
  const navigate = useNavigate();

  const {
    form,
    onSubmit,
    isPending,
    selectedProductNames,
    handleProductSave,
    removeProduct,
    openProductModal,
    productModalProps,
    handleDateRangeChange,
    getDateRange,
    selectedPost,
    handleSelectPost,
    clearPost,
    openPostModal,
    postModalProps,
  } = useRaffleForm();

  const startDate = form.watch("start_date");
  const endDate = form.watch("end_date");
  const minOrderValue = form.watch("min_order_value");

  return (
    <PageWrapper
      title="Novo Sorteio"
      subtitle="Configure os parâmetros e realize o sorteio entre seus clientes"
      onBack={() => navigate("/sorteios")}
    >
      <Form onSubmit={onSubmit} form={form} className={styles.form}>
        <Card title="Identificação" icon={<MdCasino />}>
          <div className={styles.fieldRow}>
            <Input
              field="name"
              label="Nome do sorteio"
              placeholder="Ex: Sorteio de Aniversário"
              required
              fullWidth
            />
            <Input
              field="description"
              label="Descrição (opcional)"
              placeholder="Ex: Sorteio de Aniversário"
              fullWidth
            />
          </div>
        </Card>

        <Card title="Ganhadores" icon={<MdPeople />}>
          <div className={styles.fieldRow}>
            <div className={styles.fieldGroup}>
              <Input
                field="primary_count"
                label="Ganhadores principais"
                type="number"
                min={1}
                required
              />
              <p className={styles.fieldHint}>
                Clientes sorteados como vencedores primários
              </p>
            </div>
            <div className={styles.fieldGroup}>
              <Input
                field="secondary_count"
                label="Ganhadores alternativos"
                type="number"
                min={0}
              />
              <p className={styles.fieldHint}>
                Reservas caso algum principal seja inválido
              </p>
            </div>
          </div>
        </Card>

        <Card title="Post do Instagram" icon={<MdCameraAlt />}>
          {selectedPost ? (
            <div className={styles.selectedPost}>
              <div className={styles.selectedPostInfo}>
                {selectedPost.contents[0] && (
                  <img
                    src={
                      selectedPost.contents[0].thumbnailUrl ||
                      selectedPost.contents[0].url
                    }
                    alt="thumbnail"
                    className={styles.selectedPostThumb}
                  />
                )}
                <div className={styles.selectedPostDetails}>
                  <p className={styles.selectedPostCaption}>
                    {selectedPost.caption}
                  </p>
                  <div className={styles.selectedPostMetrics}>
                    <span className={styles.metric}>
                      <MdFavorite size={14} className={styles.metricIconLike} />
                      {selectedPost.likeCount ?? "-"}
                    </span>
                    <span className={styles.metric}>
                      <MdComment
                        size={14}
                        className={styles.metricIconComment}
                      />
                      {selectedPost.commentsCount ?? "-"}
                    </span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                className={styles.clearPostBtn}
                onClick={clearPost}
                title="Remover post"
              >
                <MdClose size={18} />
              </button>
            </div>
          ) : (
            <div className={styles.filterBlock}>
              <Button
                type="button"
                variant="secondary"
                onClick={() => openPostModal()}
              >
                Selecionar post
              </Button>
              <p className={styles.filterHint}>
                Sorteie entre comentaristas do post. Quando selecionado, os
                filtros de clientes são ignorados.
              </p>
            </div>
          )}
        </Card>

        {!selectedPost && (
          <Card title="Filtros" icon={<MdFilterList />}>
            <div className={styles.filtersContent}>
              <div className={styles.filterBlock}>
                <div className={styles.filterLabel}>
                  <MdCalendarMonth size={18} />
                  <span>Período de compra</span>
                </div>
                <DateRangePicker
                  value={getDateRange()}
                  onChange={handleDateRangeChange}
                  placeholder="Selecione o período"
                />
                {startDate && endDate && (
                  <p className={styles.filterHint}>
                    Clientes com compras entre{" "}
                    {new Date(`${startDate}T00:00:00`).toLocaleDateString(
                      "pt-BR",
                    )}{" "}
                    e{" "}
                    {new Date(`${endDate}T00:00:00`).toLocaleDateString(
                      "pt-BR",
                    )}
                  </p>
                )}
              </div>

              <div className={styles.filterBlock}>
                <div className={styles.filterLabel}>
                  <MdShoppingBag size={18} />
                  <span>Produtos comprados</span>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => openProductModal()}
                >
                  {selectedProductNames.length > 0
                    ? `${selectedProductNames.length} produto(s) selecionado(s)`
                    : "Selecionar produtos"}
                </Button>
                {selectedProductNames.length > 0 && (
                  <div className={styles.productTags}>
                    {selectedProductNames.map((p) => (
                      <Tag
                        key={p.id}
                        color="blue"
                        size="small"
                        onRemove={() => removeProduct(p.id)}
                      >
                        {p.name}
                      </Tag>
                    ))}
                  </div>
                )}
                <p className={styles.filterHint}>
                  Apenas clientes que compraram os produtos selecionados
                </p>
              </div>

              <div className={styles.filterBlock}>
                <Input
                  field="min_order_value"
                  label="Valor mínimo do pedido (R$)"
                  min={0}
                  step={0.01}
                  placeholder="Ex: 150.00"
                  mask={masks.formatCurrency}
                  fullWidth
                />
                {minOrderValue && (
                  <p className={styles.filterHint}>
                    Clientes com pedidos acima de {minOrderValue}
                  </p>
                )}
              </div>
            </div>
          </Card>
        )}

        <div className={styles.formActions}>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/sorteios")}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            prefixIcon={<MdCasino />}
            loading={isPending || form.formState.isSubmitting}
          >
            Realizar Sorteio
          </Button>
        </div>
      </Form>

      <Suspense>
        <LazyProductSelectionModal
          {...productModalProps}
          onSave={handleProductSave}
          productInOrder={
            selectedProductNames.map(
              (p) =>
                ({
                  id: p.id,
                  product: { id: p.id, name: p.name },
                  stock: null,
                }) as unknown as SelectedProductInOrder,
            ) as SelectedProductInOrder[]
          }
          multiple
        />
      </Suspense>

      <InstagramPostSelectionModal
        {...postModalProps}
        onSelect={handleSelectPost}
      />
    </PageWrapper>
  );
};
