class AddCrossOutThreesToGames < ActiveRecord::Migration[5.0]
  def change
    add_column :games, :cross_out_threes, :boolean
  end
end
