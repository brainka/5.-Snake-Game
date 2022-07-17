let canvas = document.getElementById('canvas');
let canvasContext = canvas.getContext('2d');
let canvas2 = document.getElementById('canvas2');
let canvasContext2 = canvas2.getContext('2d');
let canvas3 = document.getElementById('canvas2');
let canvasContext3 = canvas3.getContext('2d');

let validKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

let startXPosition = 400;
let startYPosition = 400;

let snakeSize = [];

let lastKeyPressed = [];
let invalidNextKey;

let headOfSnake = [];

let isKeyPressed = false;
let currentKeyPressed = '';

let endOfGame = false;

let applePosition = [];

let snakeTailPosition = [];

let appleEaten = false;

let score = 0;

let lastTwoKeysPressed = [];

let firstRun = true;

let pixelWidth = 10;
let pixelHeight = 10;

let speedOfSnake;

let wallMode = false;

let noWallMode = false;

let wallHit = false;

let loadGame = false;

let speedSelected = false;
let wallSelected = false;

let writeSpeed = '';
let writeWall = '';

function homeScreenLoad() {
	// canvasContext3.fillStyle = 'black';
	// canvasContext3.fillRect(0, 0, canvas3.width, canvas3.height);
	// canvasContext3.font = '30px Arial';
	// canvasContext3.fillStyle = 'WHITE';
	// canvasContext3.fillText(`SNAKE GAME`, 330, 100);

	document.addEventListener('keydown', (e) => {
		if (loadGame === false) {
			switch (e.key.toLowerCase()) {
				case 'e':
					speedOfSnake = 10;
					speedSelected = true;
					writeSpeed = '[E]TREME';
					break;
				case 'n':
					speedOfSnake = 100;
					speedSelected = true;
					writeSpeed = '[N]ORMAL';
					break;
				case 'u':
					wallMode = true;
					noWallMode = false;
					wallSelected = true;
					writeWall = '[U]P';
					document.getElementById('canvas').classList.add('wall');
					break;
				case 'd':
					wallMode = false;
					noWallMode = true;
					wallSelected = true;
					writeWall = '[D]OWN';
					document.getElementById('canvas').classList.remove('wall');
					break;
			}

			renderSelection(writeSpeed, writeWall);

			if (speedSelected && wallSelected) {
				canvasContext3.font = '30px Arial';
				canvasContext3.fillStyle = 'WHITE';
				canvasContext3.fillText(`PRESS [S]TART`, 300, 550);

				if (e.key.toLowerCase() === 's') {
					loadGame = true;
					canvasContext3.clearRect(0, 0, canvas3.width, canvas3.height);
					runOnce();
					randomApple();
				}
			}
		}
	});

	renderSelection();
}

function renderSelection(speed = '', wall = '') {
	canvasContext3.clearRect(0, 300, canvas3.width, 400);

	canvasContext3.fillStyle = 'black';
	canvasContext3.fillRect(0, 0, canvas3.width, canvas3.height);
	canvasContext3.font = '50px Arial';
	canvasContext3.fillStyle = 'WHITE';
	canvasContext3.fillText(`SNAKE GAME`, 250, 180);

	if (speed === '') {
		canvasContext3.font = '20px Arial';
		canvasContext3.fillStyle = 'WHITE';
		canvasContext3.fillText(
			`SELECT SPEED               [N]ORMAL or [E]TREME`,
			200,
			330
		);
	} else {
		canvasContext3.font = '20px Arial';
		canvasContext3.fillStyle = 'WHITE';
		canvasContext3.fillText(`SELECTED SPEED          ${speed}`, 250, 330);
	}
	if (wall === '') {
		canvasContext3.font = '20px Arial';
		canvasContext3.fillStyle = 'WHITE';
		canvasContext3.fillText(
			`SELECT WALL                  [U]P or [D]OWN`,
			200,
			400
		);
	} else {
		canvasContext3.font = '20px Arial';
		canvasContext3.fillStyle = 'WHITE';
		canvasContext3.fillText(`SELECTED WALL             ${wall}`, 250, 400);
	}
}

homeScreenLoad();

function runOnce() {
	document.getElementById('score').style.display = 'block';

	let x = startXPosition;
	canvasContext.fillStyle = '#009933';
	canvasContext.fillRect(0, 0, canvas.width, canvas.height);
	canvasContext.fillStyle = 'black';

	canvasContext.fillRect(startXPosition, startYPosition, 110, pixelWidth);

	document.getElementById('score').innerText = `SCORE ${score}`;

	for (let index = 0; index < 110 / pixelWidth; index++) {
		//const element = snakeSize[index];
		snakeSize.push([x, startYPosition]);
		x = x + 10;
	}
}

document.addEventListener('keydown', (event) => {
	if (loadGame) {
		for (let index = 0; index < validKeys.length; index++) {
			const element = validKeys[index];
			if (speedOfSnake !== undefined) {
				if (event.key === element) {
					isKeyPressed = true;
					snakePosition(event.key);
					if (firstRun) {
						startGame();
						firstRun = false;
					}
				}
			}
		}
	}
});

