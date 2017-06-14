(function() {
  var Game = {};

  Game.init = function() {
    var self = this;

    self.positionDice().always(function() {
      $('.yahtzee-dice').show();
    });
    $(window).scroll(self.positionDice);

    self.rollNumber = 0;
    self.initUsedPlays();

    $('button[name=roll-dice]').click(function() {
      self.rollDice();
    });

    $('.die').click(function() {
      self.toggleHold($(this));
    });

    $('.cross-out').click(function() {
      var play = $(this).attr('id').replace(/game_cross_out_/, '');

      self.usedPlays.push(play);
      $(this).prop('disabled', 'disabled');
      // copy cross-out checkbox value to hidden field for form submission
      $('input[type=hidden][name="' + $(this).attr('name') + '"]').val(true);
      $(this).siblings('button[name=play_' + play + ']').prop('disabled', 'disabled').hide();

      self.handleEndGame();
    });

    $('.play-button').click(function() {
      var play = $(this).attr('name').replace(/play_/, ''),
          score = Yahtzee.Scorer.getScore(play);

      $(this).prop('disabled', 'disabled').hide();
      $(this).parents('td').find('input.cross-out').prop('disabled', 'disabled');
      $(this).parents('td').find('input#game_' + play).val(score).blur();

      self.handleEndGame();
    });

    self.rollDice();
    self.handleEndGame();
  };

  Game.initUsedPlays = function() {
    var self = this;

    self.usedPlays = [];

    $('.play-input').each(function() {
      if ($(this).val() || $(this).parents('td').find('input.cross-out').is(':checked')) {
        self.usedPlays.push($(this).attr('id').replace(/game_/, ''));
        $(this).parents('td').find('input.cross-out').prop('disabled', 'disabled');
      }
    });
  };

  Game.positionDice = function() {
    var diceDef = $.Deferred();

    clearTimeout(this.scrollTimeout);
    this.scrollTimeout = setTimeout(function() {
      $('.yahtzee-dice').css('top', (window.pageYOffset + window.innerHeight / 2) - $('.yahtzee-dice').height() / 2);
      diceDef.resolve();
    }, 100);

    return diceDef.promise();
  }

  Game.handleEndGame = function() {
    if (this.isEndGame()) {
      $('button[name=roll-dice]').prop('disabled', 'disabled');
      $('input[name=commit]').val('Finish');
      $('#game_is_finished').val(true);
    } else {
      this.resetRoll();
    }
  };

  Game.isEndGame = function() {
    var isEndGame = true,
        allPlays = $.map(Yahtzee.Scorer.scores, function(i, score) {
          return score === 'bonuses' ? null : score;
        }),
        i;

    for(i = 0; i < allPlays.length && isEndGame; i++) {
      isEndGame = $.inArray(allPlays[i], this.usedPlays) >= 0;
    }

    return isEndGame;
  };

  Game.rollDice = function() {
    var heldDice = $('.yahtzee-dice .die').map(function(i, el) {
        return /held-die/.test($(el).attr('class')) ? $(el).data('die-pos') : null;
      }).get(),
      availableDice = $('.yahtzee-dice .die').map(function(i, el) {
        return $.inArray($(el).data('die-pos'), heldDice) < 0 ? $(el) : null;
      }).get(),
      defs = [],
      self = this;

    $.each(availableDice, function(i, $die) {
      var def = $.Deferred();

      self.animateDie($die, i + 1 * 200, def);
      defs.push(def);
    });

    $.when.apply($, defs).done(function() {
      var availablePlays;

      if (self.rollNumber == 2) {
        $('button[name=roll-dice]').prop('disabled', 'disabled');
      }

      availablePlays = Yahtzee.Scorer.evaluateDice();

      $('.play-button').hide();
      $.each(availablePlays, function(i, play) {
        $('button[name=play_' + play + ']').show();
      });

      self.rollNumber++;
    });
  };

  Game.animateDie = function($die, duration, deferred) {
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
  };

  Game.doRoll = function($die) {
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
  };

  Game.resetRoll = function() {
    $('.die').each(function(i, die) {
      var oldClasses = $(die).attr('class');

      $(die).attr('class', oldClasses.replace(/held-/, ''));
    });

    $('button[name=roll-dice]').removeProp('disabled');
    this.rollNumber = 0;
    this.rollDice();
  };

  Game.dieIsHeld = function($die) {
    return /held-die/.test($die.attr('class'));
  };

  Game.toggleHold = function($die) {
    var classString = $die.attr('class');

    if (this.dieIsHeld($die)) {
      $die.attr('class', classString.replace(/held-(die-[^\s]+)/, '$1'));
    } else {
      $die.attr('class', classString.replace(/(die-[^\s]+)/, 'held-$1'));
    }
  };

  Yahtzee = window.Yahtzee || {};
  Yahtzee.Game = Game;

  $(document).on('turbolinks:load', function() {
    Yahtzee.Game.init();
  });
})();
