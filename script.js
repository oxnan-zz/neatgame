
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

//Setting vars////////
var backgroundLayer;
var groundLayer;
var map;
var bg;
/////////////////////

//player vars////////
var player;
var facing = 'right';
var jumpTimer = 0;
var cursors;
var jumpButton;
var blackback;



function preload() {
    game.load.tilemap('tilemap', './tile-ting/tilemap.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tileset', './tile-ting/tileset.png');
    game.load.spritesheet('captain', 'assets/captain.png', 32, 32);
    game.load.image('background', 'assets/background2.png');
    game.load.image('blackback', 'assets/black.png');

    //Loading maps resources



}


////////////////////

//monster vars//////

////////////////////

function create() {

    map = game.add.tilemap('tilemap');
    map.addTilesetImage('tileset', 'tileset');

    background = map.createLayer('1');
    ground = map.createLayer('2');

    ground.resizeWorld();
    map.setCollisionBetween(0, 1000000, true, '2');
    



    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.time.desiredFps = 30;

    game.physics.arcade.gravity.y = 200;

    //player///////////////////////////////////////////
    player = game.add.sprite(100, 600, 'captain');
    game.physics.arcade.enable(player);
    blackback = game.add.sprite(2048,2048,'blackback');
    game.physics.enable(blackback, Phaser.Physics.ARCADE);
    player.body.bounce.y = 0.2;
        
    player.body.acceleration = 0.1;

    player.body.collideWorldBounds = true;
    player.animations.add('left', [2], 10, true);
    player.animations.add('turn', [0], 20, true);
    player.animations.add('right', [1], 10, true);
    ///////////////////////////////////////////////////

    cursors = game.input.keyboard.createCursorKeys();

    game.camera.follow(player);
}

function update() {

    game.physics.arcade.collide(player, ground);
    blackback.body.x = player.body.x - (blackback.body.width/2)+(player.body.width/2);
    blackback.body.y = player.body.y - (blackback.body.height/2)+(player.body.height/2);
    alignovelay(blackback)
    move()

}

function render() {

    game.debug.text(game.time.suggestedFps, 32, 32);

    // game.debug.text(game.time.physicsElapsed, 32, 32);
    // game.debug.body(player);
    // game.debug.bodyInfo(player, 16, 24);

}

function createLevelMap(level) {
  map = game.add.tilemap('tilemap' + level);
  map.addTilesetImage('tileset' + level, level);

  backgroundLayer = map.createLayer('Background');
  groundLayer = map.createLayer('Ground');

  map.setCollisionBetween(1, 100000, true, 'Ground');
}

function move(){
    player.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        player.body.velocity.x = -150;

        if (facing != 'left')
        {
            player.animations.play('left');
            facing = 'left';
        }
    }
    else if (cursors.right.isDown)
    {
        player.body.velocity.x = 150;

        if (facing != 'right')
        {
            player.animations.play('right');
            facing = 'right';
        }
    }
    else
    {
        if (facing != 'idle')
        {
            player.animations.stop();

            if (facing == 'left')
            {
                player.frame = 0;
            }
            else
            {
                player.frame = 5;
            }

            facing = 'idle';
        }
    }

    if (cursors.up.isDown && player.body.onFloor() && game.time.now > jumpTimer)
    {
        player.body.velocity.y = -250;
        jumpTimer = game.time.now + 750;
    }
    if (cursors.down.isDown && !player.body.onFloor()){
      currentYvelocity = player.body.velocity.y;
      player.body.velocity.y = +250;
    } 
}
function alignovelay(blackback) {

}

function monsteradd(x, y, name, boundsleft, boundsright) {
  name = game.add.sprite(32, 32, 'monster');
  game.physics.enable(name, Phaser.Physics.ARCADE);
}
