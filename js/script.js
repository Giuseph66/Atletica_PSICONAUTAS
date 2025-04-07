// Variável global para controle do modo administrador
let isAdmin = false;

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
    <div class="product-edit-form">
      <div class="form-group">
        <label for="productName">Nome do Produto:</label>
        <input type="text" id="productName" placeholder="Digite o nome do produto">
      </div>
      <div class="form-group">
        <label for="productImage">Imagem do Produto:</label>
        <input type="file" id="productImage" accept="image/*">
        <img id="imagePreview" class="image-preview" src="" alt="Preview">
      </div>
      <button id="addProduct" class="add-product-btn">
        <i class="fas fa-plus"></i> Adicionar Produto
      </button>
      <div id="productsList" class="products-list"></div>
    </div>
  `;
  
  // Adiciona os event listeners para o formulário
  const imageInput = document.getElementById('productImage');
  const imagePreview = document.getElementById('imagePreview');
  
  imageInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        imagePreview.src = e.target.result;
        imagePreview.classList.add('visible');
      };
      reader.readAsDataURL(file);
    }
  });
  
  const addProductBtn = document.getElementById('addProduct');
  addProductBtn.addEventListener('click', function() {
    const name = document.getElementById('productName').value;
    const image = document.getElementById('productImage').files[0];
    
    if (name && image) {
      const reader = new FileReader();
      reader.onload = function(e) {
        addProductToGrid(name, e.target.result);
        // Limpa o formulário
        document.getElementById('productName').value = '';
        document.getElementById('productImage').value = '';
        imagePreview.src = '';
        imagePreview.classList.remove('visible');
      };
      reader.readAsDataURL(image);
    } else {
      alert('Por favor, preencha todos os campos!');
    }
  });
  
  modal.style.display = 'block';
}

// Função para adicionar um produto à grade
function addProductToGrid(name, imageUrl) {
  const productsGrid = document.querySelector('.products-grid');
  const productCard = document.createElement('div');
  productCard.className = 'product-card';
  
  productCard.innerHTML = `
    <img src="${imageUrl}" alt="${name}" class="product-image">
    <div class="product-info">
      <h3 class="product-name">${name}</h3>
    </div>
  `;
  
  productsGrid.appendChild(productCard);
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
          <input type="text" id="founderName" placeholder="Digite o nome">
        </div>
        <div class="form-group">
          <label for="founderTitle">Título/Cargo:</label>
          <input type="text" id="founderTitle" placeholder="Digite o título ou cargo">
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
          <input type="file" id="founderImage" accept="image/*"style="display: none;">
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
    const name = document.getElementById('founderName').value;
    const title = document.getElementById('founderTitle').value;
    const image = document.getElementById('founderImage').files[0];
    
    if (name && title && image) {
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
    } else {
      alert('Por favor, preencha todos os campos!');
    }
  });
  
  modal.style.display = 'block';
}

// Função para carregar fundadores existentes
function loadExistingFounders() {
  const existingFounders = document.getElementById('existingFounders');
  const foundersGrid = document.querySelector('.founders-grid');
  const founderCards = foundersGrid.querySelectorAll('.founder-card');
  
  existingFounders.innerHTML = '';
  
  if (founderCards.length === 0) {
    existingFounders.innerHTML = `
      <div class="no-founders-message">
        <i class="fas fa-info-circle"></i>
        <p>Nenhum fundador/diretor cadastrado ainda.</p>
      </div>
    `;
    return;
  }
  
  founderCards.forEach((card, index) => {
    const name = card.querySelector('.founder-name').textContent;
    const title = card.querySelector('.founder-title').textContent;
    const image = card.querySelector('.founder-image').src;
    
    const founderDiv = document.createElement('div');
    founderDiv.className = 'existing-founder-item';
    founderDiv.innerHTML = `
      <div class="founder-preview">
        <img src="${image}" alt="${name}" class="founder-preview-image">
        <div class="founder-preview-info">
          <h4>${name}</h4>
          <p>${title}</p>
        </div>
      </div>
      <div class="founder-actions">
        <button class="edit-founder-btn" data-index="${index}">
          <i class="fas fa-edit"></i> Editar
        </button>
        <button class="delete-founder-btn" data-index="${index}">
          <i class="fas fa-trash"></i> Excluir
        </button>
      </div>
    `;
    
    existingFounders.appendChild(founderDiv);
    
    // Adiciona evento de edição
    founderDiv.querySelector('.edit-founder-btn').addEventListener('click', function() {
      editFounder(index, name, title, image);
    });
    
    // Adiciona evento de exclusão
    founderDiv.querySelector('.delete-founder-btn').addEventListener('click', function() {
      deleteFounder(index);
    });
  });
}

// Função para editar um fundador existente
function editFounder(index, currentName, currentTitle, currentImage) {
  const modal = document.getElementById('editModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  
  modalTitle.textContent = 'Editar Fundador/Diretor';
  modalBody.innerHTML = `
    <div class="founder-edit-form">
      <div class="form-section">
        <h3>Editar Fundador/Diretor</h3>
        <div class="form-group">
          <label for="editFounderName">Nome:</label>
          <input type="text" id="editFounderName" value="${currentName}">
        </div>
        <div class="form-group">
          <label for="editFounderTitle">Título/Cargo:</label>
          <input type="text" id="editFounderTitle" value="${currentTitle}">
        </div>
        <div class="form-group">
          <label for="editFounderImage">Foto:</label>
          <div class="image-upload-container">
          <div class="image-preview-container">
          <img id="editFounderImagePreview" class="image-preview visible" src="${currentImage}" alt="Preview">
          <div class="image-placeholder" style="display: none;">
          <i class="fas fa-user"></i>
          <span>Clique para adicionar uma foto</span>
          </div>
          </div>
          <input type="file" id="editFounderImage" accept="image/*"style="display: none;">
          </div>
        </div>
        <div class="modal-actions">
          <button id="saveFounderEdit" class="save-btn">
            <i class="fas fa-save"></i> Salvar Alterações
          </button>
          <button id="cancelFounderEdit" class="cancel-btn">
            <i class="fas fa-times"></i> Cancelar
          </button>
        </div>
      </div>
    </div>
  `;
  
  // Adiciona os event listeners para o formulário de edição
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
      const reader = new FileReader();
      reader.onload = function(e) {
        imagePreview.src = e.target.result;
        imagePreview.classList.add('visible');
        imagePlaceholder.style.display = 'none';
      };
      reader.readAsDataURL(file);
    }
  });
  
  // Salva as alterações
  document.getElementById('saveFounderEdit').addEventListener('click', function() {
    const newName = document.getElementById('editFounderName').value;
    const newTitle = document.getElementById('editFounderTitle').value;
    const newImage = imagePreview.src;
    
    if (newName && newTitle) {
      updateFounder(index, newName, newTitle, newImage);
      openFoundersEditModal(); // Recarrega a lista
    } else {
      alert('Por favor, preencha todos os campos!');
    }
  });
  
  // Cancela a edição
  document.getElementById('cancelFounderEdit').addEventListener('click', function() {
    openFoundersEditModal(); // Volta para a lista
  });
}

// Função para atualizar um fundador existente
function updateFounder(index, name, title, imageUrl) {
  const foundersGrid = document.querySelector('.founders-grid');
  const founderCard = foundersGrid.children[index];
  
  founderCard.innerHTML = `
    <img src="${imageUrl}" alt="${name}" class="founder-image">
    <div class="founder-info">
      <h3 class="founder-name">${name}</h3>
      <p class="founder-title">${title}</p>
    </div>
  `;
}

// Função para excluir um fundador
function deleteFounder(index) {
  if (confirm('Tem certeza que deseja excluir este fundador/diretor?')) {
    const foundersGrid = document.querySelector('.founders-grid');
    foundersGrid.children[index].remove();
    openFoundersEditModal(); // Recarrega a lista
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

// Atualiza a função openSectionEditModal para incluir fundadores
function openSectionEditModal(sectionId) {
  const section = document.getElementById(sectionId);
  const title = section.querySelector('h2').textContent;
  const content = section.querySelector('.section-content').innerHTML;
  const list = section.querySelector('.section-list');
  
  document.getElementById('modalTitle').textContent = `Editar ${title}`;
  
  let modalContent = '';
  
  if (sectionId === 'products') {
    modalContent = `
      <div class="form-section">
        <h3>Adicionar Novo Produto</h3>
        <div class="form-group">
          <label for="productName">Nome do Produto</label>
          <input type="text" id="productName" placeholder="Digite o nome do produto">
        </div>
        <div class="form-group">
          <label for="productImage">Imagem do Produto</label>
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
        <button id="addProduct" class="add-product-btn">
          <i class="fas fa-plus"></i> Adicionar Produto
        </button>
      </div>
      <div class="existing-products-section">
        <h3>Produtos Existentes</h3>
        <div id="existingProducts" class="existing-products"></div>
      </div>
    `;
  } else if (sectionId === 'founders') {
    openFoundersEditModal();
    return;
  } else {
    // ... existing other sections code ...
  }
  
  document.getElementById('modalBody').innerHTML = modalContent;
  
  if (sectionId === 'products') {
    const imageInput = document.getElementById('productImage');
    const imagePreview = document.getElementById('productImagePreview');
    const imagePlaceholder = document.querySelector('.image-placeholder');
    const imageContainer = document.querySelector('.image-preview-container');
    
    // Adiciona evento de clique no container para abrir o seletor de arquivo
    imageContainer.addEventListener('click', function() {
      imageInput.click();
    });
    
    imageInput.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          imagePreview.src = e.target.result;
          imagePreview.classList.add('visible');
          imagePlaceholder.style.display = 'none';
        }
        reader.readAsDataURL(file);
      }
    });
    
    document.getElementById('addProduct').addEventListener('click', function() {
      const productName = document.getElementById('productName').value;
      const productImage = document.getElementById('productImage').files[0];
      
      if (!productName) {
        alert('Por favor, insira o nome do produto');
        return;
      }
      
      if (!productImage) {
        alert('Por favor, selecione uma imagem para o produto');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = function(e) {
        const product = {
          name: productName,
          image: e.target.result
        };
        
        addProductToGrid(product);
        document.getElementById('productName').value = '';
        document.getElementById('productImage').value = '';
        imagePreview.classList.remove('visible');
        imagePlaceholder.style.display = 'flex';
      };
      reader.readAsDataURL(productImage);
    });
    
    loadExistingProducts();
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

function addProductToGrid(product) {
  const productsGrid = document.querySelector('.products-grid');
  if (!productsGrid) return;
  
  const productCard = document.createElement('div');
  productCard.className = 'product-card';
  productCard.innerHTML = `
    <img src="${product.image}" alt="${product.name}" class="product-image">
    <div class="product-info">
      <h3 class="product-name">${product.name}</h3>
      <div class="product-actions">
        <button class="edit-product-btn" onclick="editProduct(this)">
          <i class="fas fa-edit"></i> Editar
        </button>
        <button class="delete-product-btn" onclick="deleteProduct(this)">
          <i class="fas fa-trash"></i> Excluir
        </button>
      </div>
    </div>
  `;
  
  productsGrid.appendChild(productCard);
}

function loadExistingProducts() {
  const existingProducts = document.getElementById('existingProducts');
  if (!existingProducts) return;
  
  const products = document.querySelectorAll('.product-card');
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
  products.forEach(product => {
    const name = product.querySelector('.product-name').textContent;
    const image = product.querySelector('.product-image').src;
    
    productsHTML += `
      <div class="existing-product-item">
        <div class="product-preview">
          <img src="${image}" alt="${name}" class="product-preview-image">
          <div class="product-preview-info">
            <h4>${name}</h4>
          </div>
        </div>
        <div class="product-actions">
          <button class="edit-product-btn" onclick="editProduct(this)">
            <i class="fas fa-edit"></i> Editar
          </button>
          <button class="delete-product-btn" onclick="deleteProduct(this)">
            <i class="fas fa-trash"></i> Excluir
          </button>
        </div>
      </div>
    `;
  });
  
  existingProducts.innerHTML = productsHTML;
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
