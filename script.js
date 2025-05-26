document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('container');
  const registerBtn = document.getElementById('register');
  const loginBtn = document.getElementById('login');
  const welcomeScreen = document.getElementById('welcome-screen');
  const forgotLink = document.getElementById('forgot-password-link');
  const backToLogin = document.getElementById('back-to-login');

  // ----- Saneamento de entradas -----
  function sanitize(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  }

  // ----- Cookies seguros -----
  function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${encodeURIComponent(value)};expires=${d.toUTCString()};path=/;SameSite=Lax;Secure`;
  }

  function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let c of cookies) {
      const [key, val] = c.trim().split('=');
      if (key === name) return decodeURIComponent(val);
    }
    return null;
  }

  // Alternância entre telas
  welcomeScreen.style.display = 'none';

  registerBtn.addEventListener('click', () => {
    container.classList.add('active');
    container.classList.remove('forgot');
  });

  loginBtn.addEventListener('click', () => {
    container.classList.remove('active');
    container.classList.remove('forgot');
  });

  forgotLink.addEventListener('click', (e) => {
    e.preventDefault();
    container.classList.add('forgot');
    resetarRecuperacao();
  });

  backToLogin.addEventListener('click', (e) => {
    e.preventDefault();
    container.classList.remove('forgot');
    resetarRecuperacao();
  });

  // ----- Validação de senha forte -----
  function senhaForte(senha) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regex.test(senha);
  }

  // ----- Cadastro -----
  document.getElementById('register-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = sanitize(document.getElementById('reg-name').value.trim());
    const email = sanitize(document.getElementById('reg-email').value.trim());
    const password = document.getElementById('reg-password').value;

    if (!senhaForte(password)) {
      alert('A senha deve conter pelo menos 8 caracteres, incluindo letra maiúscula, minúscula, número e símbolo.');
      return;
    }

    const user = { name, email, password };

    // ⚠️ localStorage não é seguro para dados sensíveis. Use backend seguro em produção.
    localStorage.setItem('user', JSON.stringify(user));
    setCookie('userEmail', email, 7); // Cookie limitado apenas ao email
    alert('Conta criada com sucesso!');
    container.classList.remove('active');
  });

  // ----- Login -----
  document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const user = JSON.parse(localStorage.getItem('user'));

    if (user && email === user.email && password === user.password) {
      setCookie('loggedIn', 'true', 1);
      setCookie('userEmail', user.email, 7);
      window.location.href = 'CINEMA/index.html';
    } else {
      alert('Email ou senha incorretos.');
    }
  });

  // ----- Recuperação de senha com token seguro -----
  const forgotForm = document.getElementById('forgot-form');
  const forgotEmail = document.getElementById('forgot-email');
  const newPassword = document.getElementById('new-password');
  const confirmPassword = document.getElementById('confirm-password');
  const forgotSubmit = document.getElementById('forgot-submit');

  let etapa = 1;
  let tokenGerado = '';
  let tokenExpira = null;
  let tokenUsado = false;

  function gerarToken() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  function criarCampoToken() {
    let tokenInput = document.getElementById('token-input');
    if (!tokenInput) {
      tokenInput = document.createElement('input');
      tokenInput.type = 'text';
      tokenInput.placeholder = 'Digite o token recebido';
      tokenInput.id = 'token-input';
      tokenInput.required = true;
      forgotEmail.insertAdjacentElement('afterend', tokenInput);
    }
    tokenInput.style.display = 'block';
    tokenInput.disabled = false;
    return tokenInput;
  }

  function esconderCamposSenha() {
    newPassword.style.display = 'none';
    confirmPassword.style.display = 'none';
    newPassword.value = '';
    confirmPassword.value = '';
  }

  function mostrarCamposSenha() {
    newPassword.style.display = 'block';
    confirmPassword.style.display = 'block';
  }

  function resetarRecuperacao() {
    etapa = 1;
    tokenGerado = '';
    tokenExpira = null;
    tokenUsado = false;
    forgotEmail.disabled = false;
    forgotEmail.value = '';
    forgotSubmit.textContent = 'Validar Email';
    esconderCamposSenha();
    const tokenInput = document.getElementById('token-input');
    if (tokenInput) tokenInput.remove();
  }

  forgotForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));

    if (etapa === 1) {
      if (user && forgotEmail.value === user.email) {
        tokenGerado = gerarToken();
        tokenExpira = Date.now() + 5 * 60 * 1000;
        tokenUsado = false;
        forgotEmail.disabled = true;
        criarCampoToken();
        forgotSubmit.textContent = 'Validar Token';
        etapa = 2;
        alert(`Token enviado para o e-mail: ${tokenGerado}`); // Simulação
      } else {
        alert('Email não encontrado.');
      }
    }

    else if (etapa === 2) {
      const tokenInput = document.getElementById('token-input');
      if (
        tokenInput &&
        tokenInput.value === tokenGerado &&
        !tokenUsado &&
        Date.now() < tokenExpira
      ) {
        tokenUsado = true;
        tokenInput.disabled = true;
        mostrarCamposSenha();
        forgotSubmit.textContent = 'Redefinir Senha';
        etapa = 3;
      } else if (Date.now() >= tokenExpira) {
        alert('Token expirado. Solicite novamente.');
        resetarRecuperacao();
      } else {
        alert('Token inválido.');
      }
    }

    else if (etapa === 3) {
      const novaSenha = newPassword.value.trim();
      const confirmarSenha = confirmPassword.value.trim();

      if (!senhaForte(novaSenha)) {
        alert('A senha deve conter letra maiúscula, minúscula, número e símbolo, com no mínimo 8 caracteres.');
        return;
      }

      if (novaSenha !== confirmarSenha) {
        alert('As senhas não coincidem.');
        return;
      }

      user.password = novaSenha;
      localStorage.setItem('user', JSON.stringify(user));
      setCookie('userEmail', user.email, 7);
      alert('Senha redefinida com sucesso!');
      resetarRecuperacao();
      container.classList.remove('forgot');
    }
  });

  // ----- Força da senha e requisitos -----
  const regPassword = document.getElementById('reg-password');

  let barraForca = document.getElementById('password-strength-bar');
  let requisitos = document.getElementById('password-requirements');

  if (!barraForca) {
    barraForca = document.createElement('div');
    barraForca.id = 'password-strength-bar';
    barraForca.style.height = '8px';
    barraForca.style.width = '100%';
    barraForca.style.background = '#eee';
    barraForca.style.marginTop = '5px';
    barraForca.style.borderRadius = '4px';
    regPassword.insertAdjacentElement('afterend', barraForca);
  }

  if (!requisitos) {
    requisitos = document.createElement('ul');
    requisitos.id = 'password-requirements';
    requisitos.style.listStyle = 'none';
    requisitos.style.padding = '0';
    requisitos.style.margin = '8px 0 0 0';
    requisitos.innerHTML = `
      <li id="req-length">• Mínimo 8 caracteres</li>
      <li id="req-maiuscula">• Letra maiúscula</li>
      <li id="req-minuscula">• Letra minúscula</li>
      <li id="req-numero">• Número</li>
      <li id="req-simbolo">• Símbolo</li>
    `;
    requisitos.style.textAlign = 'left';
    requisitos.style.fontSize = '14px';
    requisitos.style.color = '#333';
    barraForca.insertAdjacentElement('afterend', requisitos);
  }

  regPassword.addEventListener('input', function () {
    const senha = regPassword.value;
    let forca = 0;

    const temLength = senha.length >= 8;
    const temMaiuscula = /[A-Z]/.test(senha);
    const temMinuscula = /[a-z]/.test(senha);
    const temNumero = /\d/.test(senha);
    const temSimbolo = /[\W_]/.test(senha);

    document.getElementById('req-length').style.color = temLength ? 'green' : 'red';
    document.getElementById('req-maiuscula').style.color = temMaiuscula ? 'green' : 'red';
    document.getElementById('req-minuscula').style.color = temMinuscula ? 'green' : 'red';
    document.getElementById('req-numero').style.color = temNumero ? 'green' : 'red';
    document.getElementById('req-simbolo').style.color = temSimbolo ? 'green' : 'red';

    forca += temLength ? 1 : 0;
    forca += temMaiuscula ? 1 : 0;
    forca += temMinuscula ? 1 : 0;
    forca += temNumero ? 1 : 0;
    forca += temSimbolo ? 1 : 0;

    let cores = ['#e74c3c', '#f39c12', '#f1c40f', '#2ecc71', '#27ae60'];
    barraForca.style.width = (forca * 20) + '%';
    barraForca.style.background = cores[forca - 1] || '#eee';
  });

  // ----- Olhinho para visualizar senha -----
  function adicionarOlhoCadastro(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;

    if (input.parentElement.classList.contains('input-wrapper')) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'input-wrapper';
    input.parentNode.insertBefore(wrapper, input);
    wrapper.appendChild(input);

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'toggle-password';
    btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="12" rx="9" ry="5"/><circle cx="12" cy="12" r="2.5"/></svg>`;
    wrapper.appendChild(btn);

    btn.addEventListener('click', () => {
      if (input.type === 'password') {
        input.type = 'text';
        btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="12" rx="9" ry="5"/><circle cx="12" cy="12" r="2.5"/><line x1="2" y1="2" x2="22" y2="22" /></svg>`;
      } else {
        input.type = 'password';
        btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="12" rx="9" ry="5"/><circle cx="12" cy="12" r="2.5"/></svg>`;
      }
    });
  }

  adicionarOlhoCadastro('reg-password');
});
