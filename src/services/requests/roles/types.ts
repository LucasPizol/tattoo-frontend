export type Role = {
  id: number;
  name: string;
};

export type RoleWithPermissions = Role & { permissions: string[] };
export type AvailablePermission = { name: string; label: string; resource: string; action: string };
export type RoleCreatePayload = { name: string };
export type RoleUpdatePayload = { name: string };
