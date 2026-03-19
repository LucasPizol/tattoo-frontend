import { ConfirmModal } from "@/components/ConfirmModal";
import { IconButton } from "@/components/ui/IconButton";
import type { TagForm } from "@/schemas/tag";
import type { Tag } from "@/services/requests/tags/types";
import { cn } from "@/utils/cn";
import { useState } from "react";
import { MdDelete, MdEdit, MdExpandLess, MdExpandMore } from "react-icons/md";
import { useTagForm } from "../../hooks/useTagsForm";
import styles from "./styles.module.scss";

type TagContainerProps = {
  tag: Tag;
  data: Tag[];
  refetch: () => Promise<void>;
  open: (data: TagForm, reference: Tag | null) => void;
};

export const TagContainer = ({ tag, data, refetch, open }: TagContainerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { handleDestroyTag } = useTagForm();

  return (
    <div
      className={cn(styles.category)}
      onClick={(e) => {
        e.stopPropagation();
        if (tag.children.length === 0) return;
        setIsOpen(!isOpen);
      }}
    >
      <div className={cn(styles.header, { [styles.hasChildren]: tag.children.length > 0 })}>
        <div className={styles.headerLeft}>
          {tag.children.length > 0 && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={cn(styles.expandButton, styles.button)}
              aria-label={isOpen ? "Recolher" : "Expandir"}
            >
              {isOpen ? <MdExpandLess size={14} /> : <MdExpandMore size={14} />}
            </button>
          )}
          <div className={styles.nameContainer}>
            <h3 className={styles.name}>{tag.name}</h3>
            {tag.notes && <p className={styles.notes}>{tag.notes}</p>}
          </div>
        </div>
        <div className={styles.actions}>
          <IconButton
            onClick={() => {
              open(
                {
                  name: tag.name,
                  notes: tag.notes,
                  parentTag: tag.parentTag
                    ? { id: tag.parentTag.id, name: tag.parentTag.name }
                    : null,
                },
                tag,
              );
            }}
          >
            <MdEdit size={24} />
          </IconButton>
          <ConfirmModal
            title="Excluir tag"
            onSave={async () => {
              await handleDestroyTag(tag);
              await refetch();
            }}
            trigger={<MdDelete size={24} />}
          >
            <p>Tem certeza que deseja excluir a tag <strong>"{tag?.name}"</strong>?</p>
            <p className={styles.deleteWarning}>
              Esta ação não pode ser desfeita e todos os dados relacionados serão perdidos.
            </p>
          </ConfirmModal>
        </div>
      </div>
      {isOpen && (
        <div className={styles.children}>
          {tag.children.map((child) => (
            <TagContainer
              key={child.id}
              tag={child}
              data={data}
              refetch={refetch}
              open={open}
            />
          ))}
        </div>
      )}
    </div>
  );
};
