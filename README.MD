# 🚀 Documentação da API V1

Bem-vindo à documentação oficial da API V1. Esta API foi construída em Node.js com Express, TypeScript e Prisma ORM (PostgreSQL).

## 📌 Visão Geral
- **Base URL:** `http://localhost:3333/v1` (ou a URL de produção na Vercel/VPS)
- **Formato de Resposta:** `application/json`
- **Upload de Arquivos:** `multipart/form-data`

---

## 🔒 Autenticação
A maioria das rotas privadas exige um Token JWT.
Para acessar essas rotas, envie o token no Header da requisição:
`Authorization: Bearer <SEU_TOKEN_AQUI>`

---

## 👤 1. Usuários (`/v1/users`)

| Método | Rota | Autenticação | Descrição |
|---|---|---|---|
| **POST** | `/users` | Pública | Cria uma nova conta de usuário. |
| **POST** | `/users/session` | Pública | Realiza o login e retorna o Token JWT. |
| **GET** | `/users/me` | Bearer Token | Retorna os dados básicos do usuário logado. |
| **GET** | `/users/profile` | Bearer Token | Retorna o perfil detalhado (com serviços associados). |
| **PUT** | `/users/:userId` | Bearer Token | Atualiza dados do usuário (apenas o próprio usuário). |
| **DELETE** | `/users/:userId` | Bearer Token | Deleta a conta do usuário. |

---

## 🗂 2. Categorias (`/v1/categories`)

| Método | Rota | Autenticação | Descrição |
|---|---|---|---|
| **GET** | `/categories` | Pública | Lista todas as categorias com média de notas. |
| **GET** | `/categories/carousel` | Pública | Lista versão simplificada para carrossel. |
| **GET** | `/categories/:categoryId` | Pública | Detalhes de uma categoria específica. |
| **GET** | `/categories/name/:name` | Pública | Busca categoria por nome (case-insensitive). |
| **POST** | `/categories` | Bearer Token (Admin) | Cria nova categoria. *Requer `multipart/form-data` (campo `file`).* |
| **PUT** | `/categories/:categoryId` | Bearer Token (Admin) | Atualiza categoria. *Requer `multipart/form-data`.* |
| **DELETE** | `/categories/:categoryId` | Bearer Token (Admin) | Deleta categoria e arquivo físico. |

---

## 📂 3. Subcategorias (`/v1/subcategories`)

| Método | Rota | Autenticação | Descrição |
|---|---|---|---|
| **GET** | `/subcategories` | Pública | Lista todas as subcategorias com serviços formatados. |
| **GET** | `/subcategories/:subcategoryId` | Pública | Detalhes de uma subcategoria específica. |
| **GET** | `/subcategories/category/:categoryId`| Pública | Lista subcategorias de uma categoria pai. |
| **POST** | `/subcategories` | Bearer Token (Admin) | Cria nova subcategoria (Requer `categoryId` e `name`). |
| **PUT** | `/subcategories/:subcategoryId`| Bearer Token (Admin) | Atualiza o nome da subcategoria. |
| **DELETE** | `/subcategories/:subcategoryId`| Bearer Token (Admin) | Deleta subcategoria. |

---

## 🛠 4. Serviços (`/v1/services`)

| Método | Rota | Autenticação | Descrição |
|---|---|---|---|
| **GET** | `/services` | Pública | Lista todos os serviços disponíveis. |
| **GET** | `/services/:serviceId` | Pública | Retorna detalhes completos de um serviço. |
| **GET** | `/services/category/:categoryId`| Pública | Lista serviços filtrados por Categoria PAI. |
| **POST** | `/services` | Bearer Token | Provider cria um novo serviço. |
| **PUT** | `/services/:serviceId` | Bearer Token | Provider atualiza dados do serviço. |
| **DELETE** | `/services/:serviceId` | Bearer Token | Deleta serviço e apaga todas as fotos relacionadas. |

---

## 📸 5. Detalhes de Serviço / Portfólio (`/v1/service-details`)

| Método | Rota | Autenticação | Descrição |
|---|---|---|---|
| **GET** | `/service-details/:serviceId` | Pública | Lista todas as fotos de um serviço. |
| **POST** | `/service-details` | Bearer Token | Adiciona fotos. *Upload múltiplo (array de `file`).* |
| **PUT** | `/service-details/:serviceId` | Bearer Token | Substitui as fotos atuais por novas. |
| **DELETE** | `/service-details/:serviceId/:detailId` | Bearer Token | Deleta uma foto específica do servidor. |

---

## ⭐ 6. Avaliações (`/v1/ratings`)

| Método | Rota | Autenticação | Descrição |
|---|---|---|---|
| **GET** | `/ratings/:serviceId` | Pública | Retorna todas as notas e a média do serviço. |
| **POST** | `/ratings` | Bearer Token | Avalia um serviço (Nota de 1 a 5). |

---

## 💬 7. Comentários (`/v1/comments` e `/v1/subcomments`)

### Comentários Principais
| Método | Rota | Autenticação | Descrição |
|---|---|---|---|
| **GET** | `/comments/:serviceId` | Pública | Lista comentários de um serviço. |
| **POST** | `/comments` | Bearer Token | Cria um comentário em um serviço. |
| **PUT** | `/comments/:commentId` | Bearer Token | Edita o próprio comentário. |
| **DELETE** | `/comments/:commentId` | Bearer Token | Deleta o próprio comentário. |

### Respostas (Subcomments)
| Método | Rota | Autenticação | Descrição |
|---|---|---|---|
| **GET** | `/subcomments/:commentId` | Pública | Lista respostas de um comentário. |
| **POST** | `/subcomments/:commentId` | Bearer Token | Responde a um comentário existente. |
| **PUT** | `/subcomments/:subcommentId` | Bearer Token | Edita a própria resposta. |
| **DELETE** | `/subcomments/:subcommentId` | Bearer Token | Deleta a própria resposta. |