const BASE_URL = 'http://localhost:3333/v1';
let authToken = '';

function logResult(step, status, data) {
  const isSuccess = status >= 200 && status < 300;
  const icon = isSuccess ? '✅' : '❌';
  console.log(`\n${icon} [${step}] - Status: ${status}`);
  console.log(JSON.stringify(data, null, 2));
}

async function runTests() {
  console.log("🚀 Iniciando Testes Automatizados da API...");

  try {
    // Gera um número de telefone aleatório (Ex: 11987654321)
    const randomPhone = `119${Math.floor(10000000 + Math.random() * 90000000)}`;

    const createUserRes = await fetch(`${BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: "Testador Automático",
        email: `testador_${Date.now()}@email.com`, 
        password: "senha_segura",
        number: randomPhone // <-- Agora o telefone é dinâmico e nunca repete!
      })
    });
    const createUserData = await createUserRes.json();
    logResult('CRIAR USUÁRIO', createUserRes.status, createUserData);

    if (createUserRes.status >= 400) {
        console.log("⚠️ Parando os testes porque a criação de usuário falhou.");
        return;
    }

    const loginRes = await fetch(`${BASE_URL}/users/session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: createUserData.email, 
        password: "senha_segura"
      })
    });
    const loginData = await loginRes.json();
    logResult('LOGIN E GERAÇÃO DE TOKEN', loginRes.status, loginData);
    
    authToken = loginData.token;

    const errorRes = await fetch(`${BASE_URL}/users/me`, {
      method: 'GET',
    });
    const errorData = await errorRes.json();
    logResult('TESTE DE ERRO (Sem Token 401)', errorRes.status, errorData);

    const adminErrorRes = await fetch(`${BASE_URL}/subcategories`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ categoryId: 1, name: "Teste Admin" })
    });
    const adminErrorData = await adminErrorRes.json();
    logResult('TESTE DE ERRO (Usuário comum em Rota Admin 403)', adminErrorRes.status, adminErrorData);

    const profileRes = await fetch(`${BASE_URL}/users/me`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const profileData = await profileRes.json();
    logResult('BUSCAR MEU PERFIL', profileRes.status, profileData);

    const serviceRes = await fetch(`${BASE_URL}/services`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        providerId: profileData.id, 
        subcategoryId: 1, 
        name: `Reforma de Teste ${Date.now()}`,
        description: "Teste automatizado",
        price: 150.00
      })
    });
    const serviceData = await serviceRes.json();
    logResult('CRIAR SERVIÇO', serviceRes.status, serviceData);

    console.log("\n🏁 Testes finalizados!");

  } catch (err) {
    console.error("❌ Ocorreu um erro no script de teste:", err);
  }
}

runTests();