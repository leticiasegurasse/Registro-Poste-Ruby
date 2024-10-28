class PostesController < ApplicationController
  skip_before_action :verify_authenticity_token, only: %i[create update destroy]
  
  # Exige autenticação apenas para `json` e `xlsx` no endpoint `index`
  before_action :authorized_user, only: %i[show create update destroy], if: -> { request.format.json? || request.format.xlsx? }
  before_action :authorized_user, only: %i[index], if: -> { request.format.json? || request.format.xlsx? }
  before_action :set_poste, only: %i[show edit update destroy]

  # GET /postes or /postes.json
def index
  @postes = Poste.includes(:bairro, :cidade).page(params[:page]).per(6) # 10 registros por página

  respond_to do |format|
    format.html # Renderiza o arquivo index.html.erb normalmente
    format.xlsx
    format.json do
      render json: {
        postes: @postes.map do |poste|
          {
            id: poste.id,
            users_id: poste.users_id,
            zonautm: poste.zonautm,
            localizacao_utm_x: poste.localizacao_utm_x,
            localizacao_utm_y: poste.localizacao_utm_y,
            observacoes: poste.observacoes,
            data_registro: poste.data_registro,
            created_at: poste.created_at,
            updated_at: poste.updated_at,
            file_url: poste.file.attached? ? url_for(poste.file) : nil,
            bairro: {
              id: poste.bairro.id,
              nome: poste.bairro.nome
            },
            cidade: {
              id: poste.cidade.id,
              nome: poste.cidade.nome
            }
          }
        end,
        pagination: {
          current_page: @postes.current_page,
          total_pages: @postes.total_pages,
          total_count: @postes.total_count
        }
      }
    end
  end
end

  

  # GET /postes/1 or /postes/1.json
  def show
    respond_to do |format|
      format.html # Renderiza a view padrão
      format.json do
        render json: {
          id: @poste.id,
          users_id: @poste.users_id,
          zonautm: @poste.zonautm,
          localizacao_utm_x: @poste.localizacao_utm_x,
          localizacao_utm_y: @poste.localizacao_utm_y,
          observacoes: @poste.observacoes,
          data_registro: @poste.data_registro,
          created_at: @poste.created_at,
          updated_at: @poste.updated_at,
          file_url: url_for(@poste.file),
          bairro: {
            id: @poste.bairro.id,
            nome: @poste.bairro.nome
          },
          cidade: {
            id: @poste.cidade.id,
            nome: @poste.cidade.nome
          }
        }
      end
    end
  end   

  # GET /postes/new
  def new
    @poste = Poste.new
  end

  # GET /postes/1/edit
  def edit
  end

  # POST /postes or /postes.json
  def create
    @poste = Poste.new(poste_params)
    @poste.users_id = @current_user.id # Usa o ID do usuário autenticado

    respond_to do |format|
      if @poste.save
        format.html { redirect_to @poste, notice: "Poste was successfully created." }
        format.json { render :show, status: :created, location: @poste }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @poste.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /postes/1 or /postes/1.json
  def update
    respond_to do |format|
      if @poste.update(poste_params)
        format.html { redirect_to @poste, notice: "Poste was successfully updated." }
        format.json { render :show, status: :ok, location: @poste }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @poste.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /postes/1 or /postes/1.json
  def destroy
    @poste.destroy!

    respond_to do |format|
      format.html { redirect_to postes_path, status: :see_other, notice: "Poste was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_poste
      @poste = Poste.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def poste_params
      params.require(:poste).permit(:users_id, :cidade_id, :bairro_id, :zonautm, :localizacao_utm_x, :localizacao_utm_y, :observacoes, :data_registro, :file)
    end
    
end
