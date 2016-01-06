var myGame = new Kiwi.Game("GameContainer","Game",myState,{plugins:["LEAPController"]});
var myState = new Kiwi.State('myState');
var loadingState = new Kiwi.State('loadingState');
var preloader = new Kiwi.State('preloader');
var lose = new Kiwi.State('lose');
var win = new Kiwi.State('win');
var start = new Kiwi.State('start');
var s;
var allSpeed = 2;
var eatNum = 0;

myState.preload = function(){
	Kiwi.State.prototype.preload.call(this);
}

myState.create = function(){

	this.control = Kiwi.Plugins.LEAPController.createController();

	this.ground = new Platform(this, 0, 505);	

	this.bombGroup = new Kiwi.Group(this);

	//////////////////////////////
	//Parallax Environment Groups
	this.grassGroup = new Kiwi.Group(this);
	this.bg1 = new Kiwi.Group(this);
	this.bg2 = new Kiwi.Group(this);
	this.bg3 = new Kiwi.Group(this);
	this.bg4 = new Kiwi.Group(this);
	this.bg5 = new Kiwi.Group(this);
	this.bg6 = new Kiwi.Group(this);
	this.bg7 = new Kiwi.Group(this);

	this.bombDropped = false;
	
	this.missileGroup = new Kiwi.Group(this);
	this.explodeGroup = new Kiwi.Group(this);
	

	///////////////////
	//Plane and Bomb Door
	this.plane = new Airplane(this,this.textures['sw'], 250, 20);
	
	/////////////////////////
	//Timers for enemy spawns
	this.timer = this.game.time.clock.createTimer('spawnTroop', .5, -1, true);
	this.timerEvent = this.timer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_COUNT, this.spawnMissile, this);
	this.timerEvent = this.timer.createTimerEvent(Kiwi.Time.TimerEvent.TIMER_COUNT, this.onTimerCount, this);
	this.timerCount = 0;

	/////////////////////////
	//PauseImage
	this.pauseImage = new Kiwi.GameObjects.StaticImage(this, this.textures['pauseImage'], 0, 0);


  	////////////////////////
  	//Creating parallax bacground assets  
    for(var i = 0; i < 20; i++){//grass
    	this.grassGroup.addChild(new Kiwi.GameObjects.Sprite(this, this.textures['grass'], i * 48, 504, true));
    	this.grassGroup.addChild(new Kiwi.GameObjects.Sprite(this, this.textures['dirt'], i * 48, 552, true));
    }
    for(var i = 0; i < 4; i++){
    	this.bg7.addChild(new Kiwi.GameObjects.Sprite(this, this.textures['bg7'], i*434, 0, true));//bg7
    }    
    for(var i = 0; i < 5; i++){
    	this.bg6.addChild(new Kiwi.GameObjects.Sprite(this, this.textures['bg6'], i*800, 0, true));//bg6
    }    
    for(var i = 0; i < 10; i++){
    	this.bg5.addChild(new Kiwi.GameObjects.Sprite(this, this.textures['bg5'], i*96, 253, true));//bg5
    	this.bg4.addChild(new Kiwi.GameObjects.Sprite(this, this.textures['bg4'], i*96, 279, true));//bg4
    }    
    for(var i = 0; i < 3; i++){
    	this.bg3.addChild(new Kiwi.GameObjects.Sprite(this, this.textures['bg3'], i*460, 305, true));//bg3
    	this.bg2.addChild(new Kiwi.GameObjects.Sprite(this, this.textures['bg2'], i*460, 335, true));//bg2
   		this.bg1.addChild(new Kiwi.GameObjects.Sprite(this, this.textures['bg1'], i*1143, 400, true));//bg1
   	}
    //Background
    this.addChild(this.ground);
    this.addChild(this.bg7);
    this.addChild(this.bg6);
    this.addChild(this.bg5);
    this.addChild(this.bg4);
    this.addChild(this.bg3);
    this.addChild(this.bg2);
    this.addChild(this.bg1);

    //
    this.addChild(this.missileGroup);
    this.addChild(this.plane);
    this.addChild(this.explodeGroup);

    //Foreground
    this.addChild(this.grassGroup);
    this.addChild(this.pauseImage);

    //Audio
	this.yell = new Kiwi.Sound.Audio(this.game, 'yell', 1, false);
	this.yame = new Kiwi.Sound.Audio(this.game, 'yame', 1, false);
	this.pin = new Kiwi.Sound.Audio(this.game, 'pin', 1, false);
	this.speed1 = new Kiwi.Sound.Audio(this.game, 'speed1', 1, false);
	this.speed2 = new Kiwi.Sound.Audio(this.game, 'speed2', 1, false);
	this.speed3 = new Kiwi.Sound.Audio(this.game, 'speed3', 1, false);
	this.speed4 = new Kiwi.Sound.Audio(this.game, 'speed4', 1, false);
	this.speed5 = new Kiwi.Sound.Audio(this.game, 'speed5', 1, false);
	this.music = new Kiwi.Sound.Audio(this.game, 'music', 1, true);
	this.music.play();

	//scorebar
	this.healthBar = new Kiwi.HUD.Widget.Bar ( this.game, 700, 1000, 10, 10, 780, 15);
    this.healthBar.bar.style.backgroundColor = '#F00';
    this.healthBar.style.backgroundColor = '#000';
	this.game.huds.defaultHUD.addWidget( this.healthBar );

	this.score = new Kiwi.HUD.Widget.BasicScore( this.game, 50, 50, 0 );
	this.score.counter.current = 1500;

	//Text
}

