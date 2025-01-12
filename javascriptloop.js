const viewers = { "viewer": "p4ssw@rd", "sys_adm": "rootroot#" };
        let currentUser = '';

        function login() {
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const errorMessage = document.getElementById('error-message');

            if (viewers[username] && viewers[username] === password) {
                currentUser = username;
                errorMessage.textContent = '';
                document.getElementById('login-container').style.display = 'none';
                document.getElementById('feed-container').style.display = 'block';
                document.getElementById('post-form').style.display = username === 'sys_adm' ? 'block' : 'none';
                loadPosts();
            } else {
                errorMessage.textContent = 'Usuário ou senha incorretos!';
            }
        }

        function addPost() {
            const postText = document.getElementById('post-text').value;
            const postImageInput = document.getElementById('post-image');
            const postImageFile = postImageInput.files[0];

            if (!postText.trim() && !postImageFile) {
                alert('Por favor, insira texto ou selecione uma imagem.');
                return;
            }

            const texts = JSON.parse(localStorage.getItem('texts')) || [];
            const images = JSON.parse(localStorage.getItem('images')) || [];

            if (postText.trim()) {
                texts.push({ user: currentUser, text: postText });
            }

            if (postImageFile) {
                const reader = new FileReader();
                reader.onloadend = function () {
                    images.push({ user: currentUser, image: reader.result });
                    savePosts(texts, images);
                };
                reader.readAsDataURL(postImageFile);
            } else {
                savePosts(texts, images);
            }
        }

        function savePosts(texts, images) {
            localStorage.setItem('texts', JSON.stringify(texts));
            localStorage.setItem('images', JSON.stringify(images));
            loadPosts();
            document.getElementById('post-text').value = '';
            document.getElementById('post-image').value = '';
        }

        function loadPosts() {
            const postsContainer = document.getElementById('posts');
            postsContainer.innerHTML = '';

            const texts = JSON.parse(localStorage.getItem('texts')) || [];
            const images = JSON.parse(localStorage.getItem('images')) || [];

            const allPosts = [];

            images.forEach(img => {
                allPosts.push({ user: img.user, image: img.image, text: '' });
            });

            texts.forEach(txt => {
                allPosts.push({ user: txt.user, text: txt.text, image: '' });
            });

            allPosts.forEach((post, index) => {
                const postElement = document.createElement('div');

                // Adicionar imagem se houver
                if (post.image) {
                    postElement.innerHTML = `<strong>${post.user} postou uma imagem:</strong><br><img src="${post.image}" alt="Imagem postada"><br>`;
                }

                // Adicionar texto se houver
                if (post.text) {
                    const textElement = document.createElement('div');
                    textElement.innerHTML = `<strong>${post.user}:</strong> ${post.text}`;
                    postElement.appendChild(textElement);
                }

                // Botão de exclusão
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Excluir';
                deleteButton.onclick = function () {
                    if (post.image) {
                        deleteImagePost(index);
                    } else {
                        deleteTextPost(index);
                    }
                };

                postElement.appendChild(deleteButton);
                postsContainer.appendChild(postElement);
            });
        }

        function deleteTextPost(postIndex) {
            const texts = JSON.parse(localStorage.getItem('texts')) || [];
            texts.splice(postIndex, 1);
            localStorage.setItem('texts', JSON.stringify(texts));
            loadPosts();
        }

        function deleteImagePost(postIndex) {
            const images = JSON.parse(localStorage.getItem('images')) || [];
            images.splice(postIndex, 1);
            localStorage.setItem('images', JSON.stringify(images));
            loadPosts();
        }
