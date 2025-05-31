document.addEventListener('DOMContentLoaded', () => {
  const defaultUser = {
    email: 'marcelopimenta1234@gmail.com',
    password: 'Bolinhas33'
  };


  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify([defaultUser]));
  }

  const loginForm = document.getElementById('loginForm');
  const errorMessage = document.getElementById('errorMessage');

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      const users = JSON.parse(localStorage.getItem('users')) || [];
      const user = users.find(u => u.email === email && u.password === password);

      if (user) {
        localStorage.setItem('loggedInUser', email);
        errorMessage.style.display = 'none';
        window.location.href = "Selecaodeauditoria.html";
      } else {
        errorMessage.textContent = 'Email ou password incorretos.';
        errorMessage.style.display = 'block';
      }
    });
  }
});


window.handleCredentialResponse = function(response) {
  try {
    const token = response.credential;
    const payload = JSON.parse(atob(token.split('.')[1])); 

    const email = payload.email;
    const name = payload.name;
    const user_id =1 ;
 
    localStorage.setItem('loggedInUser', email);
    console.log("Nome do utilizador:", name);
    localStorage.setItem('userName', name);
    localStorage.setItem('user_id', user_id);
    window.location.href = "Selecaodeauditoria.html";
  } catch (error) {
    console.error('Erro ao processar a resposta do Google:', error);
    alert('Falha ao iniciar sessão com a conta Google.');
  }
};
