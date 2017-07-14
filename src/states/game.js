/* globals __DEV__ */
import Phaser from 'phaser';


export default class extends Phaser.State {
  
  init () {
    // let game = new Phaser.Game(400, 768, Phaser.AUTO, 'viewport', { preload: preload, create: create, update: update, render: render });
    this.score = 0;
    this.scale = 0.5;
    this.rowHeight = 70;
    this.generators = [
        { selector: '#bt-generator1', bps: 1, count: 0, cost: 10, growthRate: 1.07, multiplier: 1 },
        { selector: '#bt-generator2', bps: 5, count: 0, cost: 80, growthRate: 1.07, multiplier: 1 },
        { selector: '#bt-generator3', bps: 20, count: 0, cost: 200, growthRate: 1.07, multiplier: 1 },
        { selector: '#bt-generator4', bps: 80, count: 0, cost: 1000, growthRate: 1.07, multiplier: 1 },
        { selector: '#bt-generator5', bps: 150, count: 0, cost: 2000, growthRate: 1.07, multiplier: 1 },
    ];
    const milestoneElem = $('#milestone-list > li');
    this.milestones = [
        { height: 2.6, name: 'Little house', element: milestoneElem.get(0) },
        { height: 4.8, name: 'Giraffe', element: milestoneElem.get(1) },
        { height: 150, name: 'Godzilla', element: milestoneElem.get(2) },
        { height: 324, name: 'Eiffel Tower hon hon hon', element: milestoneElem.get(3) },
        { height: 828, name: 'Burj Khalifa', element: milestoneElem.get(4) },
        { height: 8848, name: 'Everest', element: milestoneElem.get(5) },
        { height: 15000, name: 'Above the clouds', element: milestoneElem.get(6) },
        { height: 690000, name: 'Spaaaaaace', element: milestoneElem.get(7) },
        { height: 384400000, name: 'Moon', element: milestoneElem.get(8) },
    ];
    this.heightColors = [
        { height: 0, color: '#7DC5FF' },
        { height: 12000, color: '#7DC5FF' },
        { height: 80000, color: '#001122' },
    ];
    this.currentMilestoneId = -1;
    this.game.stage.disableVisibilityChange = true;
    this.game.input.mouse.capture = true;
    this.game.stage.backgroundColor = '#7DC5FF';
    this.storage = localStorage;

  }

  preload () {

    this.load.image('parpin1', 'assets/images/0001.png');
    this.load.image('parpin2', 'assets/images/0002.png');
    this.load.image('parpin3', 'assets/images/0003.png');
    this.load.image('parpin4', 'assets/images/0004.png');
    this.load.image('parpin5', 'assets/images/0005.png');
    this.load.image('parpin6', 'assets/images/0006.png');
    this.load.image('parpin7', 'assets/images/0007.png');
    this.load.image('parpin8', 'assets/images/0008.png');
    this.load.image('parpin9', 'assets/images/0009.png');
    this.load.image('parpin10', 'assets/images/0010.png');
    this.load.image('parpin11', 'assets/images/0011.png');
    this.load.image('parpin12', 'assets/images/0012.png');
    this.load.image('parpin13', 'assets/images/0013.png');
    this.load.image('parpin14', 'assets/images/0014.png');
    this.load.image('parpin15', 'assets/images/0015.png');
    this.load.image('parpin16', 'assets/images/0016.png');
    this.load.image('parpin17', 'assets/images/0017.png');
    this.load.image('parpin18', 'assets/images/0018.png');
    this.load.image('parpin19', 'assets/images/0019.png');
    this.load.image('parpin20', 'assets/images/0020.png');
    this.load.image('parpin21', 'assets/images/0021.png');
    this.load.image('parpin22', 'assets/images/0022.png');
    this.load.image('parpin23', 'assets/images/0023.png');
    this.load.image('parpin24', 'assets/images/0024.png');
    this.load.image('parpin25', 'assets/images/0025.png');
    this.load.image('parpin26', 'assets/images/0026.png');
    this.load.image('parpin27', 'assets/images/0027.png');
    this.load.image('parpin28', 'assets/images/0028.png');
    this.load.image('parpin29', 'assets/images/0029.png');
    this.load.image('parpin30', 'assets/images/0030.png');
    this.load.image('parpin31', 'assets/images/0031.png');
    this.load.image('parpin32', 'assets/images/0032.png');
    this.load.image('parpaingButton', 'assets/images/parpaing_button.png');
    this.load.image('ground', 'assets/images/ground.png');
    this.load.image('background', 'assets/images/witewall_3.png');

  }

