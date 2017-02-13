Rails.application.routes.draw do
  resources :games, only: [:create, :new, :update, :destroy]
  get '/high_scores' => 'games#index', :as => :high_scores
  get '/games/:id/continue' => 'games#edit', :as => :continue_game

  root 'games#index'
end
