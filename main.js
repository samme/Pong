'use strict';

var game = new Phaser.Game("90", "85", Phaser.WEBGL, 'game', {preload: preload, create: create, update: update, render: render});

var ball;

var playerPaddle;
var playerScore = 0;
var playerScoreText;
var playerName = "Player";

//Just doing this for the lulz
var LazerBeam;

var enemyPaddle;

function preload() {
	game.add.plugin(Phaser.Plugin.Debug);
	game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	game.scale.pageAlignHorizontally = true;
	game.scale.pageAlignVertically = true;
	game.stage.backgroundColor = '#eee';
	game.load.image('paddle', 'assets/paddle.png');
	game.load.image('ball', 'assets/ball.png');
	
	game.load.script("LazerBeam", "assets/LazerBeam.js");
}
function create() {
	game.physics.startSystem(Phaser.Physics.ARCADE);
	game.physics.arcade.checkCollision.left = false;
	game.physics.arcade.checkCollision.right = false;
	
	LazerBeam = game.add.filter("LazerBeam", game.world.width, game.world.height, 0.5);
	ballSpawn();
	
	playerPaddle = game.add.sprite(5, game.world.height * 0.5, 'paddle');
	playerPaddle.anchor.set(0.5,1);
	game.physics.enable(playerPaddle, Phaser.Physics.ARCADE);
	playerPaddle.body.immovable = true;
	
	playerScoreText = game.add.text(0, 0, playerName + " score: " + playerScore);
	
	enemyPaddle = game.add.sprite(game.world.width-10, game.world.height * 0.5, 'paddle');
	enemyPaddle.anchor.set(0.5, 1);
	game.physics.enable(enemyPaddle, Phaser.Physics.ARCADE);
	enemyPaddle.body.immovable = true;
}
function update() {
	game.physics.arcade.collide(ball, playerPaddle, ballHitPaddle);
	game.physics.arcade.collide(ball, enemyPaddle, ballHitPaddle);
	playerPaddle.y = game.input.y || game.world.height*0.5;
}

function render() {
	// http://phaser.io/docs/2.4.4/Phaser.Utils.Debug.html
	//game.debug.spriteInfo(playerPaddle, 32, 32);
	//game.debug.body(playerPaddle);
	//game.debug.inputInfo();
	//game.debug.text(ball.x, 50, 50);
	//game.debug.pointer(game.input.activePointer);
}

function ballLeaveScreen() {
	if (ball.x >= game.world.width)
		playerScore++;
	else
		playerScore--;
	
	playerScoreText.text = playerName + " score: " + playerScore;
	ballSpawn();
}
function ballHitPaddle(ball, paddle) {
	//TODO (Maybe): Modify the bounce. The code below leads to some weird issues
	//ball.body.velocity.x = -(ball.speed);
	//ball.body.velocity.y = (paddle.body.velocity > 0) ? paddle.body.velocity.y * 10 : 150;
	
	game.add.tween(ball).to({tint: 0xFFF}, 100, Phaser.Easing.Cubic.In, true, 0, 0, true);
}

function ballSpawn() {
	if (ball instanceof Object)
		ball.reset(50, 50);
	else
		ball = game.add.sprite(50, 50, 'ball');
	
	game.physics.enable(ball, Phaser.Physics.ARCADE);
	ball.body.velocity.set(250, 250);
	ball.body.collideWorldBounds = true;
	ball.checkWorldBounds = true;
	ball.body.bounce.set(1);
	ball.events.onOutOfBounds.add(ballLeaveScreen, this);
	ball.filters = [LazerBeam];
	
	console.log("Ball spawned");
}