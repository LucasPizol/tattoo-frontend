import { CategoryTreeSelect } from "@/components/CategoryTreeSelect";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { MdAdd, MdLocalOffer } from "react-icons/md";
import { TagContainer } from "./components/TagContainer";
import { useTagForm } from "./hooks/useTagsForm";
import { useTagList } from "./hooks/useTagList";
import styles from "./styles.module.scss";

export const TagsContent = () => {
  const { data, refetch } = useTagList();
  const { form, open, modalProps } = useTagForm();

  const parentTag = form.watch("parentTag");

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 16,
        }}
      >
        <Button prefixIcon={<MdAdd />} variant="primary" onClick={() => open()}>
          Nova Tag
        </Button>
      </div>
      <Card
        title="Tags"
        icon={<MdLocalOffer />}
        className={styles.categoriesCard}
      >
        <div className={styles.categoriesList}>
          {data.length === 0 ? (
            <div className={styles.emptyState}>
              <MdLocalOffer size={36} className={styles.emptyIcon} />
              <h3>Nenhuma tag encontrada</h3>
              <p>Comece criando sua primeira tag</p>
              <Button
                prefixIcon={<MdAdd />}
                variant="primary"
                onClick={() => open()}
              >
                Criar primeira tag
              </Button>
            </div>
          ) : (
            data.map((tag) => (
              <TagContainer
                key={tag.id}
                tag={tag}
                data={data}
                open={open}
                refetch={async () => {
                  await refetch();
                }}
              />
            ))
          )}
        </div>
      </Card>

      <Modal {...modalProps} title="Nova Tag">
        <div className={styles.modalContent}>
          <Input label="Nome" placeholder="Nome da tag" required field="name" />
          <Input
            label="Observações"
            placeholder="Observações (opcional)"
            field="notes"
          />
          <CategoryTreeSelect
            values={
              parentTag ? [{ id: parentTag.id, title: parentTag.name }] : []
            }
            label="Selecione uma Tag pai"
            placeholder="Selecione uma Tag pai"
            onChange={(value) => {
              if (!value) {
                form.setValue("parentTag", null);
                return;
              }
              const { id, title } = value as unknown as {
                id: number;
                title: string;
              };
              form.setValue("parentTag", { id, name: title });
            }}
            onClear={() => form.setValue("parentTag", null)}
            tag={null}
            canSelectRoot
          />
        </div>
      </Modal>
    </>
  );
};
