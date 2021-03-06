var __pickr = (function(){
	
	'use strict';

	var languages = {
		english : 0,
		romanian : 1,
		german : 2,
		french : 3,
		greek : 4,
		spanish : 5,
		portuguese : 6
	};

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
		timerDisplay = undefined,
		comboDisplay = undefined,
		roundTime = 8000,
		timeLeft = roundTime,
		startTime = undefined,
		boop = undefined,
		canInteract = true,
		playingGame = false,
		correctCount = 0,
		withTimer = true,
		browserLanguage = 0;

	window.requestAnimationFrame = (window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame);

	var twitterScore = document.querySelector('#gameOver .tweetAction a');

	var words = [
		{
			start : "Start",
			score : "Score",
			highScore : "High Score",
			difficulty : "Difficulty",
			youScored : "You Scored",
			inARow : "in a row",
			beginTimer : "start new game (with timer)",
			begin : "start new game (without timer)",
			cont : "continue game",
			tryAgain : "try again?",
			tagline : "One of these colors is not like the others!",
			which : "Which one?",
			selected : "You correctly picked out the following colors...",
			gameOver : "GAME OVER",
			available : "Also available from:"
		},
		{
			start : "Start",
			score : "Scor",
			highScore : "Scor mare",
			difficulty : "Dificultate",
			youScored : "Tu marcat",
			inARow : "Într-un rând",
			beginTimer : "începe jocul nou (cu ceas)",
			begin : "începe joc nou (fără ceas)",
			cont : "continua jocul",
			tryAgain : "încearcă din nou?",
			tagline : "Una dintre aceste culori nu este ca ceilalți!",
			which : "Care?",
			selected : "Ai ales corect următoarele culori...",
			gameOver : "JOC ÎNCHEIAT",
			available : "De asemenea, disponibile de la:"
		},
		{
			start : "Start",
			score : "Ergebnis",
			highScore : "Bestes Ergebnis",
			difficulty : "Schwierigkeit",
			youScored : "Sie Erzielte",
			inARow : "In einer Reihe",
			beginTimer : "neues spiel starten (mit uhr)",
			begin : "neues spiel starten (ohne uhr)",
			cont : "weiter Spiel",
			tryAgain : "wieder?",
			tagline : "Eine dieser Farben ist nicht wie die anderen!",
			which : "Welcher?",
			selected : "Sie richtig ausgesucht die folgenden Farben ...",
			gameOver : "Spiel ist aus",
			available : "Auch erhältlich:"
		},
		{
			start : "Début",
			score : "marquer des points",
			highScore : "Score élevé",
			difficulty : "Difficulté",
			youScored : "Vous avez marqué",
			inARow : "en rang",
			beginTimer : "démarrer jeu (avec horloge)",
			begin : "démarrer jeu (sans horloge)",
			cont : "continuera jeu",
			tryAgain : "essayer à nouveau?",
			tagline : "Un de ces couleurs ne est pas comme les autres!",
			which : "Laquelle?",
			selected : "Vous avez correctement choisi les couleurs suivantes...",
			gameOver : "jeu terminé",
			available : "Egalement disponible à partir:"
		},
		{
			start : "αρχή",
			score : "marquer des points",
			highScore : "υψηλή βαθμολογία",
			difficulty : "δυσκολία",
			youScored : "Μπορείτε Σκόραρε",
			inARow : "Σε μια σειρά",
			beginTimer : "νέο παιχνίδι (με το ρολόι)",
			begin : "νέο παιχνίδι (με το ρολόι)",
			cont : "να συνεχίσει το παιχνίδι",
			tryAgain : "δοκιμάστε ξανά",
			tagline : "Ένα από αυτά τα χρώματα δεν είναι σαν τους άλλους!",
			which : "Ποιο από τα δύο",
			selected : "Μπορείτε σωστά διάλεξε τα εξής χρώματα...",
			gameOver : "το παιχνίδι τελείωσε",
			available : "Επίσης διατίθεται από:"
		},
		{
			start : "Comienzo",
			score : "Puntuación",
			highScore : "Puntuación más alta",
			difficulty : "Dificultad",
			youScored : "su puntaje",
			inARow : "en una fila",
			beginTimer : "iniciar un nuevo juego (con temporizador)",
			begin : "iniciar un nuevo juego (sin temporizador)",
			cont : "continuar juego",
			tryAgain : "inténtalo de nuevo?",
			tagline : "Uno de estos colores no es como las otras!",
			which : "Cúal?",
			selected : "Usted correctamente recogido los siguientes colores ...",
			gameOver : "JUEGO TERMINADO",
			available : "También disponible en:"
		},
		{
			start : "Começo",
			score : "Ponto",
			highScore : "Melhor Pontuação",
			difficulty : "Dificuldade",
			youScored : "Você Marcou",
			inARow : "em uma fila",
			beginTimer : "iniciar novo jogo (com temporizador)",
			begin : "iniciar novo jogo (sem temporizador)",
			cont : "continuar jogo",
			tryAgain : "tente novamente?",
			tagline : "Uma dessas cores não é como os outros!",
			which : "Qual?",
			selected : "Você escolheu corretamente as seguintes cores ...",
			gameOver : "VOCÊ PERDER",
			available : "Também está disponível a partir de:"
		}
	];

	var animationTimes = {
		quick : 300,
		medium : 600,
		longish : 100
	}

	var sounds = {
		nope : document.getElementById('nope'),
		pop : document.getElementById('pop'),
		gameOver : document.getElementById('gameover_snd')
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

		resetGame();
		resetValues();

		thisRGB = game.thisRGB;
		mutantRGB = game.mutantRGB;
		mutant = game.mutant;
		score = game.score;
		correctSelections = game.correctSelections;
		scoreDisplay.innerHTML = words[browserLanguage].score + " " + score;
		lives = game.lives;
		highScoreDisplay.innerHTML = words[browserLanguage].highScore +  " " + localStorage.getItem('highScore');
		timeLeft = game.timeLeft;
		correctCount = game.correctCount;
		withTimer = game.withTimer;

		if(withTimer){
			timerDisplay.setAttribute('data-visible', 'true');
		} else {
			timerDisplay.setAttribute('data-visible', 'false');
		}

		startTime = (Date.now() * 1) - (roundTime - timeLeft);

		var e = 0,
			f = 0;

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

		difficultyDisplay.innerHTML = words[browserLanguage].difficulty + " x " + difficulty;

		while(e < cells.length){

			cells[e].style.backgroundColor = "rgb(" + thisRGB.r + "," + thisRGB.g + "," + thisRGB.b + ")";

			if(e !== mutant){
				cells[e].addEventListener(boop, incorrect, false);	
			}

			e += 1;
		}

		cells[mutant].style.backgroundColor = "rgb(" + mutantRGB.r + "," + mutantRGB.g + "," + mutantRGB.b + ")";
		cells[mutant].addEventListener(boop, correct, false);

		while(f < 5){

			if(f < lives){
				livesDisplay[f].setAttribute('data-lost', 'false');	
			} else {
				livesDisplay[f].setAttribute('data-lost', 'true');
			}

			f += 1;

		}

		var h = 0;

		while(h < correctSelections.length){

			var oldSwatch = document.createElement('span');
			oldSwatch.style.backgroundColor = "rgb(" + correctSelections[h].r + "," + correctSelections[h].g + "," + correctSelections[h].b + ")"
			colorHistory.appendChild(oldSwatch);

			h += 1;

		}

		drawTimer();

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
		difficultyDisplay.innerHTML = words[browserLanguage].difficulty + "x" + difficulty;
		scoreDisplay.innerHTML =  words[browserLanguage].score + " 0";
		comboDisplay.innerHTML = "0 " + words[browserLanguage].inARow;

		var g = 0;

		while(g < livesDisplay.length){

			livesDisplay[g].setAttribute('data-lost', 'false');

			g += 1;
		}

		colorDisplay.innerHTML = "";

	}

	function drawTimer(){

		if(playingGame && withTimer){
			var currentTime = Date.now() * 1;

			timeLeft = roundTime - (currentTime - startTime);
		
			timerDisplay.style.width = ((timeLeft / roundTime) * 100) + "%";

			if(timeLeft <= 0){

				updateGameState();
				incorrect();
				if(lives > 0){
					startTime = Date.now() * 1;	
				}
				
			} else {
				updateGameState();
				
			}
		}

		window.requestAnimationFrame(drawTimer);

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

		try{
			sounds.gameOver.currentTime = 0;
			sounds.gameOver.play();	
		} catch(err){

		}
		
		twitterScore.setAttribute('href', 'https://twitter.com/intent/tweet?url=https%3A%2F%2Fsmt.codes%2Fstuff%2Fpickr%2F&text=' + encodeURI('I scored ' + score + ' on Pickr. Can anyone beat me?'));

		gameHolder.setAttribute('data-is-active-view', 'false');
		gameOverView.setAttribute('data-is-active-view', 'true');

		document.getElementById('finalScore').innerHTML = words[browserLanguage].youScored + " " + score + "!";

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
			correctCount : correctCount,
			thisRGB : thisRGB,
			mutantRGB : mutantRGB,
			mutant : mutant,
			score : score,
			highScore : highScore,
			lives :lives,
			timeLeft : timeLeft,
			withTimer : withTimer
		};

		localStorage.setItem('storedGame', JSON.stringify(gameState));

	}

	function incorrect(evt){

		correctCount = 0;

		if(canInteract){
			var element = this;

			if(element !== window && element !== undefined){
				element.setAttribute('class', 'wobble');

				(function(el){

					setTimeout(function(){
						el.setAttribute('class', '');
					}, animationTimes.quick);

				})(element);
			}

			livesDisplay[lives - 1].setAttribute('data-lost', 'true');
			comboDisplay.innerHTML = "0 " + words[browserLanguage].inARow;
	
			try{
				sounds.nope.currentTime = 0;
				sounds.nope.play();
			} catch(err){

			}
	
			if(lives - 1 > 0){
				lives -= 1;
			} else {
				lives -= 1;
				cells[mutant].setAttribute('data-reveal', 'true');

				canInteract = false;

				playingGame = false;
				
				setTimeout(function(){
					gameOver();
				}, 2000);
				
			}

			updateGameState();
		}

	}

	function correct(){

		if(canInteract){

			var newSwatch = document.createElement('span');
			newSwatch.style.backgroundColor = "rgb(" + mutantRGB.r + "," + mutantRGB.g + "," + mutantRGB.b + ")"
			colorHistory.appendChild(newSwatch);

			correctSelections.push(mutantRGB);
			score += Math.ceil(1 * difficulty);
			correctCount += 1;

			comboDisplay.innerHTML = correctCount + " " + words[browserLanguage].inARow;

			if(score > highScore){
				highScore = score;
				highScoreDisplay.innerHTML = words[browserLanguage].highScore + " " + highScore;
				localStorage.setItem('highScore', highScore);
			}

			if(correctCount !== 0 && correctCount % 10 === 0 && lives < 5){
				lives += 1;
				livesDisplay[lives - 1].setAttribute('data-lost', 'false');
			}

			resetGame();
			newSet();

			updateGameState();

		}

	}

	function newColor(color){

		var r = Math.random() * 255 | 0,
			g = Math.random() * 255 | 0,
			b = Math.random() * 255 | 0;

		return {r : r, g : g, b : b};

		/*if(color === undefined){
			thisRGB.r = Math.random() * 255 | 0;
			thisRGB.g = Math.random() * 255 | 0;
			thisRGB.b = Math.random() * 255 | 0;
		} else {
			thisRGB.r = color.r;
			thisRGB.g = color.g;
			thisRGB.b = color.b;
		}*/

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

		difficultyDisplay.innerHTML = words[browserLanguage].difficulty + " x " + difficulty;
		scoreDisplay.innerHTML = words[browserLanguage].score + " " + score;
		highScoreDisplay.innerHTML = words[browserLanguage].highScore + " " +  highScore;

		startTime = Date.now() * 1;

		var setColor = newColor(),
			luminosity = (0.2126 * setColor.r + 0.7152 * setColor.g + 0.0722 * setColor.b);

		thisRGB = setColor;

		while(luminosity < 20){
			setColor = newColor();
			luminosity = (0.2126 * setColor.r + 0.7152 * setColor.g + 0.0722 * setColor.b);
		}

		newMutant();
		drawGrid(mutant);

		playingGame = true;

		updateGameState();

	}

	function checkSavedGame(){
		return localStorage.getItem('storedGame');
	}

	function handleButtonLocales(){

		document.getElementById('beginTimer').innerHTML = words[browserLanguage].beginTimer;
		document.getElementById('begin').innerHTML = words[browserLanguage].begin;
		document.getElementById('continueBtn').innerHTML = words[browserLanguage].cont;
		document.getElementById('tryAgainBtn').innerHTML = words[browserLanguage].tryAgain;
		document.getElementById('tagline').innerHTML = words[browserLanguage].tagline;
		document.getElementById('tagQuestion').innerHTML = words[browserLanguage].which;
		document.getElementById('correctlyGot').innerHTML = words[browserLanguage].selected;
		document.getElementById('govDisplay').innerHTML = words[browserLanguage].gameOver;

		if(document.getElementById('installs') !== null){
			document.getElementById('available').innerHTML = words[browserLanguage].available;	
		}

	}

	function addEvents(){
		
		document.getElementById('beginTimer').addEventListener(boop, function(){

			playingGame = true;
			withTimer = true;
			timerDisplay.setAttribute('data-visible', 'true');

			resetGame();
			resetValues();
			newSet();

			startScreen.setAttribute('data-is-active-view', 'false');
			gameHolder.setAttribute('data-is-active-view', 'true');

		}, false);

		document.getElementById('begin').addEventListener(boop, function(){

			playingGame = true;
			withTimer = false;
			timerDisplay.setAttribute('data-visible', 'false');

			resetGame();
			resetValues();
			newSet();

			startScreen.setAttribute('data-is-active-view', 'false');
			gameHolder.setAttribute('data-is-active-view', 'true');

		}, false);

		document.getElementById('tryAgainBtn').addEventListener(boop, function(){

			playingGame = true;

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
			playingGame = false;

		});
			
		var continueBtn = document.getElementById('continueBtn');

		continueBtn.addEventListener(boop, function(){
		
			if(checkSavedGame() !== null){
				
				var storedGame = JSON.parse(localStorage.getItem('storedGame'));
				playingGame = true;
				continueGame(storedGame);

			}

		}, false);

	}

	//Source from http://ctrlq.org/code/19616-detect-touch-screen-javascript
	function is_touch_device() {
		return (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
	}

	function init(){
		
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
		timerDisplay = document.getElementById('runningOut');
		livesDisplay = document.getElementById('lives').getElementsByClassName('life');
		comboDisplay = document.getElementById('combo');

		var navLanguage = navigator.language.toLowerCase();

		if(navLanguage === "ro" || navLanguage === "ro-ro"){
			browserLanguage = languages.romanian;
		} else if(navLanguage === "de"){
			browserLanguage = languages.german;
		} else if(navLanguage === "fr"){
			browserLanguage = languages.french;
		} else if(navLanguage === "el"){
			browserLanguage = languages.greek;
		} else if(navLanguage === "es" || navLanguage === "es-ar" || navLanguage === "es-bo" || navLanguage === "es-cl" || navLanguage === "es-co" || navLanguage === "es-cr" || navLanguage === "es-do" || navLanguage === "es-ec" || navLanguage === "es-sv" || navLanguage === "es-gt" || navLanguage === "es-hn" || navLanguage === "es-mx" || navLanguage === "es-ni" || navLanguage === "es-pa" || navLanguage === "es-py" || navLanguage === "es-pe" || navLanguage === "es-pr" || navLanguage === "es-es" || navLanguage === "es-uy" || navLanguage === "es-ve"){
			browserLanguage = languages.spanish;
		} else if(navLanguage === "pt" || navLanguage === "pt-br"){
			browserLanguage = languages.portuguese;
		}

		handleButtonLocales();

		var storedHighScore = localStorage.getItem('highScore');

		if(storedHighScore !== null){
			highScore = parseInt(storedHighScore);
			highScoreDisplay.innerHTML = words[browserLanguage].highScore + " " + highScore;
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
		drawTimer();

	}

	return{
		init : init
	};

})();

(function(){
	__pickr.init();
})();