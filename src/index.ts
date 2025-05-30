import Game from './game';
import Keyboard from './modules/keyboard';
import Menu from './menu';
import Sounds from './modules/sounds';
import { BG_CTX, DRAFT_CTX, GAME_CANVAS, GAME_CTX, KEYS, UPDATE_INTERVAL } from './globals';
import { bind } from 'helpful-decorators';
import { clearCanvas, preloadImages } from './utils';

class BattleCity {
	private menu?: Menu;
	private game?: Game;

	private frameTimeStamp: number;
	private frameTimeDelta: number;
	private parity: boolean = false;
	private updatePaused: boolean = false;

	private doClear: boolean = true;

	constructor() {
		BG_CTX.imageSmoothingEnabled = false;
		GAME_CTX.imageSmoothingEnabled = false;

		preloadImages({ spritesheet: './spritesheet.png' }).then((images: Record<string, HTMLImageElement>) => {
			if (!this.isStarted()) {
				this.menu = new Menu(this.startGame);
				BG_CTX.save();
				GAME_CANVAS.style.display = 'none';
				this.requestAnimationFrame();
			}

			DRAFT_CTX.drawImage(images.spritesheet, 0, 0);
			GAME_CTX.fillStyle = 'white';
		});
	}

	@bind
	private startGame(mode: GameMode, level: number): void {
		this.doClear = true;
		GAME_CANVAS.style.display = '';

		this.menu = undefined;
		this.game = new Game(this.getGameOptions(mode, level), this.endGame);
	}

	@bind
	private endGame(): void {
		Sounds.stopSounds();
		this.game = undefined;
		this.menu = new Menu(this.startGame);
		BG_CTX.save();
		GAME_CANVAS.style.display = 'none';
		this.doClear = false;
	}

	private isStarted(): boolean {
		return Boolean(this.game);
	}

	private getGameOptions(mode: GameMode, level: number): GameOptions {
		switch (mode) {
			case 'single':
				return {
					playersCount: 1,
					friendlyFire: false,
					enemiesEnabled: true,
					level,
				};
			case 'tandem':
				return {
					playersCount: 2,
					friendlyFire: false,
					enemiesEnabled: true,
					level,
				};
			case 'versus':
				return {
					playersCount: 2,
					friendlyFire: true,
					enemiesEnabled: false,
					level,
				};
		}
	}

	private updateClocks(frameTimeStamp: number): void {
		if (undefined === this.frameTimeStamp) {
			this.frameTimeStamp = frameTimeStamp;
		}

		this.frameTimeDelta = frameTimeStamp - this.frameTimeStamp;
		this.frameTimeStamp = frameTimeStamp;
	}

	private shouldSkipUpdate(): boolean {
		if (Keyboard.handleKey(KEYS.PAUSE)) {
			this.updatePaused = !this.updatePaused;
		}

		return this.updatePaused && !Keyboard.handleKey(KEYS.STEP);
	}

	private shouldInterruptGame(): boolean {
		return Keyboard.handleKey(KEYS.EXIT);
	}

	@bind
	private iterate(frameTimeStamp: number): void {
		this.updateClocks(frameTimeStamp);

		this.update(this.frameTimeDelta ?? 0);
		this.render();

		Sounds.playSounds();

		this.requestAnimationFrame();
	}

	private requestAnimationFrame(): void {
		window.requestAnimationFrame(this.iterate);
	}

	private update(delta: number): void {
		if (this.shouldInterruptGame()) {
			this.endGame();
			return;
		}

		if (this.shouldSkipUpdate()) {
			return;
		}

		if (delta > 200) {
			delta = UPDATE_INTERVAL;
		}

		const units: number = delta / UPDATE_INTERVAL;

		if (this.isStarted()) {
			this.game!.update(units);
		} else {
			this.menu?.update();
		}

		this.parity = !this.parity;
	}

	private render(): void {
		if (Keyboard.handleKey(KEYS.CLEAR)) this.doClear = !this.doClear;

		if (this.doClear) {
			clearCanvas(GAME_CTX, 'black');
			clearCanvas(BG_CTX);
		}

		if (this.isStarted()) {
			this.game!.render();
		} else {
			this.menu?.render();
		}
	}
}

export default new BattleCity();
