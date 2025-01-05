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

    if (postText || postImageFile) {
        const posts = JSON.parse(localStorage.getItem('posts')) || [];
        const newPost = { user: currentUser, text: postText };

        // Ler imagem se o usuário tiver selecionado uma
        if (postImageFile) {
            const reader = new FileReader();
            reader.onloadend = function() {
                newPost.image = reader.result; // Armazenar a imagem em formato Base64
                savePost(newPost, posts);
            };
            reader.readAsDataURL(postImageFile); // Lendo arquivo como URL base64
        } else {
            savePost(newPost, posts);
        }
    }
}

function savePost(newPost, posts) {
    posts.push(newPost); // Adicionando nova postagem
    localStorage.setItem('posts', JSON.stringify(posts)); // Salvando no Local Storage
    loadPosts(); // Carregar postagens
    document.getElementById('post-text').value = '';
    document.getElementById('post-image').value = ''; // Limpar o input de imagem
}

function loadPosts() {
    const postsContainer = document.getElementById('posts');
    postsContainer.innerHTML = ''; // Limpar o conteúdo anterior
    const posts = JSON.parse(localStorage.getItem('posts')) || []; // Carregar postagens existentes

    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.innerHTML = `<strong>${post.user}:</strong> ${post.text}`;
        
        if (post.image) {
            const imgElement = document.createElement('img');
            imgElement.src = post.image; // Atribuindo o src da imagem
            imgElement.alt = "Imagem postada";
            imgElement.style.maxWidth = "300px"; // Limitar largura da imagem
            imgElement.style.display = "block"; // Exibir como bloco
            postElement.appendChild(imgElement); // Adicionando a imagem à postagem
        }
        
        postsContainer.appendChild(postElement); // Adicionando a postagem ao container
    });
}