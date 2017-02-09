class AddLowerTotalToGames < ActiveRecord::Migration[5.0]
  def change
    add_column :games, :lower_total, :integer
  end
end
