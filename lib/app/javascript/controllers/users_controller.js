// users_controller.js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    if(!localStorage.getItem('auth')) {
      window.location.href = '/auth';
    }
    this.renderUser();
  }

  static uri = 'http://localhost:3000/users/'
  async createUser(event) {
    event.preventDefault();
    const data = {
      first_name: this.element.querySelector("input[id='first_name']").value,
      last_name: this.element.querySelector("input[id='last_name']").value,
      username: this.element.querySelector("input[id='username']").value,
      email: this.element.querySelector("input[id='email']").value,
      password: this.element.querySelector("input[id='password']").value,
      password_confirmation: this.element.querySelector("input[id='password_confirmation']").value
    }
  
    try {
      const response = await fetch(`${this.constructor.uri}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      
      const userResponse = await response.json();
      console.log(userResponse);
      
    } catch (error) {
      console.log(error);
    }
  }
  

  renderUser() {
    this.element.innerHTML = `
    <div class="absolute flex justify-center items-center z-50 top-0 left-0 w-full h-screen bg-gradient-to-r from-gray-700 via-gray-900 to-black bg-opacity-60 backdrop-blur-lg">
      <form data-action="submit->users#createUser" class="max-w-screen-md w-full mx-auto p-6 lg:p-10 bg-white rounded-lg shadow-md dark:bg-gray-800 space-y-5">
        <!-- Username -->
        <div class="mb-5">
          <label for="username" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
          <input type="text" id="username" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="username" required />
        </div>  
      
        <!-- First Name -->
        <div class="mb-5">
          <label for="first_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">First Name</label>
          <input type="text" id="first_name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John" required />
        </div>

        <!-- Last Name -->
        <div class="mb-5">
          <label for="last_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Last Name</label>
          <input type="text" id="last_name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Doe" required />
        </div>

        <!-- Email -->
        <div class="mb-5">
          <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your Email</label>
          <input type="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@flowbite.com" required />
        </div>

        <!-- Password -->
        <div class="mb-5">
          <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
          <input type="password" id="password" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
        </div>

        <!-- Password Confirmation -->
        <div class="mb-5">
          <label for="password_confirmation" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm Password</label>
          <input type="password" id="password_confirmation" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
        </div>

        <!-- Remember Me Checkbox -->
        <div class="flex items-start mb-5">
          <div class="flex items-center h-5">
            <input id="remember" type="checkbox" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800" />
          </div>
          <label for="remember" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Remember me</label>
        </div>

        <!-- Submit Button -->
        <button type="submit" class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
      </form>
    </div>
    `;
  }
}
