document.addEventListener('DOMContentLoaded', () => {
  const btn = document.querySelector('.confirmar-botao');

  btn.addEventListener('click', async () => {
    const auditoriaId = btn.dataset.auditoriaId;
    const userId = btn.dataset.userId;

    const permite = confirm(
      'Permite que acedamos à sua localização?'
    );
    if (!permite) {
      return alert('Sem acesso à localização, não podemos confirmar a sua presença.');
    }

    // 2) (Opcional) verifica o estado atual da permissão
    if (navigator.permissions) {
      try {
        const status = await navigator.permissions.query({ name: 'geolocation' });
        console.log('Estado da permissão:', status.state);
        if (status.state === 'denied') {
          return alert(
            'Bloqueou o acesso à localização.\n' +
            'Por favor, permita nas definições do navegador e tente novamente.'
          );
        }
      } catch (e) {
        console.warn('Permissions API não disponível:', e);
      }
    }

    // 3) Geolocalização (invoca o prompt nativo “Permitir / Bloquear”)
    if (!navigator.geolocation) {
      return alert('Geolocalização não é suportada no seu navegador.');
    }


    navigator.geolocation.getCurrentPosition(
      async position => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };

        console.log('Localização obtida:', location);
        const API_BASE = 'http://127.0.0.1:5000';
        const url = `${API_BASE}/location/send`;

        // Verificar se o utilizador está autenticado
        const auditoria = JSON.parse(localStorage.getItem("auditoria"));
        const id_auditoria = auditoria['id'];
        const id_user = JSON.parse(localStorage.getItem("user_id"));
        const data = {
          auditoria_id: id_auditoria,
          user_id: id_user,
          location: location,
        };
        console.log('Dados a enviar:', data);
        try {
          const response = await fetch(`http://127.0.0.1:5000/location/send`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
          });

          if (!response.ok) {
            console.error("Erro ao obter o utilizador.");
            return null;
          }
          if (response.ok) {
            alert('Localização enviada com sucesso!');
          }else {
            alert('Erro ao enviar localização. Tente novamente.');
          }
        } catch (err) {
          console.error('Erro de rede ao enviar localização:', err);
          alert('Erro de rede ao enviar localização.');
        }
      },
      err => {
        console.error('Erro ao obter localização:', err);
        alert(`Não foi possível obter localização: ${err.message}`);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  });
});
