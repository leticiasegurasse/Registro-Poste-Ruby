class AuthController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:login]
  require 'jwt'

  def index 
  end
  # POST /login
  def login
    user = User.find_by(email: params[:email])

    if user && user.authenticate(params[:password])
      token = encode_token({ user_id: user.id })
      render json: { token: token }, status: :ok
    else
      render json: { error: 'Invalid email or password' }, status: :unauthorized
    end
  end

  private

  # Função para gerar o token JWT
  def encode_token(payload)
    JWT.encode(payload, Rails.application.secrets.secret_key_base)
  end
end