define(["jquery"],
function($) {
    "use strict";
    var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
    var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
    var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

    var numbers = [ 'ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king' ];
    var numberGrammar = '#JSGF V1.0; grammar numbers; public <number> = ' + numbers.join(' | ') + ' ;'
    var suites = [ 'clubs', 'diamonds', 'spades', 'hearts' ];
    var suitesGrammar = '#JSGF V1.0; grammar suites; public <suite> = ' + suites.join(' | ') + ' ;'
    var commands = [ 'new game', 'continue', 'pass', 'play' ];
    var commandsGrammar = '#JSGF V1.0; grammar commands; public <command> = ' + commands.join(' | ') + ' ;'

    var recognition = new SpeechRecognition();
    var speechRecognitionList = new SpeechGrammarList();
    speechRecognitionList.addFromString(numberGrammar, 1);
    speechRecognitionList.addFromString(suitesGrammar, 1);
    speechRecognitionList.addFromString(commandsGrammar, 1);
    recognition.grammars = speechRecognitionList;
    recognition.continuous = true;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    function processCommand(input) {

    }

    function processCardSelection(input) {
        var words = input.split(" ");
        words.forEach((word, index) => {
            if (numbers.includes(word)) {
                var suite = null;
                if (index + 1 < words.length && suites.includes(words[index + 1])) {
                    suite = words[index + 1];
                }
                else if (index + 2 < words.length && words[index + 1] === "of" && suites.includes(words[index + 2])) {
                    suite = words[index + 2];
                }
                if (suite != null) {
                    var num = word.charAt(0).toUpperCase();
                    var query = $( ".card.movable." + suite.substring(0, suite.length - 1) );
                    query = query.filter(function() {
                        return $(this).find(".num").text() == num;
                    });
                    query.click();
                }
            }
        });
    }

    recognition.onresult = function(event) {
        var input = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
        console.log('Input: ' + input);
        if (numbers.some(number => input.includes(number)) &&
                 suites.some(suite => input.includes(suite))) {
            processCardSelection(input)
        }
        if (commands.some(command => input.includes(command))) {
            processCommand(input)
        }
    }
      
    recognition.onspeechend = function() {
    }
    
    recognition.onnomatch = function(event) { }
    
    recognition.onerror = function(event) {
        console.log('Error occurred in recognition: ' + event.error);
    }


    return {
        start: function(){
            console.log("Speech recognition starting");
            recognition.start();
        }
    }
});