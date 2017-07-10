window.onload = function() {

    var game = new Phaser.Game(400, 768, Phaser.AUTO, 'viewport', { preload: preload, create: create, update: update, render: render });
    var sprites = [];
    var score = 0;
    var rowIDs = [];
    var scale = 0.5;
    var rowHeight = 70 * scale;
    var generators = [
        { selector: '#bt-generator1', bps: 1, count: 0, cost: 10, growthRate: 1.07, multiplier: 1 },
        { selector: '#bt-generator2', bps: 5, count: 0, cost: 80, growthRate: 1.07, multiplier: 1 },
        { selector: '#bt-generator3', bps: 20, count: 0, cost: 2000, growthRate: 1.07, multiplier: 1 },
        { selector: '#bt-generator4', bps: 80, count: 0, cost: 10000, growthRate: 1.07, multiplier: 1 },
        { selector: '#bt-generator5', bps: 150, count: 0, cost: 20000, growthRate: 1.07, multiplier: 1 },
    ]
    var milestones = [
        { height: 1, name: 'Milestone #1' },
        { height: 2, name: 'Milestone #2' },
        { height: 4, name: 'Milestone #3' },
        { height: 8, name: 'Milestone #4' },
        { height: 16, name: 'Milestone #5' },
        { height: 32, name: 'Milestone #6' },
        { height: 64, name: 'Milestone #7' },
        { height: 128, name: 'Milestone #8' },
        { height: 256, name: 'Milestone #9' },
        { height: 512, name: 'Milestone #10' },
        { height: 1024, name: 'Milestone #11' },
        { height: 2048, name: 'Milestone #12' },
        { height: 4096, name: 'Milestone #13' },
        { height: 8192, name: 'Milestone #14' },
        { height: 16384, name: 'Milestone #15' },
        { height: 32768, name: 'Milestone #16' },
    ];
    var heightColors = [
        { height: 0, color: '#7DC5FF' },
        { height: 12000, color: '#7DC5FF' },
        { height: 80000, color: '#001122' },
    ]
    var currentMilestoneId = -1;

    $('#bt-cinderblock').on('click', (event) => {
        addBricks(1);
        score += 1;
    });
    generators.forEach((generator, index) => {
        $(generator.selector).find('button').on('click', (event) => buyGenerator(index, 1));
    });

    updateGenerators();

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
        game.camera.follow(cameraHeight, Phaser.Camera.FOLLOW_LOCKON, 0.5, 0.2);
        game.camera.bounds = null;

        var ground = game.add.sprite(200, game.world.height - 320, 'ground');
        // ground.scale.set(0.5);
        ground.anchor.set(0.5, 0.5);

        bricks = game.add.group();
        bps = 0;
        lastScore = 0;
        step = 0;
    }

    function update() {

        var increment = 0;
        generators.forEach((generator) => {
            increment += generator.bps * generator.count * generator.multiplier * (game.time.elapsed / 1000);
        });
        updateBricks(score, score + increment);
        score += increment;
        updateScoreUI();
        updateGenerators();
        updateMilestones();

        bps = Math.round(increment / (game.time.elapsed / 1000))

        $('#bps').text('BPS : ' + bps);
        var flooredScore = Math.floor(score);
        cameraHeight.y = game.world.centerY - rowHeight * 0.5 * Math.floor(flooredScore / 16);

        // game.camera.y
        // game.stage.backgroundColor = '#7DC5FF';
        var height = Math.floor(flooredScore / 16) * 0.2;
        var lowerColor;
        var upperColor;
        heightColors.forEach((color) => {
            if (color.height <= height) {
                lowerColor = color;
            }
            else if (!upperColor && color.height >= height) {
                upperColor = color;   
            }
        });
        if (!upperColor) { upperColor = lowerColor; }
        var ratio = (height - lowerColor.height) / (upperColor.height - lowerColor.height);
        game.stage.backgroundColor = lerpColor(lowerColor.color, upperColor.color, ratio);
    }

    function lerpColor(a, b, amount) { 
        var ah = parseInt(a.replace(/#/g, ''), 16),
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
        var flooredScore = Math.floor(newScore);
        var delta = flooredScore - Math.floor(prevScore);
        if (delta > 0) {
            addBricks(delta);
        }
    }

    function addBricks(step = 1) {
        if (step > 400) { return; };
        var flooredScore = Math.floor(score);
        for (var i = 0; i < step; i++) {
            var tempScore = flooredScore + i;
            var posY = game.world.height - 384 - rowHeight * Math.floor(tempScore / 32);
            spawnBrick(tempScore, posY, 1 / step);
            if (sprites.length > 400) {
                var spriteToDestroy = sprites.shift();
                spriteToDestroy.destroy();
            }
        }
    }

    function spawnBrick(_score, posY, _scale) {
        // if (!rowIDs.length) {
        //     if (score % 32 < 16) {
        //         rowIDs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
        //     }
        //     else {
        //         rowIDs = [17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32];
        //     }
        // }
        var spriteIndex = _score % 32 + 1; // rowIDs.splice(Math.floor(Math.random() * rowIDs.length), 1)[0];
        var brick = game.add.sprite(200, posY, 'parpin' + spriteIndex);
        brick.scale.setTo(scale);
        brick.anchor.setTo(0.5, 0.5);
        sprites.push(brick);
        bricks.add(brick);

        var bounce = game.add.tween(brick);
        bounce.from({ y: brick.y - 100 * _scale }, (500 + Math.random() * 400) * _scale, Phaser.Easing.Bounce.Out)
        bounce.start();

        var fadeIn = game.add.tween(brick);
        fadeIn.from({ alpha: 0 }, 400 * _scale, Phaser.Easing.Cubic.Out);
        fadeIn.start();

        return brick;
    }

    function buyGenerator(index, count = 1) {
        if (!generators[index]) { return; }
        generator = generators[index];
        cost = Math.floor(generator.cost * Math.pow(generator.growthRate, generator.count));
        if (cost > score) { return; }
        score -= cost;
        for (var i = 0; i < cost; i++) {
            var spriteToDestroy = sprites.pop();
            if (spriteToDestroy) { 
                spriteToDestroy.destroy(); 
            }
        }
        // removeBricks(cost);
        generator.count += count;
        updateGenerators();
    }

    function updateScoreUI() {
        var flooredScore = Math.floor(score);
        $('#score').text('Cinder blocks: ' + new Intl.NumberFormat().format(Math.max(0, flooredScore)));
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
        var flooredScore = Math.floor(score);
        var lastMilestone = currentMilestoneId;
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