// Variável global para controle do modo administrador
let isAdmin = false; //deixar true para depuração

// Atualiza a visibilidade dos botões de edição em cada seção
function updateSectionEditButtons() {
  const editButtons = document.querySelectorAll('.section-edit-btn, .social-edit-btn, .register-edit-btn');
  editButtons.forEach(button => {
    button.style.display = isAdmin ? 'flex' : 'none';
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
function checkAdminAuth() {
  const nameInput = document.getElementById('name');
  if (nameInput) {
    nameInput.addEventListener('input', function() {
      const adminPassword = getAdminPassword();
      if (this.value === adminPassword) {
        isAdmin = true;
        updateSectionEditButtons();
        showAdminButton();
      } else {
        isAdmin = false;
        updateSectionEditButtons();
        hideAdminButton();
      }
    });
  }
}

// Modal de edição global
const modal = document.getElementById('editModal');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');

let currentSectionId = ""; // Para saber qual seção estamos editando

// Função para abrir o modal de edição de produtos
function openProductsEditModal() {
  const modal = document.getElementById('editModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  
  modalTitle.textContent = 'Editar Produtos';
  modalBody.innerHTML = `
    <div class="form-section">
      <div class="form-group">
        <label for="productName">Nome do Produto:</label>
        <input type="text" id="productName" placeholder="Digite o nome do produto" required>
      </div>
      <div class="form-group">
        <label for="productImage">Imagem do Produto:</label>
        <div class="image-upload-container">
          <div class="image-preview-container">
            <img id="productImagePreview" class="image-preview" src="" alt="Preview">
            <div class="image-placeholder">
              <i class="fas fa-image"></i>
              <span>Clique para adicionar uma imagem</span>
            </div>
          </div>
          <input type="file" id="productImage" accept="image/*" style="display: none;">
        </div>
      </div>
      <button id="addProduct" class="add-btn">
        <i class="fas fa-plus"></i> Adicionar Produto
      </button>
    </div>
    <div class="existing-products-section">
      <h3>Produtos Existentes</h3>
      <div id="existingProducts" class="existing-products"></div>
    </div>
  `;
  
  // Adiciona os event listeners para o formulário
  const imageInput = document.getElementById('productImage');
  const imagePreview = document.getElementById('productImagePreview');
  const imagePlaceholder = document.querySelector('.image-placeholder');
  const imageContainer = document.querySelector('.image-preview-container');

  imageContainer.addEventListener('click', function() {
    imageInput.click();
  });

  imageInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('A imagem deve ter no máximo 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = function(e) {
        imagePreview.src = e.target.result;
        imagePreview.classList.add('visible');
        imagePlaceholder.style.display = 'none';
      };
      reader.readAsDataURL(file);
    }
  });
  
  // Carrega os produtos existentes
  loadExistingProducts();
  
  const addProductBtn = document.getElementById('addProduct');
  addProductBtn.addEventListener('click', function() {
    const name = document.getElementById('productName').value.trim();
    const image = document.getElementById('productImage').files[0];
    
    if (!name) {
      alert('Por favor, preencha o nome do produto');
      return;
    }
    
    if (!image) {
      alert('Por favor, selecione uma imagem');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
      addProductToGrid(name, e.target.result);
      // Limpa o formulário
      document.getElementById('productName').value = '';
      document.getElementById('productImage').value = '';
      imagePreview.src = '';
      imagePreview.classList.remove('visible');
      imagePlaceholder.style.display = 'flex';
      // Recarrega a lista
      loadExistingProducts();
    };
    reader.readAsDataURL(image);
  });
  
  modal.style.display = 'block';
}

// Função para adicionar um produto à grade
function addProductToGrid(name, imagePath) {
  saveProductImage(imagePath, name);
  console.log(name);
  console.log(imagePath);
  const productsGrid = document.querySelector('.products-grid');
  const productCard = document.createElement('div');
  productCard.className = 'product-card';
  
  // Carrega a imagem do localStorage se necessário
  const imageUrl = loadImage(imagePath);
  
  productCard.innerHTML = `
    <img src="${imageUrl}" alt="${name}" class="product-image">
    <div class="product-info">
      <h3 class="product-name">${name}</h3>
    </div>
  `;
  
  productsGrid.appendChild(productCard);
  loadExistingProducts(); // Recarrega a lista de produtos existentes
}

// Função para mostrar o botão de admin
function showAdminButton() {
  const adminButton = document.getElementById('adminButton');
  if (adminButton) {
    adminButton.style.display = 'block';
  }
}

// Função para esconder o botão de admin
function hideAdminButton() {
  const adminButton = document.getElementById('adminButton');
  if (adminButton) {
    adminButton.style.display = 'none';
  }
}

// Função para abrir o modal de edição de fundadores
function openFoundersEditModal() {
  const modal = document.getElementById('editModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  
  modalTitle.textContent = 'Editar Fundadores e Diretores';
  modalBody.innerHTML = `
    <div class="founder-edit-form">
      <div class="form-section">
        <h3>Adicionar Novo Fundador/Diretor</h3>
        <div class="form-group">
          <label for="founderName">Nome:</label>
          <input type="text" id="founderName" placeholder="Digite o nome" required>
        </div>
        <div class="form-group">
          <label for="founderTitle">Título/Cargo:</label>
          <input type="text" id="founderTitle" placeholder="Digite o título ou cargo" required>
        </div>
        <div class="form-group">
          <label for="founderImage">Foto:</label>
          <div class="image-upload-container">
            <div class="image-preview-container">
              <img id="founderImagePreview" class="image-preview" src="" alt="Preview">
              <div class="image-placeholder">
                <i class="fas fa-user"></i>
                <span>Clique para adicionar uma foto</span>
              </div>
            </div>
            <input type="file" id="founderImage" accept="image/*" style="display: none;">
          </div>
        </div>
        <button id="addFounder" class="add-founder-btn">
          <i class="fas fa-plus"></i> Adicionar Fundador/Diretor
        </button>
      </div>
      
      <div class="existing-founders-section">
        <h3>Fundadores/Diretores Existentes</h3>
        <div id="existingFounders" class="existing-founders"></div>
      </div>
    </div>
  `;
  
  // Adiciona os event listeners para o formulário
  const imageInput = document.getElementById('founderImage');
  const imagePreview = document.getElementById('founderImagePreview');
  const imagePlaceholder = document.querySelector('.image-placeholder');
  const imageContainer = document.querySelector('.image-preview-container');

  imageContainer.addEventListener('click', function() {
    imageInput.click();
  });

  imageInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('A imagem deve ter no máximo 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = function(e) {
        imagePreview.src = e.target.result;
        imagePreview.classList.add('visible');
        imagePlaceholder.style.display = 'none';
      };
      reader.readAsDataURL(file);
    }
  });
  
  // Carrega os fundadores existentes
  loadExistingFounders();
  
  const addFounderBtn = document.getElementById('addFounder');
  addFounderBtn.addEventListener('click', function() {
    const name = document.getElementById('founderName').value.trim();
    const title = document.getElementById('founderTitle').value.trim();
    const image = document.getElementById('founderImage').files[0];
    
    if (!name || !title) {
      alert('Por favor, preencha todos os campos');
      return;
    }
    
    if (!image) {
      alert('Por favor, selecione uma foto');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
      addFounderToGrid(name, title, e.target.result);
      // Limpa o formulário
      document.getElementById('founderName').value = '';
      document.getElementById('founderTitle').value = '';
      document.getElementById('founderImage').value = '';
      imagePreview.src = '';
      imagePreview.classList.remove('visible');
      imagePlaceholder.style.display = 'flex';
      // Recarrega a lista
      loadExistingFounders();
    };
    reader.readAsDataURL(image);
  });
  
  modal.style.display = 'block';
}

