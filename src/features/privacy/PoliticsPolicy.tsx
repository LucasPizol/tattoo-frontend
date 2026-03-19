import { PageWrapper } from "@/components/PageWrapper";
import Markdown from "react-markdown";

export const PoliticsPolicy = () => {
  const markdown = `
# Política de Privacidade e Segurança
### Nome do Site/Aplicativo: Rainbow Software, Data de Vigência: 03 de dezembro de 2025
### 1. Introdução
Nossa plataforma foi projetada para ajudar vendedores de piercing a gerenciar seus negócios de forma eficiente, oferecendo ferramentas para o controle de clientes, produtos, pedidos e outras atividades comerciais. Esta Política de Privacidade e Segurança descreve como coletamos, utilizamos, processamos e protegemos suas informações, incluindo os dados acessados através da integração com a API do Instagram, em total conformidade com os Termos da Plataforma da Meta.
Ao utilizar nossos serviços, você concorda com as práticas descritas neste documento.
### 2. Coleta de Informações
Para fornecer e aprimorar nossos serviços, coletamos diferentes tipos de informações:
- Informações de Cadastro: Quando você cria uma conta, coletamos dados como seu nome, endereço de e-mail, nome da loja e informações de contato.
- Dados de Gerenciamento: A plataforma armazena as informações que você insere e gerencia, incluindo dados de seus clientes (nome, contato), lista de produtos (descrições, preços, estoque) e registros de pedidos (histórico, status).
- Informações de Uso: Coletamos dados sobre como você interage com nossa plataforma, como as funcionalidades que utiliza e a frequência de acesso, para fins de análise e melhoria do serviço.
- Dados da API do Instagram: Com sua autorização explícita, coletamos dados de sua(s) conta(s) do Instagram para habilitar a funcionalidade de publicação de conteúdo. Além disso, acessamos somente 3 dados de sua conta: Nome de usuário, foto de perfil e ID
### 3. Integração com a API do Instagram
Nossa plataforma oferece a funcionalidade de conectar sua conta do Instagram para criar e agendar publicações em um ou mais perfis simultaneamente. Para isso, utilizamos a API oficial do Instagram (parte da Plataforma Meta).
Conexão e Permissões
Ao conectar sua conta do Instagram, você será redirecionado para uma tela de autenticação segura da Meta, onde solicitaremos sua autorização para as seguintes permissões:
- instagram_business_content_publish: Permite que nosso aplicativo publique fotos, vídeos e carrosséis em seu nome.
- instagram_basic e pages_read_engagement: Permitem o acesso a dados básicos do seu perfil e da Página do Facebook associada, necessários para a publicação e gerenciamento.
- instagram_business_management: Permite o gerenciamento de permissões e configurações da conta comercial.
Nós nunca solicitaremos ou armazenaremos sua senha do Instagram. A conexão é feita através de um token de acesso seguro e revogável, fornecido pela Meta.
Uso dos Dados do Instagram
Os dados obtidos através da API do Instagram são utilizados exclusivamente para:
- Autenticar sua conta e confirmar que você possui as permissões necessárias.
- Publicar o conteúdo (imagens, vídeos, legendas) que você cria e agenda em nossa plataforma.
- Exibir informações básicas do seu perfil conectado dentro da nossa interface para facilitar o gerenciamento.
### 4. Uso e Processamento das Informações
Utilizamos as informações coletadas para as seguintes finalidades:
- Operação do Serviço: Fornecer, manter e aprimorar as funcionalidades da plataforma, como o gerenciamento de clientes, produtos e pedidos.
- Comunicação: Enviar notificações importantes sobre sua conta, atualizações de serviço e informações de suporte.
- Publicação no Instagram: Executar as ações de publicação de conteúdo conforme instruído por você através da nossa interface.
- Segurança: Proteger a segurança de sua conta e da nossa plataforma, prevenindo fraudes e atividades não autorizadas.
- Conformidade Legal: Cumprir com nossas obrigações legais e regulatórias.
### 5. Compartilhamento de Dados
Nós não vendemos ou alugamos suas informações pessoais. O compartilhamento de dados ocorre apenas nas seguintes circunstâncias:
- Com a Meta/Instagram: O compartilhamento de dados é inerente à funcionalidade de publicação. Ao usar a integração, você instrui a Meta a publicar seu conteúdo no Instagram.
- Provedores de Serviço: Podemos utilizar serviços de terceiros para nos auxiliar na operação da plataforma (ex: provedores de hospedagem em nuvem). Esses provedores têm acesso limitado às suas informações, apenas o necessário para executar suas tarefas, e são contratualmente obrigados a protegê-las.
- Obrigações Legais: Podemos divulgar suas informações se formos obrigados por lei, intimação ou outro processo legal.
### 6. Segurança de Dados
Levamos a segurança dos seus dados a sério e implementamos medidas técnicas, administrativas e físicas para proteger suas informações contra acesso não autorizado, alteração, divulgação ou destruição. Nossas medidas incluem:
- Criptografia de dados em trânsito (SSL/TLS).
- Armazenamento de informações em servidores seguros.
- Controles de acesso rigorosos para garantir que apenas pessoal autorizado tenha acesso a dados sensíveis.
- Monitoramento contínuo de nossos sistemas para detectar vulnerabilidades e ataques.
### 7. Seus Direitos e a Exclusão de Dados
Respeitamos seu direito de controlar suas informações. Você tem o direito de acessar, corrigir e solicitar a exclusão dos seus dados.

**Acesso e Correção**
Você pode revisar e atualizar a maioria das informações da sua conta diretamente nas configurações da plataforma. Para informações que não podem ser alteradas por você, entre em contato conosco.

**Exclusão de Dados**
Você pode solicitar a exclusão completa dos seus dados a qualquer momento. Para fazer isso, por favor, envie um e-mail para lucaspizolfe@gmail.com com o assunto “Solicitação de Exclusão de Dados”.
Para excluir qualquer dado relacionado à sua conta do Instagram, você deve acessar a aba de configurações da sua conta do Instagram e clicar no ícone similar a uma lixeira. Com isso, todo e qualquer dado relacionado à sua conta do Instagram será excluído, incluindo tokens, ID, foto de perfil e nome de usuário.

### 8. Alterações a esta Política
Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre quaisquer alterações significativas, publicando a nova política em nosso site e, se aplicável, enviando uma notificação por e-mail.

### 9. Contato
Se você tiver alguma dúvida ou preocupação sobre esta Política de Privacidade ou nossas práticas de dados, entre em contato conosco pelo e-mail: lucaspizolfe@gmail.com

  `;

  return (
    <PageWrapper title=" ">
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <Markdown
          components={{
            li: ({ children }) => (
              <li
                style={{
                  listStyleType: "disc",
                  marginLeft: "16px",
                  marginTop: "4px",
                  marginBottom: "4px",
                }}
              >
                {children}
              </li>
            ),
          }}
        >
          {markdown}
        </Markdown>
      </div>
    </PageWrapper>
  );
};
