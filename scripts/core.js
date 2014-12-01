var __pickr = (function(){
	
	'use strict';

	var startScreen = undefined,
		gameHolder = undefined,
		gameOverView = undefined,
		grid = undefined,
		cells = undefined,
		mutant = undefined,
		increment = undefined,
		colorHistory = undefined,
		difficulty = 0,
		score = 0,
		highScore = 0,
		lives = 5,
		counters = undefined,
		scoreDisplay = undefined,
		highScoreDisplay = undefined,
		difficultyDisplay = undefined,
		livesDisplay = undefined,
		colorDisplay = undefined,
		boop = undefined,
		canInteract = true;

	var animationTimes = {
		quick : 300,
		medium : 600,
		longish : 100
	}

	var sounds = {
		nope : document.getElementById('nope'),
		pop : document.getElementById('pop')
	}

	var thisRGB = {
		r : 0,
		g : 0,
		b : 0
	},
	mutantRGB = {
		r : 0,
		g : 0,
		b : 0
	}

	var correctSelections = [];

	function continueGame(game){
		console.log(game);

		resetGame();
		resetValues();

		thisRGB = game.thisRGB;
		mutantRGB = game.mutantRGB;
		mutant = game.mutant;
		score = game.score;
		correctSelections = game.correctSelections;
		scoreDisplay.innerHTML = "Score " + score;
		lives = game.lives;
		highScoreDisplay.innerHTML = "High score " + localStorage.getItem('highScore');

		var e = 0,
			f = 5;

		if(correctSelections.length <= 10){	
			difficulty = 1;
		} else if(correctSelections.length > 10 && correctSelections.length <= 20){
			difficulty = 1.5;
		} else if(correctSelections.length > 20 && correctSelections.length <= 30){
			difficulty = 2;
		} else if(correctSelections.length > 30 && correctSelections.length <= 40){
			difficulty = 4;
		} else if(correctSelections.length > 40 && correctSelections.length <= 50){
			difficulty = 5;
		} else {
			difficulty = 8;
		}

		while(e < cells.length){

			cells[e].style.backgroundColor = "rgb(" + thisRGB.r + "," + thisRGB.g + "," + thisRGB.b + ")";

			if(e !== mutant){
				cells[e].addEventListener(boop, incorrect, false);	
			}

			e += 1;
		}


		cells[mutant].style.backgroundColor = "rgb(" + mutantRGB.r + "," + mutantRGB.g + "," + mutantRGB.b + ")";
		cells[mutant].addEventListener(boop, correct, false);

		while(f > lives){

			if(f > lives){
				livesDisplay[5 - (f)].setAttribute('data-lost', 'true');	
			} else {
				livesDisplay[f - 1].setAttribute('data-lost', 'false');
			}

			f -= 1;

		}

		var h = 0;

		while(h < correctSelections.length){

			var oldSwatch = document.createElement('span');
			oldSwatch.style.backgroundColor = "rgb(" + correctSelections[h].r + "," + correctSelections[h].g + "," + correctSelections[h].b + ")"
			colorHistory.appendChild(oldSwatch);

			h += 1;

		}

		startScreen.setAttribute('data-is-active-view', 'false');
		gameHolder.setAttribute('data-is-active-view', 'true');

	}

	function preloadImages(){

		var images = ["./assets/images/lives_lost.png"];

		for(var d = 0; d < images.length; d += 1){

			var img = new Image();
			img.src = images[d].src;

		}


	}

	function resetValues(){
		lives = 5;
		score = 0;
		difficulty = 1;
		correctSelections = [];
		colorHistory.innerHTML = "";
		difficultyDisplay.innerHTML = "Difficulty x" + difficulty;
		scoreDisplay.innerHTML = "Score 0";

		var g = 0;

		while(g < livesDisplay.length){

			livesDisplay[g].setAttribute('data-lost', 'false');

			g += 1;
		}

		colorDisplay.innerHTML = "";

	}

	function gameOver(){

		var c = 0,
			ca = 0;

		while(c < livesDisplay.length){

			livesDisplay[c].setAttribute('data-lost', 'false');

			c += 1;
		}

		while(ca < correctSelections.length){

			var swatch = document.createElement('li');

			swatch.style.backgroundColor = "rgb(" + correctSelections[ca].r + "," + correctSelections[ca].g + "," + correctSelections[ca].b + ")";

			colorDisplay.appendChild(swatch);

			ca += 1;

		}

		gameHolder.setAttribute('data-is-active-view', 'false');
		gameOverView.setAttribute('data-is-active-view', 'true');

		document.getElementById('finalScore').innerHTML = "You scored " + score + "!";

		if(score > highScore){
			highScore = score;
		}

		localStorage.removeItem('storedGame');
		canInteract = true;

	}

	function resetGame(){
		var b = 0;

		while(b < cells.length){

			if(b !== mutant){
				cells[b].removeEventListener(boop, incorrect, false);
			} else {
				cells[b].removeEventListener(boop, correct, false);
				cells[b].setAttribute('data-reveal', 'false');
			}

			b += 1;

		}

	}

	function updateGameState(){

		var gameState = {
			correctSelections : correctSelections,
			thisRGB : thisRGB,
			mutantRGB : mutantRGB,
			mutant : mutant,
			score : score,
			highScore : highScore,
			lives :lives
		};

		console.log("Current State:");
		console.log(gameState);

		localStorage.setItem('storedGame', JSON.stringify(gameState));

	}

	function incorrect(evt){
		console.log("incorrect");

		if(canInteract){
			var element = this;

			element.setAttribute('class', 'wobble');

			(function(el){

				setTimeout(function(){
					el.setAttribute('class', '');
				}, animationTimes.quick);

			})(element);

			livesDisplay[5 - lives].setAttribute('data-lost', 'true');

			// sounds.nope.currentTime = 0;
			// sounds.nope.play();

			if(lives - 1 > 0){
				lives -= 1;
			} else {

				cells[mutant].setAttribute('data-reveal', 'true');

				canInteract = false;

				setTimeout(function(){
					gameOver();
				}, 2000);
				
			}

			updateGameState();
		}

	}

	function correct(){
		// console.log("correct");

		if(canInteract){

			// sounds.pop.currentTime = 0;
			// sounds.pop.play();

			var newSwatch = document.createElement('span');
			newSwatch.style.backgroundColor = "rgb(" + mutantRGB.r + "," + mutantRGB.g + "," + mutantRGB.b + ")"
			colorHistory.appendChild(newSwatch);

			correctSelections.push(mutantRGB);
			score += Math.ceil(1 * difficulty);

			if(score > highScore){
				highScore = score;
				highScoreDisplay.innerHTML = "High score " + highScore;
				localStorage.setItem('highScore', highScore);
			}

			resetGame();
			newSet();

			updateGameState();

		}

	}

	function newColor(color){

		if(color === undefined){
			thisRGB.r = Math.random() * 255 | 0;
			thisRGB.g = Math.random() * 255 | 0;
			thisRGB.b = Math.random() * 255 | 0;
		} else {
			thisRGB.r = color.r;
			thisRGB.g = color.g;
			thisRGB.b = color.b;
		}

	}

	function newMutant(){
		mutant = Math.random() * cells.length | 0;
	}

	function drawGrid(mutant){

		var a = 0,
			rc = {
				r : thisRGB.r,
				g : thisRGB.g,
				b : thisRGB.b
			},
			shouldInvert = Math.round(Math.random());

		if(shouldInvert === 0){
			shouldInvert = -1;
		}

		while(a < cells.length){

			cells[a].style.backgroundColor = "rgb(" + rc.r + "," + rc.g + "," + rc.b + ")";

			if(a !== mutant){
				cells[a].addEventListener(boop, incorrect, false);	
			}

			a += 1;
		}

		var cV = [rc.r, rc.g, rc.b].sort(function(a, b){
			 return (b-a);
		});

		if(cV[0] === rc.r){
			rc.r += (increment * shouldInvert) / difficulty | 0; // / 0.2126;
		} else if(cV[0] === rc.g){
			rc.g += (increment * shouldInvert) / difficulty | 0; // * 0.7152;
		} else if(cV[0] === rc.b){
			rc.b += (increment * shouldInvert) / difficulty | 0; // / 0.0722;
		} else {
			console.log("It went wrong");
		}

		cells[mutant].style.backgroundColor = "rgb(" + rc.r + "," + rc.g + "," + rc.b + ")";
		cells[mutant].addEventListener(boop, correct, false);

		mutantRGB = rc;

	}

	function newSet(){

		if(correctSelections.length <= 10){
			difficulty = 1;
		} else if(correctSelections.length > 10 && correctSelections.length <= 20){
			difficulty = 1.5;
		} else if(correctSelections.length > 20 && correctSelections.length <= 30){
			difficulty = 2;
		} else if(correctSelections.length > 30 && correctSelections.length <= 40){
			difficulty = 4;
		} else if(correctSelections.length > 40 && correctSelections.length <= 50){
			difficulty = 5;
		} else {
			difficulty = 8;
		}

		difficultyDisplay.innerHTML = "Difficulty x" + difficulty;
		scoreDisplay.innerHTML = "Score " + score;
		highScoreDisplay.innerHTML = "High score " + highScore;

		newColor();
		newMutant();
		drawGrid(mutant);

		updateGameState();

	}

	function checkSavedGame(){
		return localStorage.getItem('storedGame');
	}

	function addEvents(){
		
		document.getElementById('begin').addEventListener(boop, function(){

			resetGame();
			resetValues();
			newSet();

			startScreen.setAttribute('data-is-active-view', 'false');
			gameHolder.setAttribute('data-is-active-view', 'true');

		}, false);

		document.getElementById('tryAgainBtn').addEventListener(boop, function(){

			resetGame();
			newSet();
			resetValues();

			gameOverView.setAttribute('data-is-active-view', 'false');
			gameHolder.setAttribute('data-is-active-view', 'true');

		}, false);

		document.getElementById('menuBtn').addEventListener(boop, function(){
			updateGameState();

			document.getElementById('continueBtn').setAttribute('data-visible', 'true');

			gameHolder.setAttribute('data-is-active-view', 'false');
			gameOverView.setAttribute('data-is-active-view', 'false');
			startScreen.setAttribute('data-is-active-view', 'true');
		});
			
		var continueBtn = document.getElementById('continueBtn');

		continueBtn.addEventListener(boop, function(){
		
			if(checkSavedGame() !== null){
				var storedGame = JSON.parse(localStorage.getItem('storedGame'));

				continueGame(storedGame);

			}

		}, false);

	}

	//Source from http://ctrlq.org/code/19616-detect-touch-screen-javascript
	function is_touch_device() {
		return (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
	}

	function init(){

		// console.log("Initialised");
		
		startScreen = document.getElementById('startScreen');
		gameHolder = document.getElementById('gameHolder');
		gameOverView = document.getElementById('gameOver');
		grid = document.getElementById('gameGrid');
		cells = grid.getElementsByTagName('span');
		increment = 20,
		colorHistory = document.getElementById('colorHistory');
		counters = document.getElementById('counters');
		scoreDisplay = document.getElementById('score');
		highScoreDisplay = document.getElementById('highScore');
		difficultyDisplay = document.getElementById('difficultyFactor');
		colorDisplay = document.getElementById('youPicked');
		livesDisplay = document.getElementById('lives').getElementsByClassName('life');

		var storedHighScore = localStorage.getItem('highScore');

		if(storedHighScore !== null){
			highScore = parseInt(storedHighScore);
			highScoreDisplay.innerHTML = "High score" + highScore;
		}

		if(checkSavedGame() !== null){
			continueBtn.setAttribute('data-visible', 'true');
		}
		
		if(!is_touch_device()){
			boop = "click";
		} else {
			boop = "touchend";
		}

		addEvents();

	}

	return{
		init : init
	};

})();

(function(){
	__pickr.init();
})();