// Função para carregar fundadores existentes
function loadExistingFounders() {
  const existingFounders = document.getElementById('existingFounders');
  const foundersGrid = document.querySelector('.founders-grid');
  const founderCards = foundersGrid.querySelectorAll('.founder-card');
  
  existingFounders.innerHTML = '';
  
  founderCards.forEach((card, index) => {
    const name = card.querySelector('.founder-name').textContent;
    const title = card.querySelector('.founder-title').textContent;
    const imageUrl = card.querySelector('.founder-image').src;
    
    const founderItem = document.createElement('div');
    founderItem.className = 'existing-item';
    founderItem.innerHTML = `
      <img src="${imageUrl}" alt="${name}">
      <div class="existing-item-info">
        <h4>${name}</h4>
        <p>${title}</p>
      </div>
      <div class="existing-item-actions">
        <button class="edit-btn" onclick="editFounder(${index}, '${name}', '${title}', '${imageUrl}')">
          <i class="fas fa-edit"></i>
        </button>
        <button class="delete-btn" onclick="deleteFounder(${index})">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `;
    
    existingFounders.appendChild(founderItem);
  });
}

// Função para editar um fundador
function editFounder(index, currentName, currentTitle, currentImage) {
  const modal = document.getElementById('editModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  
  modalTitle.textContent = 'Editar Fundador/Diretor';
  modalBody.innerHTML = `
    <div class="founder-edit-form">
      <div class="form-group">
        <label for="editFounderName">Nome:</label>
        <input type="text" id="editFounderName" value="${currentName}" required>
      </div>
      <div class="form-group">
        <label for="editFounderTitle">Título/Cargo:</label>
        <input type="text" id="editFounderTitle" value="${currentTitle}" required>
      </div>
      <div class="form-group">
        <label for="editFounderImage">Foto:</label>
        <div class="image-upload-container">
          <div class="image-preview-container">
            <img id="editFounderImagePreview" class="image-preview visible" src="${currentImage}" alt="Preview">
            <div class="image-placeholder" style="display: none;">
              <i class="fas fa-user"></i>
              <span>Clique para alterar a foto</span>
            </div>
          </div>
          <input type="file" id="editFounderImage" accept="image/*" style="display: none;">
        </div>
      </div>
      <div class="modal-actions">
        <button id="updateFounder" class="save-btn">
          <i class="fas fa-save"></i> Salvar
        </button>
        <button id="cancelEdit" class="cancel-btn">
          <i class="fas fa-times"></i> Cancelar
        </button>
      </div>
    </div>
  `;
  
  // Adiciona os event listeners para o formulário
  const imageInput = document.getElementById('editFounderImage');
  const imagePreview = document.getElementById('editFounderImagePreview');
  const imagePlaceholder = document.querySelector('.image-placeholder');
  const imageContainer = document.querySelector('.image-preview-container');

  imageContainer.addEventListener('click', function() {
    imageInput.click();
  });

  imageInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('A imagem deve ter no máximo 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = function(e) {
        imagePreview.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });
  
  const updateFounderBtn = document.getElementById('updateFounder');
  updateFounderBtn.addEventListener('click', function() {
    const name = document.getElementById('editFounderName').value.trim();
    const title = document.getElementById('editFounderTitle').value.trim();
    const image = document.getElementById('editFounderImage').files[0];
    
    if (!name || !title) {
      alert('Por favor, preencha todos os campos');
      return;
    }
    
    if (image) {
      const reader = new FileReader();
      reader.onload = function(e) {
        updateFounder(index, name, title, e.target.result);
      };
      reader.readAsDataURL(image);
    } else {
      updateFounder(index, name, title, currentImage);
    }
  });
  
  const cancelBtn = document.getElementById('cancelEdit');
  cancelBtn.addEventListener('click', function() {
    closeModal();
  });
  
  modal.style.display = 'block';
}

