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
		livesDisplay = undefined;

	var animationTimes = {
		quick : 300,
		medium : 600,
		longish : 100
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
				cells[e].addEventListener('click', incorrect, false);	
			}

			e += 1;
		}


		cells[mutant].style.backgroundColor = "rgb(" + mutantRGB.r + "," + mutantRGB.g + "," + mutantRGB.b + ")";
		cells[mutant].addEventListener('click', correct, false);

		while(f > lives){

			if(f > lives){
				livesDisplay[5 - (f)].setAttribute('data-lost', 'true');	
			} else {
				livesDisplay[f - 1].setAttribute('data-lost', 'false');
			}

			f -= 1;

		}


		startScreen.setAttribute('data-is-active-view', 'false');
		gameHolder.setAttribute('data-is-active-view', 'true');

		//updateGameState();

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
		difficulty = 0;
		correctSelections = [];
		colorHistory.innerHTML = "";
		difficultyDisplay.innerHTML = "Difficulty x" + difficulty;
		scoreDisplay.innerHTML = "Score 0";

		var g = 0;

		while(g < livesDisplay.length){

			livesDisplay[g].setAttribute('data-lost', 'false');

			g += 1;
		}
	}

	function gameOver(){

		var c = 0;

		while(c < livesDisplay.length){

			livesDisplay[c].setAttribute('data-lost', 'false');

			c += 1;
		}

		gameHolder.setAttribute('data-is-active-view', 'false');
		gameOverView.setAttribute('data-is-active-view', 'true');

		document.getElementById('finalScore').innerHTML = "You scored " + score + "!";

		if(score > highScore){
			highScore = score;
		}

		localStorage.removeItem('storedGame');

	}

	function resetGame(){
		var b = 0;

		while(b < cells.length){

			if(b !== mutant){
				cells[b].removeEventListener('click', incorrect, false);
			} else {
				cells[b].removeEventListener('click', correct, false);
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

		var element = this;

		element.setAttribute('class', 'wobble');

		(function(el){

			setTimeout(function(){
				el.setAttribute('class', '');
			}, animationTimes.quick);

		})(element);

		livesDisplay[5 - lives].setAttribute('data-lost', 'true');

		if(lives - 1 > 0){
			lives -= 1;
		} else {

			setTimeout(function(){
				gameOver();
			}, 1000);
			
		}

		updateGameState();

	}

	function correct(){
		// console.log("correct");

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
				cells[a].addEventListener('click', incorrect, false);	
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
		cells[mutant].addEventListener('click', correct, false);

		mutantRGB = rc;

		//updateGameState();
		// console.log("Correct: rgb(" + rc.r + "," + rc.g + "," + rc.b + ")");


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
		
		document.getElementById('begin').addEventListener('click', function(){

			resetGame();
			resetValues();
			newSet();

			startScreen.setAttribute('data-is-active-view', 'false');
			gameHolder.setAttribute('data-is-active-view', 'true');

		}, false);

		document.getElementById('tryAgainBtn').addEventListener('click', function(){

			resetGame();
			newSet();
			resetValues();

			gameOverView.setAttribute('data-is-active-view', 'false');
			gameHolder.setAttribute('data-is-active-view', 'true');

		}, false);

		document.getElementById('menuBtn').addEventListener('click', function(){
			updateGameState();

			document.getElementById('continueBtn').setAttribute('data-visible', 'true');

			gameHolder.setAttribute('data-is-active-view', 'false');
			gameOverView.setAttribute('data-is-active-view', 'false');
			startScreen.setAttribute('data-is-active-view', 'true');
		});
			
		var continueBtn = document.getElementById('continueBtn');

		continueBtn.addEventListener('click', function(){
		
			if(checkSavedGame() !== null){
				var storedGame = JSON.parse(localStorage.getItem('storedGame'));

				continueGame(storedGame);

			}

		}, false);

		

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
		livesDisplay = document.getElementById('lives').getElementsByClassName('life');

		var storedHighScore = localStorage.getItem('highScore');

		if(storedHighScore !== null){
			highScore = parseInt(storedHighScore);
			highScoreDisplay.innerHTML = "High score" + highScore;
		}

		if(checkSavedGame() !== null){
			continueBtn.setAttribute('data-visible', 'true');
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