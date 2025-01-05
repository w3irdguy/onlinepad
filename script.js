const viewers = { "viewer": "p4ssw@rd", "sys_adm": "rootroot#" };
let currentUser = '';

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    // Validação de login
    if (viewers[username] && viewers[username] === password) {
        currentUser = username;
        errorMessage.textContent = '';
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('feed-container').style.display = 'block';
        document.getElementById('post-form').style.display = username === 'sys_adm' ? 'block' : 'none';
        loadPosts(); // Carregar postagens existentes
    } else {
        errorMessage.textContent = 'Usuário ou senha incorretos!';
    }
}

function addPost() {
    const postText = document.getElementById('post-text').value;
    const postImageInput = document.getElementById('post-image');
    const postImageFile = postImageInput.files[0]; // Obter arquivo de imagem

    if (!postText.trim() && !postImageFile) {
        alert('Por favor, insira texto ou selecione uma imagem.');
        return;
    }

    const texts = JSON.parse(localStorage.getItem('texts')) || [];
    const images = JSON.parse(localStorage.getItem('images')) || [];

    if (postText.trim()) {
        texts.push({ user: currentUser, text: postText }); // Armazenar textos
    }

    // Ler imagem se o usuário tiver selecionado uma
    if (postImageFile) {
        const reader = new FileReader();
        reader.onloadend = function() {
            images.push({ user: currentUser, image: reader.result }); // Armazenar a imagem em formato Base64
            savePosts(texts, images);
        };
        reader.readAsDataURL(postImageFile); // Lendo arquivo como URL base64
    } else {
        savePosts(texts, images);
    }
}

function savePosts(texts, images) {
    localStorage.setItem('texts', JSON.stringify(texts)); // Salvando textos no Local Storage
    localStorage.setItem('images', JSON.stringify(images)); // Salvando imagens no Local Storage
    loadPosts(); // Carregar postagens
    document.getElementById('post-text').value = '';
    document.getElementById('post-image').value = ''; // Limpar o input de imagem
}

function loadPosts() {
    const postsContainer = document.getElementById('posts');
    postsContainer.innerHTML = ''; // Limpar o conteúdo anterior

    const texts = JSON.parse(localStorage.getItem('texts')) || []; // Carregar textos existentes
    const images = JSON.parse(localStorage.getItem('images')) || []; // Carregar imagens existentes

    // Carregar textos
    texts.forEach((post, index) => {
        const postElement = document.createElement('div');
        postElement.innerHTML = `<strong>${post.user}:</strong> ${post.text}`;
        
        // Adicionar botão "Excluir" para o administrador
        if (currentUser === 'sys_adm') {
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Excluir Texto';
            deleteButton.onclick = function() {
                deleteTextPost(index);
            };
            postElement.appendChild(deleteButton);
        }

        postsContainer.appendChild(postElement); // Adicionando a postagem ao container
    });

    // Carregar imagens
    images.forEach((post, index) => {
        const postElement = document.createElement('div');
        postElement.innerHTML = `<strong>${post.user} postou uma imagem:</strong>`;
        
        const imgElement = document.createElement('img');
        imgElement.src = post.image; // Atribuindo o src da imagem
        imgElement.alt = "Imagem postada";
        imgElement.style.maxWidth = "300px"; // Limitar largura da imagem
        imgElement.style.display = "block"; // Exibir como bloco
        postElement.appendChild(imgElement); // Adicionando a imagem à postagem

        // Adicionar botão "Excluir" para o administrador
        if (currentUser === 'sys_adm') {
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Excluir Imagem';
            deleteButton.onclick = function() {
                deleteImagePost(index);
            };
            postElement.appendChild(deleteButton);
        }

        postsContainer.appendChild(postElement); // Adicionando a postagem ao container
    });
}

function deleteTextPost(postIndex) {
    const texts = JSON.parse(localStorage.getItem('texts')) || [];
    texts.splice(postIndex, 1); // Remover a postagem pelo índice
    localStorage.setItem('texts', JSON.stringify(texts)); // Atualiza o localStorage
    loadPosts(); // Recarregar postagens
}

function deleteImagePost(postIndex) {
    const images = JSON.parse(localStorage.getItem('images')) || [];
    images.splice(postIndex, 1); // Remover a imagem pelo índice
    localStorage.setItem('images', JSON.stringify(images)); // Atualiza o localStorage
    loadPosts(); // Recarregar postagens
}
