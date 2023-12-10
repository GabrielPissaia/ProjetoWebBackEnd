**Link Video Explicação**
https://www.youtube.com/watch?v=27ktRVhloMI

**Baixar Dependencias**
Yarn Install

**Rodar Projeto**
Yarn start

**Rota do Swagger**
http://localhost:3000/api-docs

**Funcionalidades**
A API backend possui as seguintes funcionalidades:

-Cadastro e autenticação de usuários

-Autenticação e autorização de rotas utilizando JWT (JSON Web Token)

-Conexão com um banco de dados MySql utilizando Sequelize

**Tecnologias utilizadas**

-Node.js

-Express.js

-MySql

-WorckBacnh

-JWT (JSON Web Token)

-Insomnia (para testar a API)

**Estrutura de Pastas**
O projeto está organizado da seguinte forma:

-config: Contém arquivos de configuração do projeto.

-controllers: Armazena os controladores da aplicação, que manipulam a lógica de negócios.

-middlewares: Guarda os middlewares, funções que podem ser executadas antes ou depois dos controladores.

-models: Define os modelos de dados da aplicação.

-routes: Contém os arquivos de definição de rotas.

-swagger: Armazena os arquivos de configuração do Swagger.

-utils: Contém utilitários, funções e módulos reutilizáveis.

-index.js: Ponto de entrada da aplicação.

**Configurações**
A pasta config inclui arquivos de configuração importantes para o funcionamento do projeto:

-auth.js: Configurações de autenticação.

-database.js: Configurações do banco de dados.

**Controladores**
Os controladores, na pasta controllers, contêm a lógica principal da aplicação. Cada arquivo geralmente representa uma entidade ou recurso.

Exemplo:

UserController.js: Controlador para operações relacionadas a usuários.

**Middlewares**
A pasta middlewares armazena funções de middleware usadas em diferentes partes da aplicação.

Exemplo:

authMiddleware.js: Middleware para autenticação de usuários.

**Modelos**
Os modelos de dados da aplicação são definidos na pasta models.

Exemplo:

User.js: Modelo para a entidade de usuário.

**Rotas**
Os arquivos na pasta routes definem as rotas da aplicação.

Exemplo:

userRoutes.js: Define as rotas relacionadas a usuários.

**Swagger**
A pasta swagger inclui arquivos de configuração para o Swagger, uma ferramenta de documentação.

Exemplo:

swagger.yaml: Configuração principal do Swagger.

**Utilitários**
A pasta utils contém funções e módulos reutilizáveis.

Exemplo:

helpers.js: Funções de auxílio genéricas.

**Ponto de Entrada**
O arquivo index.js é o ponto de entrada da aplicação
