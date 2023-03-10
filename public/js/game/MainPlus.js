class MainPlus {

    preload() {

        this.score=0;
        this.skin=2;
    // skin 1
            this.load.spritesheet('player-walk-1', 'img/game-assets/Dude_Monster_Walk_6.png',
            { frameWidth: 32, frameHeight: 32 });
            this.load.spritesheet('player-idle-1', 'img/game-assets/Dude_Monster_Idle_4.png',
            { frameWidth: 32, frameHeight: 32 });
    // skin 2
            this.load.spritesheet('player-walk-2', 'img/game-assets/Pink_Monster_Walk_6.png',
            { frameWidth: 32, frameHeight: 32 });
            this.load.spritesheet('player-idle-2', 'img/game-assets/Pink_Monster_Idle_4.png',
            { frameWidth: 32, frameHeight: 32 });
   // skin 3
            this.load.spritesheet('player-walk-3', 'img/game-assets/Owlet_Monster_Walk_6.png',
            { frameWidth: 32, frameHeight: 32 });
            this.load.spritesheet('player-idle-3', 'img/game-assets/Owlet_Monster_Idle_4.png',
            { frameWidth: 32, frameHeight: 32 });
            // this.load.image('tileset', '/img/game-assets/tileset.png');
            // this.load.tilemapTiledJSON('map', '/img/game-assets/map.json');
        
            this.load.image('bg1', './img/game-assets/bg1.jpg');
        this.load.image('space-cave-tileset', './img/game-assets/space-cave-tileset.png');
        this.load.tilemapTiledJSON('stepbystep', './img/game-assets/zodiacmap.json');
        this.load.spritesheet('zodiac-enemy', 'img/game-assets/enemytiles.png',
            { frameWidth: 32, frameHeight: 32, endFrame:11 });
        // this.load.image('wallH', 'img/game-assets/wallHorizontal.png');
        // this.load.image('wallV', 'img/game-assets/wallVertical.png');
        this.load.image('coin','img/game-assets/coin.png');
        this.load.image('enemy','img/game-assets/enemy.png');
        this.load.image('star', './img/game-assets/star.png');
        // load zodiac tokens

    
    }

    create(data) {

        if (data) {console.log('yes, there is data in main game');
        console.log(data);
        this.skin=data.skin;
        
        }
        // this.events.on('gameover', async () => {
        //     console.log('Game over! Score was '+score);
        //     await fetch('api/gamedata', {method: 'POST',headers: {'Content-Type': 'application/json'},
        //         body: JSON.stringify({score:this.score, currency:this.currency});
        //         })
        //     console.log('Pushed score event');
        //   });

    //     this.scale.setGameSize(500, 340);
    // this.scale.resize(800, 600);
   
       
        this.bg1 = this.add.image(-5, -5, 'bg1').setOrigin(0,0);
        this.player=this.physics.add.sprite(300, 224, 'player');
        this.enemies = this.physics.add.group();
               // this.addStars();
        this.anims.create({
            key: 'player-idle',
            frames: this.anims.generateFrameNumbers('player-idle-'.concat(this.skin), { start: 0, end: 4 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'player-walk',
            frames: this.anims.generateFrameNumbers('player-walk-'.concat(this.skin), { start: 0, end: 6 }),
            frameRate: 10,
            repeat: -1
        });

        // enemy
        this.anims.create({
            key: 'enemy-flight',
            frames: this.anims.generateFrameNumbers('zodiac-enemy', { start: 0, end: 11 }),
            frameRate: 10,
            repeat: -1
        });

        this.player.body.gravity.y=500;
        this.coin = this.physics.add.sprite(60, 130,'coin')
        this.arrow = this.input.keyboard.createCursorKeys();
        this.scoreText = this.add.text(56, 16, 'Score: 0', { font: '32px Quantico', fill: '#fff' });
        this.scoreText.setDepth(1);
        this.currencyText = this.add.text(56, 54, 'Currency Gained: 0', { font: '32px Quantico', fill: '#f00' });
        this.currencyText.setDepth(1);
        this.score=0;
        this.currency=0;
        this.createWorld();
        this.physics.add.collider(this.player, this.walls);
        // let zodiacDance=this.anims.get('enemy-flight');
        // this.enemies.children.iterate(function (child) {
        //      child.anims.animation=zodiacDance;
        //         });

        this.fancyStars = this.physics.add.group({
            key: 'star',
            repeat: 8,
            setXY: { x: 240, y: 40, stepX: 18 }
        });
        this.fancyStars.children.iterate(function (child) {

            child.enableBody(true, child.x, 0, true, true);
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
            child.setBounceX(Phaser.Math.FloatBetween(0.4, 0.8));
            child.body.velocity.x=Phaser.Math.RND.pick([-40,40]);
            child.setGravityY(150);

        });
        this.time.addEvent({
            delay:3000,
            callback:() => this.addEnemy(),
            loop:true,
        });
        
        this.events.on('gameover', this.gameOver, this);
    }
 
    update() {
    //    this.player.angle++;
       
       // this.physics.collide(this.player, this.walls);
        this.physics.collide(this.enemies, this.walls);
        if (this.physics.overlap(this.player, this.enemies)) {
            this.playerDie();
        }
       this.physics.add.collider(this.fancyStars, this.walls);
       this.physics.add.overlap(this.player, this.fancyStars, this.collectStar, null, this);
        this.movePlayer();
        if (this.player.y > 600 || this.player.y <0) {
            this.playerDie();
        }
        if (this.physics.overlap(this.player, this.coin)) {
            this.takeCoin();
        }
        this.fancyStars.children.iterate(function (child) {
            if (child.y > 500) {
                child.disableBody(true, true);
            }
        });
        let zodiacDance=this.anims.get('enemy-flight');
        this.enemies.children.iterate(function (child) {
             child.anims.play('enemy-flight', true);
                });

    }
    
    // methods
    movePlayer() {
        if (this.arrow.left.isDown) {
            this.player.setVelocityX(-160);
           // this.player.angle--;
           this.player.flipX=true;
           this.player.anims.play('player-walk', true);
        }

        else if (this.arrow.right.isDown) {
            this.player.setVelocityX(160);
            // this.player.angle++;
            this.player.flipX=false;
            this.player.anims.play('player-walk', true);
        }
        else {
            this.player.setVelocityX(0);
            this.player.anims.play('player-idle', true);
        }

      //  else {this.player.setVelocityY();}
        
        if (this.arrow.up.isDown) {
           // this.player.setVelocityY(-160);
            if (this.player.body.blocked.down) {
                this.player.setVelocityY(-320);
            }
           // this.player.angle--;
        }

        else if (this.arrow.down.isDown) {
           //this.player.setVelocityY(160);
           // this.player.angle++;
          
        }
       
    }
    
    createWorld() {
 
        this.fancyMap = this.add.tilemap('stepbystep');
        this.fancyTileset = this.fancyMap.addTilesetImage('space-cave-tileset','space-cave-tileset',
         // 16, 16,0,0
         );
        this.walls = this.fancyMap.createStaticLayer('Ground', this.fancyTileset)
    // the player will collide with this layer
        this.walls.setCollisionByExclusion([-1]);


    } // create world

    async gameOver() {
        {
            console.log('Game over! Score was '+this.score);
            await fetch('api/gamedata', {method: 'POST',headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({score:this.score, currency:this.currency})
                })
            console.log('Pushed score event');
          }

    }
    playerDie() {
        this.events.emit('gameover');
        this.scene.start('intro', {score:this.score})
    }
    takeCoin() {
        this.currency=this.currency+1;
        this.score=this.score+10;
        this.currencyText.setText('Currency Gained: '+this.currency);
        this.scoreText.setText('Score: '+this.score);
        this.updateCoinPosition();
    }
    addEnemy() {
    let enemy = this.enemies.create(Phaser.Math.RND.pick([250,350]), -10, 'zodiac-enemy');
    // enemy.setTint(200, 0, 0);
    enemy.body.gravity.y=500;
    enemy.body.velocity.x=Phaser.Math.RND.pick([-120,120]);
    enemy.body.bounce.x = 1;

    this.time.addEvent({delay:9000, callback:()=>enemy.destroy()});
    }
    updateCoinPosition() {
        // let positions = [
        //     {x: 496, y:54},
        //     {x: 96, y:368},
        //     {x: 672, y:400},
        //     {x: 576, y:160},
        //     {x: 80, y:528},
        //     {x: 370, y:300}
        // ]
        let tileCoords = [ 
            {x: 10, y:11},
            {x: 22, y:18},
            {x: 44, y:15},
            {x: 35, y:11},
            {x: 28, y:32},
            {x: 19, y:29},
            {x: 39, y:20},
            {x: 47, y:33},
        ]   

        let positions=tileCoords.map(obj => ({ x: (obj.x-1) * 16, y: (obj.y-1) * 16 }));
        positions=positions.filter(coin => coin.x !== this.coin.x);
        let newPosition=Phaser.Math.RND.pick(positions);
        this.coin.setPosition(newPosition.x, newPosition.y);
        // this.coin.type=Phaser.Math.RND.pick()
        // assign zodiacs
    }
    // addStars() {
    //     this.stars = this.physics.add.group({
    //         key: 'star',
    //         repeat: 11,
    //         setXY: { x: 12, y: 0, stepX: 70 }
    //     });
    //     this.stars.children.iterate(function (child) {
    //         child.body.gravity.y=500;
    //         //  Give each star a slightly different bounce
    //         child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

    //     });

    // }
    collectStar(player, star)
    {
        star.disableBody(true, true);

        //  Add and update the score
        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);
        console.log('starcount');
        console.log(this.fancyStars.countActive(true));
        if (this.fancyStars.countActive(true) === 0)
        {
            
            console.log('out of stars');
            this.fancyStars.children.iterate(function (child) {

                child.enableBody(true, child.x, 0, true, true);
                child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
                child.setBounceX(Phaser.Math.FloatBetween(0.4, 0.8));
            child.body.velocity.x=Phaser.Math.RND.pick([-40,40]);
                child.setGravityY(150);

            });

            // let x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

            // let bomb = bombs.create(x, 16, 'bomb');
            // bomb.setBounce(1);
            // bomb.setCollideWorldBounds(true);
            // bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
            // bomb.allowGravity = false;

        }
    }
}