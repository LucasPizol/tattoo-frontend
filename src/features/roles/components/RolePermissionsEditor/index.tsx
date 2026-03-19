import { Button } from "@/components/ui/Button";
import { useAvailablePermissions } from "../../http/queries/useAvailablePermissions";
import { useUpdatePermissions } from "../../http/mutations/useUpdatePermissions";
import { useEffect, useMemo, useState } from "react";
import styles from "./styles.module.scss";

type Props = {
  roleId: number;
  currentPermissions: string[];
};

export const RolePermissionsEditor = ({ roleId, currentPermissions }: Props) => {
  const { permissions: available, isLoading } = useAvailablePermissions();
  const { updatePermissions, isLoading: isSaving } = useUpdatePermissions(roleId);

  const [selected, setSelected] = useState<Set<string>>(() => new Set(currentPermissions));

  useEffect(() => {
    setSelected(new Set(currentPermissions));
  }, [currentPermissions]);

  const grouped = useMemo(() => {
    if (!available) return {};
    return available.reduce<Record<string, typeof available>>((acc, p) => {
      if (!acc[p.resource]) acc[p.resource] = [];
      acc[p.resource].push(p);
      return acc;
    }, {});
  }, [available]);

  const togglePermission = (name: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  };

  const toggleGroup = (resource: string) => {
    const group = grouped[resource] ?? [];
    const allSelected = group.every((p) => selected.has(p.name));
    setSelected((prev) => {
      const next = new Set(prev);
      group.forEach((p) => (allSelected ? next.delete(p.name) : next.add(p.name)));
      return next;
    });
  };

  const getGroupState = (resource: string): "all" | "none" | "partial" => {
    const group = grouped[resource] ?? [];
    const count = group.filter((p) => selected.has(p.name)).length;
    if (count === 0) return "none";
    if (count === group.length) return "all";
    return "partial";
  };

  const handleSave = async () => {
    await updatePermissions(Array.from(selected));
  };

  if (isLoading) return <p>Carregando permissões...</p>;

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {Object.entries(grouped).map(([resource, perms]) => {
          const state = getGroupState(resource);
          return (
            <div key={resource} className={styles.group}>
              <label className={styles.groupHeader}>
                <input
                  type="checkbox"
                  checked={state === "all"}
                  ref={(el) => {
                    if (el) el.indeterminate = state === "partial";
                  }}
                  onChange={() => toggleGroup(resource)}
                />
                <span className={styles.groupLabel}>{resource}</span>
              </label>
              <div className={styles.permissions}>
                {perms.map((p) => (
                  <label key={p.name} className={styles.permission}>
                    <input
                      type="checkbox"
                      checked={selected.has(p.name)}
                      onChange={() => togglePermission(p.name)}
                    />
                    <span>{p.label}</span>
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <div className={styles.actions}>
        <Button onClick={handleSave} loading={isSaving}>
          Salvar Permissões
        </Button>
      </div>
    </div>
  );
};
