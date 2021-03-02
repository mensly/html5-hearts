# Hearts with HTML5

You can try the game at http://mens.ly/hearts/

# AI

The `Ai.js` class can use various `Brains` to make decision.

* `Brain.js`: Base class for all brains
* `AsyncBrain.js`: A wrapper to call the more time-consuming brains via web-worker
* `SimpleBrain.js`: Simple greedy heuristics
* `McBrain.js`: One-step look-ahead with sample generation and deterministic rollouts based on the assumption that all players use the simple greedy strategy
* `PomDPBrain.js`: assuming all other players to be playing using the greedy strategy, the game can then be formulated as a [POMDP](http://en.wikipedia.org/wiki/Partially_observable_Markov_decision_process) and can thus be solved with the [POMCP Algorithm](http://machinelearning.wustl.edu/mlpapers/paper_files/NIPS2010_0740.pdf). This `brain` implements the POMCP algorithm.

# TODO

1. Port `McBrain` and `PomDPBrain` to `C++`, which can be compiled to `asm.js` for better performance
1. Multi-player support

# Voice Recognition
Voice Recognition Modification by Michael Ensly (@mensly)

## Commands
* Name a card to select it, eg "two of clubs" or "queen of spades"
* Say "pass" to confirm your selection of cards to pass
* Read the name of the button to click it, eg "go"
* Say "play" then a name of a card to complete your turn in one command, eg "play ace of clubs"
* Say "new game" to start a new game
