class UsersController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:create]
  before_action :set_user, only: %i[ show edit update destroy ]
  before_action :authorized_user, only: [:perfil, :update_password]
  # GET /users or /users.json
def index
  @users = User.page(params[:page]).per(6) # Defina o número de usuários por página (ex: 10)

  respond_to do |format|
    format.html # Renderiza o index.html.erb normalmente
    format.json do
      render json: {
        users: @users.map do |user|
          {
            id: user.id,
            username: user.username,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            created_at: user.created_at,
            updated_at: user.updated_at
          }
        end,
        pagination: {
          current_page: @users.current_page,
          total_pages: @users.total_pages,
          total_count: @users.total_count
        }
      }
    end
  end
end

  # GET /users/perfil
  def perfil
    if @current_user
      render json: {
        id: @current_user.id,
        username: @current_user.username,
        first_name: @current_user.first_name,
        last_name: @current_user.last_name,
        email: @current_user.email,
        created_at: @current_user.created_at,
        updated_at: @current_user.updated_at
      }
    else
      render json: { message: 'User not authenticated' }, status: :unauthorized
    end
  end

  def update_password
    if @current_user.authenticate(params[:current_password]) # Verifica a senha atual
      if @current_user.update(password: params[:new_password], password_confirmation: params[:new_password_confirmation])
        render json: { message: 'Password updated successfully' }, status: :ok
      else
        render json: { errors: @current_user.errors.full_messages }, status: :unprocessable_entity
      end
    else
      render json: { message: 'Current password is incorrect' }, status: :unauthorized
    end
  end

  # GET /users/1 or /users/1.json
  def show
  end

  # GET /users/new
  def new
    @user = User.new
  end

  # GET /users/1/edit
  def edit
  end

  # POST /users or /users.json
  def create
    @user = User.new(user_params)
  
    respond_to do |format|
      if @user.save
        # Redireciona para a página /auth após a criação bem-sucedida do usuário
        format.html { redirect_to '/auth', notice: "User was successfully created." }
        format.json { render :show, status: :created, location: @user }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end                                

  # PATCH/PUT /users/1 or /users/1.json
  def update
    respond_to do |format|
      if @user.update(user_params)
        format.html { redirect_to @user, notice: "User was successfully updated." }
        format.json { render :show, status: :ok, location: @user }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /users/1 or /users/1.json
  def destroy
    @user.destroy!

    respond_to do |format|
      format.html { redirect_to users_path, status: :see_other, notice: "User was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_user
      @user = User.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def user_params
      params.require(:user).permit(:username, :first_name, :last_name, :email, :password, :password_confirmation)
    end
    
end
