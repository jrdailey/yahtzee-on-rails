class Game < ApplicationRecord
  validates :player_name, presence: true
end
