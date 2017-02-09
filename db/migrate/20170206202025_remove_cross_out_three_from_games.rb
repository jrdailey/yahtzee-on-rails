class RemoveCrossOutThreeFromGames < ActiveRecord::Migration[5.0]
  def change
    remove_column :games, :cross_out_three, :boolean
  end
end