function snakePosition(keyPressed) {
	let arrowKeyPressed = '';

	switch (keyPressed) {
		case 'ArrowUp':
			startYPosition = startYPosition - pixelHeight;
			headOfSnake = [startXPosition, startYPosition];
			if (endOfGame === false) {
				drawSnake(startXPosition, startYPosition);
			}
			arrowKeyPressed = 'ArrowUp';
			break;
		case 'ArrowDown':
			startYPosition = startYPosition + pixelHeight;
			headOfSnake = [startXPosition, startYPosition];
			if (endOfGame === false) {
				drawSnake(startXPosition, startYPosition);
			}
			arrowKeyPressed = 'ArrowDown';
			break;
		case 'ArrowLeft':
			startXPosition = startXPosition - pixelWidth;
			headOfSnake = [startXPosition, startYPosition];
			if (endOfGame === false) {
				drawSnake(startXPosition, startYPosition);
			}
			arrowKeyPressed = 'ArrowLeft';
			break;
		case 'ArrowRight':
			startXPosition = startXPosition + pixelWidth;
			headOfSnake = [startXPosition, startYPosition];
			if (endOfGame === false) {
				drawSnake(startXPosition, startYPosition);
			}
			arrowKeyPressed = 'ArrowRight';
			break;
		default:
			arrowKeyPressed = '';

			break;
	}
	if (arrowKeyPressed !== '') {
		lastKeyPressed.unshift(arrowKeyPressed);
	}
	if (lastKeyPressed.length === 3) {
		lastKeyPressed.pop();
	}
	isKeyPressed = false;
}

function drawSnake(xPosition, yPosition) {
	startXPosition = xPosition;
	startYPosition = yPosition;

	if (noWallMode) {
		if (startXPosition < 0) {
			startXPosition = startXPosition + canvas.width;
		} else if (startXPosition > canvas.width - pixelWidth) {
			startXPosition = startXPosition - canvas.width;
		} else if (startYPosition < 0) {
			startYPosition = startYPosition + canvas.height;
		} else if (startYPosition > canvas.height - pixelHeight) {
			startYPosition = startYPosition - canvas.height;
		}
	} else if (wallMode) {
		if (startXPosition === 0) {
			wallHit = true;
			gameOver();
		} else if (startXPosition === canvas.width - pixelWidth) {
			wallHit = true;
			gameOver();
		} else if (startYPosition === 0) {
			wallHit = true;
			gameOver();
		} else if (startYPosition === canvas.height - pixelHeight) {
			wallHit = true;
			gameOver();
		}
	}

	snakeSize.unshift([startXPosition, startYPosition]);

	let removed = snakeSize.pop();

	snakeTailPosition.pop();

	canvasContext.fillStyle = '#009933';
	canvasContext.fillRect(0, 0, canvas.width, canvas.height);
	for (let index = 0; index < snakeSize.length; index++) {
		canvasContext.fillStyle = 'black';

		canvasContext.fillRect(
			snakeSize[index][0],
			snakeSize[index][1],
			pixelWidth,
			pixelHeight
		);
	}

	gameOver();

	//add apple to tail once eaten and grow up by 1
	if (
		headOfSnake[0] === applePosition[0][0] &&
		headOfSnake[1] === applePosition[0][1]
	) {
		appleEaten = true;
		snakeSize.push([removed[0], removed[1]]);
	}

	if (appleEaten) {
		applePosition = [];
		randomApple();
		appleEaten = false;
		keepScore();
	}

	if (!endOfGame) {
		canvasContext.fillStyle = 'white';
		canvasContext.fillRect(
			applePosition[0][0],
			applePosition[0][1],
			pixelWidth,
			pixelHeight
		);
	} else {
		canvasContext2.clearRect(0, 0, canvas2.width, canvas2.height);
	}

	canvasContext2.font = '20px Arial';
	//canvasContext2.fillStyle = 'black';
	canvasContext2.clearRect(0, 0, canvas2.width, canvas2.height);
	//canvasContext2.fillText(`SCORE ${score}`, 10, 15);
	document.getElementById('score').innerText = `SCORE ${score}`;
	//canvasContext2.fillText(`SCORE ${score}`, 0, 10);
}

