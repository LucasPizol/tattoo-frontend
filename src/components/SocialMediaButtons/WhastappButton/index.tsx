import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { FaWhatsapp } from "react-icons/fa";
import styles from "./styles.module.scss";

export const WhatsappButton = () => {
  const [isLoading, setIsLoading] = useState(false);

  const fbLoginCallback = (response: any) => {
    if (response.authResponse) {
      const code = response.authResponse.code;
      console.log("response: ", code);
    } else {
      console.log("response: ", response);
    }
  };

  const launchWhatsAppSignup = () => {
    (window as any).FB.login(fbLoginCallback, {
      config_id: "1437580641154378",
      response_type: "code",
      override_default_response_type: true,
      extras: {
        setup: {},
      },
    });
  };

  return (
    <Button
      className={styles.whatsappButton}
      onClick={async () => {
        setIsLoading(true);
        try {
          launchWhatsAppSignup();
        } catch (error) {
          toast.error("Erro ao conectar ao WhatsApp");
        } finally {
          setIsLoading(false);
        }
      }}
      disabled={isLoading}
      prefixIcon={<FaWhatsapp size={18} />}
    >
      Conectar WhatsApp
    </Button>
  );
};
