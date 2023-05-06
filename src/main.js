/* 
Name: Daniel Do
A Dark Night
~22 hours

5-Point Tier
Add your own (copyright-free) background music to the Play scene (please be mindful of the volume) (5)
Create a new scrolling tile sprite for the background (5)
Allow the player to control the Rocket after it's fired (5)

10-Point Tier
Create 4 new explosion sound effects and randomize which one plays on impact (10)
Display the time remaining (in seconds) on the screen (10)
Create a new title screen (e.g., new artwork, typography, layout) (10)
Implement parallax scrolling for the background (10)

15-Point Tier
Create a new enemy Spaceship type (w/ new artwork) that's smaller, moves faster, and is worth more points (15)
Implement an alternating two-player mode (15)
Implement a new timing/scoring mechanism that adds time to the clock for successful hits (15)

Sources
Rain Tile Sprite: https://opengameart.org/sites/default/files/rain_drops-01.png
Gray City Background: https://www.clker.com/cliparts/w/R/a/d/9/m/gray-city-skyline-hi.png
Black City Background: https://static.vecteezy.com/system/resources/thumbnails/000/625/946/small/Black_vector_city_silhouette.jpg
Background Music: https://www.youtube.com/watch?v=5a83feE_oTI&list=PLdsGes2mFh92eHpOZVJQgoubb6rF0CcvU
*/

let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [ Menu, Play ]
}

let game = new Phaser.Game(config);

// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

// reserve keyboard vars
let keyF, keyR, keyLEFT, keyRIGHT;