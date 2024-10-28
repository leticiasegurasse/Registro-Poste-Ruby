class ApplicationController < ActionController::Base
  
  def authorized_user
    auth_header = request.headers['Authorization']
    
    # Verifica se o cabeçalho de autorização está presente
    unless auth_header
      render json: { message: 'Authorization header missing' }, status: :unauthorized
      return
    end

    token = auth_header.split(' ').last

    # Decodifica o token e tenta encontrar o usuário
    begin
      decoded_token = JWT.decode(token, Rails.application.secret_key_base)[0]
      user_id = decoded_token['user_id']
      @current_user = User.find(user_id)
    rescue JWT::DecodeError
      render json: { message: 'Invalid token' }, status: :unauthorized
    rescue ActiveRecord::RecordNotFound
      render json: { message: 'User not found' }, status: :unauthorized
    end
  end
end
