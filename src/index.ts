import ImageExtended from './image';
import Keyboard, { KEYS } from './modules/keyboard';
import Menu from './menu';
import { BACKGROUND_CANVAS, BRICK_CANVAS, GAME_CANVAS } from './globals';
import { bind } from 'helpful-decorators';
import { clearCanvas, fillBox } from './utils';

class BattleCity {
	private readonly UPDATE_INTERVAL: number = 16.666;

	private gameOptions: GameOptions = {
		playersCount: 1,
		friendlyFire: false,
		enemiesEnabled: true,
		level: 0,
	};

	private menu: Menu;

	private frameTimeStamp: number;
	private frameTimeDelta: number;
	private frameUnits: number;
	private parity: boolean = false;
	private started: boolean = false;
	private updatePaused: boolean = false;

	private doClear: boolean = true;
	private doBox: boolean = false;
	private undoBox: boolean = false;
	private doFlipFlop: boolean = false;
	private doRender: boolean = true;

	constructor() {
		this.bgContext.imageSmoothingEnabled = false;
		this.gameContext.imageSmoothingEnabled = false;

		ImageExtended.preloadImages({ spritesheet: './spritesheet.png' }).then((images: Record<string, ImageExtended>) => {
			if (this.started) {
				// entityManager.init();
				// gameState.init();
				// entityManager.initLevel();
				// gameState.createLevel();
			} else {
				this.menu = new Menu(this.bgContext, this.startGame);
				this.bgContext.save();
				GAME_CANVAS.style.display = 'none';
				this.requestAnimationFrame();
			}

			this.brickContext.drawImage(images.spritesheet, 0, 0);
			this.gameContext.fillStyle = 'white';
		});
	}

	@bind
	private startGame(mode: GameMode, level: number): void {
		this.gameOptions = this.getGameOptions(mode, level);
		this.doClear = true;

		// g_doClear = true;
		// g_gameStarted = true;
		// g_canvas.style.display = "";
		// entityManager.init();
		// gameState.init();
		// createBorder();
		// gameState.createLevel();
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

	private update(delta: number): void {
		if (this.shouldSkipUpdate()) {
			return;
		}

		if (delta > 200) {
			delta = this.UPDATE_INTERVAL;
		}

		const units: number = delta / this.UPDATE_INTERVAL;

		if (this.started) {
			// processDiagnostics(); // вообще по-ходу не важно
			// entityManager.update(units);
			// gameState.update(units);
		} else {
			this.menu.update();
		}

		this.frameUnits = units;
		this.parity = !this.parity;
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

	private render(): void {
		if (Keyboard.handleChar(KEYS.CLEAR)) this.doClear = !this.doClear;
		if (Keyboard.handleChar(KEYS.BOX)) this.doBox = !this.doBox;
		if (Keyboard.handleChar(KEYS.UNDO)) this.undoBox = !this.undoBox;
		if (Keyboard.handleChar(KEYS.FLIP_FLOP)) this.doFlipFlop = !this.doFlipFlop;
		if (Keyboard.handleChar(KEYS.RENDER)) this.doRender = !this.doRender;

		if (this.doClear) {
			clearCanvas(this.gameContext, 'black');
			clearCanvas(this.bgContext);
		}

		if (this.doBox) fillBox(this.gameContext, 200, 200, 50, 50, 'red');

		if (this.doRender) {
			if (this.started) {
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

	public get bgContext(): CanvasRenderingContext2D {
		return BACKGROUND_CANVAS.getContext('2d') as CanvasRenderingContext2D;
	}

	public get brickContext(): CanvasRenderingContext2D {
		return BRICK_CANVAS.getContext('2d') as CanvasRenderingContext2D;
	}

	public get gameContext(): CanvasRenderingContext2D {
		return GAME_CANVAS.getContext('2d') as CanvasRenderingContext2D;
	}
}

export default new BattleCity();
