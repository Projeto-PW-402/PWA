const chosenFiles = []; // Armazena todos os ficheiros selecionados

// Abre o seletor de ficheiros ao clicar no botão
document.getElementById('choose-files').addEventListener('click', () => {
  document.getElementById('file-input').click();
});

// Atualiza os slots e texto de status ao selecionar ficheiros
document.getElementById('file-input').addEventListener('change', (event) => {
  const newFiles = Array.from(event.target.files);
  const slots = document.querySelectorAll('.photo-slot');

  // Validação de limite máximo de 5 ficheiros
  if (chosenFiles.length + newFiles.length > 5) {
    alert('Você pode selecionar no máximo 5 ficheiros.');
    event.target.value = '';
    return;
  }

  // Adiciona os novos ficheiros ao array principal
  chosenFiles.push(...newFiles);

  // Preenche apenas os slots ainda não ocupados
  let slotIndex = 0;
  for (let i = 0; i < slots.length; i++) {
    if (!slots[i].querySelector('img') && slots[i].textContent === '+') {
      const file = chosenFiles[slotIndex];
      if (!file) break;

      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function (e) {
          const img = document.createElement('img');
          img.src = e.target.result;
          img.style.width = '100%';
          img.style.height = '100%';
          img.style.objectFit = 'cover';
          slots[i].innerHTML = '';
          slots[i].appendChild(img);
        };
        reader.readAsDataURL(file);
      } else {
        slots[i].textContent = file.type.split('/')[0].toUpperCase();
      }

      slotIndex++;
    } else {
      slotIndex++;
    }

    if (slotIndex >= chosenFiles.length) break;
  }

  // Atualiza texto de status
  document.getElementById('file-status').textContent = `${chosenFiles.length} ficheiro(s) selecionado(s)`;

  // Permite reusar o mesmo ficheiro
  event.target.value = '';
});

// Envio do formulário
document.getElementById('submit-btn').addEventListener('click', () => {
  const titulo = document.getElementById('titulo').value.trim();
  const tipoOcorrencia = document.getElementById('tipo-ocorrencia').value;
  const descricao = document.getElementById('descricao').value.trim();

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

  chosenFiles.forEach(file => {
    formData.append('files[]', file);
  });

  fetch('http://127.0.0.1:5000/auditoria/upload', {
    method: 'POST',
    body: formData
  })
    .then(response => response.json())
    .then(data => {
      if (data.mensagem) {
        alert(data.mensagem);
      } else if (data.error) {
        alert(`Erro: ${data.error}`);
      }

      // Reset do formulário
      document.getElementById('titulo').value = '';
      document.getElementById('tipo-ocorrencia').value = '';
      document.getElementById('descricao').value = '';
      document.getElementById('file-input').value = '';
      document.getElementById('file-status').textContent = 'Nenhum ficheiro selecionado';

      // Limpa os slots
      const slots = document.querySelectorAll('.photo-slot');
      slots.forEach(slot => {
        slot.innerHTML = '+';
      });

      // Limpa array de ficheiros
      chosenFiles.length = 0;
    })
    .catch(error => {
      alert('Erro ao enviar os dados.');
      console.error('Erro:', error);
    });
});
