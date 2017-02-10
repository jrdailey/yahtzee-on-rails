(function() {
  var Scorer = {};

  Scorer.scores = {
    'aces': function(diceMap) {
      return diceMap[1];
    },
    'twos': function(diceMap) {
      return diceMap[2] * 2;
    },
    'threes': function(diceMap) {
      return diceMap[3] * 3;
    },
    'fours': function(diceMap) {
      return diceMap[4] * 4;
    },
    'fives': function(diceMap) {
      return diceMap[5] * 5;
    },
    'sixes': function(diceMap) {
      return diceMap[6] * 6;
    },
    'three_of_a_kind': function(diceMap) {
      return Yahtzee.sumAllDice(diceMap);
    },
    'four_of_a_kind': function(diceMap) {
      return Yahtzee.sumAllDice(diceMap);
    },
    'full_house': function(diceMap) {
      return 25;
    },
    'sm_straight': function(diceMap) {
      return 30;
    },
    'lg_straight': function(diceMap) {
      return 40;
    },
    'yahtzee': function(diceMap) {
      return 50;
    },
    'bonuses': function(diceMap) {
      return (parseInt($('#game_bonuses').val()) || 0) + 1;
    },
    'chance': function(diceMap) {
      return Yahtzee.sumAllDice(diceMap);
    }
  };

  Scorer.init = function() {
    this.handleUpperScoreKeeping();
    this.handleLowerScoreKeeping();
    this.handleFinalScoreKeeping();
  };

  Scorer.handleUpperScoreKeeping = function() {
    var $uppers = $('#game_aces, #game_twos, #game_threes, #game_fours, #game_fives, #game_sixes');

    $uppers.blur(function() {
      var upperTotal = 0;

      $uppers.each(function(i, el) {
        upperTotal += parseInt($(el).val()) || 0;
      });

      if (upperTotal >= 63) upperTotal += 35;

      $('#game_upper_total').val(upperTotal).blur();
    });
  };

  Scorer.handleLowerScoreKeeping = function() {
    var $lowers = $('#game_three_of_a_kind, #game_four_of_a_kind, #game_full_house, #game_sm_straight, #game_lg_straight,' +
            '#game_yahtzee, #game_chance, #game_bonuses');

    $lowers.blur(function() {
      var lowerTotal = 0;

      $lowers.each(function(i, el) {
        var val = parseInt($(el).val()) || 0;

        if ($(el).attr('id') === 'game_bonuses') {
          lowerTotal += val * 100;
        } else {
          lowerTotal += val;
        }
      });

      $('#game_lower_total').val(lowerTotal).blur();
    });
  };

  Scorer.handleFinalScoreKeeping = function() {
    var $totals = $('#game_upper_total, #game_lower_total');

    $totals.blur(function() {
      var finalTotal = 0;

      $totals.each(function(i, total) {
        finalTotal += parseInt($(total).val()) || 0;
      });

      $('#game_final_score').val(finalTotal);
    });
  };

  Scorer.sumAllDice = function(diceMap) {
    var score = 0;

    if (diceMap[1]) score += diceMap[1];
    if (diceMap[2]) score += diceMap[2] * 2;
    if (diceMap[3]) score += diceMap[3] * 3;
    if (diceMap[4]) score += diceMap[4] * 4;
    if (diceMap[5]) score += diceMap[5] * 5;
    if (diceMap[6]) score += diceMap[6] * 6;

    return score;
  };

  Scorer.getScore = function(play) {
    var diceMap = this.getDiceMap();

    Yahtzee.Game.usedPlays.push(play);
    return this.scores[play](diceMap);
  };

  Scorer.getDiceMap = function() {
    var $dice = $('.yahtzee-dice .die'),
        diceMap = {};

    $dice.each(function(i, die) {
      var face = $(die).attr('class').replace(/\s*held-die-/, '').replace(/\s*die-/, '').replace(/\s*die\s*/, '').trim();

      switch(face) {
        case 'one':
          diceMap[1] ? diceMap[1]++ : diceMap[1] = 1;
          break;
        case 'two':
          diceMap[2] ? diceMap[2]++ : diceMap[2] = 1;
          break;
        case 'three':
          diceMap[3] ? diceMap[3]++ : diceMap[3] = 1;
          break;
        case 'four':
          diceMap[4] ? diceMap[4]++ : diceMap[4] = 1;
          break;
        case 'five':
          diceMap[5] ? diceMap[5]++ : diceMap[5] = 1;
          break;
        case 'six':
          diceMap[6] ? diceMap[6]++ : diceMap[6] = 1;
          break;
      }
    });

    return diceMap;
  };

  Scorer.evaluateDice = function() {
    var availablePlays = [],
        diceMap = this.getDiceMap(),
        game = Yahtzee.Game;

    if (diceMap[1] && $.inArray('aces', game.usedPlays) < 0) availablePlays.push('aces');
    if (diceMap[2] && $.inArray('twos', game.usedPlays) < 0) availablePlays.push('twos');
    if (diceMap[3] && $.inArray('threes', game.usedPlays) < 0) availablePlays.push('threes');
    if (diceMap[4] && $.inArray('fours', game.usedPlays) < 0) availablePlays.push('fours');
    if (diceMap[5] && $.inArray('fives', game.usedPlays) < 0) availablePlays.push('fives');
    if (diceMap[6] && $.inArray('sixes', game.usedPlays) < 0) availablePlays.push('sixes');
    if (this.isThreeOfAKind(diceMap) && $.inArray('three_of_a_kind', game.usedPlays) < 0) availablePlays.push('three_of_a_kind');
    if (this.isFourOfAKind(diceMap) && $.inArray('four_of_a_kind', game.usedPlays) < 0) availablePlays.push('four_of_a_kind');
    if (this.isFullHouse(diceMap) && $.inArray('full_house', game.usedPlays) < 0) availablePlays.push('full_house');
    if (this.isSmStraight(diceMap) && $.inArray('sm_straight', game.usedPlays) < 0) availablePlays.push('sm_straight');
    if (this.isLgStraight(diceMap) && $.inArray('lg_straight', game.usedPlays) < 0) availablePlays.push('lg_straight');
    if (this.isYahtzee(diceMap) && $.inArray('yahtzee', game.usedPlays) < 0) {
      availablePlays.push('yahtzee');
    } else if (this.isYahtzee(diceMap) && !$('#game_cross_out_yahtzee').is(':checked')) {
      availablePlays.push('bonuses');
    }
    if ($.inArray('chance', game.usedPlays) < 0) availablePlays.push('chance');

    return availablePlays;
  };

  Scorer.isThreeOfAKind = function(diceMap) {
    var isThreeOfAKind = false,
        face;

    for (face in diceMap) {
      if (diceMap[face] >= 3) isThreeOfAKind = true;
    }

    return isThreeOfAKind;
  };

  Scorer.isFourOfAKind = function(diceMap) {
    var isFourOfAKind = false,
        face;

    for (face in diceMap) {
      if (diceMap[face] >= 4) isFourOfAKind = true;
    }

    return isFourOfAKind;
  };

  Scorer.isFullHouse = function(diceMap) {
    var isTwoOfAKind = false,
        isThreeOfAKind = false;

    for (var face in diceMap) {
      if (diceMap[face] === 3) {
        isThreeOfAKind = true;
        diceMap[face] = 0;
      }
    }

    if (isThreeOfAKind) {
      for (var face in diceMap) {
        if (diceMap[face] === 2) isTwoOfAKind = true;
      }
    }

    return isTwoOfAKind && isThreeOfAKind;
  };

  Scorer.isSmStraight = function(diceMap) {
    return (diceMap[1] && diceMap[2] && diceMap[3] && diceMap[4]) ||
          (diceMap[2] && diceMap[3] && diceMap[4] && diceMap[5]) ||
          (diceMap[3] && diceMap[4] && diceMap[5] && diceMap[6]);
  };

  Scorer.isLgStraight = function(diceMap) {
    return (diceMap[1] && diceMap[2] && diceMap[3] && diceMap[4] && diceMap[5]) ||
          (diceMap[2] && diceMap[3] && diceMap[4] && diceMap[5] && diceMap[6]);
  };

  Scorer.isYahtzee = function(diceMap) {
    var isYahtzee = false;

    for (var face in diceMap) {
      if (diceMap[face] === 5) isYahtzee = true;
    }

    return isYahtzee;
  };

  Yahtzee = window.Yahtzee || {};
  Yahtzee.Scorer = Scorer;

  $(document).on('turbolinks:load', function() {
    Yahtzee.Scorer.init();
  });
})();
