import { api } from "@/services/api";
import type { AvailablePermission, Role, RoleCreatePayload, RoleUpdatePayload, RoleWithPermissions } from "./types";

const index = async () => {
  const response = await api.get<{ roles: Role[] }>("/api/roles");
  return response.roles;
};

const show = async (id: number) => {
  const response = await api.get<{ role: RoleWithPermissions }>(`/api/roles/${id}`);
  return response.role;
};

const create = async (payload: RoleCreatePayload) => {
  const response = await api.post<{ role: RoleWithPermissions }>("/api/roles", { role: payload });
  return response.role;
};

const update = async (id: number, payload: RoleUpdatePayload) => {
  const response = await api.put<{ role: RoleWithPermissions }>(`/api/roles/${id}`, { role: payload });
  return response.role;
};

const destroy = async (id: number) => {
  await api.delete(`/api/roles/${id}`);
};

const updatePermissions = async (roleId: number, permissions: string[]) => {
  const response = await api.put<{ permissions: string[] }>(`/api/roles/${roleId}/permissions`, { permissions });
  return response.permissions;
};

const availablePermissions = async () => {
  const response = await api.get<{ permissions: AvailablePermission[] }>("/api/roles/available_permissions");
  return response.permissions;
};

export const RoleRequests = {
  index,
  show,
  create,
  update,
  destroy,
  updatePermissions,
  availablePermissions,
};