function gameOver() {
	for (let index = 1; index < snakeSize.length; index++) {
		const snakeBody = snakeSize[index];

		let xValueOfSnakeBody = snakeBody[0];
		let yValueOfSnakeBody = snakeBody[1];

		let xValueOfSnakeHead = headOfSnake[0];
		let yValueOfSnakeHead = headOfSnake[1];

		if (
			xValueOfSnakeBody === xValueOfSnakeHead &&
			yValueOfSnakeBody === yValueOfSnakeHead
		) {
			canvasContext.fillStyle = 'black';
			canvasContext.fillRect(
				snakeSize[index][0],
				snakeSize[index][1],
				pixelWidth,
				pixelHeight
			);

			document.getElementById('score').style.display = 'none';
			canvasContext.fillStyle = 'black';
			canvasContext.fillRect(0, 0, canvas.width, canvas.height);

			canvasContext.fillStyle = 'white';
			canvasContext.font = '50px Arial';
			canvasContext.textAlign = 'center';
			canvasContext.fillText(`GAME OVER`, canvas.width / 2, canvas.height / 2);

			canvasContext2.clearRect(0, 0, canvas2.width, canvas2.height);

			canvasContext.font = '20px Arial';
			canvasContext.fillStyle = 'white';
			canvasContext.fillText(`BEST SCORE ${score}`, canvas.width / 2, 400);

			canvasContext.font = '20px Arial';
			canvasContext.fillStyle = 'white';
			canvasContext.fillText(`[R]ESTART`, canvas.width / 2, 500, 100);

			restartScreen();

			return (endOfGame = true);
		} else if (wallHit) {
			document.getElementById('score').style.display = 'none';
			canvasContext.fillStyle = 'black';
			canvasContext.fillRect(0, 0, canvas.width, canvas.height);

			canvasContext.fillStyle = 'white';
			canvasContext.font = '50px Arial';
			canvasContext.textAlign = 'center';
			canvasContext.fillText(`GAME OVER`, canvas.width / 2, canvas.height / 2);

			canvasContext2.clearRect(0, 0, canvas2.width, canvas2.height);

			canvasContext.font = '20px Arial';
			canvasContext.fillStyle = 'white';
			canvasContext.fillText(`BEST SCORE ${score}`, canvas.width / 2, 400);

			canvasContext.font = '20px Arial';
			canvasContext.fillStyle = 'white';
			canvasContext.fillText(`[R]ESTART`, canvas.width / 2, 500, 100);

			restartScreen();
			return (endOfGame = true);
		}
	}
}

function restartScreen() {
	document.addEventListener('keydown', (e) => {
		if (endOfGame) {
			if (e.key === 'r') {
				restartGame();
			}
		}
	});
}

function randomApple() {
	let xApple = Math.floor(Math.random() * canvas.width);
	let yApple = Math.floor(Math.random() * canvas.height);

	xApple = numberDivisiableBy10(xApple);

	yApple = numberDivisiableBy10(yApple);

	if (yApple === startYPosition) {
		yApple = yApple + 10;
		applePosition.push([xApple, yApple]);
	} else {
		applePosition.push([xApple, yApple]);
	}
	canvasContext.fillStyle = 'white';
	canvasContext.fillRect(
		applePosition[0][0],
		applePosition[0][1],
		pixelWidth,
		pixelHeight
	);
}

function numberDivisiableBy10(num) {
	let numString;

	if (typeof num === 'string') {
		numString = num;
	} else if (typeof num === 'number') {
		numString = num.toString();
	}

	if (numString.endsWith('0')) {
		numString = numString;
	} else if (numString.length === 1) {
		numString = `${numString}0`;
	} else if (numString.length === 2) {
		numString = numString.substring(0, 1);
		numString = `${numString}0`;
	} else if (numString.length === 3) {
		numString = numString.substring(0, 2);
		numString = `${numString}0`;
	}
	return parseFloat(numString);
}

function keepScore() {
	score = score + 1;
	return score;
}

function startGame() {
	let myInterval = setInterval(() => {
		if (endOfGame) {
			clearInterval(myInterval);
		} else if (speedOfSnake !== undefined) {
			snakePosition(lastKeyPressed[0]);
		}
	}, speedOfSnake);
}

function restartGame() {
	headOfSnake = [];
	startXPosition = 400;
	startYPosition = 400;
	snakeSize = [];
	lastKeyPressed = [];
	invalidNextKey;

	isKeyPressed = false;
	currentKeyPressed = '';
	endOfGame = false;
	applePosition = [];
	snakeTailPosition = [];
	appleEaten = false;
	score = 0;

	lastTwoKeysPressed = [];
	firstRun = true;
	pixelWidth = 10;
	pixelHeight = 10;
	canvasContext.fillStyle = '#009933';
	canvasContext.fillRect(0, 0, canvas.width, canvas.height);

	canvasContext2.fillStyle = 'transparent';
	canvasContext2.fillRect(0, 0, canvas2.width, canvas.height);
	speedOfSnake;

	speedOfSnake;

	wallMode = false;

	noWallMode = false;

	document.getElementById('canvas').classList.remove('wall');

	wallHit = false;

	canvasContext2.clearRect(0, 0, canvas2.width, canvas2.height);
	wallHit = false;

	loadGame = false;

	speedSelected = false;
	wallSelected = false;

	writeSpeed = '';
	writeWall = '';

	canvasContext.clearRect(0, 0, canvas.width, canvas.height);
	homeScreenLoad();
}
