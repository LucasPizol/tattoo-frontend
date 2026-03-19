import { createConsumer } from "@rails/actioncable";
import { useQuery } from "@tanstack/react-query";

export type CompanyNotification =
  | {
      type: "instagram_post_published";
      instagramPost: {
        id: number;
        status: "published";
        published_at: string;
      };
    }
  | {
      type: "instagram_post_failed";
      instagramPost: {
        id: number;
        status: "failed";
      };
    }
  | {
      type: "products_price_applied";
      data: {
        status: "success" | "error";
        message: string;
      };
    }
  | {
      type: "order_processed";
      order: {
        id: number;
        status: string;
      };
    };

export const useCompanySocket = ({
  onReceived,
}: {
  onReceived: (data: CompanyNotification) => void;
}) => {
  const connect = () => {
    const socket = createConsumer(import.meta.env.VITE_SOCKET_URL as string);
    const newSubscription = socket.subscriptions.create(
      { channel: "CompanyChannel" },
      {
        received: async (data: CompanyNotification) => {
          onReceived(data);
        },
      },
    );

    return newSubscription;
  };

  useQuery({
    queryKey: ["company-socket"],
    queryFn: () => {
      return connect();
    },
    staleTime: 1000 * 60 * 5,
  });

  return null;
};