// Função para atualizar um fundador
function updateFounder(index, name, title, imageUrl) {
  const foundersGrid = document.querySelector('.founders-grid');
  const founderCards = foundersGrid.querySelectorAll('.founder-card');
  
  if (founderCards[index]) {
    founderCards[index].querySelector('.founder-name').textContent = name;
    founderCards[index].querySelector('.founder-title').textContent = title;
    founderCards[index].querySelector('.founder-image').src = imageUrl;
  }
  
  closeModal();
  loadExistingFounders();
}

// Função para deletar um fundador
function deleteFounder(index) {
  if (confirm('Tem certeza que deseja excluir este fundador/diretor?')) {
    const foundersGrid = document.querySelector('.founders-grid');
    const founderCards = foundersGrid.querySelectorAll('.founder-card');
    
    if (founderCards[index]) {
      founderCards[index].remove();
    }
    
    loadExistingFounders();
  }
}

// Função para adicionar um fundador à grade
function addFounderToGrid(name, title, imageUrl) {
  const foundersGrid = document.querySelector('.founders-grid');
  const founderCard = document.createElement('div');
  founderCard.className = 'founder-card';
  
  founderCard.innerHTML = `
    <img src="${imageUrl}" alt="${name}" class="founder-image">
    <div class="founder-info">
      <h3 class="founder-name">${name}</h3>
      <p class="founder-title">${title}</p>
    </div>
  `;
  
  foundersGrid.appendChild(founderCard);
}

// Função para abrir o modal de edição de seções
function openSectionEditModal(sectionId) {
  console.log('Abrindo modal para seção:', sectionId);
  
  const section = document.getElementById(sectionId);
  if (!section) {
    console.error('Seção não encontrada:', sectionId);
    return;
  }

  const title = section.querySelector('h2')?.textContent || 'Editar';
  const content = section.querySelector('.section-content')?.innerHTML || '';
  const list = section.querySelector('.section-list');
  
  const modal = document.getElementById('editModal');
  if (!modal) {
    console.error('Modal não encontrado');
    return;
  }

  document.getElementById('modalTitle').textContent = `Editar ${title}`;
  
  let modalContent = '';
  
  if (sectionId === 'products') {
    openProductsEditModal();
    return;
  } else if (sectionId === 'founders') {
    openFoundersEditModal();
    return;
  } else if (sectionId === 'about' || sectionId === 'extras') {
    modalContent = `
      <div class="form-section">
        <div class="form-group">
          <label for="modalSectionContent">Conteúdo:</label>
          <textarea id="modalSectionContent" class="text-editor" rows="10">${content}</textarea>
        </div>
      </div>
    `;
  } else if (sectionId === 'events' || sectionId === 'projects') {
    const items = list ? Array.from(list.children).map(li => li.textContent) : [];
    modalContent = `
      <div class="form-section">
        <div class="form-group">
          <label for="newItem">Adicionar Novo Item:</label>
          <input type="text" id="newItem" placeholder="Digite o nome do item">
          <button id="addItem" class="add-btn">
            <i class="fas fa-plus"></i> Adicionar
          </button>
        </div>
        <div class="existing-items-section">
          <h3>Itens Existentes</h3>
          <div id="existingItems" class="existing-items">
            ${items.map((item, index) => `
              <div class="existing-item">
                <div class="existing-item-info">
                  <p>${item}</p>
                </div>
                <div class="existing-item-actions">
                  <button class="edit-btn" onclick="editItem(${index}, '${item}', '${sectionId}')">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="delete-btn" onclick="deleteItem(${index}, '${sectionId}')">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }
  
  document.getElementById('modalBody').innerHTML = modalContent;
  
  // Adiciona os event listeners
  if (sectionId === 'about' || sectionId === 'extras') {
    const saveBtn = document.getElementById('saveChanges');
    const cancelBtn = document.getElementById('cancelEdit');
    
    saveBtn.addEventListener('click', function() {
      const newContent = document.getElementById('modalSectionContent').value;
      section.querySelector('.section-content').innerHTML = newContent;
      closeModal();
    });
    
    cancelBtn.addEventListener('click', closeModal);
  } else if (sectionId === 'events' || sectionId === 'projects') {
    const addItemBtn = document.getElementById('addItem');
    const saveBtn = document.getElementById('saveChanges');
    const cancelBtn = document.getElementById('cancelEdit');
    
    addItemBtn.addEventListener('click', function() {
      const newItem = document.getElementById('newItem').value.trim();
      if (newItem) {
        const itemList = section.querySelector('.section-list');
        if (!itemList) {
          const newList = document.createElement('ul');
          newList.className = 'section-list';
          section.querySelector('.section-content').appendChild(newList);
        }
        const li = document.createElement('li');
        li.textContent = newItem;
        section.querySelector('.section-list').appendChild(li);
        document.getElementById('newItem').value = '';
        openSectionEditModal(sectionId);
      }
    });
    
    saveBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
  }
  
  modal.style.display = 'block';
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
document.addEventListener('DOMContentLoaded', function() {
  // Adiciona event listeners para os botões de edição
  document.querySelectorAll('.section-edit-btn').forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const sectionId = this.getAttribute('data-section');
      if (sectionId) {
        openSectionEditModal(sectionId);
      }
    });
  });

  // Adiciona event listeners para os botões de edição de redes sociais
  document.querySelectorAll('.social-edit-btn').forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      openSocialEditModal();
    });
  });

  // Adiciona event listener para o botão de edição de URL do Dadus
  const editDadusUrlBtn = document.getElementById('editDadusUrl');
  if (editDadusUrlBtn) {
    editDadusUrlBtn.addEventListener('click', function(e) {
      e.preventDefault();
      openEditDadusUrlModal();
    });
  }

  // Adiciona event listeners para fechar o modal
  const modal = document.getElementById('editModal');
  if (modal) {
    // Fecha o modal ao clicar no X
    const closeBtn = modal.querySelector('.close');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }

    // Fecha o modal ao clicar fora dele
    window.addEventListener('click', function(event) {
      if (event.target === modal) {
        closeModal();
      }
    });
  }
});

