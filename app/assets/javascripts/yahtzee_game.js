var Yahtzee = {
  rollNumber: 0,

  usedPlays: [],

  scores: {
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
      return 100;
    },
    'chance': function(diceMap) {
      return Yahtzee.sumAllDice(diceMap);
    }
  },

  sumAllDice: function(diceMap) {
    var score = 0;

    if (diceMap[1]) score += diceMap[1];
    if (diceMap[2]) score += diceMap[2] * 2;
    if (diceMap[3]) score += diceMap[3] * 3;
    if (diceMap[4]) score += diceMap[4] * 4;
    if (diceMap[5]) score += diceMap[5] * 5;
    if (diceMap[6]) score += diceMap[6] * 6;

    return score;
  },

  init: function() {
    var self = this;

    $('button[name=roll-dice]').click(self.rollDice);
    $('.die').click(self.toggleHold);
    $('.cross-out').click(function() {
      var play = $(this).attr('id').replace(/game_/, '');

      Yahtzee.usedPlays.push(play);
      $(this).prop('disabled', 'disabled');
    });
    $('.play-button').click(function() {
      var play = $(this).attr('name').replace(/play_/, ''),
          score = Yahtzee.doScore(play, Yahtzee.getDiceMap());

      $(this).prop('disabled', 'disabled').hide();
      $(this).parents('td').first().find('input.cross-out').prop('disabled', 'disabled');
      $(this).parents('td').first().find('input#game_' + play).val(score);

      if (Yahtzee.isEndGame()) {
        $('button[name=roll-dice]').prop('disabled', 'disabled');
        $('input[name=commit]').show();
      }
    });

    self.handleUpperScoreKeeping();
    self.handleLowerScoreKeeping();
    self.handleFinalScoreKeeping();

    self.rollDice();
  },

  isEndGame: function() {
    var isEndGame = true,
        allPlays = $.map(this.scores, function(i, score) {
          return score === 'bonuses' ? null : score;
        }),
        i;

    for(i = 0; i < allPlays.length && isEndGame; i++) {
      isEndGame = $.inArray(allPlays[i], this.usedPlays) >= 0;
    }

    return isEndGame;
  },

  handleUpperScoreKeeping: function() {

  },

  handleLowerScoreKeeping: function() {

  },

  handleFinalScoreKeeping: function() {

  },

  rollDice: function() {
    var heldDice = $('.yahtzee-dice .die').map(function(i, el) {
        return /held-die/.test($(el).attr('class')) ? $(el).data('die-pos') : null;
      }).get(),
      availableDice = $('.yahtzee-dice .die').map(function(i, el) {
        return $.inArray($(el).data('die-pos'), heldDice) < 0 ? $(el) : null;
      }).get(),
      availablePlays;


    $.each(availableDice, function(i, $die) {
      Yahtzee.doRoll($die);
    });

    Yahtzee.rollNumber++;

    if (Yahtzee.rollNumber == 3) {
      $('button[name=roll-dice]').prop('disabled', 'disabled');
    }

    availablePlays = Yahtzee.evaluateDice();

    $('.play-button').hide();
    $.each(availablePlays, function(i, play) {
      $('button[name=play_' + play + ']').show();
    });
  },

  doRoll: function($die) {
    var newDie = Math.floor(Math.random() * 6 + 1),
        classString = $die.attr('class'),
        classRegex = /die-[^\s]+/;

    switch(newDie) {
      case 1:
        $die.attr('class', classString.replace(classRegex, 'die-one'));
        break;
      case 2:
        $die.attr('class', classString.replace(classRegex, 'die-two'));
        break;
      case 3:
        $die.attr('class', classString.replace(classRegex, 'die-three'));
        break;
      case 4:
        $die.attr('class', classString.replace(classRegex, 'die-four'));
        break;
      case 5:
        $die.attr('class', classString.replace(classRegex, 'die-five'));
        break;
      case 6:
        $die.attr('class', classString.replace(classRegex, 'die-six'));
        break;
    }
  },

  dieIsHeld: function($die) {
    return /held-die/.test($die.attr('class'));
  },

  toggleHold: function() {
    var classString = $(this).attr('class');

    if (Yahtzee.dieIsHeld($(this))) {
      $(this).attr('class', classString.replace(/held-(die-[^\s]+)/, '$1'));
    } else {
      $(this).attr('class', classString.replace(/(die-[^\s]+)/, 'held-$1'));
    }
  },

  doScore: function(play, diceMap) {
    this.usedPlays.push(play);
    return this.scores[play](diceMap);
  },

  getDiceMap: function() {
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
  },

  evaluateDice: function() {
    var availablePlays = [],
        diceMap = this.getDiceMap();

    if (diceMap[1] && $.inArray('aces', this.usedPlays) < 0) availablePlays.push('aces');
    if (diceMap[2] && $.inArray('twos', this.usedPlays) < 0) availablePlays.push('twos');
    if (diceMap[3] && $.inArray('threes', this.usedPlays) < 0) availablePlays.push('threes');
    if (diceMap[4] && $.inArray('fours', this.usedPlays) < 0) availablePlays.push('fours');
    if (diceMap[5] && $.inArray('fives', this.usedPlays) < 0) availablePlays.push('fives');
    if (diceMap[6] && $.inArray('sixes', this.usedPlays) < 0) availablePlays.push('sixes');
    if (this.hasThreeOfAKind(diceMap) && $.inArray('three_of_a_kind', this.usedPlays) < 0) availablePlays.push('three_of_a_kind');
    if (this.hasFourOfAKind(diceMap) && $.inArray('four_of_a_kind', this.usedPlays) < 0) availablePlays.push('four_of_a_kind');
    if (this.isFullHouse(diceMap) && $.inArray('full_house', this.usedPlays) < 0) availablePlays.push('full_house');
    if (this.isSmStraight(diceMap) && $.inArray('sm_straight', this.usedPlays) < 0) availablePlays.push('sm_straight');
    if (this.isLgStraight(diceMap) && $.inArray('lg_straight', this.usedPlays) < 0) availablePlays.push('lg_straight');
    if (this.isYahtzee(diceMap) && $.inArray('yahtzee', this.usedPlays) < 0) {
      availablePlays.push('yahtzee');
    } else if (this.isYahtzee(diceMap)) {
      availablePlays.push('bonuses');
    }
    if ($.inArray('chance', this.usedPlays) < 0) availablePlays.push('chance');

    return availablePlays;
  },

  hasThreeOfAKind: function(diceMap) {
    var isThreeOfAKind = false;

    for (var face in diceMap) {
      if (diceMap[face] >= 3) isThreeOfAKind = true;
    }

    return isThreeOfAKind;
  },

  hasFourOfAKind: function(diceMap) {
    var isFourOfAKind = false;

    for (var face in diceMap) {
      if (diceMap[face] >= 4) isFourOfAKind = true;
    }

    return isFourOfAKind;
  },

  isFullHouse: function(diceMap) {
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
  },

  isSmStraight: function(diceMap) {
    return (diceMap[1] && diceMap[2] && diceMap[3] & diceMap[4]) ||
          (diceMap[2] && diceMap[3] && diceMap[4] && diceMap[5]) ||
          (diceMap[3] && diceMap[4] && diceMap[5] && diceMap[6]);
  },

  isLgStraight: function(diceMap) {
    return (diceMap[1] && diceMap[2] && diceMap[3] && diceMap[4] && diceMap[5]) ||
          (diceMap[2] && diceMap[3] && diceMap[4] && diceMap[5] && diceMap[6]);
  },

  isYahtzee: function(diceMap) {
    var isYahtzee = false;

    for (var face in diceMap) {
      if (diceMap[face] === 5) isYahtzee = true;
    }

    return isYahtzee;
  }
};

$(function() {
  Yahtzee.init();
});
