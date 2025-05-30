document.addEventListener("DOMContentLoaded", () => {
  const permitirSempreBtn = document.getElementById("permitir-sempre");
  const permitirLocalizacaoBtn = document.getElementById("permitir-localizacao");
  const naoPermitoBtn = document.getElementById("nao-permito");
  const debug = document.getElementById("debug");

  function requestLocation() {
    if (!navigator.geolocation) {
      debug.textContent = "Geolocalização não suportada.";
      setTimeout(() => { window.location.href = "Login.html"; }, 2000);
      return;
    }
    debug.textContent = "Solicitando...";
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        debug.textContent = `Sucesso: Lat ${pos.coords.latitude}, Lon ${pos.coords.longitude}`;
        window.location.href = "Menuinicial.html";
      },
      (err) => {
        debug.textContent = `Erro: ${err.message} (Código: ${err.code})`;
        setTimeout(() => { window.location.href = "Login.html"; }, 2000);
      },
      { timeout: 10000 }
    );
  }

  // Eventos dos botões
  if (permitirSempreBtn) {
    permitirSempreBtn.addEventListener("click", requestLocation);
  } else {
    console.error("Botão 'permitir-sempre' não encontrado.");
  }

  if (permitirLocalizacaoBtn) {
    permitirLocalizacaoBtn.addEventListener("click", requestLocation);
  } else {
    console.error("Botão 'permitir-localizacao' não encontrado.");
  }

  if (naoPermitoBtn) {
    naoPermitoBtn.addEventListener("click", () => {
      debug.textContent = "Localização não permitida pelo usuário.";
      setTimeout(() => { window.location.href = "Login.html"; }, 2000);
    });
  } else {
    console.error("Botão 'nao-permito' não encontrado.");
  }

  // Inicializar ícones Lucide
  lucide.createIcons();
});