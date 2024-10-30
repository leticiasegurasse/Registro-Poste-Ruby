import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  connect() {
    if(!localStorage.getItem('auth')) {
      window.location.href = '/auth';
    }
    this.renderPerfil();
  }

  async renderPerfil() {
    const token = localStorage.getItem('auth'); // Recupera o token do localStorage

    if (!token) {
      this.element.innerHTML = `<p class="text-red-500">Você precisa estar logado para ver o perfil.</p>`;
      return;
    }

    const url = "https://postes.g2telecom.com.br/users/perfil"; // URL para buscar as informações do usuário
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar as informações do usuário');
      }

      const userData = await response.json();
      this.createProfileHTML(userData); // Chama a função para criar o HTML do perfil

    } catch (error) {
      console.error(error);
      this.element.innerHTML = `<p class="text-red-500">Erro ao carregar o perfil.</p>`;
    }
  }

  createProfileHTML(user) {
    // Cria o HTML do perfil com as informações do usuário
    this.element.innerHTML = `
        <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-gray-700 via-gray-900 to-black bg-opacity-60 backdrop-blur-lg py-8">
          <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 w-full max-w-md">
            <h2 class="text-3xl font-bold mb-4 text-center text-gray-800 dark:text-white">Meu Perfil</h2>
            <div class="dados bg-gray-200 dark:bg-gray-700 p-4 rounded-lg mb-6">
              <p class="text-gray-700 dark:text-gray-300"><strong>Usuário:</strong> ${user.username}</p>
              <p class="text-gray-700 dark:text-gray-300"><strong>Email:</strong> ${user.email}</p>
              <p class="text-gray-700 dark:text-gray-300"><strong>Data de Registro:</strong> ${new Date(user.created_at).toLocaleDateString()}</p>
            </div>
            <h3 class="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Atualizar Senha</h3>
            <form data-action="submit->perfil#updatePassword" class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div class="mb-4">
                <label for="id_old_password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Senha antiga:</label>
                <input type="password" name="old_password" required id="id_old_password" class="mt-1 block w-full p-2 bg-gray-200 dark:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring focus:ring-blue-500" />
              </div>
              <div class="mb-4">
                <label for="id_new_password1" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nova senha:</label>
                <input type="password" name="new_password" id="id_new_password1" required class="mt-1 block w-full p-2 bg-gray-200 dark:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring focus:ring-blue-500" />
                <span class="text-gray-500 dark:text-gray-400 text-xs">Sua senha deve ter pelo menos 8 caracteres.</span>
              </div>
              <div class="mb-4">
                <label for="id_new_password2" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirmação da nova senha:</label>
                <input type="password" name="new_password_confirmation" id="id_new_password2" required class="mt-1 block w-full p-2 bg-gray-200 dark:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring focus:ring-blue-500" />
                <span class="text-gray-500 dark:text-gray-400 text-xs">Informe a mesma senha informada anteriormente, para verificação.</span>
              </div>
              <button type="submit" class="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200">Atualizar Senha</button>
            </form>
          </div>
        </div>
      `;
  }

  async updatePassword(event) {
    event.preventDefault(); // Evita o envio padrão do formulário

    const token = localStorage.getItem('auth'); // Recupera o token do localStorage
    const oldPassword = event.target.old_password.value;
    const newPassword = event.target.new_password.value;
    const newPasswordConfirmation = event.target.new_password_confirmation.value;

    const url = "https://postes.g2telecom.com.br/users/update_password"; // URL para atualizar a senha
    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Authorization': `${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          current_password: oldPassword,
          new_password: newPassword,
          new_password_confirmation: newPasswordConfirmation,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao atualizar a senha');
      }

      const successMessage = await response.json();
      alert(successMessage.message); // Mensagem de sucesso
      this.renderPerfil(); // Recarrega o perfil para refletir as mudanças

    } catch (error) {
      console.error(error);
      alert(error.message); // Mensagem de erro
    }
  }
}