myState.onTimerCount = function () {
	this.timerCount += 1;
	if(!(this.timerCount%10)){
		allSpeed+= 1.2; //level up
		var speedNum = Math.floor(Math.random()*5 + 1)
			switch(speedNum){
				case 1: this.speed1.play('default', true); break;
				case 2: this.speed2.play('default', true); break;
				case 3: this.speed3.play('default', true); break;
				case 4: this.speed4.play('default', true); break;
				case 5: this.speed5.play('default', true); break;
				default: this.speed1.play('default', true); break;
			}
	}
	if(this.plane.animation.currentAnimation.name == 'walk' && this.timerCount%3==0) {
		this.plane.animation.play('happy');
	}
}

myState.update = function(){
	Kiwi.State.prototype.update.call(this);
	//console.log(this.control.hands[0].posY);

	if(this.control.controllerConnected){
		//console.log("ControllerConnected");
		this.pauseImage.alpha = 0;


		this.control.update();
		this.plane.x = (this.control.hands[0].posX* 1.7) + 200;
		this.plane.y =((-1 * this.control.hands[0].posY)*1.7) + 600;

	//手細節effect
	// this.plane.scaleX = this.control.hands[0].posZ /250;
	// this.plane.scaleY = this.control.hands[0].posZ / 250;
	// this.plane.rotation = -1 * (this.control.hands[0].palmNormalX);
	///

	if(this.game.input.isDown){
		//console.log(this.control.currentHand);
		this.game.input.reset();
	}

	this.healthBar.counter.current = ( this.score.counter.current / 2000 ) * this.healthBar.counter.max;
	this.checkScore();
	this.updateParallax();
	this.checkMissiles();
	} else {
		this.pauseImage.alpha = 1;
	}
}


myState.checkScore = function(){
	if(eatNum >= 100){
		this.game.states.switchState('win');
		this.healthBar.style.backgroundColor = '';
	}
	if(this.score.counter.current <= 0){
		this.game.states.switchState('lose');
    	this.healthBar.style.backgroundColor = '';
	}
}

lose.preload = function(){
    this.addImage('loseImage', 'assets/lose.gif')
}

lose.update = function(){
    Kiwi.State.prototype.update.call(this);
}

lose.create = function(){
	this.loseImage = new Kiwi.GameObjects.StaticImage(this, this.textures['loseImage'], 0, 0);
	this.addChild(this.loseImage);
	this.loseImage.alpha = 1;

	this.text = new Kiwi.GameObjects.Textfield( this, "You ate " + eatNum + " Person.", 90, 340, "#FFF", 32, 'normal', 'Courier' );
	this.addChild( this.text );
    
    this.myButton = new Kiwi.HUD.Widget.Button( this.game, 'RESTART', 290, 420 );
    this.game.huds.defaultHUD.addWidget( this.myButton );

    this.myButton.style.color = 'white';
    this.myButton.style.fontSize = '2em';
    this.myButton.style.fontWeight = 'bold';
    this.myButton.style.padding = '0.5em 1em';
    this.myButton.style.backgroundColor = 'black';
    this.myButton.style.cursor = 'pointer';
    this.myButton.style.fontFamily = 'Courier';

    this.myButton.input.onDown.add( this.buttonPressed, this );
    this.myButton.input.onUp.add( this.buttonReleased, this );

    this.myButton.input.onOver.add( this.buttonOver, this );
    this.myButton.input.onOut.add( this.buttonOut, this );
}

