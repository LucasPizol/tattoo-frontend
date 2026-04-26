import { fetchNotifications, type NotificationResponse } from "@/features/shared/http/queries/notificationsQuery";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useState } from "react";

type NotificationsContextProps = {
  data: NotificationResponse;
  read: (key: NotificationKeys) => void;
};

const NotificationsContext = createContext<NotificationsContextProps>(
  null as unknown as NotificationsContextProps
);

type NotificationKeys = "calendar_events_today";

type Notification = {
  key: NotificationKeys;
  timestamp: string;
};

const todayFirstHour = new Date();
const todayLastHour = new Date();

todayFirstHour.setHours(0, 0, 0, 0);
todayLastHour.setHours(23, 59, 59, 999);

export const NotificationsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [readNotifications, setReadNotifications] = useState<Notification[]>(
    []
  );

  const { data } = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
  });

  const loadNotifications = () => {
    const notifications = JSON.parse(
      localStorage.getItem("notifications_read") ?? "[]"
    ) as Notification[];

    const filteredNotifications = notifications.filter(
      (notification) =>
        new Date(notification.timestamp).getTime() >=
          todayFirstHour.getTime() &&
        new Date(notification.timestamp).getTime() <= todayLastHour.getTime()
    );

    setReadNotifications(filteredNotifications);
    localStorage.setItem(
      "notifications_read",
      JSON.stringify(filteredNotifications)
    );
  };

  const read = (key: NotificationKeys) => {
    const hasNotification = readNotifications.some(
      (notification) => notification.key === key
    );

    if (hasNotification) return;

    const newNotifications = [
      ...readNotifications,
      { key, timestamp: new Date().toISOString() },
    ];

    setReadNotifications(newNotifications);

    localStorage.setItem(
      "notifications_read",
      JSON.stringify(newNotifications)
    );
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const needToNotify = (key: NotificationKeys) => {
    return !readNotifications.some((notification) => notification.key === key);
  };

  return (
    <NotificationsContext.Provider
      value={{
        data: {
          calendarEventsToday: needToNotify("calendar_events_today")
            ? data?.calendarEventsToday ?? 0
            : 0,
        },
        read,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotificationsContext = () => {
  const context = useContext(NotificationsContext);

  if (!context) {
    throw new Error(
      "useNotificationsContext must be used within a NotificationsProvider"
    );
  }

  return context;
};
