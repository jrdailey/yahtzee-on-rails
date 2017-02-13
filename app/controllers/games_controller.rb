class GamesController < ApplicationController
  before_action :set_game, only: [:edit, :update, :destroy]

  def index
    @finished_games = Game.where(is_finished: true).order(:final_score).reverse
    @unfinished_games = Game.where(:is_finished => [false, nil]).order(:id);
  end

  def new
    @game = Game.new
  end

  def edit
    @game = Game.find(params[:id]);
  end

  def create
    @game = Game.new(game_params)

    respond_to do |format|
      if @game.save
        format.html { redirect_to high_scores_path, notice: 'Game was successfully created.' }
      else
        format.html { render :new }
      end
    end
  end

  def update
    respond_to do |format|
      if @game.update(game_params)
        format.html { redirect_to @game, notice: 'Game was successfully updated.' }
      else
        format.html { render :edit }
      end
    end
  end

  def destroy
    @game.destroy
    respond_to do |format|
      format.html { redirect_to high_scores_path, notice: 'Game was successfully destroyed.' }
    end
  end

  private
    def set_game
      @game = Game.find(params[:id])
    end

    def game_params
      params.require(:game).permit(:aces, :twos, :threes, :fours, :fives, :sixes, :upper_total, :three_of_a_kind,
        :four_of_a_kind, :full_house, :sm_straight, :lg_straight, :yahtzee, :chance, :bonuses, :upper_total, :lower_total,
        :final_score, :is_finished, :player_name, :cross_out_aces, :cross_out_twos, :cross_out_threes, :cross_out_fours,
        :cross_out_fives, :cross_out_sixes, :cross_out_three_of_a_kind, :cross_out_four_of_a_kind, :cross_out_full_house,
        :cross_out_sm_straight, :cross_out_lg_straight, :cross_out_yahtzee, :cross_out_chance)
    end
end
