import Game from './game';
import Keyboard, { KEYS } from './modules/keyboard';
import Menu from './menu';
import { BG_CTX, DRAFT_CTX, GAME_CANVAS, GAME_CTX, UPDATE_INTERVAL } from './globals';
import { bind } from 'helpful-decorators';
import { clearCanvas, fillBox, preloadImages } from './utils';

class BattleCity {
	private menu: Menu;
	private game: Game;

	private frameTimeStamp: number;
	private frameTimeDelta: number;
	private frameUnits: number;
	private parity: boolean = false;
	private updatePaused: boolean = false;

	private doClear: boolean = true;
	private doBox: boolean = false;
	private undoBox: boolean = false;
	private doFlipFlop: boolean = false;
	private doRender: boolean = true;

	constructor() {
		BG_CTX.imageSmoothingEnabled = false;
		GAME_CTX.imageSmoothingEnabled = false;

		preloadImages({ spritesheet: './spritesheet.png' }).then((images: Record<string, HTMLImageElement>) => {
			if (this.isStarted()) {
				// gameState.init();
				// entityManager.initLevel();
				// gameState.createLevel();
			} else {
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

		this.game = new Game(this.getGameOptions(mode, level), this.endGame);
	}

	@bind
	private endGame(): void {
		//TODO меню инициализировать
		// entityManager._playerTanks.length = 0;
		// entityManager.destroyLevel();
		// g_gameStarted = false;
		// gameState.setFreezeTimerToZero();
		// gameState.resetSpawnTimer();
		// this.levelSelect = false;
		// this.menuItems.length = 0;
		// this.selectedItem = 0;
		// this.menuItems = ["1 PLAYER", "2 PLAYERS", "VS MODE", "INSTRUCTIONS"];
		// g_backgroundCtx.save();
		// g_canvas.style.display = "none";
		// g_doClear = false;
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
		if (Keyboard.handleChar(KEYS.PAUSE)) {
			this.updatePaused = !this.updatePaused;
		}

		return this.updatePaused && !Keyboard.handleChar(KEYS.STEP);
	}

	@bind
	private iterate(frameTimeStamp: number): void {
		this.updateClocks(frameTimeStamp);

		this.update(this.frameTimeDelta ?? 0);
		this.render();
		// handleSFXtoggles();
		// playSounds();

		this.requestAnimationFrame();
	}

	private requestAnimationFrame(): void {
		window.requestAnimationFrame(this.iterate);
	}

	private update(delta: number): void {
		if (this.shouldSkipUpdate()) {
			return;
		}

		if (delta > 200) {
			delta = UPDATE_INTERVAL;
		}

		const units: number = delta / UPDATE_INTERVAL;

		if (this.isStarted()) {
			this.game.update(units);
		} else {
			this.menu.update();
		}

		this.frameUnits = units;
		this.parity = !this.parity;
	}

	private render(): void {
		if (Keyboard.handleChar(KEYS.CLEAR)) this.doClear = !this.doClear;
		if (Keyboard.handleChar(KEYS.BOX)) this.doBox = !this.doBox;
		if (Keyboard.handleChar(KEYS.UNDO)) this.undoBox = !this.undoBox;
		if (Keyboard.handleChar(KEYS.FLIP_FLOP)) this.doFlipFlop = !this.doFlipFlop;
		if (Keyboard.handleChar(KEYS.RENDER)) this.doRender = !this.doRender;

		if (this.doClear) {
			clearCanvas(GAME_CTX, 'black');
			clearCanvas(BG_CTX);
		}

		if (this.doBox) fillBox(GAME_CTX, 200, 200, 50, 50, 'red');

		if (this.doRender) {
			if (this.isStarted()) {
				// entityManager.render(ctx);
				// if (g_renderSpatialDebug) spatialManager.render(ctx);
				// gameState.render(ctx);
			} else {
				this.menu.render();
			}
		}

		// This flip-flip mechanism illustrates the pattern of alternation
		// between frames, which provides a crude illustration of whether
		// we are running "in sync" with the display refresh rate.
		//
		// e.g. in pathological cases, we might only see the "even" frames.
		//
		// if (g_doFlipFlop) {
		// 	var boxX = 250,
		// 		boxY = g_isUpdateOdd ? 100 : 200;

		// Draw flip-flop box
		// util.fillBox(ctx, boxX, boxY, 50, 50, 'green');

		// Display the current frame-counter in the box...
		// ctx.fillText(g_frameCounter % 1000, boxX + 10, boxY + 20);
		// ..and its odd/even status too
		// var text = g_frameCounter % 2 ? 'odd' : 'even';
		// ctx.fillText(text, boxX + 10, boxY + 40);
		// }

		// Optional erasure of diagnostic "box",
		// to illustrate flicker-proof double-buffering
		//
		// if (g_undoBox) ctx.clearRect(200, 200, 50, 50);

		// ++g_frameCounter;
	}
}

export default new BattleCity();
