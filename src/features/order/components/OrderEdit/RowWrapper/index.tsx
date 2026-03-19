import { Form } from "@/components/Form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
  quantity: z.number(),
  price: z.number(),
});

type FormData = z.infer<typeof formSchema>;

export const RowWrapper = ({
  children,
  onSubmit,
}: {
  children: React.ReactNode;
  onSubmit: (data: FormData) => void;
}) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  return (
    <Form form={form} onSubmit={onSubmit}>
      {children}
    </Form>
  );
};
