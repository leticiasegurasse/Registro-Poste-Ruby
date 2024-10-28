class CreatePostes < ActiveRecord::Migration[7.1]
  def change
    create_table :postes do |t|
      t.references :users, null: false, foreign_key: true
      t.string :foto
      t.references :cidade, null: false, foreign_key: true
      t.references :bairro, null: false, foreign_key: true
      t.float :zonautm
      t.float :localizacao_utm_x
      t.float :localizacao_utm_y
      t.text :observacoes
      t.datetime :data_registro

      t.timestamps
    end
  end
end
