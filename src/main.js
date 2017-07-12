import 'pixi';
import 'p2';
import Phaser from 'phaser';

import {$,jQuery} from 'jquery';
window.$ = $;
window.jQuery = jQuery;

import GameState from './states/game';

import config from './config';


class Game extends Phaser.Game {
  constructor () {
    const docElement = document.documentElement;
    const width = docElement.clientWidth > config.gameWidth ? config.gameWidth : docElement.clientWidth;
    const height = docElement.clientHeight > config.gameHeight ? config.gameHeight : docElement.clientHeight;

    super(width, height, Phaser.CANVAS, 'viewport', null);

    // this.state.add('Boot', BootState, false)
    // this.state.add('Splash', SplashState, false)
    this.state.add('Game', GameState, false)

    this.state.start('Game');
  }
}

window.game = new Game();
