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

    recognition.onresult = function(event) {
        var command = event.results[event.results.length - 1][0].transcript.trim();
        console.log('Command: ' + command);
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