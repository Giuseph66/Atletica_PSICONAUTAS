// Variável global para controle do modo administrador
let isAdmin = false;

// Atualiza a visibilidade dos botões de edição em cada seção
function updateSectionEditButtons() {
  document.querySelectorAll('.section-edit-btn').forEach(button => {
    button.style.display = isAdmin ? 'block' : 'none';
  });
}

// Gera a senha de administrador dinâmica (exemplo: "060420251PsiconautasX")
function getAdminPassword() {
  const date = new Date();
  const day = ("0" + date.getDate()).slice(-2);
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const year = date.getFullYear();
  const dayOfWeek = date.getDay();
  const salt = "Psiconautas";
  const letra_chave = "sociais".charAt(dayOfWeek);
  return day + month + year + dayOfWeek + salt + letra_chave;
}

// Verifica o campo "Nome" para identificar administrador
document.getElementById('name').addEventListener('input', function() {
  const nameInput = document.getElementById('name').value;
  const adminPassword = getAdminPassword();
  console.log("Senha de administrador: " + adminPassword); // Para depuração
  if (nameInput === adminPassword) {
    alert("Bem vindo, administrador!");
    isAdmin = true;
  } else {
    isAdmin = false;
  }
  updateSectionEditButtons();
});

// Modal de edição global
const modal = document.getElementById('editModal');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');

let currentSectionId = ""; // Para saber qual seção estamos editando

// Abre o modal de edição de uma seção com base no seu ID
function openSectionEditModal(sectionId) {
  currentSectionId = sectionId;
  const section = document.getElementById(sectionId);
  const sectionType = section.dataset.type; // "text" ou "list"
  modalTitle.textContent = "Editar " + section.querySelector('h2').textContent;
  modalBody.innerHTML = "";
  
  if (sectionType === "text") {
    // Para seções de texto, use um textarea preenchido com o conteúdo
    const currentContent = section.querySelector('.section-content').innerHTML;
    modalBody.innerHTML = `
      <label>Conteúdo:</label>
      <textarea id="modalSectionContent" style="width:100%; height:200px;">${currentContent}</textarea>
    `;
  } else if (sectionType === "list") {
    // Para seções de lista, iteramos sobre os itens (li)
    const list = section.querySelector('.section-list');
    modalBody.innerHTML = `<div id="modalListContainer"></div>
      <button id="addNewItem">Adicionar Novo Item</button>`;
    const container = document.getElementById('modalListContainer');
    list.querySelectorAll('li').forEach((li, index) => {
      container.innerHTML += `
        <div class="modal-list-item" data-index="${index}">
          <input type="text" class="modalListItemInput" value="${li.innerHTML.trim()}">
          <button class="deleteListItemButton">Apagar</button>
        </div>
      `;
    });
    // Configura o botão para adicionar novo item
    document.getElementById('addNewItem').addEventListener('click', function() {
      const newDiv = document.createElement('div');
      newDiv.classList.add('modal-list-item');
      newDiv.innerHTML = `<input type="text" class="modalListItemInput" value="">
                          <button class="deleteListItemButton">Apagar</button>`;
      container.appendChild(newDiv);
      newDiv.querySelector('.deleteListItemButton').addEventListener('click', function() {
        newDiv.remove();
      });
    });
    // Configura os botões de apagar dos itens já existentes
    document.querySelectorAll('.deleteListItemButton').forEach(btn => {
      btn.addEventListener('click', function() {
        btn.parentElement.remove();
      });
    });
  }
  
  modal.style.display = "block";
}

// Fechar o modal
function closeModal() {
  modal.style.display = "none";
  modalBody.innerHTML = "";
  currentSectionId = "";
}

// Eventos para fechar o modal
document.querySelector('.modal .close').addEventListener('click', closeModal);
document.getElementById('cancelEdit').addEventListener('click', closeModal);
window.addEventListener('click', function(event) {
  if (event.target == modal) {
    closeModal();
  }
});

// Ao salvar as alterações, atualiza a seção correspondente
document.getElementById('saveChanges').addEventListener('click', function() {
  if (!currentSectionId) return;
  const section = document.getElementById(currentSectionId);
  const sectionType = section.dataset.type;
  
  if (sectionType === "text") {
    const newContent = document.getElementById('modalSectionContent').value;
    section.querySelector('.section-content').innerHTML = newContent;
  } else if (sectionType === "list") {
    const container = document.getElementById('modalListContainer');
    const newItems = [];
    container.querySelectorAll('.modal-list-item').forEach(item => {
      const value = item.querySelector('.modalListItemInput').value.trim();
      if (value !== "") newItems.push(value);
    });
    const list = section.querySelector('.section-list');
    list.innerHTML = "";
    newItems.forEach(itemText => {
      const li = document.createElement('li');
      li.textContent = itemText;
      list.appendChild(li);
    });
  }
  
  closeModal();
});

// Configura os botões de edição de cada seção
document.querySelectorAll('.section-edit-btn').forEach(button => {
  button.addEventListener('click', function(e) {
    e.stopPropagation();
    const sectionId = button.getAttribute('data-section');
    openSectionEditModal(sectionId);
  });
});
