document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("auditorias-container");
  const paginationContainer = document.getElementById("pagination-container");
  const itemsPerPage = 9;
  let currentPage = 1;
  let auditorias = [];

  const useremail = localStorage.getItem("loggedInUser");

  const auth = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/user?email=${useremail}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
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
    const response = await fetch(`http://localhost:5000/users/auditorias?user_id=${user.id}`);

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
      container.innerHTML = ""; // Clear the audit container

      // Calculate start and end indices for the current page
      const start = (page - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      const pageAuditorias = auditorias.slice(start, end);

      // Render audit buttons for the current page
      pageAuditorias.forEach((auditoria) => {
        const btn = document.createElement("button");
        btn.className = "audit-button";
        btn.innerHTML = `<span class="audit-name">${auditoria.nome || 'Auditoria'}</span><br><span class="audit-location">${auditoria.location || 'Sem localização'}</span>`;
        
        btn.onclick = () => {
          localStorage.setItem("auditoria", JSON.stringify(auditoria));
          console.log("Auditoria selecionada:", auditoria.id);
        };

        container.appendChild(btn);
      });

      // Calculate total pages
      const totalPages = Math.ceil(auditorias.length / itemsPerPage);

      // Clear and render pagination controls
      paginationContainer.innerHTML = ""; // Clear the pagination container
      const pagination = document.createElement("div");
      pagination.className = "pagination-controls";

      // First button
      const firstButton = document.createElement("button");
      firstButton.className = "pagination-button";
      firstButton.textContent = "First";
      firstButton.disabled = page === 1;
      firstButton.onclick = () => {
        currentPage = 1;
        renderPage(currentPage);
      };
      pagination.appendChild(firstButton);

      // Numbered page buttons
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

      // Last button
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

    // Initial render
    renderPage(currentPage);
  } catch (err) {
    container.innerHTML = "<p class='text-danger'>Erro ao ligar ao servidor.</p>";
    console.error(err);
  }
});