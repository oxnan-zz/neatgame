
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
var jumping = 0;
var weapon;
var shoot;
/////////////////////

////////////////////////////
var xlistC = [100, 200];
var ylistC = [670, 400];

var xlistM = [180];
var ylistM = [700];

var crystalgroup;
var monstergroup;
////////////////////////////



function preload() {
    game.load.tilemap('tilemap', './tile-ting/tilemap.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tileset', './tile-ting/tileset.png');
    game.load.spritesheet('captain', 'assets/captain.png', 32, 32);
    game.load.image('background', 'assets/background2.png');
    game.load.image('blackback', 'assets/blacknew1.png',-3000,-3000);
    game.load.image('bullet', 'assets/bullet.png', 32, 32)
    game.load.spritesheet('monster', 'assets/monster.png',26,32);
    game.load.spritesheet('crystal', 'assets/icecrystal.png', 22, 32);
    //Loading maps resources



}

function create() {

    map = game.add.tilemap('tilemap');
    map.addTilesetImage('tileset', 'tileset');

    background = map.createLayer('1');
    ground = map.createLayer('2');

    ground.resizeWorld();
    map.setCollisionBetween(0, 1000000, true, '2');




    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.time.desiredFps = 30;

    game.physics.arcade.gravity.y = 100;

    //player///////////////////////////////////////////
    player = game.add.sprite(100, 600, 'captain');
    game.physics.arcade.enable(player);
    blackback = game.add.sprite(2048,2048,'blackback');
    game.physics.enable(blackback, Phaser.Physics.ARCADE);
    player.body.bounce.y = 0.1;

    player.body.acceleration = 0.1;

    player.body.collideWorldBounds = true;
    player.animations.add('left', [2], 10, true);
    player.animations.add('turn', [0], 20, true);
    player.animations.add('right', [1], 10, true);
    ///////////////////////////////////////////////////

    cursors = game.input.keyboard.createCursorKeys();

    //spawn shit/////////
    crystalgroup = game.add.group();
    game.physics.arcade.enable(crystalgroup);
    crystalgroup.collideWorldBounds = true;
    crystalgroup.enableBody = true;

    monstergroup = game.add.group();
    game.physics.arcade.enable(monstergroup);
    monstergroup.collideWorldBounds = true;
    monstergroup.enableBody = true;

    spawncrystals(xlistC, ylistC);
    spawnmonsters(xlistM, ylistM);
    /////////////////////

    //Weapon
    shoot = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
    weapon = game.add.weapon(1, 'bullet')

    weapon.bulletSpeed = 600;
    weapon.fireRate = 100;
    weapon.fireLimit = 5;

    weapon.bulletKillType = Phaser.Weapon.KILL_LIFESPAN;
    weapon.bulletLifespan = 500;

    // weapon.bulletLifespan = 0.1;
    weapon.trackSprite(player, 0, 0, true);
    game.physics.arcade.enable(weapon);


    game.camera.follow(player);
}

function update() {

    game.physics.arcade.collide(player, ground);
    game.physics.arcade.collide(weapon.bullets, ground, deleteBullet);

    // alignovelay(blackback)
    move();
    /////////////////////////
    game.physics.arcade.collide(crystalgroup, ground);
    game.physics.arcade.collide(crystalgroup, player);

    game.physics.arcade.collide(monstergroup, ground);
    game.physics.arcade.collide(monstergroup, player, resetGame);
    /////////////////////////

    if (shoot.isDown)
    {
        weapon.fire();
    }

}

function render() {

    // game.debug.text(game.time.suggestedFps, 32, 32);

    // game.debug.text(game.time.physicsElapsed, 32, 32);
    // game.debug.body(player);
    // game.debug.bodyInfo(player, 16, 24);

}

function deleteBullet() {
  console.log("jkjkdf")
  weapon.killAll()
}

function resetAmmo() {
  Weapon.resetShots;
}

function move(){
    player.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        player.body.velocity.x = -100;

        if (facing != 'left')
        {
            player.animations.play('left');
            facing = 'left';
        }
    }
    else if (cursors.right.isDown)
    {
        player.body.velocity.x = 100;

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
        jumping = 1;
        player.body.velocity.y = -140;
        jumpTimer = game.time.now + 750;
    }
    if (cursors.down.isDown && jumping == 1 && !player.body.onFloor()){
      jumping = 0;
      player.body.velocity.y = +140;
    }

}

function alignovelay(blackback) {
  blackback.body.x = player.body.x - (blackback.body.width/2)+(player.body.width/2);
  blackback.body.y = player.body.y - (blackback.body.height/2)+(player.body.height/2);
}
function spawnmonsters(xlistM, ylistM) {
  for (i = 0; i < xlistM.length; i++) {
    spawnmonster(xlistM[i], ylistM[i], "monster" + i);
  }
}

function spawnmonster(x, y, monstername) {
  var monster = monstergroup.create(x, y, 'monster');
}



function spawncrystals(xlistC, ylistC) {
  for (i = 0; i < xlistC.length; i++) {
    spawncrystal(xlistC[i], ylistC[i], "crystal" + i);
  }
}

function spawncrystal(x, y, crystalname){
  var crystal = crystalgroup.create(x, y, 'crystal');
}


function resetGame() {
  //player.reset(0, 0);
}