// Função para abrir o modal de edição de redes sociais
function openSocialEditModal() {
  if (!isAdmin) return;
  
  const modal = document.getElementById('socialEditModal');
  const form = modal.querySelector('.social-edit-form');
  const socialLinks = document.querySelectorAll('.social-links a');
  
  // Limpa o formulário existente
  form.innerHTML = '';
  
  // Adiciona campos para cada rede social
  socialLinks.forEach(link => {
    const platform = link.getAttribute('data-platform');
    const currentUrl = link.getAttribute('href');
    
    const formGroup = document.createElement('div');
    formGroup.className = 'form-group';
    
    formGroup.innerHTML = `
      <label for="${platform}">${link.querySelector('span').textContent}:</label>
      <input type="url" id="${platform}" value="${currentUrl}" placeholder="Digite a URL do ${link.querySelector('span').textContent}">
    `;
    
    form.appendChild(formGroup);
  });
  
  modal.style.display = 'block';
}

// Função para fechar o modal de edição de redes sociais
function closeSocialEditModal() {
  const modal = document.getElementById('socialEditModal');
  modal.style.display = 'none';
}

// Função para salvar as alterações das redes sociais
function saveSocialLinks() {
  const form = document.querySelector('.social-edit-form');
  const inputs = form.querySelectorAll('input');
  
  inputs.forEach(input => {
    const platform = input.id;
    const newUrl = input.value;
    const link = document.querySelector(`.social-links a[data-platform="${platform}"]`);
    
    if (link && newUrl) {
      link.setAttribute('href', newUrl);
    }
  });
  
  closeSocialEditModal();
}

// Adiciona os event listeners para o modal de edição de redes sociais
document.addEventListener('DOMContentLoaded', () => {
  const socialEditBtn = document.querySelector('.social-edit-btn');
  const socialEditModal = document.getElementById('socialEditModal');
  const closeBtn = socialEditModal.querySelector('.close');
  const saveBtn = document.getElementById('saveSocialLinks');
  const cancelBtn = document.getElementById('cancelSocialEdit');
  
  if (socialEditBtn) {
    socialEditBtn.addEventListener('click', openSocialEditModal);
  }
  
  if (closeBtn) {
    closeBtn.addEventListener('click', closeSocialEditModal);
  }
  
  if (saveBtn) {
    saveBtn.addEventListener('click', saveSocialLinks);
  }
  
  if (cancelBtn) {
    cancelBtn.addEventListener('click', closeSocialEditModal);
  }
  
  // Fecha o modal ao clicar fora dele
  window.addEventListener('click', (event) => {
    if (event.target === socialEditModal) {
      closeSocialEditModal();
    }
  });
  
  checkAdminAuth();
  updateSectionEditButtons();
});

function loadExistingProducts() {
  const existingProducts = document.getElementById('existingProducts');
  if (!existingProducts) return;

  // Carrega os produtos do dadus.json
  fetch('data/dadus.json')
    .then(response => response.json())
    .then(data => {
      const products = data.produtos || [];
      
      if (products.length === 0) {
        existingProducts.innerHTML = `
          <div class="no-products-message">
            <i class="fas fa-box-open"></i>
            <p>Nenhum produto cadastrado</p>
          </div>
        `;
        return;
      }

      let productsHTML = '';
      products.forEach((product, index) => {
        const name = product.nome;
        const imagePath = product.imagem;
        
        productsHTML += `
          <div class="existing-product-item">
            <div class="product-preview">
              <img src="${loadImage(imagePath)}" alt="${name}" class="product-preview-image">
              <div class="product-preview-info">
                <h4>${name}</h4>
              </div>
            </div>
            <div class="product-actions">
              <button class="edit-btn" onclick="editProduct(${index})">
                <i class="fas fa-edit"></i> Editar
              </button>
              <button class="delete-btn" onclick="deleteProduct(${index})">
                <i class="fas fa-trash"></i> Excluir
              </button>
            </div>
          </div>
        `;
      });

      existingProducts.innerHTML = productsHTML;
    })
    .catch(error => {
      console.error('Erro ao carregar produtos:', error);
      existingProducts.innerHTML = `
        <div class="error-message">
          <i class="fas fa-exclamation-circle"></i>
          <p>Erro ao carregar produtos</p>
        </div>
      `;
    });
}

