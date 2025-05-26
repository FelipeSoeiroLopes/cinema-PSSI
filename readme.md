# Sistema de Login, Cadastro e Acesso ao Cinema - Projeto Simulado

**Código desenvolvido por:** Camila Santos, Felipe Lopes, Victor Guimarães, Lucas Koiti e Kauã da Silveira

---

Este projeto é uma simulação de um sistema de autenticação completo, com **login**, **cadastro** e **recuperação de senha**, desenvolvido em **HTML5, CSS3 e JavaScript puro**. Após o login, o usuário é redirecionado para uma área exclusiva de filmes (pasta `CINEMA/`), que já está **integrada com a API pública do TMDB** (The Movie Database), permitindo a busca e exibição de sinopse de filmes reais em tempo real.

O objetivo é demonstrar boas práticas de segurança no frontend e servir como base para futuras integrações com backend real, banco de dados e outras APIs externas.

---

## ✅ Funcionalidades Implementadas

- Tela de **cadastro** com validação de senha forte e feedback visual
- Tela de **login** com verificação de credenciais
- Sistema de **recuperação de senha** com token temporário, expiração e uso único
- Feedback visual da **força da senha** e requisitos dinâmicos
- Alternância suave entre login, cadastro e recuperação
- Visualização de senha (olhinho) no campo de cadastro
- Armazenamento simulado com `localStorage` e `cookies` (apenas para fins didáticos)
- **Redirecionamento automático para a área de filmes** (`CINEMA/index.html`) após login bem-sucedido
- **Página de filmes integrada à API TMDB**: busca, exibição de pôster, título, nota e sinopse dos filmes em português
- Busca dinâmica de filmes por nome, consumindo dados reais da API

---

## 🔐 Medidas de Segurança Implementadas

> ⚠️ **Este é um projeto educacional e de simulação. Não utilize em produção sem adaptações!**

- **Saneamento de entradas do usuário**: Todos os dados digitados são tratados para evitar ataques XSS (Cross-Site Scripting), utilizando `textContent` para escapar valores.
- **Validação forte de senha**: O cadastro e a redefinição exigem senha com no mínimo 8 caracteres, incluindo letra maiúscula, minúscula, número e símbolo. O usuário recebe feedback visual dos requisitos atendidos.
- **Token de recuperação de senha seguro**:
  - Geração de token aleatório de 6 dígitos
  - Token expira em 5 minutos
  - Token só pode ser usado uma vez
  - O campo de nova senha só aparece após validação do token
- **Bloqueio de múltiplos usos de token**: O token é invalidado após o uso ou expiração, impedindo tentativas de reutilização.
- **Uso de cookies seguros**: Cookies são definidos com as flags `Secure` e `SameSite=Lax` para evitar vazamento de informações em conexões inseguras e ataques CSRF. Apenas informações não sensíveis (como email e status de login) são armazenadas em cookies.
- **Separação clara de etapas**: O fluxo de recuperação de senha é dividido em etapas, evitando que o usuário pule etapas ou abuse do sistema.
- **Feedbacks claros ao usuário**: Mensagens de erro e sucesso são exibidas em cada etapa, orientando o usuário e dificultando tentativas de engenharia social.
- **Visualização de senha**: O campo de senha do cadastro possui um ícone de olhinho para facilitar a digitação, sem comprometer a segurança.
- **Armazenamento local apenas para simulação**: Todos os dados são salvos em `localStorage` apenas para fins didáticos. Não há armazenamento de senhas em texto puro em produção.
- **Acesso protegido à área de filmes**: O acesso à pasta `CINEMA/` só é liberado após autenticação, simulando um ambiente restrito para usuários logados.
- **Estrutura modular e fácil de adaptar**: O código está organizado para facilitar futuras integrações com autenticação real, APIs e banco de dados.

---

## ⚠️ Observações Importantes

- **Não utiliza backend real**: Todos os dados são armazenados localmente via `localStorage` (simulação).
- **Não use em produção sem adaptações**: Para uso real, implemente:
  - Armazenamento seguro das senhas (hashing e criptografia)
  - Autenticação com JWT ou sessões
  - Integração com banco de dados e APIs reais
  - Backend seguro para envio de e-mails e gerenciamento de tokens
  - Controle real de acesso à área de filmes

---

## 📁 Estrutura do Projeto

```
📆 raiz/
├── index.html
├── style.css
├── script.js
├── readme.md
└── CINEMA/
    ├── index.html (página protegida após login)
    ├── style.css
    └── script.js
```

---

## 💡 Futuras Melhorias

- Integração com backend (Node.js/Express ou outro)
- Uso de JWT para autenticação
- Conexão com banco de dados (MongoDB, PostgreSQL, etc)
- Criptografia de senhas com bcrypt
- Gerenciamento de sessões e tokens expiráveis
- Integração com outras APIs de filmes (ex: OMDB)
- Envio real de e-mails para recuperação de senha
- Controle de acesso real à área de filmes
- Personalização do perfil do usuário
- Favoritos e avaliações de filmes

---

## 🛠️ Tecnologias Usadas

- HTML5
- CSS3
- JavaScript (Vanilla)
- Integração com API TMDB (The Movie Database)
