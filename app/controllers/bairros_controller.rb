class BairrosController < ApplicationController
  before_action :set_bairro, only: %i[ show edit update destroy ]
  before_action :authorized_user, only: %i[show create update destroy], if: -> { request.format.json?  }
  before_action :authorized_user, only: %i[index], if: -> { request.format.json?  }

  # GET /bairros or /bairros.json
  def index
    if params[:cidade_id].present?
      @bairros = Bairro.where(cidade_id: params[:cidade_id])
    else
      @bairros = Bairro.all
    end
    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @bairros }
    end
  end

  # GET /bairros/1 or /bairros/1.json
  def show
  end

  # GET /bairros/new
  def new
    @bairro = Bairro.new
  end

  # GET /bairros/1/edit
  def edit
  end

  # POST /bairros or /bairros.json
  def create
    @bairro = Bairro.new(bairro_params)

    respond_to do |format|
      if @bairro.save
        format.html { redirect_to @bairro, notice: "Bairro was successfully created." }
        format.json { render :show, status: :created, location: @bairro }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @bairro.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /bairros/1 or /bairros/1.json
  def update
    respond_to do |format|
      if @bairro.update(bairro_params)
        format.html { redirect_to @bairro, notice: "Bairro was successfully updated." }
        format.json { render :show, status: :ok, location: @bairro }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @bairro.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /bairros/1 or /bairros/1.json
  def destroy
    @bairro.destroy!

    respond_to do |format|
      format.html { redirect_to bairros_path, status: :see_other, notice: "Bairro was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_bairro
      @bairro = Bairro.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def bairro_params
      params.require(:bairro).permit(:nome, :cidade_id)
    end
end
