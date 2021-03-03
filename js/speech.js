define(["game", "jquery"],
function(game,   $) {
    "use strict";
    var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
    var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
    var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

    var numberNameMap = {
        "hace"  :   "ace",
        "two"   :   "2",
        "to"    :   "2",
        "too"   :   "2",
        "who"   :   "2",
        "three" :   "3",
        "free"  :   "3",
        "four"  :   "4",
        "for"   :   "4",
        "five"  :   "5",
        "six"   :   "6",
        "sex"   :   "6",
        "seven" :   "7",
        "eight" :   "8",
        "heat"  :   "8",
        "paint" :   "8",
        "hate"  :   "8",
        "ate"   :   "8",
        "age"   :   "8",
        "nine"  :   "9",
        "ten"   :   "10",
        "can"   :   "10",
    };
    var suiteMap = {
        "clubs"     :   "club",
        "diamonds"  :   "diamond",
        "spades"    :   "spade",
        "hearts"    :   "heart"
    }
    var numbers = [ "ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king" ];
    var numberGrammar = "#JSGF V1.0; grammar numbers; public <number> = " + numbers.join(" | ") + " ;"
    var suitesGrammar = "#JSGF V1.0; grammar suites; public <suite> = " + Object.keys(suiteMap).join(" | ") + " ;"
    var newGameCommands = [ "new game", "restart" ];
    var playCommands = [ "confirm", "continue", "play", "go", "convert", "ok", "turn" ];
    var passCommands = [ "pass", "ass", "hass" ];
    var commands = newGameCommands.concat(passCommands).concat(playCommands);
    var commandsGrammar = "#JSGF V1.0; grammar commands; public <command> = " + commands.join(" | ") + " ;"

    var recognition = new SpeechRecognition();
    var speechRecognitionList = new SpeechGrammarList();
    speechRecognitionList.addFromString(numberGrammar, 1);
    speechRecognitionList.addFromString(suitesGrammar, 1);
    speechRecognitionList.addFromString(commandsGrammar, 1);
    recognition.grammars = speechRecognitionList;
    recognition.continuous = true;
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    var pendingPlay = false;
    var processedInterim = "";
    var clickedCards = [];

    jQuery.fn.visible = function(){ return $(this).filter(function() {
        return $(this).css('opacity') > 0;
    }); };
    jQuery.fn.exists = function(){ return this.length > 0; };
    
    function processCommand(input) {
        var executed = false;
        if (newGameCommands.some(command => input.includes(command))) {
            game.newGame();
            executed = true;
        }
        if (passCommands.some(command => input.includes(command))) {
            var query = $( "#pass-arrow" ).visible();
            if (query.exists()) {
                query.click();
                executed = true;
            }
        }
        if (playCommands.some(command => input.includes(command))) {
            var query = $( "#play-button" ).visible();
            if (query.exists()) {
                query.click();
                executed = true;
            }
            else {
                pendingPlay = true;
            }
        }
        return executed;
    }

    function processCardSelection(input) {
        var words = input.split(" ");
        var playedCard = null;
        words.forEach((word, index) => {
            if (numbers.includes(word)) {
                var suite = null;
                var suites = Object.values(suiteMap);
                if (index + 1 < words.length && suites.includes(words[index + 1])) {
                    suite = words[index + 1];
                }
                else if (index + 2 < words.length && words[index + 1] === "of" && suites.includes(words[index + 2])) {
                    suite = words[index + 2];
                }
                if (suite != null) {
                    var num = isNaN(word) ? word.charAt(0).toUpperCase() : word;
                    var card = suite + num;
                    if (!(clickedCards.includes(card))) {
                        var query = $( ".card.movable." + suite );
                        if (query.exists()) {
                            query = query.filter(function() {
                                return $(this).find(".num").text() == num;
                            });
                            if (query.exists()) {
                                query.click();
                                playedCard = card;
                            }
                        }
                    }
                }
            }
        });
        return playedCard;
    }

    recognition.onresult = function(event) {
        var latestResults = event.results[event.results.length - 1]

        if (latestResults.isFinal) {
            processedInterim = "";
            pendingPlay = false;
            clickedCards = [];
        }
        else {
            var input = latestResults[0].transcript.trim().toLowerCase();
            for (const [plural, singular] of Object.entries(suiteMap)) {
                input = input.replaceAll(plural, singular);
            }
            for (const [name, number] of Object.entries(numberNameMap)) {
                input = input.replaceAll(name, number);
            }
            if (input.indexOf(processedInterim) == 0) {
                input = input.slice(processedInterim.length);
            }
            Object.keys(numberNameMap).some(number => input.includes(number))
            // console.log("Input: " + input);
            var clickedCard = false;
            if (numbers.some(number => input.includes(number)) &&
                    Object.values(suiteMap).some(suite => input.includes(suite))) {
                var clickedCard = processCardSelection(input)
                if (clickedCard != null) {
                    clickedCards.push(clickedCard);
                    if (pendingPlay) {
                        setTimeout(function() { processCommand("play"); }, 100);
                    }
                }
                if (!latestResults.isFinal) {
                    processedInterim += input;
                }
            }
            if (commands.some(command => input.includes(command))) {
                if (clickedCard) {
                    setTimeout(function() { processCommand(input); }, 100);
                }
                else {
                    processCommand(input)
                }
                if (!latestResults.isFinal) {
                    processedInterim += input;
                }
            }
        }
    }
      
    recognition.onspeechend = function() {
    }
    
    recognition.onnomatch = function(event) { }
    
    recognition.onerror = function(event) {
        console.log("Error occurred in recognition: " + event.error);
        recognition.start();
    }


    return {
        start: function(){
            console.log("Speech recognition starting");
            recognition.start();
        }
    }
});
