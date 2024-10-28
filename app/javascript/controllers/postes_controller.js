import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  
  connect() {
    if(!localStorage.getItem('auth')) {
      window.location.href = '/auth';
    }
    this.page=1
    this.renderPostes();
    this.setupCityChangeListener();
    this.getLocation();
  }
  toggleModal() {
    const modal = document.getElementById('crud-modal');
    modal.classList.toggle('hidden');
  }
  toggleEditModal() {
    const modal = document.getElementById('crud-modal-content');
    modal.classList.toggle('hidden');
  }
  
  static url = 'http://localhost:3000'

  async getLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;

                    // Cálculo da zona UTM
                    const zonaUTM = Math.floor((longitude + 180) / 6) + 1;
                    const hemisferio = latitude >= 0 ? ' +north' : ' +south';
                    
                    // Definição do sistema de referência WGS84 e UTM
                    const WGS84 = 'EPSG:4326';
                    const projUTM = `+proj=utm +zone=${zonaUTM} +datum=WGS84${hemisferio} +units=m +no_defs`;

                    // Projeção das coordenadas
                    const [easting, northing] = proj4(WGS84, projUTM, [longitude, latitude]);

                    // Retornar dados como um objeto resolvido
                    resolve({
                        zonautm: zonaUTM, // Valor correto da zona UTM
                        localizacao_utm_x: easting.toFixed(2), // Coordenada X em UTM
                        localizacao_utm_y: northing.toFixed(2)  // Coordenada Y em UTM
                    });
                },
                (error) => {
                    console.error('Erro ao obter a localização:', error);
                    reject(error);
                }
            );
        } else {
            console.log("Geolocalização não é suportada pelo seu navegador.");
            reject(new Error("Geolocalização não suportada"));
        }
    });
}

  async createNewPoste(event) {
    event.preventDefault();

    // Obtenha a localização usando a função getLocation
    const { zonautm, localizacao_utm_x, localizacao_utm_y } = await this.getLocation();

    // Aqui você deve coletar os outros dados do formulário. 
    // Por exemplo, supondo que você tenha um formulário com campos de entrada com ids específicos:
    const observacoes = this.element.querySelector("textarea[id='observacoes']").value;
    const file = this.element.querySelector("input[id='file_url']").files[0];
    const bairroId = this.element.querySelector("select[id='bairro']").value; // Altere conforme o seu formulário
    const cidadeId = this.element.querySelector("select[id='cidade']").value;  // Altere conforme o seu formulário

    // Crie o objeto data com todos os parâmetros necessários
    const data = new FormData();
    data.append("poste[zonautm]", zonautm);
    data.append("poste[localizacao_utm_x]", localizacao_utm_x);
    data.append("poste[localizacao_utm_y]", localizacao_utm_y);
    data.append("poste[observacoes]", observacoes);
    data.append("poste[data_registro]", new Date().toISOString());
    data.append("poste[file]", file); // Note que file deve ser o arquivo selecionado pelo usuário
    data.append("poste[bairro_id]", bairroId);
    data.append("poste[cidade_id]", cidadeId);

    // Agora você pode enviar os dados para o servidor
    try {
        const response = await fetch(`${this.constructor.url}/postes/`, {
            method: "POST",
            headers: {
                "Authorization": `${localStorage.getItem('auth')}`
            },
            body: data
        });

        if (response.ok) {
          this.renderPostes();
            this.toggleModal()
            // Você pode redirecionar ou atualizar a interface aqui
        } else {
            console.error("Erro ao criar o poste:", response.statusText);
        }
    } catch (error) {
        console.error("Erro de rede:", error);
    }
}


  async posteForm() {
    const token = localStorage.getItem('auth');
    const responseCidadeJson = await fetch(`${this.constructor.url}/cidades.json`, {
      headers: {
        'Authorization': `${token}`
      }
    });
    const cidades = await responseCidadeJson.json();

    return `
      <!-- Modal body -->
      <form data-action="submit->postes#createNewPoste" class="p-4 md:p-5" enctype="multipart/form-data">
        <div class="grid gap-4 mb-4 grid-cols-2">
        <!-- Campo para Upload de Arquivo -->
          <div class="col-span-2">
              <label for="file_url" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Upload de Arquivo
              </label>
              <input type="file" name="file_url" id="file_url" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" required="">
          </div>
          <!-- Campo para Observações -->
          <div class="col-span-2">
              <label for="observacoes" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Observações
              </label>
              <textarea name="observacoes" id="observacoes" rows="4" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-600 focus:border-primary-600 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Digite suas observações" required=""></textarea>
          </div>
          <!-- Select de Cidades -->
          <div class="col-span-2">
              <label for="cidade" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Cidade
              </label>
              <select id="cidade" name="cidade" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-600 focus:border-primary-600 dark:bg-gray-600 dark:border-gray-500 dark:text-white" required>
                  <option value="">Selecione uma cidade</option>
                  ${cidades.map(cidade => `<option value="${cidade.id}">${cidade.nome}</option>`).join('')}
              </select>
          </div>
          <!-- Select de Bairros -->
          <div class="col-span-2">
              <label for="bairro" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Bairro
              </label>
              <select id="bairro" name="bairro" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-600 focus:border-primary-600 dark:bg-gray-600 dark:border-gray-500 dark:text-white" required disabled>
                  <option value="">Selecione uma cidade primeiro</option>
              </select>
          </div>
        </div>
        <button type="submit" class="mt-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Salvar Poste</button>
      </form>
    `;
  }

  setupCityChangeListener() {
    document.addEventListener('change', (event) => {
      if (event.target.id === 'cidade') {
        this.updateBairros(event.target.value);
      }
    });
  }

  async updateBairros(cidadeId) {
    const responseBairroJson = await fetch(`${this.constructor.url}/bairros.json?cidade_id=${cidadeId}`, {
      headers: {
        'Authorization': `${this.localStorage.getItem('auth')}`
      }
    });
    const bairros = await responseBairroJson.json();
    console.log(bairros);
    
    const bairroSelect = document.getElementById('bairro');

    bairroSelect.innerHTML = bairros.map(bairro => `<option value="${bairro.id}">${bairro.nome}</option>`).join('');
    bairroSelect.disabled = bairros.length === 0;
  }

  async openEditModal(event) {
    const posteId = event.currentTarget.dataset.posteId;  // Obtém o ID do data-attribute
    const response = await fetch(`${this.constructor.url}/postes/${posteId}.json`, {
      headers: {
        'Authorization': `${localStorage.getItem('auth')}`
      }
    });
    const poste = await response.json();
    console.log(poste);
    // debugger
    
    // Gera o formulário com os dados do poste para edição
    const editModalContent = await this.editPosteForm(poste);
    document.getElementById('crud-modal-content').innerHTML = editModalContent;
    
    // Exibe o modal de edição
    this.toggleEditModal();
  }

  async excluirPoste(event) {
    const posteId = event.currentTarget.dataset.posteId;
    try {
      const response = await fetch(`${this.constructor.url}/postes/${posteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `${localStorage.getItem('auth')}`
        }
      });
      if (response.ok) {
        this.renderPostes();  // Atualiza a lista
      } else {
          console.error("Erro ao atualizar o poste:", response.statusText);
      }
    } catch(error) {
      console.log(error);
      
    }
  }

  // Método para renderizar o formulário de edição
  async editPosteForm(poste) {
    return `
    <div class=" overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full h-screen">
      <div class="absolute flex justify-center items-center bg-black/50  p-4 w-full h-screen">
        <div class="relative bg-white w-[80%] rounded-lg shadow dark:bg-gray-700">
          <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Editar Poste
            </h3>
            <button type="button" data-action="click->postes#toggleEditModal" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
            </svg>
            <span class="sr-only">Close modal</span>
            </button>
          </div>
          <form data-action="submit->postes#updatePoste" class="p-4 md:p-5" enctype="multipart/form-data">
            <div class="grid gap-4 mb-4 grid-cols-2">
              <input type="hidden" name="posteId" value="${poste.id}">
              
              <!-- Campos preenchidos com dados existentes -->
              <div class="col-span-2">
                  <img src="${poste.file_url}" alt="Poste Image" class="w-16 h-16 object-cover" />
              </div>
              <div class="col-span-2">
                  <label for="file_url" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Upload de Arquivo
                  </label>
                  <input type="file" name="file_url" id="file_url" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg" value="${poste.file_url}">
              </div>
              <div class="col-span-2">
                  <label for="observacoes" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Observações
                  </label>
                  <textarea name="observacoes" id="observacoes" rows="4" class="block w-full p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300">${poste.observacoes}</textarea>
              </div>
              <!-- Selecione os valores atuais -->
              <div class="col-span-2">
                  <label for="cidade" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Cidade
                  </label>
                  <select id="cidade" name="cidade" class="block w-full p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300">
                      <option value="${poste.cidade.id}" selected>${poste.cidade.nome}</option>
                  </select>
              </div>
              <div class="col-span-2">
                  <label for="bairro" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Bairro
                  </label>
                  <select id="bairro" name="bairro" class="block w-full p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300">
                      <option value="${poste.bairro.id}" selected>${poste.bairro.nome}</option>
                  </select>
              </div>
            </div>
            <button type="submit" class="mt-4 text-white bg-blue-700 hover:bg-blue-800 rounded-lg text-sm px-5 py-2.5">Salvar Alterações</button>
          </form>
        </div>
      </div>
    </div>
    `;
  }

  async updatePoste(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const posteId = formData.get('posteId');

    // Crie um novo objeto FormData e adicione os dados do formulário dentro de 'poste'
    const updatedData = new FormData();
    updatedData.append('poste[id]', posteId); // Adicione o ID do poste
    updatedData.append('poste[observacoes]', formData.get('observacoes')); // Adicione as observações
    updatedData.append('poste[cidade_id]', formData.get('cidade')); // Adicione a cidade
    updatedData.append('poste[bairro_id]', formData.get('bairro')); // Adicione o bairro
    // Adicione outros campos conforme necessário
    // Se você estiver incluindo arquivos, faça isso aqui também
    // updatedData.append('poste[file]', formData.get('file'));

    try {
        const response = await fetch(`${this.constructor.url}/postes/${posteId}`, {
            method: "PUT",
            headers: {
                "Authorization": `${localStorage.getItem('auth')}`
            },
            body: updatedData // Envie o novo objeto FormData
        });

        if (response.ok) {
            this.renderPostes();  // Atualiza a lista
            this.toggleModal();   // Fecha o modal
        } else {
            console.error("Erro ao atualizar o poste:", response.statusText);
        }
    } catch (error) {
        console.error("Erro de rede:", error);
    }
}


  async renderPostes() {
    const token = localStorage.getItem('auth');
    const responseJson = await fetch(`${this.constructor.url}/postes.json?page=${this.page}`, {
      headers: {
        'Authorization': `${token}`
      }
    });
    // console.log(await responseJson.json());
    // debugger
    const { postes, pagination } = await responseJson.json();
    console.log(pagination);
    
    this.totalPages = pagination.total_pages
    
    // Geração do HTML da tabela
    const rows = postes.map(poste => `
      <tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
        <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
          ${poste.id}
        </th>
        <td class="px-6 py-4">
          <img src="${poste.file_url}" alt="Poste Image" class="w-16 h-16 object-cover" /> <!-- Exibindo a imagem -->
        </td>
        <td class="px-6 py-4">
          ${poste.zonautm} <!-- Zona UTM -->
        </td>
        <td class="px-6 py-4">
          ${poste.localizacao_utm_x} <!-- Easting (UTM) -->
        </td>
        <td class="px-6 py-4">
          ${poste.localizacao_utm_y} <!-- Northing (UTM) -->
        </td>
        <td class="px-6 py-4">
          ${poste.observacoes}
        </td>
        <td class="px-6 py-4">
          ${new Date(poste.data_registro).toLocaleDateString()} <!-- Formatação da data -->
        </td>
        <td class="px-6 py-4">
          ${poste.users_id} <!-- Usuário (ID do usuário) -->
        </td>
        <td class="px-6 py-4">
          <!--<button type="button" class="font-medium text-blue-600 hover:underline" data-action="click->postes#openEditModal" data-poste-id="${poste.id}">Edit</button>-->
          <button type="button" class="font-medium text-red-600 hover:underline" data-action="click->postes#excluirPoste" data-poste-id="${poste.id}">Excluir</button>
        </td>
      </tr>
    `).join('');

    const formHtml = await this.posteForm();
    
    this.element.innerHTML = `
    <!-- Container principal com fundo que responde ao tema dark -->
    <div class="min-h-screen pt-16 bg-gradient-to-r from-gray-700 via-gray-900 to-black bg-opacity-60 backdrop-blur-lg"> <!-- Classe de fundo aplicada aqui -->
      <div id="crud-modal-content"></div>
      
      <!-- Modal toggle -->
        <div class="container mx-auto px-4 py-3 flex flex-wrap justify-between items-center">
          <h1 class="text-2xl font-semibold text-gray-800 dark:text-gray-100 py-2.5">Postes</h1>
          <button data-action="click->postes#toggleModal" data-modal-toggle="crud-modal" class="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
            Criar Poste
          </button>
        </div>

        <!-- Main modal -->
        <div id="crud-modal" tabindex="-1" aria-hidden="true" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full h-screen">
            <div class="absolute flex justify-center items-center bg-black/50  p-4 w-full h-screen">
                <!-- Modal content -->
                <div class="relative bg-white w-[80%] rounded-lg shadow dark:bg-gray-700">
                    <!-- Modal header -->
                    <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                            Novo Poste
                        </h3>
                        <button type="button" data-action="click->postes#toggleModal" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                          <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                          </svg>
                          <span class="sr-only">Close modal</span>
                        </button>
                    </div>
                    ${formHtml}
                </div>
            </div>
        </div>

      <!-- Container da tabela -->
      <div class="flex justify-center ">
        <div class="relative overflow-x-auto shadow-md sm:rounded-lg w-4/5">
          <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" class="px-6 py-3">ID</th>
                <th scope="col" class="px-6 py-3">Foto</th>
                <th scope="col" class="px-6 py-3">Zona UTM</th>
                <th scope="col" class="px-6 py-3">Easting (UTM)</th>
                <th scope="col" class="px-6 py-3">Northing (UTM)</th>
                <th scope="col" class="px-6 py-3">Observações</th>
                <th scope="col" class="px-6 py-3">Data de Registro</th>
                <th scope="col" class="px-6 py-3">Usuário</th>
                <th scope="col" class="px-6 py-3">Ação</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
          <div class="flex justify-between items-center mt-4 px-4 py-2">
            <button 
              data-action="click->postes#previousPage" 
              class="px-4 py-2 rounded-lg transition-all duration-300 text-white bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800 shadow-lg ${this.page <= 1 ? 'opacity-50 cursor-not-allowed' : ''}" 
              ${this.page <= 1 ? 'disabled' : ''}
            >
              Anterior
            </button>
            
            <span class="text-gray-700 dark:text-gray-300">
              Página ${this.page} de ${this.totalPages}
            </span>
            
            <button 
              data-action="click->postes#nextPage" 
              class="px-4 py-2 rounded-lg transition-all duration-300 text-white bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800 shadow-lg ${this.page >= this.totalPages ? 'opacity-50 cursor-not-allowed' : ''}" 
              ${this.page >= this.totalPages ? 'disabled' : ''}
            >
              Próxima
            </button>
          </div>

          </div>
          </div>
          <div class="w-[80%] mx-auto flex justify-between mt-6">
          <button data-action="click->postes#exportToExcel" class="px-4 py-2 rounded-lg transition-all duration-300 text-white bg-green-500 hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-800 shadow-lg">Exportar para Excel</button>
           
      </div>

    </div> <!-- Fechamento do container principal -->
  `;
  }

  async exportToExcel() {
    const token = localStorage.getItem('auth');
    const response = await fetch(`${this.constructor.url}/postes.xlsx`, {
      headers: { 
        'Authorization': `${token}`
      }
    })
    if(response.ok) {
      const blob = await response.blob(); // Converte a resposta para blob
      const url = window.URL.createObjectURL(blob); // Cria uma URL temporária para o blob
  
      // Cria um link temporário e simula o clique para download
      const link = document.createElement('a');
      link.href = url;
      link.download = 'postes.xlsx'; // Nome sugerido para o arquivo
      document.body.appendChild(link);
      link.click();
      
      // Limpa o link temporário e URL após o download
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
  
      alert('Exportado com sucesso!');
    } else {
      alert('Erro ao exportar')
    }
  }

  previousPage() {
    if (this.page > 1) {
      this.page -= 1;
      this.renderPostes();
    }
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.page += 1;
      this.renderPostes();
    }
  }
}