  create () {

    this.cameraHeight = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY);
    this.cameraHeight.anchor.setTo(0.5);
    this.game.camera.x = this.game.world.centerX - 512;
    this.game.camera.y = this.game.world.height - 384;
    this.game.camera.bounds = null;
    this.game.renderer.renderSession.roundPixels = true

    // this.background = game.add.tileSprite(0, 0, 400, 768, 'background');
    // this.background.fixedToCamera = true;

    this.ground = game.add.sprite(200, game.world.height - 350, 'ground');
    this.ground.scale.set(0.5);
    this.ground.anchor.set(0.5, 0.5);


    this.bricks = game.add.group();
    this.bps = 0;
    $('#bt-cinderblock').on('click', (event) => {
      this.addBricks(1);
      this.score += 1;
    });
    this.generators.forEach((generator, index) => {
      $(generator.selector).find('button').on('click', (event) => this.buyGenerator(index, 1));
    });

    this.updateGenerators();

    this.bricks.createMultiple(600, 'parpin1', 0, 0);
    this.bricks.scale.setTo(this.scale);
    this.bricks.x = 200;
    this.bricks.y = this.game.world.height - 384;
    this.bricks.forEach((brick) => brick.anchor.setTo(0.5, 0.5));

    this.loadState();
    setInterval(() => this.saveState(), 5000);

  }

  update() {

    let increment = 0;
    this.generators.forEach((generator) => {
      increment += generator.bps * generator.count * generator.multiplier * (this.game.time.elapsed / 1000);
    });
    this.updateBricks(this.score, this.score + increment);
    this.score += increment;
    this.updateScoreUI();
    this.updateGenerators();
    this.updateMilestones();

    this.bps = Math.round(increment / (this.game.time.elapsed / 1000))

    $('#bps').text(this.bps);
    let camSpeed = this.bps < 800 ? 0.4 : 1;
    this.game.camera.follow(this.cameraHeight, Phaser.Camera.FOLLOW_LOCKON, 1, camSpeed);
    this.cameraHeight.y = this.game.world.centerY - this.rowHeight * this.scale * 0.5 * Math.floor(this.scoreInteger() / 16);
    // this.background.tilePosition.y = -this.cameraHeight.y;

  }

  updateBackgroundColor() {

    let height = Math.floor(this.scoreInteger() / 16) * 0.2;
    let lowerColor;
    let upperColor;
    this.heightColors.forEach((color) => {
      if (color.height <= height) {
        lowerColor = color;
      }
      else if (!upperColor && color.height >= height) {
        upperColor = color;   
      }
    });
    if (!upperColor) { upperColor = lowerColor; }
    let ratio = (height - lowerColor.height) / (upperColor.height - lowerColor.height);
    this.game.stage.backgroundColor = lerpColor(lowerColor.color, upperColor.color, ratio);

  }

  scoreInteger() {

    return Math.floor(this.score);

  }

  lerpColor(a, b, amount) { 

    let ah = parseInt(a.replace(/#/g, ''), 16),
    ar = ah >> 16, ag = ah >> 8 & 0xff, ab = ah & 0xff,
    bh = parseInt(b.replace(/#/g, ''), 16),
    br = bh >> 16, bg = bh >> 8 & 0xff, bb = bh & 0xff,
    rr = ar + amount * (br - ar),
    rg = ag + amount * (bg - ag),
    rb = ab + amount * (bb - ab);

    return '#' + ((1 << 24) + (rr << 16) + (rg << 8) + rb | 0).toString(16).slice(1);

  }


  updateBricks(prevScore, newScore) {

    let delta = Math.floor(newScore) - Math.floor(prevScore);
    if (delta > 0) {
      this.addBricks(delta);
    } 

  }

  addBricks(step = 1) {

    for (let i = Math.max(0, step - this.bricks.children.length); i < step; i++) {
      let tempScore = this.scoreInteger() + i;
      let posY = -this.rowHeight * Math.floor(tempScore / 32);
      let brick = this.bricks.getBottom();
      if (brick) {
        var spriteIndex = tempScore % 32 + 1;
        brick.loadTexture('parpin' + spriteIndex);
        brick.x = 0;
        brick.y = posY;
        brick.alpha = 1;
        if (this.bps < 50) {
          console.log(this.bps);
          game.add.tween(brick).from({ alpha: 0 }, 200, Phaser.Easing.In, true);
          game.add.tween(brick).from({ y: '-200px' }, 500, Phaser.Easing.Bounce.Out, true);
        }
        brick.visible = true;
        this.bricks.bringToTop(brick);
      }
    }

  }

  buyGenerator(index, count = 1) {

    if (!this.generators[index]) { return; }
    let generator = this.generators[index];
    let cost = Math.floor(generator.cost * Math.pow(generator.growthRate, generator.count));
    if (cost > this.score) { return; }
    this.score -= cost;
    for (let i = Math.max(0, cost - this.bricks.children.length); i < cost; i++) {
      let tempScore = this.scoreInteger() + cost - i - this.bricks.children.length - 1;
      let brick = this.bricks.getTop();
      if (brick) {
        let posY = 0;
        if (tempScore >= 0) {
          posY = -this.rowHeight * Math.floor(tempScore / 32);
          let spriteIndex = tempScore % 32 + 1;
          brick.loadTexture('parpin' + spriteIndex);
          brick.visible = true;
          brick.y = posY;
        }
        else {
          brick.visible = false;
        }
      }
      this.bricks.sendToBack(brick);
    }
    generator.count += count;
    this.updateGenerators();
    this.saveState();

  }

  updateScoreUI() {

    $('#score').text(new Intl.NumberFormat().format(Math.max(0, this.scoreInteger())));
    $('#height').text('Height: ' + new Intl.NumberFormat().format(Math.floor(this.scoreInteger() / 16) * 0.2) + 'm');

  }

  updateGenerators() {

    this.generators.forEach((generator, index) => {
      let nextCost = Math.floor(generator.cost * Math.pow(generator.growthRate, generator.count));
      $(generator.selector).find('.generator-count').text(generator.count);
      $(generator.selector).find('.generator-cost').text(nextCost);
      if (this.score >= nextCost) {
        $(generator.selector).find('button').removeClass('disable');
      }
      else {
        $(generator.selector).find('button').addClass('disable');
      }
    });

  }

  updateMilestones() {

    let lastMilestone = this.currentMilestoneId;
    this.milestones.forEach((milestone, index) => {
      if (Math.floor(this.scoreInteger() / 16) * 0.2 >= milestone.height && index > this.currentMilestoneId) {
        this.currentMilestoneId = index;
        $(milestone.element).addClass('unlocked');
      }
    });
    // if (this.currentMilestoneId > lastMilestone) {
      
    // }

  }

  saveState() {
    let generators = this.generators.map((generator) => generator.count);
    this.storage.setItem('save', JSON.stringify({
      score: this.score,
      generators: generators
    }));
  }

  loadState() {
    let state = JSON.parse(this.storage.getItem('save'));
    if (!state) { return; }
    if (state['generators'] && Array.isArray(state['generators'])) {
      state['generators'].forEach((count, index) => {
        if (this.generators[index]) {
          this.generators[index].count = count;
        }
      });
    }
    this.updateBricks(0, state['score']);
    this.score = state['score'] || 0;
  }

}
