document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.getElementById('startAudit');
  const endButton = document.getElementById('endAudit');
  const timerDisplay = document.getElementById('timerDisplay');
  const durationDisplay = document.getElementById('auditDuration'); // vamos esconder / ignorar

  let timerInterval = null;

  function formatTime(elapsedTime) {
    const hours = Math.floor(elapsedTime / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((elapsedTime % 3600) / 60).toString().padStart(2, '0');
    const seconds = (elapsedTime % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }

  function updateTimer() {
    const startTime = localStorage.getItem('auditStartTime');
    if (!startTime) return;

    const currentTime = new Date();
    const elapsedTime = Math.floor((currentTime - new Date(startTime)) / 1000);

    if (timerDisplay) {
      timerDisplay.textContent = formatTime(elapsedTime);
    }
  }

  function initializeTimer() {
    const startTime = localStorage.getItem('auditStartTime');
    if (startTime) {
      if (startButton) startButton.disabled = true;
      if (endButton) endButton.disabled = false;
      if (durationDisplay) durationDisplay.style.display = 'none'; // nunca mostrar
      timerInterval = setInterval(updateTimer, 1000);
      updateTimer();
    } else {
      if (startButton) startButton.disabled = false;
      if (endButton) endButton.disabled = true;
      if (timerDisplay) timerDisplay.textContent = '00:00:00';
      if (durationDisplay) durationDisplay.style.display = 'none'; // nunca mostrar
    }
  }

  if (startButton) {
    startButton.addEventListener('click', () => {
      localStorage.setItem('auditStartTime', new Date().toISOString());
      startButton.disabled = true;
      endButton.disabled = false;
      if (durationDisplay) durationDisplay.style.display = 'none'; // nunca mostrar
      timerInterval = setInterval(updateTimer, 1000);
      updateTimer();
    });
  }

  if (endButton) {
    endButton.addEventListener('click', () => {
      clearInterval(timerInterval);
      localStorage.removeItem('auditStartTime');
      if (startButton) startButton.disabled = false;
      if (endButton) endButton.disabled = true;
      if (timerDisplay) timerDisplay.textContent = '00:00:00';
      if (durationDisplay) {
        durationDisplay.style.display = 'none'; // nunca mostrar
        durationDisplay.textContent = '';
      }
    });
  }

  initializeTimer();
});