lose.buttonPressed = function() {
    this.myButton.y = 435;
	window.location.reload();
}

lose.buttonReleased = function() {
    this.myButton.y = 430;
	console.log('button pressed');
}

lose.buttonOver = function() {
    this.myButton.style.backgroundColor = 'green';
}

lose.buttonOut = function() {
    this.myButton.style.backgroundColor = 'black';
}

win.preload = function(){
    this.addImage('winImage', 'assets/win.png')
}

win.update = function(){
    Kiwi.State.prototype.update.call(this);
}

win.create = function(){
	this.winImage = new Kiwi.GameObjects.StaticImage(this, this.textures['winImage'], 0, 0);
	this.addChild(this.winImage);
	this.winImage.alpha = 1;

	this.text = new Kiwi.GameObjects.Textfield( this, "ATE", 360, 65, "#FFF", 38, 'normal', 'Courier' );
	this.text1 = new Kiwi.GameObjects.Textfield( this, eatNum, 358, 103, "#FF0", 38, 'bold', 'Courier' );
	this.text2 = new Kiwi.GameObjects.Textfield( this, " Person", 305, 141, "#FF0", 38, 'normal', 'Courier' );
	this.addChild( this.text );
	this.addChild( this.text1 );
	this.addChild( this.text2 );
    
    this.myButton = new Kiwi.HUD.Widget.Button( this.game, 'RESTART', 330, 390 );
    this.game.huds.defaultHUD.addWidget( this.myButton );

    this.myButton.style.color = 'white';
    this.myButton.style.fontSize = '2em';
    this.myButton.style.fontWeight = 'bold';
    this.myButton.style.padding = '0.5em 1em';
    this.myButton.style.backgroundColor = 'black';
    this.myButton.style.cursor = 'pointer';
    this.myButton.style.fontFamily = 'Courier';

    this.myButton.input.onDown.add( this.buttonPressed, this );
    this.myButton.input.onUp.add( this.buttonReleased, this );

    this.myButton.input.onOver.add( this.buttonOver, this );
    this.myButton.input.onOut.add( this.buttonOut, this );
}

win.buttonPressed = function() {
    this.myButton.y = 435;
	window.location.reload();
}

win.buttonReleased = function() {
    this.myButton.y = 430;
	console.log('button pressed');
}

win.buttonOver = function() {
    this.myButton.style.backgroundColor = 'green';
}

win.buttonOut = function() {
    this.myButton.style.backgroundColor = 'black';
}


myState.checkMissiles = function(){
	var bombs = this.bombGroup.members;
	var missiles = this.missileGroup.members;

		for (var j = 0; j < missiles.length; j++){ //collides with enemy
			if(this.plane.physics.overlaps(missiles[j])){
				eatNum ++;
				missiles[j].health --;
				var yellNum = Math.floor(Math.random()*3 + 1)
				switch(yellNum){
					case 1: this.pin.play('default', true); break;
					case 2: this.yell.play('default', true); break;
					case 3: this.yame.play('default', true); break;
					default: this.yell.play('default', true); break;
				}
				
				this.plane.animation.play('walk');
				
				this.explodeGroup.addChild(new Explosion(this, missiles[j].x-30, missiles[j].y-70, missiles[j].enemyTexture));
				missiles[j].destroy();
				this.score.counter.current += 10;

				break;
			}
			if(missiles[j].x < -200){
				missiles[j].destroy();
				break;
			}
		}
}

