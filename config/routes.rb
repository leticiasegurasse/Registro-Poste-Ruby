Rails.application.routes.draw do
  resources :postes
  resources :bairros
  resources :cidades
  resources :users do
    collection do
      get 'perfil', to: 'users#perfil'
      patch 'update_password', to: 'users#update_password'
    end
  end
  resources :auth
  resources :perfil
  # Defines the root path route ("/")
  post 'login', to: 'auth#login'
  root "home#index"
end
