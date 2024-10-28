class Poste < ApplicationRecord
  belongs_to :user, foreign_key: 'users_id'
  has_one_attached :file
  belongs_to :cidade
  belongs_to :bairro
end
