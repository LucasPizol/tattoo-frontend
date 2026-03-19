import { api } from "@/services/api";

type Params = Array<{
  user_id: number;
  order_id: number;
  comission_value: number;
  received_value: number;
  payment_method_id: number | null;
}>;

export const UserComissionsRequests = {
  upsert: (params: Params) =>
    api.post<void>("/api/user_comissions", {
      user_comissions: params,
    }),
};