// Função para abrir o modal de edição da URL do dadus.json
function openEditDadusUrlModal() {
  const modal = document.getElementById('editModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');

  modalTitle.textContent = 'Editar URL';
  modalBody.innerHTML = `
    <div class="form-group">
      <label for="dadusUrl">URL:</label>
      <input type="url" id="dadusUrl" placeholder="Digite a nova URL">
    </div>
  `;

  // Adiciona eventos aos botões
  //document.getElementById('saveDadusUrl').addEventListener('click', saveDadusUrl);
  //document.getElementById('cancelDadusEdit').addEventListener('click', closeModal);

  modal.style.display = 'block';
}

// Função para salvar a nova URL do dadus.json
function saveDadusUrl() {
  const newUrl = document.getElementById('dadusUrl').value;
  if (!newUrl) {
    alert('Por favor, insira uma URL válida.');
    return;
  }

  // Atualiza a URL no arquivo dadus.json (simulação)
  console.log(`Nova URL do Dadus: ${newUrl}`);
  alert('URL do Dadus atualizada com sucesso!');
  closeModal();
}

// Adiciona evento ao botão de editar URL do Dadus
document.getElementById('editDadusUrl').addEventListener('click', openEditDadusUrlModal);

// Função para editar um item (evento ou projeto)
function editItem(index, currentText, sectionId) {
  const modal = document.getElementById('editModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  
  modalTitle.textContent = 'Editar Item';
  modalBody.innerHTML = `
    <div class="form-section">
      <div class="form-group">
        <label for="editItemText">Nome do Item:</label>
        <input type="text" id="editItemText" value="${currentText}" required>
      </div>
    </div>
  `;
  
  const updateBtn = document.getElementById('saveChanges');
  const cancelBtn = document.getElementById('cancelEdit');
  
  updateBtn.addEventListener('click', function() {
    const newText = document.getElementById('editItemText').value.trim();
    if (newText) {
      const itemsList = document.querySelector(`#${sectionId} .section-list`);
      if (itemsList && itemsList.children[index]) {
        itemsList.children[index].textContent = newText;
      }
      closeModal();
      openSectionEditModal(sectionId);
    }
  });
  
  cancelBtn.addEventListener('click', closeModal);
  
  modal.style.display = 'block';
}

// Função para deletar um item (evento ou projeto)
function deleteItem(index, sectionId) {
  if (confirm('Tem certeza que deseja excluir este item?')) {
    const itemsList = document.querySelector(`#${sectionId} .section-list`);
    if (itemsList && itemsList.children[index]) {
      itemsList.children[index].remove();
    }
    openSectionEditModal(sectionId);
  }
}

// Função para converter imagem em base64
function getBase64Image(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
}

// Função para adicionar um novo fundador
async function addFounder(name, title, imageFile) {
  try {
    const imageBase64 = await getBase64Image(imageFile);
    const founderData = {
      nome: name,
      cargo: title,
      imagem: imageBase64
    };

    // Atualiza o dadus.json
    const dadusData = JSON.parse(localStorage.getItem('dadusData') || '{}');
    if (!dadusData.fundadoresEDiretores) {
      dadusData.fundadoresEDiretores = [];
    }
    dadusData.fundadoresEDiretores.push(founderData);
    localStorage.setItem('dadusData', JSON.stringify(dadusData));
    return true;
  } catch (error) {
    console.error('Erro ao adicionar fundador:', error);
    return false;
  }
}

// Função para salvar uma imagem
async function saveImage(file, type, name) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function(e) {
      const base64Image = e.target.result;
      const imagePath = `@produtos/${name.toLowerCase().replace(/\s+/g, '_')}.jpg`;
      
      // Salva a imagem no localStorage
      const images = JSON.parse(localStorage.getItem('productImages') || '{}');
      images[imagePath] = base64Image;
      localStorage.setItem('productImages', JSON.stringify(images));
      
      resolve(imagePath);
    };
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
}

// Função para adicionar um novo produto
async function addProduct(name, imageFile) {
  try {
    // Salva a imagem e obtém o caminho
    const imagePath = await saveProductImage(imageFile, name);
    
    // Atualiza a interface
    addProductToGrid(name, imagePath);
    loadExistingProducts();
    
    // Mostra alerta de sucesso
    alert(`Produto "${name}" adicionado com sucesso!`);
    return true;
  } catch (error) {
    console.error('Erro ao adicionar produto:', error);
    // Mostra alerta de erro
    alert(`Erro ao adicionar o produto "${name}": ${error.message}`);
    return false;
  }
}

// Função para carregar uma imagem
function loadImage(imagePath) {
  if (imagePath.startsWith('@produtos/')) {
    const productImages = JSON.parse(localStorage.getItem('productImages') || '{}');
    return productImages[imagePath] || '';
  }
  return imagePath;
}

