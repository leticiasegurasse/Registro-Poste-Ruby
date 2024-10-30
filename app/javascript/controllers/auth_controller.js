import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    this.renderForm();
  }

  async login(event) {
    event.preventDefault();
    const url = "https://postes.g2telecom.com.br/login";
    const data = {
      email: this.element.querySelector("input[id='email']").value,
      password: this.element.querySelector("input[id='password']").value,
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })
      const tokenJson = await response.json();
      localStorage.setItem('auth', tokenJson.token)
      console.log(localStorage.getItem('auth'));
      window.location.href = "/postes";
    } catch(error) {
      console.log(error);
    }
    
  }

  async renderForm() {
    this.element.innerHTML = `
      <div class="absolute flex justify-center items-center z-50 top-0 left-0 w-full h-screen bg-gradient-to-r from-gray-700 via-gray-900 to-black bg-opacity-60 backdrop-blur-lg">
        <form data-action="submit->auth#login" class="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8 w-full max-w-lg">
          <h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Login</h2>
          <div class="mb-6">
            <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
            <input type="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@example.com" required />
          </div>
          <div class="mb-6">
            <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
            <input type="password" id="password" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
          </div>
          <div class="flex items-center mb-6">
            <a href="/user" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Cadastro</a>
            <!--<input id="remember" type="checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600">
              <label for="remember" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Remember me</label>-->
          </div>
          <button type="submit" class="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-3 text-center dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800">Submit</button>
        </form>
      </div>
    `
  }

}
