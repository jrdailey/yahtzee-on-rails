(function() {
  var Yahtzee = {
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
        return (parseInt($('#game_bonuses').val()) || 0) + 1;
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

      self.rollNumber = 0;
      self.usedPlays = [];

      $('button[name=roll-dice]').click(self.rollDice);
      $('.die').click(self.toggleHold);
      $('.cross-out').click(function() {
        var play = $(this).attr('id').replace(/game_cross_out_/, '');

        self.usedPlays.push(play);
        $(this).prop('disabled', 'disabled');
        $('input[type=hidden][name="' + $(this).attr('name') + '"]').val(1);
        $(this).siblings('button[name=play_' + play + ']').prop('disabled', 'disabled').hide();

        self.handleEndGame();
      });
      $('.play-button').click(function() {
        var play = $(this).attr('name').replace(/play_/, ''),
            score = self.doScore(play, self.getDiceMap());

        $(this).prop('disabled', 'disabled').hide();
        $(this).siblings('input.cross-out').prop('disabled', 'disabled');
        $(this).siblings('input#game_' + play).val(score).blur();

        self.handleEndGame();
      });

      self.handleUpperScoreKeeping();
      self.handleLowerScoreKeeping();
      self.handleFinalScoreKeeping();

      self.rollDice();
    },

    handleEndGame: function() {
      if (this.isEndGame()) {
        $('button[name=roll-dice]').prop('disabled', 'disabled');
        $('input[name=commit]').show();
        $('#game_is_finished').val(true);
      } else {
        this.resetRoll();
      }
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
      var $uppers = $('#game_aces, #game_twos, #game_threes, #game_fours, #game_fives, #game_sixes');

      $uppers.blur(function() {
        var upperTotal = 0;

        $uppers.each(function(i, el) {
          upperTotal += parseInt($(el).val()) || 0;
        });

        if (upperTotal >= 63) upperTotal += 35;

        $('#game_upper_total').val(upperTotal).blur();
      });
    },

    handleLowerScoreKeeping: function() {
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
    },

    handleFinalScoreKeeping: function() {
      var $totals = $('#game_upper_total, #game_lower_total');

      $totals.blur(function() {
        var finalTotal = 0;

        $totals.each(function(i, total) {
          finalTotal += parseInt($(total).val()) || 0;
        });

        $('#game_final_score').val(finalTotal);
      });
    },

    rollDice: function() {
      var heldDice = $('.yahtzee-dice .die').map(function(i, el) {
          return /held-die/.test($(el).attr('class')) ? $(el).data('die-pos') : null;
        }).get(),
        availableDice = $('.yahtzee-dice .die').map(function(i, el) {
          return $.inArray($(el).data('die-pos'), heldDice) < 0 ? $(el) : null;
        }).get(),
        defs = [];

      $.each(availableDice, function(i, $die) {
        var def = $.Deferred();

        Yahtzee.animateDie($die, i + 1 * 200, def);
        defs.push(def);
      });

      $.when.apply($, defs).done(function() {
        var availablePlays;

        if (Yahtzee.rollNumber == 2) {
          $('button[name=roll-dice]').prop('disabled', 'disabled');
        }

        availablePlays = Yahtzee.evaluateDice();

        $('.play-button').hide();
        $.each(availablePlays, function(i, play) {
          $('button[name=play_' + play + ']').show();
        });

        Yahtzee.rollNumber++;
      });
    },

    animateDie: function($die, duration, deferred) {
      var delta = 50,
          time = 0,
          self = this;

      (function animate($die, duration, deferred, time) {
        if (time < duration) {
          setTimeout(function() {
            self.doRoll($die);
            animate($die, duration, deferred, time + delta);
          }, delta);
        } else {
          deferred.resolve();
        }
      })($die, duration, deferred, time);
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

    resetRoll: function() {
      $('.die').each(function(i, die) {
        var oldClasses = $(die).attr('class');

        $(die).attr('class', oldClasses.replace(/held-/, ''));
      });

      $('button[name=roll-dice]').removeProp('disabled');
      this.rollNumber = 0;
      this.rollDice();
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
      if (this.isThreeOfAKind(diceMap) && $.inArray('three_of_a_kind', this.usedPlays) < 0) availablePlays.push('three_of_a_kind');
      if (this.isFourOfAKind(diceMap) && $.inArray('four_of_a_kind', this.usedPlays) < 0) availablePlays.push('four_of_a_kind');
      if (this.isFullHouse(diceMap) && $.inArray('full_house', this.usedPlays) < 0) availablePlays.push('full_house');
      if (this.isSmStraight(diceMap) && $.inArray('sm_straight', this.usedPlays) < 0) availablePlays.push('sm_straight');
      if (this.isLgStraight(diceMap) && $.inArray('lg_straight', this.usedPlays) < 0) availablePlays.push('lg_straight');
      if (this.isYahtzee(diceMap) && $.inArray('yahtzee', this.usedPlays) < 0) {
        availablePlays.push('yahtzee');
      } else if (this.isYahtzee(diceMap) && !$('#game_cross_out_yahtzee').is(':checked')) {
        availablePlays.push('bonuses');
      }
      if ($.inArray('chance', this.usedPlays) < 0) availablePlays.push('chance');

      return availablePlays;
    },

    isThreeOfAKind: function(diceMap) {
      var isThreeOfAKind = false,
          face;

      for (face in diceMap) {
        if (diceMap[face] >= 3) isThreeOfAKind = true;
      }

      return isThreeOfAKind;
    },

    isFourOfAKind: function(diceMap) {
      var isFourOfAKind = false,
          face;

      for (face in diceMap) {
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
      return (diceMap[1] && diceMap[2] && diceMap[3] && diceMap[4]) ||
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

  $(document).on('turbolinks:load', function() {
    Yahtzee.init();
  });
})();
