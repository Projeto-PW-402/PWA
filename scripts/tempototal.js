document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.confirmacao-container');
  const startISO = localStorage.getItem('auditStartTime');

  if (!startISO) {
    container.textContent = 'Não foi encontrada nenhuma auditoria em curso.';
    return;
  }

  // Calcula segundos decorrido
  const elapsedSec = Math.floor((Date.now() - new Date(startISO)) / 1000);

  // Formata HH:MM:SS
  function formatTime(s) {
    const hh = String(Math.floor(s / 3600)).padStart(2, '0');
    const mm = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
    const ss = String(s % 60).padStart(2, '0');
    return `${hh}:${mm}:${ss}`;
  }

  const formattedTime = formatTime(elapsedSec);

  // Mostra só o tempo total
  container.textContent = `Tempo total da auditoria: ${formattedTime}`;

  // Limpa o início guardado para a próxima auditoria
  localStorage.removeItem('auditStartTime');
});