// Função para atualizar a interface com os dados
function updateUI(data) {
  // Atualiza fundadores
  const foundersContainer = document.querySelector('.founders-grid');
  if (foundersContainer && data.fundadoresEDiretores) {
    foundersContainer.innerHTML = data.fundadoresEDiretores.map(founder => `
      <div class="founder-card">
        <img src="${founder.imagem}" alt="${founder.nome}" class="founder-image">
        <div class="founder-info">
          <h3 class="founder-name">${founder.nome}</h3>
          <p class="founder-title">${founder.cargo}</p>
        </div>
      </div>
    `).join('');
  }

  // Atualiza produtos
  const productsContainer = document.querySelector('.products-grid');
  if (productsContainer && data.produtos) {
    productsContainer.innerHTML = data.produtos.map(product => `
      <div class="product-card">
        <img src="${loadImage(product.imagem)}" alt="${product.nome}" class="product-image">
        <div class="product-info">
          <h3 class="product-name">${product.nome}</h3>
        </div>
      </div>
    `).join('');
  }

  // Atualiza eventos
  const eventsContainer = document.querySelector('.events-grid');
  if (eventsContainer && data.eventos) {
    eventsContainer.innerHTML = data.eventos.map(event => `
      <div class="event-card">
        <img src="${event.imagem}" alt="${event.nome}" class="event-image">
        <div class="event-info">
          <h3 class="event-name">${event.nome}</h3>
        </div>
      </div>
    `).join('');
  }
}

// Função para carregar os dados iniciais
async function loadData() {
  try {
    const response = await fetch('data/dadus.json');
    if (!response.ok) {
      throw new Error('Erro ao carregar dados');
    }
    const data = await response.json();
    updateUI(data);
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
    alert('Erro ao carregar os dados. Por favor, tente novamente mais tarde.');
  }
}

// Função para salvar uma imagem de produto
async function saveProductImage(file, productName) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async function(e) {
      try {
        // Gera um nome único para a imagem
        const imageName = productName.toLowerCase().replace(/\s+/g, '_') + '_' + Date.now() + '.jpg';
        const imagePath = `imagens/produtos/${imageName}`;
        
        // Converte base64 para blob
        const base64Data = e.target.result.split(',')[1];
        const binaryData = atob(base64Data);
        const arrayBuffer = new ArrayBuffer(binaryData.length);
        const uint8Array = new Uint8Array(arrayBuffer);
        for (let i = 0; i < binaryData.length; i++) {
          uint8Array[i] = binaryData.charCodeAt(i);
        }
        const blob = new Blob([uint8Array], { type: 'image/jpeg' });
        
        // Salva a imagem no localStorage
        const productImages = JSON.parse(localStorage.getItem('productImages') || '{}');
        productImages[imagePath] = e.target.result;
        localStorage.setItem('productImages', JSON.stringify(productImages));
        
        // Atualiza o dadus.json
        let dadusData;
        try {
          const response = await fetch('data/dadus.json');
          dadusData = await response.json();
        } catch (error) {
          console.error('Erro ao carregar dadus.json:', error);
          dadusData = { produtos: [] };
        }
        
        if (!dadusData.produtos) {
          dadusData.produtos = [];
        }
        
        dadusData.produtos.push({
          nome: productName,
          imagem: imagePath
        });
        
        // Salva os dados atualizados no dadus.json
        try {
          const response = await fetch('data/dadus.json', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadusData, null, 2)
          });
          
          if (!response.ok) {
            throw new Error('Erro ao salvar dados no dadus.json');
          }
          
          resolve(imagePath);
        } catch (error) {
          console.error('Erro ao salvar dados:', error);
          reject(error);
        }
      } catch (error) {
        console.error('Erro ao processar imagem:', error);
        reject(error);
      }
    };
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
}

// Função para carregar produtos
async function loadProducts() {
  try {
    // Carrega o dadus.json
    const response = await fetch('data/dadus.json');
    if (!response.ok) {
      throw new Error('Erro ao carregar dados do dadus.json');
    }
    const data = await response.json();
    console.log('Dados dos produtos carregados:', data.produtos);
    
    // Carrega os produtos
    const productsContainer = document.querySelector('.products-grid');
    console.log('Container de produtos encontrado:', productsContainer);
    
    if (productsContainer && data.produtos) {
      console.log('Produtos encontrados:', data.produtos);
      
      const productsHTML = data.produtos.map(product => {
        console.log('Processando produto:', product);
        const imagePath = product.imagem.startsWith('imagens/produtos/') ? product.imagem : `imagens/produtos/${product.imagem}`;
        console.log('Caminho da imagem do produto:', imagePath);
        
        return `
          <div class="product-card">
            <img src="${imagePath}" alt="${product.nome}" class="product-image" data-image="${imagePath}">
            <div class="product-info">
              <h3 class="product-name">${product.nome}</h3>
            </div>
          </div>
        `;
      }).join('');
      
      console.log('HTML gerado para produtos:', productsHTML);
      productsContainer.innerHTML = productsHTML;

      // Adiciona evento de clique nas imagens dos produtos
      const productImages = document.querySelectorAll('.product-image');
      productImages.forEach(img => {
        img.addEventListener('click', () => {
          const modal = document.getElementById('productImageModal');
          const modalImg = document.getElementById('modalProductImage');
          modalImg.src = img.dataset.image;
          modalImg.alt = img.alt;
          modal.style.display = 'block';
        });
      });

      // Adiciona evento de fechamento do modal
      const modal = document.getElementById('productImageModal');
      const closeBtn = modal.querySelector('.close');
      const modalImg = document.getElementById('modalProductImage');
      
      closeBtn.onclick = function() {
        modal.style.display = 'none';
      };
      
      window.onclick = function(event) {
        if (event.target == modal) {
          modal.style.display = 'none';
        }
      };
      
      // Adiciona evento para fechar ao clicar fora da imagem
      modal.addEventListener('click', function(event) {
        if (event.target !== modalImg && event.target !== closeBtn) {
          modal.style.display = 'none';
        }
      });
    } else {
      console.log('Container de produtos não encontrado ou sem produtos');
      if (!productsContainer) {
        console.error('Elemento .products-grid não encontrado no DOM');
      }
      if (!data.produtos) {
        console.error('Nenhum produto encontrado no dadus.json');
      }
    }
  } catch (error) {
    console.error('Erro ao carregar produtos:', error);
    alert('Erro ao carregar os produtos. Por favor, tente novamente mais tarde.');
  }
}

