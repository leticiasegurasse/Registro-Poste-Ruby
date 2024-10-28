class RemoveFotoFromPostes < ActiveRecord::Migration[7.1]
  def change
    remove_column :postes, :foto, :string
  end
end
