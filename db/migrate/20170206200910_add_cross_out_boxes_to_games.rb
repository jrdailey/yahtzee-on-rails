class AddCrossOutBoxesToGames < ActiveRecord::Migration[5.0]
  def change
    add_column :games, :cross_out_aces, :boolean
    add_column :games, :cross_out_twos, :boolean
    add_column :games, :cross_out_three, :boolean
    add_column :games, :cross_out_fours, :boolean
    add_column :games, :cross_out_fives, :boolean
    add_column :games, :cross_out_sixes, :boolean
    add_column :games, :cross_out_three_of_a_kind, :boolean
    add_column :games, :cross_out_four_of_a_kind, :boolean
    add_column :games, :cross_out_full_house, :boolean
    add_column :games, :cross_out_sm_straight, :boolean
    add_column :games, :cross_out_lg_straight, :boolean
    add_column :games, :cross_out_yahtzee, :boolean
    add_column :games, :cross_out_chance, :boolean
  end
end