// Função para carregar fundadores
async function loadFounders() {
  try {
    // Carrega o dadus.json
    const response = await fetch('data/dadus.json');
    if (!response.ok) {
      throw new Error('Erro ao carregar dados do dadus.json');
    }
    const data = await response.json();
    console.log('Dados dos fundadores carregados:', data.fundadoresEDiretores);
    
    // Carrega os fundadores
    const foundersContainer = document.querySelector('.founders-grid');
    if (foundersContainer && data.fundadoresEDiretores) {
      console.log('Fundadores encontrados:', data.fundadoresEDiretores);
      
      foundersContainer.innerHTML = data.fundadoresEDiretores.map(founder => {
        console.log('Processando fundador:', founder);
        const imagePath = founder.imagem.startsWith('imagens/fundadores/') ? founder.imagem : `imagens/fundadores/${founder.imagem}`;
        console.log('Caminho da imagem do fundador:', imagePath);
        
        return `
          <div class="founder-card">
            <img src="${imagePath}" alt="${founder.nome}" class="founder-image">
            <div class="founder-info">
              <h3 class="founder-name">${founder.nome}</h3>
              <p class="founder-title">${founder.cargo}</p>
            </div>
          </div>
        `;
      }).join('');
    } else {
      console.log('Container de fundadores não encontrado ou sem fundadores');
    }
  } catch (error) {
    console.error('Erro ao carregar fundadores:', error);
    alert('Erro ao carregar os fundadores. Por favor, tente novamente mais tarde.');
  }
}

// Função para carregar a seção Quem Somos
async function loadQuemSomos() {
  try {
    // Carrega o dadus.json
    const response = await fetch('data/dadus.json');
    if (!response.ok) {
      throw new Error('Erro ao carregar dados do dadus.json');
    }
    const data = await response.json();
    console.log('Dados do Quem Somos carregados:', data.quemSomos);
    
    // Carrega o texto do Quem Somos
    const quemSomosContainer = document.querySelector('#about .section-content');
    console.log('Container do Quem Somos encontrado:', quemSomosContainer);
    
    if (quemSomosContainer && data.quemSomos) {
      console.log('Texto do Quem Somos encontrado');
      const quemSomosHTML = `
        <h1>${data.quemSomos}</h1>
      `;
      console.log('HTML gerado para Quem Somos:', quemSomosHTML);
      quemSomosContainer.innerHTML = quemSomosHTML;
    } else {
      console.log('Container do Quem Somos não encontrado ou sem conteúdo');
      if (!quemSomosContainer) {
        console.error('Elemento #about .section-content não encontrado no DOM');
      }
      if (!data.quemSomos) {
        console.error('Nenhum texto do Quem Somos encontrado no dadus.json');
      }
    }
  } catch (error) {
    console.error('Erro ao carregar Quem Somos:', error);
    alert('Erro ao carregar a seção Quem Somos. Por favor, tente novamente mais tarde.');
  }
}

// Função para carregar eventos
async function loadEvents() {
  try {
    // Carrega o dadus.json
    const response = await fetch('data/dadus.json');
    if (!response.ok) {
      throw new Error('Erro ao carregar dados do dadus.json');
    }
    const data = await response.json();
    console.log('Dados dos eventos carregados:', data.eventos);
    
    // Carrega os eventos
    const eventsContainer = document.querySelector('#events .section-list');
    console.log('Container de eventos encontrado:', eventsContainer);
    
    if (eventsContainer && data.eventos) {
      console.log('Eventos encontrados:', data.eventos);
      
      const eventsHTML = data.eventos.map(event => {
        console.log('Processando evento:', event);
        
        // Usa valores padrão para propriedades ausentes
        const imagePath = event.imagem ? 
          (event.imagem.startsWith('imagens/eventos/') ? event.imagem : `imagens/eventos/${event.imagem}`) : 
          'imagens/eventos/default.jpg';
        
        const eventName = event.nome || 'Evento sem nome';
        const eventDate = event.data || 'Data não definida';
        const eventDescription = event.descricao || 'Descrição não disponível';
        
        console.log('Caminho da imagem do evento:', imagePath);
        
        //<img src="${imagePath}" alt="${eventName}" class="event-image">
        return `
          <li class="event-item">
            <div class="event-card">
              <div class="event-info">
                <h3 class="event-name">${eventName}</h3>
                <p class="event-date">${eventDate}</p>
                <p class="event-description">${eventDescription}</p>
              </div>
            </div>
          </li>
        `;
      }).join('');
      
      console.log('HTML gerado para eventos:', eventsHTML);
      eventsContainer.innerHTML = eventsHTML;
    } else {
      console.log('Container de eventos não encontrado ou sem eventos');
      if (!eventsContainer) {
        console.error('Elemento #events .section-list não encontrado no DOM');
      }
      if (!data.eventos) {
        console.error('Nenhum evento encontrado no dadus.json');
      }
    }
  } catch (error) {
    console.error('Erro ao carregar eventos:', error);
    alert('Erro ao carregar os eventos. Por favor, tente novamente mais tarde.');
  }
}

