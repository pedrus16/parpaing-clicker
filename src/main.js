window.onload = function() {

    let game = new Phaser.Game(400, 768, Phaser.AUTO, 'viewport', { preload: preload, create: create, update: update, render: render });
    let sprites = [];
    let score = 0;
    let rowIDs = [];
    let scale = 0.5;
    let rowHeight = 70 * scale;
    let generators = [
        { selector: '#bt-generator1', bps: 100, count: 0, cost: 10, growthRate: 1.07, multiplier: 1 },
        { selector: '#bt-generator2', bps: 5, count: 0, cost: 80, growthRate: 1.07, multiplier: 1 },
        { selector: '#bt-generator3', bps: 20, count: 0, cost: 200, growthRate: 1.07, multiplier: 1 },
        { selector: '#bt-generator4', bps: 80, count: 0, cost: 1000, growthRate: 1.07, multiplier: 1 },
        { selector: '#bt-generator5', bps: 150, count: 0, cost: 2000, growthRate: 1.07, multiplier: 1 },
    ]
    let milestones = [
        { height: 2.6, name: 'Little house' },
        { height: 4.8, name: 'Giraffe' },
        { height: 150, name: 'Godzilla' },
        { height: 324, name: 'Eiffel Tower hon hon hon' },
        { height: 828, name: 'Burj Khalifa' },
        { height: 8848, name: 'Everest' },
        { height: 15000, name: 'Above the clouds' },
        { height: 690000, name: 'Spaaaaaace' },
        { height: 384400000, name: 'Moon' },
    ];
    let heightColors = [
        { height: 0, color: '#7DC5FF' },
        { height: 12000, color: '#7DC5FF' },
        { height: 80000, color: '#001122' },
    ]
    let currentMilestoneId = -1;
    let brickPool = [];
    let poolIndex = 0;
    let bricks;

    function preload() {

        game.load.image('parpin1', 'assets/0001.png');
        game.load.image('parpin2', 'assets/0002.png');
        game.load.image('parpin3', 'assets/0003.png');
        game.load.image('parpin4', 'assets/0004.png');
        game.load.image('parpin5', 'assets/0005.png');
        game.load.image('parpin6', 'assets/0006.png');
        game.load.image('parpin7', 'assets/0007.png');
        game.load.image('parpin8', 'assets/0008.png');
        game.load.image('parpin9', 'assets/0009.png');
        game.load.image('parpin10', 'assets/0010.png');
        game.load.image('parpin11', 'assets/0011.png');
        game.load.image('parpin12', 'assets/0012.png');
        game.load.image('parpin13', 'assets/0013.png');
        game.load.image('parpin14', 'assets/0014.png');
        game.load.image('parpin15', 'assets/0015.png');
        game.load.image('parpin16', 'assets/0016.png');
        game.load.image('parpin17', 'assets/0017.png');
        game.load.image('parpin18', 'assets/0018.png');
        game.load.image('parpin19', 'assets/0019.png');
        game.load.image('parpin20', 'assets/0020.png');
        game.load.image('parpin21', 'assets/0021.png');
        game.load.image('parpin22', 'assets/0022.png');
        game.load.image('parpin23', 'assets/0023.png');
        game.load.image('parpin24', 'assets/0024.png');
        game.load.image('parpin25', 'assets/0025.png');
        game.load.image('parpin26', 'assets/0026.png');
        game.load.image('parpin27', 'assets/0027.png');
        game.load.image('parpin28', 'assets/0028.png');
        game.load.image('parpin29', 'assets/0029.png');
        game.load.image('parpin30', 'assets/0030.png');
        game.load.image('parpin31', 'assets/0031.png');
        game.load.image('parpin32', 'assets/0032.png');
        game.load.image('parpaingButton', 'assets/parpaing_button.png');
        game.load.image('ground', 'assets/ground.png');

    }

    function create() {

        game.stage.disableVisibilityChange = true;
        game.input.mouse.capture = true;
        game.stage.backgroundColor = '#7DC5FF';
        cameraHeight = game.add.sprite(game.world.centerX, game.world.centerY);
        cameraHeight.anchor.setTo(0.5);
        game.camera.x = game.world.centerX - 512;
        game.camera.y = game.world.height - 384;
        game.camera.follow(cameraHeight, Phaser.Camera.FOLLOW_LOCKON, 0.5, 0.9);
        game.camera.bounds = null;

        let ground = game.add.sprite(200, game.world.height - 350, 'ground');
        ground.scale.set(0.5);
        ground.anchor.set(0.5, 0.5);

        bricks = game.add.group();
        bps = 0;
        lastScore = 0;
        step = 0;
        $('#bt-cinderblock').on('click', (event) => {
            addBricks(1);
            score += 1;
        });
        generators.forEach((generator, index) => {
            $(generator.selector).find('button').on('click', (event) => buyGenerator(index, 1));
        });

        updateGenerators();

        for (let i = 0; i < 600; i++) {
            let sprite = bricks.create(0, 0, 'parpin1', 0);
            sprite.visible = false;
            sprite.scale.setTo(scale);
            sprite.anchor.setTo(0.5, 0.5);
            brickPool.push(sprite);
            // bricks.add(sprite);
        }
    }

    function update() {

        let increment = 0;
        generators.forEach((generator) => {
            increment += generator.bps * generator.count * generator.multiplier * (game.time.elapsed / 1000);
        });
        updateBricks(score, score + increment);
        score += increment;
        updateScoreUI();
        updateGenerators();
        updateMilestones();

        bps = Math.round(increment / (game.time.elapsed / 1000))

        $('#bps').text(bps);
        let flooredScore = Math.floor(score);
        cameraHeight.y = game.world.centerY - rowHeight * 0.5 * Math.floor(flooredScore / 16);

        // game.camera.y
        // game.stage.backgroundColor = '#7DC5FF';
        let height = Math.floor(flooredScore / 16) * 0.2;
        let lowerColor;
        let upperColor;
        heightColors.forEach((color) => {
            if (color.height <= height) {
                lowerColor = color;
            }
            else if (!upperColor && color.height >= height) {
                upperColor = color;   
            }
        });
        if (!upperColor) { upperColor = lowerColor; }
        let ratio = (height - lowerColor.height) / (upperColor.height - lowerColor.height);
        game.stage.backgroundColor = lerpColor(lowerColor.color, upperColor.color, ratio);
    }

    function lerpColor(a, b, amount) { 
        let ah = parseInt(a.replace(/#/g, ''), 16),
            ar = ah >> 16, ag = ah >> 8 & 0xff, ab = ah & 0xff,
            bh = parseInt(b.replace(/#/g, ''), 16),
            br = bh >> 16, bg = bh >> 8 & 0xff, bb = bh & 0xff,
            rr = ar + amount * (br - ar),
            rg = ag + amount * (bg - ag),
            rb = ab + amount * (bb - ab);

        return '#' + ((1 << 24) + (rr << 16) + (rg << 8) + rb | 0).toString(16).slice(1);
    }

    function render() {
        // game.debug.cameraInfo(game.camera, 32, 32);
    }

    function animateButton(button) {
        tween = game.add.tween(button).from({ scale: 0.8 }, 0, Phaser.Easing.Linear.None);
    }

    function updateBricks(prevScore, newScore) {
        let flooredScore = Math.floor(newScore);
        let delta = flooredScore - Math.floor(prevScore);
        if (delta > 0) {
            addBricks(delta);
        } 
    }

    function addBricks(step = 1) {
        let flooredScore = Math.floor(score);
        for (let i = 0; i < step; i++) {
            let tempScore = flooredScore + i;
            let posY = game.world.height - 384 - rowHeight * Math.floor(tempScore / 32);
            poolIndex = (poolIndex + 1) % brickPool.length;
            let brick = brickPool[poolIndex];
            if (brick) {
                var spriteIndex = tempScore % 32 + 1;
                brick.loadTexture('parpin' + spriteIndex);
                brick.x = 200;
                brick.y = posY;
                brick.z = tempScore;
                brick.visible = true;
            }
        }
        bricks.sort('z', Phaser.Group.SORT_ASCENDING);
    }

    function buyGenerator(index, count = 1) {
        if (!generators[index]) { return; }
        let generator = generators[index];
        let cost = Math.floor(generator.cost * Math.pow(generator.growthRate, generator.count));
        if (cost > score) { return; }
        score -= cost;
        let flooredScore = Math.floor(score);
        for (let i = 0; i < cost; i++) {
            let tempScore = flooredScore + cost - i - brickPool.length - 1;
            let brick = brickPool[poolIndex];
            poolIndex -= 1;
            if (poolIndex < 0) {
                poolIndex = brickPool.length - 1;
            }
            if (brick) {
                let posY = 0;
                if (tempScore >= 0) {
                    posY = game.world.height - 384 - rowHeight * Math.floor(tempScore / 32);
                    let spriteIndex = tempScore % 32 + 1;
                    brick.loadTexture('parpin' + spriteIndex);
                    brick.visible = true;
                    brick.x = 200;
                    brick.y = posY;
                    brick.z = tempScore;
                }
                else {
                    brick.visible = false;
                }
            }
        }
        generator.count += count;
        updateGenerators();
    }

    function updateScoreUI() {
        let flooredScore = Math.floor(score);
        $('#score').text(new Intl.NumberFormat().format(Math.max(0, flooredScore)));
        $('#height').text('Height: ' + new Intl.NumberFormat().format(Math.floor(flooredScore / 16) * 0.2) + 'm');
    }

    function updateGenerators() {
        generators.forEach((generator, index) => {
            nextCost = Math.floor(generator.cost * Math.pow(generator.growthRate, generator.count));
            $(generator.selector).find('.generator-count').text(generator.count);
            $(generator.selector).find('.generator-cost').text(nextCost);
            if (score >= nextCost) {
                $(generator.selector).find('button').removeClass('disable');
            }
            else {
                $(generator.selector).find('button').addClass('disable');
            }
        });
    }

    function updateMilestones() {
        let flooredScore = Math.floor(score);
        let lastMilestone = currentMilestoneId;
        milestones.forEach((milestone, index) => {
            if (Math.floor(flooredScore / 16) * 0.2 >= milestone.height && index > currentMilestoneId) {
                currentMilestoneId = index;
            }
        });
        if (currentMilestoneId > lastMilestone) {
            $('#milestone-list').append('<li>' + milestones[currentMilestoneId].name + ' (' + milestones[currentMilestoneId].height + 'm)' + '</li>');
        }
    }
};