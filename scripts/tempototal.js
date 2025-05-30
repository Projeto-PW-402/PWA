document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.confirmacao-container');
  const duration = localStorage.getItem('auditDuration');

  if (!duration) {
    container.textContent = 'Não foi encontrada nenhuma auditoria concluída.';
    return;
  }

  container.textContent = `Tempo total da auditoria: ${duration}`;
});
