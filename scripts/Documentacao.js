const chosenFiles = []; // Armazena todos os ficheiros selecionados

// Abre o seletor de ficheiros ao clicar no botão
const chooseFilesBtn = document.getElementById('choose-files');
const fileInput = document.getElementById('file-input');
if (chooseFilesBtn && fileInput) {
  chooseFilesBtn.addEventListener('click', () => {
    fileInput.click();
  });

  // Quando seleccionas ficheiros, atualiza o array e re-renderiza os slots
  fileInput.addEventListener('change', (event) => {
    const newFiles = Array.from(event.target.files);
    if (chosenFiles.length + newFiles.length > 5) {
      alert('Você pode selecionar no máximo 5 ficheiros.');
      event.target.value = '';
      return;
    }
    chosenFiles.push(...newFiles);
    renderSlots();
    updateStatus();
    event.target.value = ''; // para permitir re-seleção do mesmo ficheiro
  });
}

// Renderiza os 5 slots, mostrando imagem/ícone + botão de eliminar
function renderSlots() {
  const slots = document.querySelectorAll('.photo-slot');
  slots.forEach((slot, idx) => {
    slot.innerHTML = '+';      // limpa conteúdo
    slot.style.cursor = 'pointer';

    const file = chosenFiles[idx];
    if (file) {
      // Se for imagem, lê e mostra <img>
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = e => {
          slot.innerHTML = '';
          const img = document.createElement('img');
          img.src = e.target.result;
          img.style.width = '100%';
          img.style.height = '100%';
          img.style.objectFit = 'cover';
          slot.appendChild(img);
          appendDeleteButton(slot, idx);
        };
        reader.readAsDataURL(file);
      } else {
        // Senão mostra tipo (AUDIO/VIDEO)
        slot.textContent = file.type.split('/')[0].toUpperCase();
        appendDeleteButton(slot, idx);
      }
    }
  });
}

// Cria o botão “×” e associa o clique para remover
function appendDeleteButton(slot, index) {
  const btn = document.createElement('button');
  btn.className = 'delete-btn';
  btn.innerHTML = '&times;'; // símbolo X
  btn.addEventListener('click', (e) => {
    e.stopPropagation();      // não dispara outros handlers
    removeFile(index);
  });
  slot.appendChild(btn);
}

// Remove o ficheiro do array e re-renderiza tudo
function removeFile(index) {
  chosenFiles.splice(index, 1);
  renderSlots();
  updateStatus();
}

// Atualiza o texto de status (quantos ficheiros)
function updateStatus() {
  const status = document.getElementById('file-status');
  if (status) {
    status.textContent = 
      chosenFiles.length > 0 
        ? `${chosenFiles.length} ficheiro(s) selecionado(s)`
        : 'Nenhum ficheiro selecionado';
  }
}

// Envio do formulário
const submitBtn = document.getElementById('submit-btn');
if (submitBtn) {
  submitBtn.addEventListener('click', () => {
    const tituloInput = document.getElementById('titulo');
    const tipoOcorrenciaInput = document.getElementById('tipo-ocorrencia');
    const descricaoInput = document.getElementById('descricao');
    const titulo = tituloInput ? tituloInput.value.trim() : '';
    const tipoOcorrencia = tipoOcorrenciaInput ? tipoOcorrenciaInput.value : '';
    const descricao = descricaoInput ? descricaoInput.value.trim() : '';

    if (!tipoOcorrencia || !descricao) {
      alert('Por favor, preencha os campos obrigatórios (Tipo de Ocorrência e Texto Descritivo).');
      return;
    }
    if (chosenFiles.length > 5) {
      alert('Você pode enviar no máximo 5 ficheiros.');
      return;
    }

    const jsonData = {
      nome: titulo || '',
      tipo: tipoOcorrencia,
      descricao: descricao,
      dnome: '',
      dnif: '',
      dcontacto: '',
      demail: '',
      location: ''
    };

    const formData = new FormData();
    formData.append('json_data', JSON.stringify(jsonData));
    chosenFiles.forEach(file => formData.append('files[]', file));

    fetch('http://127.0.0.1:5000/auditoria/upload', {
      method: 'POST',
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        alert(data.mensagem || `Erro: ${data.error}`);
        resetForm();
      })
      .catch(err => {
        console.error('Erro:', err);
        alert('Erro ao enviar os dados.');
      });
  });
}

// Inicialização: slots limpos + status
document.addEventListener('DOMContentLoaded', () => {
  renderSlots();
  updateStatus();
});
function resetForm() {
  document.getElementById('titulo').value = '';
  document.getElementById('tipo-ocorrencia').value = '';
  document.getElementById('descricao').value = '';
  chosenFiles.length = 0;
  renderSlots();
  updateStatus();
}

// Inicialização: slots limpos + status
renderSlots();
updateStatus();
