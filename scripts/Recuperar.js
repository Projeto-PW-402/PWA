document.addEventListener('DOMContentLoaded', () => {
    const recoveryForm = document.getElementById('recoveryForm');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
  
    if (recoveryForm) {
      recoveryForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Impede o envio padrão do formulário
  
        const email = document.getElementById('email').value;
  
        // Recuperar usuários do localStorage
        const users = JSON.parse(localStorage.getItem('users')) || [];
  
        // Verificar se o email existe
        const user = users.find(u => u.email === email);
  
        if (user) {
          // Simular envio de email (em um sistema real, você enviaria um email com um link de recuperação)
          successMessage.textContent = 'Um link de recuperação foi enviado para o seu email!';
          successMessage.style.display = 'block';
          errorMessage.style.display = 'none';
  
          // Para testes, vamos apenas permitir que o usuário redefina a senha diretamente
          // Em um sistema real, você geraria um token e enviaria por email
          const newPassword = prompt('Digite sua nova senha:'); // Simples para teste
          if (newPassword) {
            user.password = newPassword; // Atualizar a senha
            localStorage.setItem('users', JSON.stringify(users)); // Salvar no localStorage
            successMessage.textContent = 'Senha redefinida com sucesso! Volte para o login.';
          }
        } else {
          // Exibir mensagem de erro
          errorMessage.textContent = 'Email não encontrado.';
          errorMessage.style.display = 'block';
          successMessage.style.display = 'none';
        }
      });
    }
  });