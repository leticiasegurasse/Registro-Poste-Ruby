class PerfilController < ApplicationController
  before_action :authorized_user, only: %i[index], if: -> { request.format.json?}
  def index 
  end
end
