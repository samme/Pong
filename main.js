'use strict';

var state = {
    
    preload: function (){
    	this.add.plugin(Phaser.Plugin.Debug);
    	this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    	this.scale.pageAlignHorizontally = true;
    	this.scale.pageAlignVertically = true;
    	this.stage.backgroundColor = '#eee';
    	this.load.image('paddle', 'assets/paddle.png');
    	this.load.image('ball', 'assets/ball.png');
	
    	this.load.script("LazerBeam", "assets/LazerBeam.js");
    },

    create: function (){
        this.newY = 0;
        this.playerScore = 0;
        this.playerScoreText = "";
        this.playerName = "Player";

    	this.physics.startSystem(Phaser.Physics.ARCADE);
    	this.physics.arcade.checkCollision.left = false;
    	this.physics.arcade.checkCollision.right = false;
	
    	this.LazerBeam = this.add.filter("LazerBeam", this.world.width, this.world.height, 0.5);
	
    	this.playerPaddle = this.add.sprite(5, this.world.height * 0.5, 'paddle');
    	this.playerPaddle.anchor.set(0.5,1);
    	this.physics.enable(this.playerPaddle, Phaser.Physics.ARCADE);
    	this.playerPaddle.body.immovable = true;
	
    	this.playerScoreText = this.add.text(0, 0, this.playerName + " score: " + this.playerScore);
	
    	this.enemyPaddle = this.add.sprite(this.world.width-10, this.world.height * 0.5, 'paddle');
    	this.enemyPaddle.anchor.set(0.5, 1);
    	this.physics.enable(this.enemyPaddle, Phaser.Physics.ARCADE);
    	this.enemyPaddle.body.immovable = true;
    	this.enemyPaddle.body.collideWorldBounds = true;
        
        this.input.keyboard.addKey(Phaser.KeyCode.R).onDown.add(this.state.restart, this.state);
	
    	this.ballSpawn();
    },

    update: function (){
    	this.physics.arcade.collide(this.ball, this.playerPaddle, this.ballHitPaddle, null, this);
    	this.physics.arcade.collide(this.ball, this.enemyPaddle, this.ballHitPaddle, null, this);
    	this.playerPaddle.y = this.input.y || this.world.height*0.5;
	
    	if (Math.ceil(this.ball.x) % 5 === 0) {
    		this.newY = this.ball.body.angle + this.ball.body.velocity.y * 2;
    	}
	
    	if (this.enemyPaddle.y > this.newY + 20) {
    		this.enemyPaddle.body.velocity.y = -200;
    	}
    	if (this.enemyPaddle.y < this.newY - 20) {
    		this.enemyPaddle.body.velocity.y = 200;
    	}
    },

    render: function (){
    	// http://phaser.io/docs/2.4.4/Phaser.Utils.Debug.html
    	//game.debug.spriteInfo(playerPaddle, 32, 32);
    	//game.debug.body(playerPaddle);
    	//game.debug.inputInfo();
    	this.game.debug.text(this.newY + " " + this.ball.x, 50, 50);
    	//game.debug.pointer(game.input.activePointer);
    },

    ballLeaveScreen: function (){
    	if (this.ball.x >= this.world.width) {
    		this.playerScore++;
    	} else {
    		this.playerScore--;
    	}
	
    	this.playerScoreText.text = this.playerName + " score: " + this.playerScore;
    	this.ballReset();
    },

    ballHitPaddle: function (ball, paddle){
    	//TODO (Maybe): Modify the bounce. The code below leads to some weird issues
    	//ball.body.velocity.x = -(ball.speed);
    	//ball.body.velocity.y = (paddle.body.velocity > 0) ? paddle.body.velocity.y * 10 : 150;
	
    	this.add.tween(ball).to({tint: 0xFFF}, 100, Phaser.Easing.Cubic.In, true, 0, 0, true);
    },

    ballSpawn: function (){
    	this.ball = this.add.sprite(50, 50, 'ball');
    	this.physics.enable(this.ball, Phaser.Physics.ARCADE);
    	this.ball.body.collideWorldBounds = true;
    	this.ball.checkWorldBounds = true;
    	this.ball.body.bounce.set(1);
    	this.ball.events.onOutOfBounds.add(this.ballLeaveScreen, this);

    	this.ballReset();
    	console.log("Ball spawned");
    },

    ballReset: function (){
    	this.ball.reset(50, 50);
    	this.ball.body.velocity.set(250, 250);
    }
    
};

var game = new Phaser.Game("90", "85", Phaser.WEBGL, 'game', state);
