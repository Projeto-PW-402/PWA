document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.getElementById('startAudit');
  const endButton   = document.getElementById('endAudit');
  const timerDisplay = document.getElementById('timerDisplay');

  let timerInterval = null;

  function formatTime(elapsedSec) {
    const hh = String(Math.floor(elapsedSec / 3600)).padStart(2, '0');
    const mm = String(Math.floor((elapsedSec % 3600) / 60)).padStart(2, '0');
    const ss = String(elapsedSec % 60).padStart(2, '0');
    return `${hh}:${mm}:${ss}`;
  }

  function updateTimer() {
    const startISO = localStorage.getItem('auditStartTime');
    if (!startISO) return;
    const elapsed = Math.floor((Date.now() - new Date(startISO)) / 1000);
    timerDisplay.textContent = formatTime(elapsed);
  }

  function initialize() {
    const started = !!localStorage.getItem('auditStartTime');
    startButton.disabled = started;
    endButton.disabled   = !started;
    timerDisplay.textContent = started ? '00:00:00' : timerDisplay.textContent || '00:00:00';

    if (started) {
      timerInterval = setInterval(updateTimer, 1000);
      updateTimer();
    }
  }

  startButton.addEventListener('click', () => {
    // marca início
    localStorage.setItem('auditStartTime', new Date().toISOString());
    // limpa qualquer duração anterior
    localStorage.removeItem('auditDuration');

    startButton.disabled = true;
    endButton.disabled   = false;
    timerInterval = setInterval(updateTimer, 1000);
    updateTimer();
  });

  endButton.addEventListener('click', () => {
    clearInterval(timerInterval);

    const startISO = localStorage.getItem('auditStartTime');
    if (startISO) {
      const totalSec = Math.floor((Date.now() - new Date(startISO)) / 1000);
      const formatted = formatTime(totalSec);
      // guarda a duração final
      localStorage.setItem('auditDuration', formatted);
    }

    // remove o start para "encerrar" a auditoria
    localStorage.removeItem('auditStartTime');

    startButton.disabled = false;
    endButton.disabled   = true;
    timerDisplay.textContent = '00:00:00';
  });

  initialize();
});
