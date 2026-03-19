import { Button } from "@/components/ui/Button";
import { CatalogsRequests } from "@/services/requests/catalogs";
import { CatalogType } from "@/services/requests/catalogs/types";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { MdPictureAsPdf } from "react-icons/md";

export const CatalogViewer = () => {
  const [isDownloading, setIsDownloading] = useState(false);

  const onDownload = async (type: CatalogType) => {
    try {
      setIsDownloading(true);
      const blob = await CatalogsRequests.show(type);

      // Verificar se o blob é válido
      if (!blob || blob.size === 0) {
        toast.error("PDF não encontrado ou vazio");
        return;
      }

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "catalogo-produtos.pdf";
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Catálogo baixado com sucesso!");
    } catch (error) {
      toast.error("Erro ao baixar catálogo. Tente novamente.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button
      prefixIcon={<MdPictureAsPdf />}
      onClick={() => onDownload(CatalogType.CLIENT)}
      variant="secondary"
      loading={isDownloading}
    >
      Baixar Catálogo
    </Button>
  );
};
