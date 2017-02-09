Rails.application.routes.draw do
  resources :games
  get '/high_scores' => 'games#index', :as => :high_scores

  root 'games#index'
end
