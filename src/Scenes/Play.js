// create a Play class that extends Phaser.Scene
class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    // load game assets
    preload() {
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('small_spaceship', './assets/small_spaceship.png');
        this.load.image('starfield', './assets/starfield.png');
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
    }

    // initialize class members and objects
    create() {
        // create a flag that tracks the player's turn
        this.isPlayer1 = true;

        // create a flag that indicates if the game is over
        this.gameOver = false;

        // create a clock that will count down from 60 seconds
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← to Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);

        // create a score for each player
        this.p1Score = 0;
        this.p2Score = 0;

        // create a timer to track the time left for each player
        this.timeLeftP1 = game.settings.gameTimer;
        this.timeLeftP2 = game.settings.gameTimer;

        // create a text object to display the scores
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig).setDepth(1);
        this.scoreRight = this.add.text(game.config.width - borderUISize - borderPadding - scoreConfig.fixedWidth, borderUISize + borderPadding*2, this.p2Score, scoreConfig).setDepth(1);
        this.timeLeftTextP1 = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*8, this.timeLeftP1, scoreConfig).setDepth(1);
        this.timeLeftTextP2 = this.add.text(game.config.width - borderUISize - borderPadding - scoreConfig.fixedWidth, borderUISize + borderPadding*8, this.timeLeftP2, scoreConfig).setDepth(1);

        // create the starfield background
        this.starfield = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'starfield').setOrigin(0, 0);

        // add a rocket (player 1)
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);

        // add a rocket (player 2)
        this.p2Rocket = new Rocket(this, game.config.width/2, borderUISize + borderPadding*2, 'rocket').setOrigin(0.5, 0);

        // add spaceships
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'spaceship', 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'spaceship', 0, 20).setOrigin(0,0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'spaceship', 0, 10).setOrigin(0,0);
        this.smallShip01 = new SmallSpaceship(this, game.config.width + borderUISize*6, borderUISize*5, 'small_spaceship', 0, 50).setOrigin(0,0);
        this.smallShip02 = new SmallSpaceship(this, game.config.width + borderUISize*3, borderUISize*6 + borderPadding*2, 'small_spaceship', 0, 40).setOrigin(0,0);
        this.smallShip03 = new SmallSpaceship(this, game.config.width, borderUISize*7 + borderPadding*4, 'small_spaceship', 0, 30).setOrigin(0,0);

        // create animations
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
            frameRate: 30
        });

        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        // display game instructions
        let instructions = "Player 1: Use ←→ arrows to move & (F) to fire\nPlayer 2: Use A&D keys to move & (LEFT SHIFT) to fire";
        let gameInstructions = {
            fontFamily: 'Courier',
            fontSize: '24px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
        }
        this.add.text(game.config.width/2, game.config.height/2 - borderPadding*5, 'ROCKET PATROL', { fontFamily: 'Impact', fontSize: '48px', color: '#ffffff' }).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2, instructions, gameInstructions).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 + borderPadding*5, 'Press ← for Novice or → for Expert', gameInstructions).setOrigin(0.5);

        // initialize difficulty level
        this.difficulty = 1;
    }
    // update method is called every frame
    update() {
        // check if game is over
        if (this.gameOver) {
            // if game is over and player hits the restart button
            if (Phaser.Input.Keyboard.JustDown(keyR)) {
                this.scene.restart();
            }
            // if game is over and player hits the menu button
            if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
                this.scene.start("menuScene");
            }
        } else {
            // scroll the starfield background
            this.starfield.tilePositionY -= 4;

            // update the rocket
            this.p1Rocket.update();

            // update the spaceships
            this.ship01.update();
            this.ship02.update();
            this.ship03.update();

            // check collisions between rocket and spaceships
            this.physics.add.collider(this.p1Rocket, this.ship01, () => {
                this.p1Rocket.reset();
                this.shipExplode(this.ship01);
            });
            this.physics.add.collider(this.p1Rocket, this.ship02, () => {
                this.p1Rocket.reset();
                this.shipExplode(this.ship02);
            });
            this.physics.add.collider(this.p1Rocket, this.ship03, () => {
                this.p1Rocket.reset();
                this.shipExplode(this.ship03);
            });

            // check if the time is up for player 1
            if (this.timeLeftP1 <= 0) {
                this.add.text(game.config.width/2, game.config.height/2, 'Player 2 wins!', scoreConfig).setOrigin(0.5);
                this.gameOver = true;
            }

            // check if the time is up for player 2
            if (this.timeLeftP2 <= 0) {
                this.add.text(game.config.width/2, game.config.height/2, 'Player 1 wins!', scoreConfig).setOrigin(0.5);
                this.gameOver = true;
            }

            // update the time left for each player
            if (this.isPlayer1) {
                this.timeLeftP1 = Math.round((game.settings.gameTimer - this.clock.getElapsed()) / 1000);
                this.timeLeftTextP1.text = this.timeLeftP1;
            } else {
                this.timeLeftP2 = Math.round((game.settings.gameTimer - this.clock.getElapsed()) / 1000);
                this.timeLeftTextP2.text = this.timeLeftP2;
            }

            // switch players if the time is up for one of them
            if (this.timeLeftP1 <= 0 || this.timeLeftP2 <= 0) {
                this.isPlayer1 = !this.isPlayer1;
                this.p1Rocket.reset();
                this.p1Rocket.visible = this.isPlayer1;
                this.ship01.reset();
                this.ship02.reset();
                this.ship03.reset();
            }
        }
    }
    // helper method to check for collision between two objects
    checkCollision(object1, object2) {
        if (object1.active && object2.active &&
            object1.x < object2.x + object2.width &&
            object1.x + object1.width > object2.x &&
            object1.y < object2.y + object2.height &&
            object1.y + object1.height > object2.y) {
            return true;
        } else {
            return false;
        }
    }

    // helper method to reset the rocket to the starting position
    resetRocket(rocket) {
        rocket.x = game.config.width/2;
        rocket.y = game.config.height - borderUISize - borderPadding;
    }

    // helper method to handle player input
    handlePlayerInput() {
        if (this.isPlayer1) {
            // player 1 controls
            if (keyLEFT.isDown && this.p1Rocket.x >= borderUISize + this.p1Rocket.width) {
                this.p1Rocket.x -= this.p1Rocket.moveSpeed;
            }
            if (keyRIGHT.isDown && this.p1Rocket.x <= game.config.width - borderUISize - this.p1Rocket.width) {
                this.p1Rocket.x += this.p1Rocket.moveSpeed;
            }
            if (Phaser.Input.Keyboard.JustDown(keyF)) {
                this.p1Rocket.fire();
            }
        } else {
            // player 2 controls
            if (keyA.isDown && this.p2Rocket.x >= borderUISize + this.p2Rocket.width) {
                this.p2Rocket.x -= this.p2Rocket.moveSpeed;
            }
            if (keyD.isDown && this.p2Rocket.x <= game.config.width - borderUISize - this.p2Rocket.width) {
                this.p2Rocket.x += this.p2Rocket.moveSpeed;
            }
            if (Phaser.Input.Keyboard.JustDown(keyQ)) {
                this.p2Rocket.fire();
            }
        }
    }

    // helper method to update the score and time left text
    updateScoreText() {
        this.scoreLeft.text = this.p1Score;
        this.scoreRight.text = this.p2Score;
        this.timeLeftTextP1.text = Math.ceil(this.timeLeftP1 / 1000);
        this.timeLeftTextP2.text = Math.ceil(this.timeLeftP2 / 1000);
    }

    // helper method to handle the game over state
    handleGameOver() {
        if (this.gameOver) {
            // restart the game on 'R' press
            if (Phaser.Input.Keyboard.JustDown(keyR)) {
                this.scene.restart();
            }
            // return to menu on 'LEFT' press
            if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
                this.scene.start("menuScene");
            }
        }
    }
    update(time, delta) {
        // check for game over state
        if (!this.gameOver) {
            // update the rocket and spaceships
            this.p1Rocket.update();
            this.p2Rocket.update();
            this.small_spaceship1.update();
            this.small_spaceship2.update();
            this.spaceship.update();

            // check for collisions between the rocket and spaceships
            if (this.checkCollision(this.p1Rocket, this.small_spaceship1)) {
                this.p1Rocket.reset();
                this.small_spaceship1.reset();
                this.scoreLeft += this.small_spaceship1.points;
                this.timeLeftP1 += this.small_spaceship1.time;
                this.scoreLeft.setText(this.p1Score);
                this.timeLeftTextP1.setText(this.timeLeftP1);
                this.sound.play('sfx_explosion');
                this.small_spaceship1.playExplodeAnimation();
            }

            if (this.checkCollision(this.p1Rocket, this.small_spaceship2)) {
                this.p1Rocket.reset();
                this.small_spaceship2.reset();
                this.scoreLeft += this.small_spaceship2.points;
                this.timeLeftP1 += this.small_spaceship2.time;
                this.scoreLeft.setText(this.p1Score);
                this.timeLeftTextP1.setText(this.timeLeftP1);
                this.sound.play('sfx_explosion');
                this.small_spaceship2.playExplodeAnimation();
            }

            if (this.checkCollision(this.p1Rocket, this.spaceship)) {
                this.p1Rocket.reset();
                this.spaceship.reset();
                this.scoreLeft += this.spaceship.points;
                this.timeLeftP1 += this.spaceship.time;
                this.scoreLeft.setText(this.p1Score);
                this.timeLeftTextP1.setText(this.timeLeftP1);
                this.sound.play('sfx_explosion');
                this.spaceship.playExplodeAnimation();
            }

            if (this.checkCollision(this.p2Rocket, this.small_spaceship1)) {
                this.p2Rocket.reset();
                this.small_spaceship1.reset();
                this.scoreRight += this.small_spaceship1.points;
                this.timeLeftP2 += this.small_spaceship1.time;
                this.scoreRight.setText(this.p2Score);
                this.timeLeftTextP2.setText(this.timeLeftP2);
                this.sound.play('sfx_explosion');
                this.small_spaceship1.playExplodeAnimation();
            }

            if (this.checkCollision(this.p2Rocket, this.small_spaceship2)) {
                this.p2Rocket.reset();
                this.small_spaceship2.reset();
                this.scoreRight += this.small_spaceship2.points;
                this.timeLeftP2 += this.small_spaceship2.time;
                this.scoreRight.setText(this.p2Score);
                this.timeLeftTextP2.setText(this.timeLeftP2);
                this.sound.play('sfx_explosion');
                this.small_spaceship2.playExplodeAnimation();
            }

            if (this.checkCollision(this.p2Rocket, this.spaceship)) {
                this.p2Rocket.reset();
                this.spaceship.reset();
                this.scoreRight += this.spaceship.points;
                this.timeLeftP2 += this.spaceship.time;
                this.scoreRight.setText(this.p2Score);
                this.timeLeftTextP2.setText(this.timeLeftP2);
                this.sound.play('sfx_explosion');
                this.spaceship.playExplodeAnimation();
            }

            // update the starfield background
            this.starfield.tilePositionY -= 4;

            // update the timer
            this.timeLeftP1 -= delta;
            this.timeLeftP2 -= delta;
            this.timeLeftTextP1.setText(this.formatTime(Math.max(0, this.timeLeftP1)));
            this.timeLeftTextP2.setText(this.formatTime(Math.max(0, this.timeLeftP2)));

            // check if time has run out
            if (this.timeLeftP1 <= 0 || this.timeLeftP2 <= 0) {
                this.gameOver = true;
                this.sound.play('sfx_gameover');
                this.add.text(this.scale.width/2, this.scale.height/2, 'GAME OVER', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
                return;
            }

            // check for victory conditions
            if (this.scoreLeft >= this.maxScore || this.scoreRight >= this.maxScore) {
                this.gameOver = true;
                this.sound.play('sfx_gameover');
                if (this.scoreLeft > this.scoreRight) {
                    this.add.text(this.scale.width/2, this.scale.height/2, 'PLAYER 1 WINS!', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
                } else {
                    this.add.text(this.scale.width/2, this.scale.height/2, 'PLAYER 2 WINS!', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
                }
                return;
            }

            // update the score display
            this.scoreLeftText.setText(this.formatScore(this.scoreLeft));
            this.scoreRightText.setText(this.formatScore(this.scoreRight));
        }
    }
}