myState.spawnMissile = function(){
	if(this.control.controllerConnected){
		var enemyNum = Math.floor(Math.random()*19 + 1);
		var enemyTexture, speed;
		switch(enemyNum){
			case 1: enemyTexture = '1'; speed = allSpeed; break;
			case 2: enemyTexture = '2'; speed = allSpeed; break;
			case 3: enemyTexture = '3'; speed = allSpeed; break;
			case 4: enemyTexture = '4'; speed = allSpeed; break;
			case 5: enemyTexture = '5'; speed = allSpeed; break;
			case 6: enemyTexture = '6'; speed = allSpeed; break;
			case 7: enemyTexture = '7'; speed = allSpeed; break;
			case 8: enemyTexture = '8'; speed = allSpeed; break;
			case 9: enemyTexture = '9'; speed = allSpeed; break;
			case 10: enemyTexture = '10'; speed = 2.5 * allSpeed; break;
			case 11: enemyTexture = '11'; speed = allSpeed; break;
			case 12: enemyTexture = '12'; speed = allSpeed; break;
			case 13: enemyTexture = '13'; speed = allSpeed; break;
			case 14: enemyTexture = '14'; speed = allSpeed; break;
			case 15: enemyTexture = '15'; speed = allSpeed; break;
			case 16: enemyTexture = '16'; speed = allSpeed; break;
			case 17: enemyTexture = '17'; speed = allSpeed; break;
			case 18: enemyTexture = '18'; speed = 1.5 * allSpeed; break;
			case 19: enemyTexture = '19'; speed = 0.75 * allSpeed; break;
			default: enemyTexture = '1'; speed = allSpeed; break;
		}
		s = new EnemyMissile(this, this.game.stage.width + 50, Math.random() * 450, enemyTexture, speed);
		this.missileGroup.addChild(s);
		if(this.score.counter.current > 0) {this.score.counter.current -= 18;}
	}	

}

myState.updateParallax = function(){
	//Ground
	for(var i =0; i < this.grassGroup.members.length;i++){
		this.grassGroup.members[i].transform.x -= 10;		
		if(this.grassGroup.members[i].transform.worldX <= -48){
			this.grassGroup.members[i].transform.x = 48*19;
		}
	}
	//bg1
	for(var i =0; i < this.bg1.members.length;i++){
		this.bg1.members[i].transform.x -= 0.5*allSpeed; //速度		
		if(this.bg1.members[i].transform.worldX <= -1143){
			this.bg1.members[i].transform.x = 1143* (this.bg1.members.length - 1) ;
		}
	}
	//bg2
	for(var i =0; i < this.bg2.members.length;i++){
		this.bg2.members[i].transform.x -= 4*allSpeed;		
		if(this.bg2.members[i].transform.worldX <= -460){
			this.bg2.members[i].transform.x = 460*(this.bg2.members.length - 1);
		}
	}
	//bg3
	for(var i =0; i < this.bg3.members.length;i++){
		this.bg3.members[i].transform.x -= 3*allSpeed;		
		if(this.bg3.members[i].transform.worldX <= -460){
			this.bg3.members[i].transform.x = 460*(this.bg3.members.length - 1);
		}
	}
	//bg4
	for(var i =0; i < this.bg4.members.length;i++){
		this.bg4.members[i].transform.x -= 2;
		if(this.bg4.members[i].transform.worldX <= -96){
			this.bg4.members[i].transform.x = 96*(this.bg4.members.length - 1);
		}
	}
	//bg5
	for(var i =0; i < this.bg4.members.length;i++){
		this.bg5.members[i].transform.x -= 2;
		if(this.bg5.members[i].transform.worldX <= -96){
			this.bg5.members[i].transform.x = 96*(this.bg5.members.length - 1);
		}
	}
	
	//bg7
	for(var i =0; i < this.bg7.members.length;i++){
		this.bg7.members[i].transform.x -= 2;		
		if(this.bg7.members[i].transform.worldX <= -434){
			this.bg7.members[i].transform.x = 434*(this.bg7.members.length - 1);
		}
	}
}




////////////////////////////////////////
//CLASSES


var Airplane = function(state, x, y){
	Kiwi.GameObjects.Sprite.call(this, state, state.textures['sw'], x, y, true);

	//this.box.hitbox = new Kiwi.Geom.Rectangle(30, 80, 130, 40);
	this.physics = this.components.add(new Kiwi.Components.ArcadePhysics(this, this.box));

	this.animation.add('walk', [1,2,3,4,5,6], 0.1, true);    
	this.animation.add('happy', [7,8,9,10,11], 0.1, true);
	this.animation.play('happy');

	this.scaleX = 0.5;
	this.scaleY = 0.5;

	Airplane.prototype.update = function(){
		Kiwi.GameObjects.Sprite.prototype.update.call(this);
		//Update ArcadePhysics
		this.physics.update();
	}	
}
Kiwi.extend(Airplane,Kiwi.GameObjects.Sprite);


