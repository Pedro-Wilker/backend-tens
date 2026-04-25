1. 👤 USERS (Usuários)
Criar Conta (Pública)

Método: POST

URL: http://localhost:3333/v1/users

Body (JSON):

JSON
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "senha_segura",
  "number": "11999999999"
}
Login / Sessão (Pública) -> ⚠️ Copie o Token gerado aqui!

Método: POST

URL: http://localhost:3333/v1/users/session

Body (JSON):

JSON
{
  "email": "joao@email.com",
  "password": "senha_segura"
}
Buscar Meu Perfil (Autenticada)

Método: GET

URL: http://localhost:3333/v1/users/me

Auth: Bearer Token

2. 🗂 CATEGORIES (Categorias)
Criar Categoria (Autenticada + Admin/Support)

Método: POST

URL: http://localhost:3333/v1/categories

Auth: Bearer Token (de um usuário Admin)

Body: Mude de "JSON" para Multipart Form no Insomnia.

name: Construção (Tipo Text)

file: Selecione uma imagem do seu computador (Tipo File)

Listar Todas (Pública)

Método: GET

URL: http://localhost:3333/v1/categories

3. 📂 SUBCATEGORIES (Subcategorias)
Criar Subcategoria (Autenticada + Admin/Support)

Método: POST

URL: http://localhost:3333/v1/subcategories

Auth: Bearer Token

Body (JSON):

JSON
{
  "categoryId": 1,
  "name": "Pedreiro"
}
Listar por Categoria (Pública)

Método: GET

URL: http://localhost:3333/v1/subcategories/category/1 (Onde 1 é o ID da categoria)

4. 🛠 SERVICES (Serviços)
Criar Serviço (Autenticada)

Método: POST

URL: http://localhost:3333/v1/services

Auth: Bearer Token

Body (JSON):

JSON
{
  "providerId": 1,
  "subcategoryId": 1,
  "name": "Reforma de Banheiro",
  "description": "Reforma completa com troca de piso e azulejos.",
  "price": 1500.00
}
Listar Todos os Serviços (Pública)

Método: GET

URL: http://localhost:3333/v1/services

5. 📸 SERVICE DETAILS (Portfólio / Fotos)
Adicionar Fotos ao Serviço (Autenticada)

Método: POST

URL: http://localhost:3333/v1/service-details

Auth: Bearer Token

Body: Mude para Multipart Form no Insomnia.

serviceId: 1 (Tipo Text)

description: Foto do antes e depois (Tipo Text - opcional)

file: Selecione uma imagem (Tipo File)

Nota: Como a rota aceita array (upload.array), você pode adicionar vários campos com o exato nome file no Insomnia e selecionar fotos diferentes para cada um.

6. ⭐ RATINGS (Avaliações)
Avaliar Serviço (Autenticada)

Método: POST

URL: http://localhost:3333/v1/ratings

Auth: Bearer Token

Body (JSON):

JSON
{
  "serviceId": 1,
  "rating": 5
}
Ver Notas de um Serviço (Pública)

Método: GET

URL: http://localhost:3333/v1/ratings/1 (Onde 1 é o ID do serviço)

7. 💬 COMMENTS (Comentários)
Comentar em um Serviço (Autenticada)

Método: POST

URL: http://localhost:3333/v1/comments

Auth: Bearer Token

Body (JSON):

JSON
{
  "serviceId": 1,
  "text": "Excelente profissional, recomendo!"
}
8. 🗣 SUBCOMMENTS (Respostas aos Comentários)
Responder a um Comentário (Autenticada)

Método: POST

URL: http://localhost:3333/v1/subcomments/1 (Onde 1 é o ID do comentário original)

Auth: Bearer Token

Body (JSON):

JSON
{
  "text": "Muito obrigado pela confiança!"
}