json.extract! poste, :id, :users_id, :cidade_id, :bairro_id, :zonautm, :localizacao_utm_x, :localizacao_utm_y, :observacoes, :data_registro, :created_at, :updated_at

if poste.file.attached?
  json.file_url url_for(poste.file)
end

json.url poste_url(poste, format: :json)
