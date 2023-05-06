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
        this.load.image('rainTile', './assets/rainTile.png');
        this.load.image('backCity', './assets/backCity.png');
        this.load.image('frontCity', './assets/frontCity.png');
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
    }

    // initialize class members and objects
    create() {
        
        this.explosion1 = new Audio('./assets/explosion1.mp3');
        this.explosion2 = new Audio('./assets/explosion2.mp3');
        this.explosion3 = new Audio('./assets/explosion3.mp3');
        this.explosion4 = new Audio('./assets/explosion4.mp3');

        this.journey = new Audio('./assets/journey.mp3');
        this.journey.play();

        // create a flag that tracks the player's turn
        this.isPlayer1 = true;
        this.currentPlayer = 1;

        // create a flag that indicates if the game is over
        this.gameOver = false;

        // create a clock that will count down from 60 seconds
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', gameOverConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← to Menu', restartConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);

        // create a score for each player
        this.p1Score = 0;
        this.p2Score = 0;

        // create a timer to track the time left for each player
        this.timeLeftP1 = game.settings.gameTimer;
        this.timeLeftP2 = game.settings.gameTimer;
        this.timeAdd = 5000;

        this.maxScore = 300;

        // create a text object to display the scores
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        let gameOverConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 200
        }
        let restartConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 600
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig).setDepth(1);
        this.scoreRight = this.add.text(game.config.width - borderUISize - borderPadding - scoreConfig.fixedWidth, borderUISize + borderPadding*2, this.p2Score, scoreConfig).setDepth(1);
        this.timeLeftTextP1 = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*8, this.timeLeftP1, scoreConfig).setDepth(1);
        this.timeLeftTextP2 = this.add.text(game.config.width - borderUISize - borderPadding - scoreConfig.fixedWidth, borderUISize + borderPadding*8, this.timeLeftP2, scoreConfig).setDepth(1);
        this.currentPlayerText = this.add.text(((game.config.width - borderUISize - borderPadding - scoreConfig.fixedWidth) + (borderUISize + borderPadding)) / 2, ((borderUISize + borderPadding*2) + (borderUISize + borderPadding*2)) / 2, this.currentPlayer, scoreConfig).setDepth(1);

        // create the tile backgrounds
        this.rainTile = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'rainTile').setOrigin(0, 0);
        this.backCity = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'backCity').setOrigin(0, 0);
        this.frontCity = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'frontCity').setOrigin(0, 0);

        // add a rocket (player 1 & 2)
        this.rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);

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
        let instructions = "Use ←→ arrows to move & (F) to fire";
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

        // initialize difficulty level
        this.difficulty = 1;
    }

    // helper method to check for collision between two objects
    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width && 
            rocket.x + rocket.width > ship.x && 
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship. y) {
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
    // function to format time in MM:SS format
    formatTime(seconds) {
        let minutes = Math.floor(seconds / 1000);
        let remainingSeconds = seconds % 1000;
        let formattedTime = '';

        if (minutes < 10) {
            formattedTime += '0';
        }
        formattedTime += minutes.toString() + ':';

        if (remainingSeconds < 10) {
            formattedTime += '0';
        }
        formattedTime += remainingSeconds.toString();

        return formattedTime;
    }

    update(time, delta) {
        // check for game over state
        if (!this.gameOver) {
            // update the rocket and spaceships
            this.rocket.update();
            this.smallShip01.update();
            this.smallShip02.update();
            this.smallShip03.update();
            this.ship01.update();
            this.ship02.update();
            this.ship03.update();

            if (this.clock.elapsed <= 30000) {
                this.smallShip01.moveSpeed * 1.5;
                this.smallShip02.moveSpeed * 1.5;
                this.smallShip03.moveSpeed * 1.5;
                this.ship01.moveSpeed * 1.5;
                this.ship02.moveSpeed * 1.5;
                this.ship03.moveSpeed * 1.5;
            }

            // check for collisions between the rocket and spaceships
            // player 1
            if (this.checkCollision(this.rocket, this.smallShip01)) {
                this.rocket.reset();
                this.smallShip01.reset();
                this.shipExplode(this.smallShip01);
                if (!this.isPlayer1) {
                    this.isPlayer1 = true;
                    this.p2Score += this.smallShip01.points;
                    this.timeLeftP2 += this.timeAdd;
                    this.clock.elapsed += this.timeAdd;
                    this.scoreRight.text = this.p2Score;
                    this.timeLeftTextP2.text = this.timeLeftP2;
                } else {
                    this.isPlayer1 = false;
                    this.p1Score += this.smallShip01.points;
                    this.timeLeftP1 += this.timeAdd;
                    this.clock.elapsed += this.timeAdd;
                    this.scoreLeft.text = this.p1Score;
                    this.timeLeftTextP1.text = this.timeLeftP1;
                }
            }

            if (this.checkCollision(this.rocket, this.smallShip02)) {
                this.rocket.reset();
                this.smallShip02.reset();
                this.shipExplode(this.smallShip02);
                if (!this.isPlayer1) {
                    this.isPlayer1 = true;
                    this.p2Score += this.smallShip02.points;
                    this.timeLeftP2 += this.timeAdd;
                    this.clock.elapsed += this.timeAdd;
                    this.scoreRight.text = this.p2Score;
                    this.timeLeftTextP2.text = this.timeLeftP2;
                } else {
                    this.isPlayer1 = false;
                    this.p1Score += this.smallShip02.points;
                    this.timeLeftP1 += this.timeAdd;
                    this.clock.elapsed += this.timeAdd;
                    this.scoreLeft.text = this.p1Score;
                    this.timeLeftTextP1.text = this.timeLeftP1;
                }
            }

            if (this.checkCollision(this.rocket, this.smallShip03)) {
                this.rocket.reset();
                this.smallShip03.reset();
                this.shipExplode(this.smallShip03);
                if (!this.isPlayer1) {
                    this.isPlayer1 = true;
                    this.p2Score += this.smallShip03.points;
                    this.timeLeftP2 += this.timeAdd;
                    this.clock.elapsed += this.timeAdd;
                    this.scoreRight.text = this.p2Score;
                    this.timeLeftTextP2.text = this.timeLeftP2;
                } else {
                    this.isPlayer1 = false;
                    this.p1Score += this.smallShip03.points;
                    this.timeLeftP1 += this.timeAdd;
                    this.clock.elapsed += this.timeAdd;
                    this.scoreLeft.text = this.p1Score;
                    this.timeLeftTextP1.text = this.timeLeftP1;
                }
            }

            if (this.checkCollision(this.rocket, this.ship01)) {
                this.rocket.reset();
                this.ship01.reset();
                this.shipExplode(this.ship01);
                if (!this.isPlayer1) {
                    this.isPlayer1 = true;
                    this.p2Score += this.ship01.points;
                    this.timeLeftP2 += this.timeAdd;
                    this.clock.elapsed += this.timeAdd;
                    this.scoreRight.text = this.p2Score;
                    this.timeLeftTextP2.text = this.timeLeftP2;
                } else {
                    this.isPlayer1 = false;
                    this.p1Score += this.ship01.points;
                    this.timeLeftP1 += this.timeAdd;
                    this.clock.elapsed += this.timeAdd;
                    this.scoreLeft.text = this.p1Score;
                    this.timeLeftTextP1.text = this.timeLeftP1;
                }
            }

            if (this.checkCollision(this.rocket, this.ship02)) {
                this.rocket.reset();
                this.ship02.reset();
                this.shipExplode(this.ship02);
                if (!this.isPlayer1) {
                    this.isPlayer1 = true;
                    this.p2Score += this.ship02.points;
                    this.timeLeftP2 += this.timeAdd;
                    this.clock.elapsed += this.timeAdd;
                    this.scoreRight.text = this.p2Score;
                    this.timeLeftTextP2.text = this.timeLeftP2;
                } else {
                    this.isPlayer1 = false;
                    this.p1Score += this.ship02.points;
                    this.timeLeftP1 += this.timeAdd;
                    this.clock.elapsed += this.timeAdd;
                    this.scoreLeft.text = this.p1Score;
                    this.timeLeftTextP1.text = this.timeLeftP1;
                }
            }

            if (this.checkCollision(this.rocket, this.ship03)) {
                this.rocket.reset();
                this.ship03.reset();
                this.shipExplode(this.ship03);
                if (!this.isPlayer1) {
                    this.isPlayer1 = true;
                    this.p2Score += this.ship03.points;
                    this.timeLeftP2 += this.timeAdd;
                    this.clock.elapsed += this.timeAdd;
                    this.scoreRight.text = this.p2Score;
                    this.timeLeftTextP2.text = this.timeLeftP2;
                } else {
                    this.isPlayer1 = false;
                    this.p1Score += this.ship03.points;
                    this.timeLeftP1 += this.timeAdd;
                    this.clock.elapsed += this.timeAdd;
                    this.scoreLeft.text = this.p1Score;
                    this.timeLeftTextP1.text = this.timeLeftP1;
                }
            }

            // update the rainTile background
            this.rainTile.tilePositionY -= 4;
            this.backCity.tilePositionX -= 3;
            this.frontCity.tilePositionX -= 2;

            // update the timer
            this.timeLeftP1 -= delta;
            this.timeLeftP2 -= delta;

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

            // switch players if the time is up for one of them
            if (this.timeLeftP1 <= 0 || this.timeLeftP2 <= 0) {
                this.isPlayer1 = !this.isPlayer1;
                this.resetRocket(this.rocket);
                if (this.rocket) {
                    this.rocket.visible = this.isPlayer1;
                }
                if (this.ship01) {
                    this.ship01.reset();
                }
                if (this.ship02) {
                    this.ship02.reset();
                }
                if (this.ship03) {
                    this.ship03.reset();
                }
            }
            // update the current player text
            if (this.isPlayer1) {
                this.timeLeftTextP1.text = this.formatTime(Math.max(0, this.timeLeftP1));
                this.currentPlayerText.text = 'P1';
            } else {
                this.timeLeftTextP2.text = this.formatTime(Math.max(0, this.timeLeftP2));
                this.currentPlayerText.text = 'P2';
            }
        } else {
            // check key input for restart / menu
            if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
                this.scene.restart();
            }

            if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
                this.scene.start("menuScene");
            }
        }
    }
    shipExplode(ship) {
        // temporarily hide ship
        ship.alpha = 0;                         
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after anim completes
            ship.reset();                         // reset ship position
            ship.alpha = 1;                       // make ship visible again
            boom.destroy();                       // remove explosion sprite
        });
        this.randomSound = Math.floor(Math.random() * 4);
        if (this.randomSound == 0) {
            this.explosion1.play();
        }
        if (this.randomSound == 1) {
            this.explosion2.play();
        }
        if (this.randomSound == 2) {
            this.explosion3.play();
        }
        if (this.randomSound == 3) {
            this.explosion4.play();
        }
      }
}