var Platform = function (state, x, y){
	Kiwi.GameObjects.Sprite.call(this, state, state.textures['ground'], x, y, true);
	this.physics = this.components.add(new Kiwi.Components.ArcadePhysics(this, this.box));
	this.physics.immovable = true;

	Platform.prototype.update = function(){
		Kiwi.GameObjects.Sprite.prototype.update.call(this);
		this.physics.update();
	}

}
Kiwi.extend(Platform,Kiwi.GameObjects.Sprite);

var EnemyMissile = function (state, x, y, enemyTexture, speed){
	Kiwi.GameObjects.Sprite.call(this, state, state.textures[enemyTexture], x, y);
	this.enemyTexture = enemyTexture;
	this.speed = speed;

	this.animation.add('walk', [0,1,2,3,4,5,6], 0.1, true, true);
	this.animation.play('walk');

	//this.box.hitbox = new Kiwi.Geom.Rectangle(50, 34, 50, 84);	
	this.physics = this.components.add(new Kiwi.Components.ArcadePhysics(this, this.box));
	this.health = 1;
	this.scaleX = 0.5;
	this.scaleY = 0.5;

	EnemyMissile.prototype.update = function(){
		Kiwi.GameObjects.Sprite.prototype.update.call(this);
		this.physics.update();

		//速度
		this.x -= this.speed;

		if(this.health <= 0){
			this.destroy();
		}

		if (this.x < -100){
			this.destroy();
		}
	}
}
Kiwi.extend(EnemyMissile,Kiwi.GameObjects.Sprite);






var Explosion = function (state, x, y, enemyTexture){
	Kiwi.GameObjects.Sprite.call(this, state, state.textures[enemyTexture], x, y);
	this.animation.add('explode', [7,8,9,10,11,12,13], 0.1, false);
	this.animation.play('explode');
	//console.log('explode');

	this.scaleX = 0.5;
	this.scaleY = 0.5;

	Explosion.prototype.update = function(){
		Kiwi.GameObjects.Sprite.prototype.update.call(this);
		this.x -= 2;
		if(this.animation.currentCell == 4){
			this.destroy();
		}
	}
}
Kiwi.extend(Explosion,Kiwi.GameObjects.Sprite);



//////////////////////////////////////////////////////
//LOADING ASSETS
preloader.preload = function(){
    Kiwi.State.prototype.preload.call(this);
    this.addImage('loadingImage', 'assets/loadingImage.png', true);
}

preloader.create = function(){
    Kiwi.State.prototype.create.call(this);
    this.game.states.switchState('loadingState');
}

