class CreateBairros < ActiveRecord::Migration[7.1]
  def change
    create_table :bairros do |t|
      t.string :nome
      t.references :cidade, null: false, foreign_key: true

      t.timestamps
    end
  end
end
