import z from "zod";

const schema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().optional(),
  startAt: z.string({
    error: "Data de início obrigatória",
  }),
  startTime: z.string({
    error: "Hora de início obrigatória",
  }),
  endTime: z.string({
    error: "Hora de término obrigatória",
  }),
  clientId: z.number().optional(),
  type: z.string({ error: "Tipo é obrigatório" }).min(1, "Tipo é obrigatório"),
  whatsappMessage: z.string().optional(),
  clientName: z.string().optional(),
  sendWhatsappMessage: z.boolean().optional(),
  phone: z.string().optional(),
});

const defaultValues: CalendarEventForm = {
  title: "",
  description: "",
  startAt: "",
  startTime: "",
  endTime: "",
  type: "",
  clientId: undefined,
  sendWhatsappMessage: true,
  phone: "",
};

export type CalendarEventForm = z.infer<typeof schema>;

export const CalendarEventSchema = {
  schema,
  defaultValues,
};