// Função para carregar informações extras
async function loadInformacoesExtras() {
  try {
    // Carrega o dadus.json
    const response = await fetch('data/dadus.json');
    if (!response.ok) {
      throw new Error('Erro ao carregar dados do dadus.json');
    }
    const data = await response.json();
    console.log('Dados das informações extras carregados:', data.informacoesExtras);
    
    // Carrega as informações extras
    const extrasContainer = document.querySelector('#extras .section-content');
    console.log('Container de informações extras encontrado:', extrasContainer);
    
    if (extrasContainer && data.informacoesExtras) {
      console.log('Informações extras encontradas');
      const extrasHTML = `
        <h1>${data.informacoesExtras}</h1>
      `;
      console.log('HTML gerado para informações extras:', extrasHTML);
      extrasContainer.innerHTML = extrasHTML;
    } else {
      console.log('Container de informações extras não encontrado ou sem conteúdo');
      if (!extrasContainer) {
        console.error('Elemento #extras .section-content não encontrado no DOM');
      }
      if (!data.informacoesExtras) {
        console.error('Nenhuma informação extra encontrada no dadus.json');
      }
    }
  } catch (error) {
    console.error('Erro ao carregar informações extras:', error);
    alert('Erro ao carregar as informações extras. Por favor, tente novamente mais tarde.');
  }
}

// Carrega os dados quando a página é carregada
document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
  loadFounders();
  loadQuemSomos();
  loadEvents();
  loadInformacoesExtras();
});

// Função para abrir o modal de dados dos administradores
async function openAdminDataModal() {
  const modal = document.getElementById('adminDataModal');
  const tableBody = document.getElementById('adminTableBody');
  
  // Limpa a tabela
  tableBody.innerHTML = `
    <tr>
      <td colspan="2" style="text-align: center;">Carregando dados...</td>
    </tr>
  `;
  
  try {
    // Carrega o dadus.json
    const dadusData = await fetch('data/dadus.json');
    const data = await dadusData.json();
    const url = data.apiUrl;
    const response = await fetch(`${url}/usuarios`);
    
    if (!response.ok) {
      throw new Error('Erro ao carregar dados da API');
    }
    
    const users = await response.json();
    
    // Limpa a tabela novamente
    tableBody.innerHTML = '';
    
    if (users.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="2" style="text-align: center;">Nenhum usuário registrado</td>
        </tr>
      `;
    } else {
      // Adiciona os dados dos usuários na tabela
      users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${user.name}</td>
          <td>${user.contact}</td>
        `;
        tableBody.appendChild(row);
      });
    }
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
    tableBody.innerHTML = `
      <tr>
        <td colspan="2" style="text-align: center; color: red;">
          Erro ao carregar dados. Por favor, tente novamente mais tarde.
        </td>
      </tr>
    `;
  }
  
  modal.style.display = 'block';
}

// Adiciona evento de clique ao botão de admin
document.getElementById('adminButton').addEventListener('click', openAdminDataModal);

// Adiciona evento de fechamento ao modal de admin
const adminModal = document.getElementById('adminDataModal');
const adminCloseBtn = adminModal.querySelector('.close');

adminCloseBtn.onclick = function() {
  adminModal.style.display = 'none';
};

window.onclick = function(event) {
  if (event.target == adminModal) {
    adminModal.style.display = 'none';
  }
};

// Função para registrar um novo usuário
async function registerUser() {
  const name = document.getElementById('name').value.trim();
  const contact = document.getElementById('contact').value.trim();

  try {
    // Carrega a URL da API do dadus.json
    const dadusResponse = await fetch('data/dadus.json');
    const dadusData = await dadusResponse.json();
    const apiUrl = dadusData.apiUrl;
    // Envia os dados para a API
    const response = await fetch(`${apiUrl}/salvar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        contact: contact
      })
    });

    if (!response.ok) {
      throw new Error('Erro ao registrar usuário');
    }

    const result = await response.json();
    
    if (result.success) {
      alert('Usuário registrado com sucesso!');
      // Limpa o formulário
      document.getElementById('name').value = '';
      document.getElementById('contact').value = '';
    } else {
      alert(result.message || 'Erro ao registrar usuário');
    }
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    alert('Erro ao registrar usuário. Por favor, tente novamente mais tarde.');
  }
}

// Adiciona evento de submit ao formulário de registro
document.getElementById('registrationForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Previne o comportamento padrão do formulário
  registerUser(); // Chama a função de registro
});

function updateSocialLinksFromDadus() {
  fetch('data/dadus.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao carregar o arquivo dadus.json');
      }
      return response.json();
    })
    .then(data => {
      const socialLinks = data.redesSociais;
      if (!socialLinks) {
        console.error('Nenhum link de redes sociais encontrado no dadus.json');
        return;
      }

      Object.keys(socialLinks).forEach(platform => {
        const linkElement = document.querySelector(`.social-links a[data-platform="${platform}"]`);
        if (linkElement) {
          linkElement.setAttribute('href', socialLinks[platform]);
        }
      });
    })
    .catch(error => {
      console.error('Erro ao atualizar os links das redes sociais:', error);
    });
}

// Chama a função ao carregar a página
document.addEventListener('DOMContentLoaded', updateSocialLinksFromDadus);
