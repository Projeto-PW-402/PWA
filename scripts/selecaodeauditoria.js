document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("auditorias-container");
  const paginationContainer = document.getElementById("pagination-container");
  const itemsPerPage = 9; 
  let auditorias = [];
  let currentPage = 1;

  const useremail = localStorage.getItem("loggedInUser");

  const auth = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/pwa/login', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: useremail })
      });

      if (!response.ok) {
        console.error("Erro ao obter o utilizador.");
        return null;
      }

      const userData = await response.json();
      return userData;
    } catch {
      return null;
    }
  };

  const user = await auth();

  if (!user) {
    container.innerHTML = "<p class='text-danger'>Erro: utilizador não autenticado.</p>";
    return;
  }

  try {
    const response = await fetch(`http://localhost:5000/users/auditorias?user_id=${user.id}` );

    if (!response.ok) {
      container.innerHTML = `<p class='text-danger'>Erro ao carregar auditorias: ${response.status}</p>`;
      return;
    }

    auditorias = await response.json();

    if (auditorias.length === 0) {
      container.innerHTML = "<p class='text-muted'>Nenhuma auditoria encontrada.</p>";
      return;
    }

    const renderPage = (page) => {
      container.innerHTML = "";

      const start = (page - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      const pageAuditorias = auditorias.slice(start, end);

  
      const totalButtons = itemsPerPage;
      for (let i = 0; i < totalButtons; i++) {
        const btn = document.createElement("button");
        btn.className = "audit-button";

        if (pageAuditorias[i]) {
          const auditoria = pageAuditorias[i];
          btn.innerHTML = `<span class="audit-name">${auditoria.nome || 'Auditoria'}</span><br><span class="audit-location">${auditoria.location || 'Sem localização'}</span>`;
          btn.title = `${auditoria.nome || 'Auditoria'} - ${auditoria.location || 'Sem localização'}`;
          btn.onclick = () => {
            localStorage.setItem("auditoria", JSON.stringify(auditoria));
            window.location.href = "Menuinicial.html";
          };
        } else {
          
          btn.style.visibility = "hidden";
          btn.disabled = true;
        }

        container.appendChild(btn);
      }

      const totalPages = Math.ceil(auditorias.length / itemsPerPage);

      paginationContainer.innerHTML = "";
      const pagination = document.createElement("div");
      pagination.className = "pagination-controls";

      const firstButton = document.createElement("button");
      firstButton.className = "pagination-button";
      firstButton.textContent = "First";
      firstButton.disabled = page === 1;
      firstButton.onclick = () => {
        currentPage = 1;
        renderPage(currentPage);
      };
      pagination.appendChild(firstButton);

      for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement("button");
        pageButton.className = `pagination-button ${i === page ? 'active-page' : ''}`;
        pageButton.textContent = i;
        pageButton.onclick = () => {
          currentPage = i;
          renderPage(currentPage);
        };
        pagination.appendChild(pageButton);
      }

      const lastButton = document.createElement("button");
      lastButton.className = "pagination-button";
      lastButton.textContent = "Last";
      lastButton.disabled = page === totalPages;
      lastButton.onclick = () => {
        currentPage = totalPages;
        renderPage(currentPage);
      };
      pagination.appendChild(lastButton);

      paginationContainer.appendChild(pagination);
    };

    renderPage(currentPage);
  } catch (err) {
    container.innerHTML = "<p class='text-danger'>Erro ao ligar ao servidor.</p>";
    console.error(err);
  }
});
