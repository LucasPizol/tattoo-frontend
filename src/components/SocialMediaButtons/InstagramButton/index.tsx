import { Button } from "@/components/ui/Button";
import { api } from "@/services/api";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { FaInstagram } from "react-icons/fa";
import styles from "./styles.module.scss";

export const InstagramButton = () => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Button
      className={styles.instagramButton}
      onClick={async () => {
        setIsLoading(true);
        try {
          const { url } = await api.get<{ url: string }>("/api/instagram/redirects");
          window.open(url, "igLogin", "width=600,height=700");
        } catch (error) {
          toast.error("Erro ao conectar ao Instagram");
        } finally {
          setIsLoading(false);
        }
      }}
      disabled={isLoading}
      prefixIcon={<FaInstagram size={18} />}
    >
      Conectar Instagram
    </Button>
  );
};
