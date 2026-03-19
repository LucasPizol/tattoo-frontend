export type CalendarEvent = {
  id: number;
  title: string;
  displayTitle: string;
  description: string;
  startAt: string;
  endAt: string;
  color: string;
  phone?: string;
  clientName?: string;
  whatsappMessage?: string;
  sendWhatsappMessage?: boolean;
  eventType: {
    value: string;
    label: string;
  };
  client?: {
    id: number;
    name: string;
  };
  status: {
    value: string;
    label: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type CreateCalendarEventPayload = {
  title: string;
  description: string;
  start_at: string;
  end_at: string;
  event_type: string;
  client_id?: number;
  phone?: string;
  client_name?: string;
  whatsapp_message?: string;
  send_whatsapp_message?: boolean;
};

export type CalendarEventFilters = {
  start_at_gteq?: string;
  end_at_lteq?: string;
  event_type_in?: string[];
  status_in?: string[];
  title_cont?: string;
  client_id_eq?: number;
};
