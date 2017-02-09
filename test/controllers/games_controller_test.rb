require 'test_helper'

class GamesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @game = games(:one)
  end

  test "should get index" do
    get games_url
    assert_response :success
  end

  test "should get new" do
    get new_game_url
    assert_response :success
  end

  test "should create game" do
    assert_difference('Game.count') do
      post games_url, params: { game: { aces: @game.aces, bonuses: @game.bonuses, chance: @game.chance, final_score: @game.final_score, fives: @game.fives, four_of_a_kind: @game.four_of_a_kind, fours: @game.fours, full_house: @game.full_house, is_finished: @game.is_finished, lg_straight: @game.lg_straight, player_name: @game.player_name, sixes: @game.sixes, sm_straight: @game.sm_straight, three_of_a_kind: @game.three_of_a_kind, threes: @game.threes, twos: @game.twos, upper_total: @game.upper_total, upper_total: @game.upper_total, yahtzee: @game.yahtzee } }
    end

    assert_redirected_to game_url(Game.last)
  end

  test "should show game" do
    get game_url(@game)
    assert_response :success
  end

  test "should get edit" do
    get edit_game_url(@game)
    assert_response :success
  end

  test "should update game" do
    patch game_url(@game), params: { game: { aces: @game.aces, bonuses: @game.bonuses, chance: @game.chance, final_score: @game.final_score, fives: @game.fives, four_of_a_kind: @game.four_of_a_kind, fours: @game.fours, full_house: @game.full_house, is_finished: @game.is_finished, lg_straight: @game.lg_straight, player_name: @game.player_name, sixes: @game.sixes, sm_straight: @game.sm_straight, three_of_a_kind: @game.three_of_a_kind, threes: @game.threes, twos: @game.twos, upper_total: @game.upper_total, upper_total: @game.upper_total, yahtzee: @game.yahtzee } }
    assert_redirected_to game_url(@game)
  end

  test "should destroy game" do
    assert_difference('Game.count', -1) do
      delete game_url(@game)
    end

    assert_redirected_to games_url
  end
end