loadingState.preload = function(){
    Kiwi.State.prototype.preload.call(this);
    this.game.states.rebuildLibraries();
    this.game.stage.color = '#E0EDF1';
    
    this.logo = new Kiwi.GameObjects.StaticImage(this, this.textures['loadingImage'], 150, 50);
    
    this.addChild(this.logo);

    this.logo.alpha = 0;
    this.tweenIn = new Kiwi.Animations.Tween;
    this.tweenIn = this.game.tweens.create(this.logo);
    this.tweenIn.to({ alpha: 1 }, 1000, Kiwi.Animations.Tweens.Easing.Linear.None, false);
    this.tweenIn.start();

    ////////////////
    //ASSETS TO LOAD
///////////////////////////////////////
	//Environment Assets
	this.addImage('ground', 'assets/ground.png');
	// this.addImage('grass', 'assets/ground-tiles/grass.png');
	// this.addImage('dirt', 'assets/ground-tiles/dirt.png');
	this.addImage('bg1', 'assets/bg-layers/giant4.gif');
	this.addImage('bg2', 'assets/bg-layers/2.png');
	this.addImage('bg3', 'assets/bg-layers/3.png');
	// this.addImage('bg4', 'assets/bg-layers/4.png');
	this.addImage('bg5', 'assets/bg-layers/5.png');
	this.addImage('bg6', 'assets/bg-layers/6.png');
	this.addImage('bg7', 'assets/bg-layers/7.png');
	this.addImage('pauseImage', 'assets/pauseImage.png')
	///////////////////////////////////
	//SpriteSheet and Objects
	this.addSpriteSheet('sw', 'assets/sw.png', 200, 225);
	this.addSpriteSheet('explosion', 'assets/explosion.png', 129, 133);
	this.addSpriteSheet('1', 'assets/boy/1.png', 200, 225);
	this.addSpriteSheet('2', 'assets/boy/2.png', 200, 225);
	this.addSpriteSheet('3', 'assets/boy/3.png', 200, 225);
	this.addSpriteSheet('4', 'assets/boy/4.png', 200, 225);
	this.addSpriteSheet('5', 'assets/boy/5.png', 200, 225);
	this.addSpriteSheet('6', 'assets/boy/6.png', 200, 225);
	this.addSpriteSheet('7', 'assets/boy/7.png', 200, 225);
	this.addSpriteSheet('8', 'assets/boy/8.png', 200, 225);
	this.addSpriteSheet('9', 'assets/boy/9.png', 200, 225);
	this.addSpriteSheet('10', 'assets/boy/cf.png', 200, 225);
	this.addSpriteSheet('11', 'assets/girl/1.png', 200, 225);
	this.addSpriteSheet('12', 'assets/girl/2.png', 200, 225);
	this.addSpriteSheet('13', 'assets/girl/3.png', 200, 225);
	this.addSpriteSheet('14', 'assets/girl/4.png', 200, 225);
	this.addSpriteSheet('15', 'assets/girl/5.png', 200, 225);
	this.addSpriteSheet('16', 'assets/girl/6.png', 200, 225);
	this.addSpriteSheet('17', 'assets/girl/7.png', 200, 225);
	this.addSpriteSheet('18', 'assets/boy/rs.png', 200, 225);
	this.addSpriteSheet('19', 'assets/girl/cpf.png', 200, 225);

	//audio
	this.addAudio('yell', 'assets/audio/yell.mp3');
	this.addAudio('pin', 'assets/audio/pin.mp3');
	this.addAudio('yame', 'assets/audio/yame.mp3');
	this.addAudio('music', 'assets/audio/music.mp3');
	this.addAudio('speed1', 'assets/audio/speedup/speedup1.mp3');
	this.addAudio('speed2', 'assets/audio/speedup/speedup2.mp3');
	this.addAudio('speed3', 'assets/audio/speedup/speedup3.mp3');
	this.addAudio('speed4', 'assets/audio/speedup/speedup4.mp3');
	this.addAudio('speed5', 'assets/audio/speedup/speedup5.mp3');
}

loadingState.update = function(){
    Kiwi.State.prototype.update.call(this);
}


loadingState.create = function(){
    Kiwi.State.prototype.create.call(this);
    console.log("inside create of loadingState");
    this.tweenOut = this.game.tweens.create(this.logo);
    this.tweenOut.to({alpha: 0}, 1000, Kiwi.Animations.Tweens.Easing.Linear.None, false);
    this.tweenOut.onComplete(this.switchToMain, this);
    this.tweenOut.start();
}
loadingState.switchToMain = function(){
    this.game.states.switchState('start');
}

start.create = function(){
    this.myButton = new Kiwi.HUD.Widget.Button( this.game, 'START', 300, 430 );
    this.game.huds.defaultHUD.addWidget( this.myButton );

    this.myButton.style.color = 'white';
    this.myButton.style.fontSize = '2em';
    this.myButton.style.fontWeight = 'bold';
    this.myButton.style.padding = '0.5em 1em';
    this.myButton.style.backgroundColor = 'black';
    this.myButton.style.cursor = 'pointer';
    this.myButton.style.fontFamily = 'Courier';

    this.myButton.input.onDown.add( this.buttonPressed, this );
    this.myButton.input.onUp.add( this.buttonReleased, this );

    this.myButton.input.onOver.add( this.buttonOver, this );
    this.myButton.input.onOut.add( this.buttonOut, this );
}

start.buttonPressed = function() {
    this.myButton.y = 435;
}

start.buttonReleased = function() {
    this.myButton.style.backgroundColor = '';
    this.game.states.switchState('myState');
    this.myButton.text = '';
    this.myButton.style.padding = 0;
}

start.buttonOver = function() {
    this.myButton.style.backgroundColor = 'green';
}

start.buttonOut = function() {
    this.myButton.style.backgroundColor = 'black';
}


myGame.states.addState(start);
myGame.states.addState(loadingState);
myGame.states.addState(preloader);
myGame.states.addState(myState);
myGame.states.addState(lose);
myGame.states.addState(win);
myGame.states.switchState('preloader');