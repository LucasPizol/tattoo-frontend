import { ConfirmModal } from "@/components/ConfirmModal";
import { FiltersCard } from "@/components/FiltersCard";
import { PageWrapper } from "@/components/PageWrapper";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Table } from "@/components/ui/Table";
import { useMobile } from "@/hooks/useMobile";
import type { Category } from "@/services/requests/categories/types";
import { MdDelete, MdEdit, MdSearch } from "react-icons/md";
import { useCategoryForm } from "./hooks/useCategoryForm";
import { useCategoryList } from "./hooks/useCategoryList";
import styles from "./styles.module.scss";

export const Categories = () => {
  const { categories, isLoading, form, onFinishFilters } = useCategoryList();
  const { open, modalProps, handleDestroyCategory } = useCategoryForm();

  const isMobile = useMobile();

  const columns = [
    {
      key: "name",
      label: "Nome",
      render: (category: Category) => <strong>{category.name}</strong>,
    },
    {
      key: "createdAt",
      label: "Data de Cadastro",
      render: (category: Category) => {
        return new Date(category.createdAt).toLocaleDateString("pt-BR");
      },
    },
    {
      key: "actions",
      label: isMobile ? " " : "Ações",
      maxWidth: isMobile ? "50px" : "120px",
      align: "center" as const,
      render: (category: Category) => {
        return (
          <div className={styles.actions}>
            <IconButton
              onClick={() =>
                open({ name: category.name, notes: category.notes }, category)
              }
            >
              <MdEdit size={24} />
            </IconButton>
            <ConfirmModal
              onSave={() => handleDestroyCategory(category.id)}
              title="Excluir Categoria"
              trigger={
                <IconButton>
                  <MdDelete size={24} />
                </IconButton>
              }
            >
              <p>Tem certeza que deseja excluir a categoria {category.name}?</p>
            </ConfirmModal>
          </div>
        );
      },
    },
  ];

  return (
    <PageWrapper
      title="Categorias"
      subtitle="Gerencie suas categorias e mantenha as informações atualizadas"
      actions={<Button onClick={() => open()}>Nova Categoria</Button>}
    >
      <FiltersCard form={form} onFinishFilters={onFinishFilters}>
        <Input
          field="name_cont"
          placeholder="Digite"
          label="Buscar categorias..."
          prefixIcon={<MdSearch />}
          className={styles.searchInput}
          onDebounceChange={async (value) => {
            onFinishFilters({
              name_cont: value,
            });
          }}
        />
      </FiltersCard>
      <Table columns={columns} data={categories || []} loading={isLoading} />
      <Modal {...modalProps}>
        <Input field="name" label="Nome" placeholder="Nome da categoria" />
        <Input
          field="notes"
          label="Observações"
          placeholder="Observações sobre a categoria (opcional)"
        />
      </Modal>
    </PageWrapper>
  );
};
