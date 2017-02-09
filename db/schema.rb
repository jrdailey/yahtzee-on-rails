# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20170208212137) do

  create_table "games", force: :cascade do |t|
    t.integer  "aces"
    t.integer  "twos"
    t.integer  "threes"
    t.integer  "fours"
    t.integer  "fives"
    t.integer  "sixes"
    t.integer  "upper_total"
    t.integer  "three_of_a_kind"
    t.integer  "four_of_a_kind"
    t.integer  "full_house"
    t.integer  "sm_straight"
    t.integer  "lg_straight"
    t.integer  "yahtzee"
    t.integer  "chance"
    t.integer  "bonuses"
    t.integer  "final_score"
    t.boolean  "is_finished"
    t.string   "player_name"
    t.datetime "created_at",                null: false
    t.datetime "updated_at",                null: false
    t.boolean  "cross_out_aces"
    t.boolean  "cross_out_twos"
    t.boolean  "cross_out_fours"
    t.boolean  "cross_out_fives"
    t.boolean  "cross_out_sixes"
    t.boolean  "cross_out_three_of_a_kind"
    t.boolean  "cross_out_four_of_a_kind"
    t.boolean  "cross_out_full_house"
    t.boolean  "cross_out_sm_straight"
    t.boolean  "cross_out_lg_straight"
    t.boolean  "cross_out_yahtzee"
    t.boolean  "cross_out_chance"
    t.boolean  "cross_out_threes"
    t.integer  "lower_total"
  end

end
