class CreateGames < ActiveRecord::Migration[5.0]
  def change
    create_table :games do |t|
      t.integer :aces
      t.integer :twos
      t.integer :threes
      t.integer :fours
      t.integer :fives
      t.integer :sixes
      t.integer :upper_total
      t.integer :three_of_a_kind
      t.integer :four_of_a_kind
      t.integer :full_house
      t.integer :sm_straight
      t.integer :lg_straight
      t.integer :yahtzee
      t.integer :chance
      t.integer :bonuses
      t.integer :upper_total
      t.integer :final_score
      t.boolean :is_finished
      t.string :player_name

      t.timestamps
    end
  end
end
