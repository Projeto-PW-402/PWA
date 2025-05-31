async function fetchUserNotification() {
  const userId = localStorage.getItem('user_id');
  const container = document.querySelector('.confirmacao-container');

  if (!userId) {
    console.warn('User ID não encontrado no localStorage');
    container.innerHTML = '<p style="color: red;">Erro: utilizador não identificado.</p>';
    return;
  }

  try {
    const res = await fetch(`http://localhost:5000/user/notification/get?id=${userId}`);
    const data = await res.json();

    if (res.status === 200 && data.message === 'Send Location') {
      container.innerHTML = `<p class="confirmacao-texto">O gestor está a pedir para enviar a sua localização.</p>`;
    } else {
      container.innerHTML = `<p class="confirmacao-texto">Não é necessário nada.</p>`;
    }
  } catch (err) {
    console.error('Erro na requisição:', err);
    container.innerHTML = '<p style="color: red;">Erro ao comunicar com o servidor.</p>';
  }
}

// Chama a cada 10 segundos
setInterval(fetchUserNotification, 10000);

// Chama logo no início
fetchUserNotification();
