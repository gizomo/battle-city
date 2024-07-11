import Keyboard, { KEYS } from './modules/keyboard';
import { CONSTS, SPRITE_SCALE } from './globals';
import { getPowerup, getStructure, getTank, getTerrain } from './sprites';

import { clearCanvas } from './utils';

const MENU: string[] = ['1 PLAYER', '2 PLAYERS', 'VS MODE', 'INSTRUCTIONS'];

export default class Menu {
	private readonly ctx: CanvasRenderingContext2D;
	private readonly selectGame: (mode: GameMode, level: number) => void;
	private readonly items: (number | string)[] = MENU;
	private selected: number = 0;
	private levelsSelectionEnabled: boolean = false;
	private helpEnabled: boolean = false;

	constructor(ctx: CanvasRenderingContext2D, selectGame: (mode: GameMode, level: number) => void) {
		this.ctx = ctx;
		this.selectGame = selectGame;
	}

	public update(): void {
		let mode: GameMode = 'single';

		if (Keyboard.handleKey(13) || Keyboard.handleChar(KEYS.SPACE)) {
			if (!this.levelsSelectionEnabled && !this.helpEnabled) {
				switch (this.selected) {
					case 0:
						mode = 'single';
						break;
					case 1:
						mode = 'tandem';
						break;
					case 2:
						mode = 'versus';
						break;
					case 3:
						this.helpEnabled = true;
						break;
					default:
						break;
				}

				if (!this.helpEnabled) {
					this.levelsSelectionEnabled = true;
					this.selected = 0;
					this.items.length = 0;
					for (let i: number = 0; i < 35; i++) this.items[i] = i + 1;
				}
			} else if (this.helpEnabled) {
				this.helpEnabled = false;
			} else if (this.levelsSelectionEnabled) {
				clearCanvas(this.ctx);
				this.ctx.restore();
				this.selectGame(mode, this.selected);
			}
		} else if (!this.helpEnabled && (Keyboard.handleKey(38) || Keyboard.handleChar(KEYS.UP))) {
			this.selected--;

			if (this.selected < 0) {
				this.selected = this.items.length - 1;
			}
		} else if (!this.helpEnabled && (Keyboard.handleKey(40) || Keyboard.handleChar(KEYS.DOWN))) {
			this.selected = (this.selected + 1) % this.items.length;
		}
	}

	public render(): void {
		clearCanvas(this.ctx, 'black');

		const centerX: number = this.ctx.canvas.width / 2;
		const centerY: number = this.ctx.canvas.height / 2;

		this.ctx.font = '20px Arial';
		this.ctx.textAlign = 'center';

		if (!this.levelsSelectionEnabled) {
			if (this.helpEnabled) {
				this.drawHelpMenu();
			} else {
				(this.items as string[]).forEach((text: string, index: number) => {
					this.ctx.fillStyle = index === this.selected ? 'red' : 'white';
					this.ctx.fillText(text, centerX, centerY - 30 + index * 30);
				});
			}
		} else {
			this.ctx.fillStyle = 'white';
			this.ctx.fillText('STAGE ' + this.items[this.selected], centerX, centerY);
		}
	}

	private drawHelpMenu(): void {
		const headerFont: string = '20px Arial';
		const regularFont: string = '14px Arial';
		const smallFont: string = '10px Arial';
		const centerX: number = this.ctx.canvas.width / 2;
		const canvasWidth: number = this.ctx.canvas.width;
		const canvasHeight: number = this.ctx.canvas.height;

		clearCanvas(this.ctx, 'black');

		this.ctx.fillStyle = 'white';
		this.ctx.textAlign = 'center';
		this.ctx.font = headerFont;
		this.ctx.fillText('Controls', centerX, 30);

		this.ctx.textAlign = 'left';
		this.ctx.fillText('Player 1', 30, 60);
		this.ctx.save();
		this.ctx.scale(SPRITE_SCALE, SPRITE_SCALE);
		getTank(CONSTS.TANK_PLAYER1, CONSTS.TANK_POWER_NONE, CONSTS.DIRECTION_RIGHT, 0).drawAt(this.ctx, 16, 26);
		this.ctx.restore();

		this.ctx.font = regularFont;
		this.ctx.fillText('W', 194, 74);
		this.ctx.fillText('Movement: A-|-D', 110, 85);
		this.ctx.fillText('S', 197, 100);
		this.ctx.fillText('Fire: SPACEBAR', 110, 123);

		this.ctx.textAlign = 'right';
		this.ctx.font = headerFont;
		this.ctx.fillText('Player 2', canvasWidth - 30, 60);
		this.ctx.save();
		this.ctx.scale(SPRITE_SCALE, SPRITE_SCALE);
		getTank(CONSTS.TANK_PLAYER2, CONSTS.TANK_POWER_NONE, CONSTS.DIRECTION_LEFT, 0).drawAt(this.ctx, canvasWidth - 513, 26);
		this.ctx.restore();

		this.ctx.font = regularFont;
		this.ctx.fillText('^', canvasWidth - 123, 76);
		this.ctx.fillText('Movement: <-|->', canvasWidth - 110, 85);
		this.ctx.fillText('v', canvasWidth - 124, 100);
		this.ctx.fillText('Fire: CONTROL', canvasWidth - 115, 123);
		this.ctx.font = smallFont;
		this.ctx.fillText('(arrow keys)', canvasWidth - 153, 100);

		this.ctx.font = headerFont;
		this.ctx.textAlign = 'center';
		this.ctx.fillText('------', centerX, 150);
		this.ctx.fillText('Hotkeys & Toggles', centerX, 180);

		this.ctx.font = regularFont;
		this.ctx.textAlign = 'left';

		const toggleHeightLine1: number = 205;
		this.ctx.fillText('Sound: N', 5, toggleHeightLine1);
		this.ctx.fillText('Previous Level: 9', 80, toggleHeightLine1);
		this.ctx.fillText('Next Level: 0', 210, toggleHeightLine1);
		this.ctx.fillText('Add Player 2: 2', 320, toggleHeightLine1);
		this.ctx.fillText('Pause: P', 450, toggleHeightLine1);
		this.ctx.fillText('Collision boxes: X', 530, toggleHeightLine1);

		const toggleHeightLine2: number = 230;
		this.ctx.fillText('Rendering: R', 5, toggleHeightLine2);
		this.ctx.fillText('Trail: C', 110, toggleHeightLine2);
		this.ctx.fillText('Framerate: T', 180, toggleHeightLine2);
		this.ctx.fillText('Odd/Even boxes: F', 290, toggleHeightLine2);
		this.ctx.fillText('Graybox: U', 440, toggleHeightLine2);
		this.ctx.fillText('Redbox: R', 550, toggleHeightLine2);

		this.ctx.font = headerFont;
		this.ctx.textAlign = 'center';
		this.ctx.fillText('------', centerX, toggleHeightLine2 + 20);
		this.ctx.fillText('How to Play', centerX, toggleHeightLine2 + 50);

		this.ctx.font = regularFont;
		this.ctx.textAlign = 'center';

		const howtoLine: number = toggleHeightLine2 + 80;
		this.ctx.fillText('Shoot these', 135, howtoLine);
		this.ctx.fillText('Protect this', centerX, howtoLine);
		this.ctx.fillText('Pick up these', canvasWidth - 140, howtoLine);

		this.ctx.save();
		this.ctx.scale(SPRITE_SCALE, SPRITE_SCALE);

		const scaledRow: number = 112;
		const leftOffset: number = 25;
		const rightOffset: number = 170;
		const rowMultiplier: number = 35;
		const columnMultiplier: number = 30;
		getTank(CONSTS.TANK_ENEMY_BASIC, CONSTS.TANK_POWER_NONE, CONSTS.DIRECTION_LEFT, 0).drawAt(this.ctx, leftOffset + columnMultiplier * 0, scaledRow + rowMultiplier * 0);
		getTank(CONSTS.TANK_ENEMY_FAST, CONSTS.TANK_POWER_NONE, CONSTS.DIRECTION_UP, 0).drawAt(this.ctx, leftOffset + columnMultiplier * 1, scaledRow + rowMultiplier * 0);
		getTank(CONSTS.TANK_ENEMY_POWER, CONSTS.TANK_POWER_NONE, CONSTS.DIRECTION_RIGHT, 0).drawAt(this.ctx, leftOffset + columnMultiplier * 0, scaledRow + rowMultiplier * 1);
		getTank(CONSTS.TANK_ENEMY_ARMOR, CONSTS.TANK_POWER_NONE, CONSTS.DIRECTION_DOWN, 0).drawAt(this.ctx, leftOffset + columnMultiplier * 1, scaledRow + rowMultiplier * 1);
		getStructure(CONSTS.STRUCTURE_FLAG, CONSTS.STRUCTURE_WHOLE).drawAt(this.ctx, 120, scaledRow + rowMultiplier * 0);
		getPowerup(CONSTS.POWERUP_HELMET).drawAt(this.ctx, rightOffset + columnMultiplier * 0, scaledRow + rowMultiplier * 0);
		getPowerup(CONSTS.POWERUP_TIMER).drawAt(this.ctx, rightOffset + columnMultiplier * 1, scaledRow + rowMultiplier * 0);
		getPowerup(CONSTS.POWERUP_SHOVEL).drawAt(this.ctx, rightOffset + columnMultiplier * 2, scaledRow + rowMultiplier * 0);
		getPowerup(CONSTS.POWERUP_STAR).drawAt(this.ctx, rightOffset + columnMultiplier * 0, scaledRow + rowMultiplier * 1);
		getPowerup(CONSTS.POWERUP_GRENADE).drawAt(this.ctx, rightOffset + columnMultiplier * 1, scaledRow + rowMultiplier * 1);
		getPowerup(CONSTS.POWERUP_TANK).drawAt(this.ctx, rightOffset + columnMultiplier * 2, scaledRow + rowMultiplier * 1);
		this.ctx.restore();

		const textRow1: number = scaledRow + 270;
		const textRow2: number = textRow1 + 15;
		const textRow3: number = textRow1 + 100;
		const textRow4: number = textRow3 + 15;
		const textLeftOffset: number = 95;
		const textRightOffset: number = 514;
		const textColumnMultiplier: number = 85;
		this.ctx.textAlign = 'center';
		this.ctx.font = smallFont;
		this.ctx.fillText('Drives slow', textLeftOffset + textColumnMultiplier * 0, textRow1);
		this.ctx.fillText('Fires slow', textLeftOffset + textColumnMultiplier * 0, textRow2);
		this.ctx.fillText('Drives fast', textLeftOffset + textColumnMultiplier * 1, textRow1);
		this.ctx.fillText('Fires normally', textLeftOffset + textColumnMultiplier * 1, textRow2);
		this.ctx.fillText('Drives normally', textLeftOffset + textColumnMultiplier * 0, textRow3);
		this.ctx.fillText('Fires fast', textLeftOffset + textColumnMultiplier * 0, textRow4);
		this.ctx.fillText('Drives normally', textLeftOffset + textColumnMultiplier * 1, textRow3);
		this.ctx.fillText('Fires normally', textLeftOffset + textColumnMultiplier * 1, textRow4);
		this.ctx.fillText('If the flag is destroyed,', centerX, textRow1);
		this.ctx.fillText('YOU LOSE THE GAME', centerX, textRow2);
		this.ctx.fillText('Force field', textRightOffset + textColumnMultiplier * 0, textRow1);
		this.ctx.fillText('Freeze', textRightOffset + textColumnMultiplier * 1, textRow1);
		this.ctx.fillText('enemies', textRightOffset + textColumnMultiplier * 1, textRow2);
		this.ctx.fillText('Barricade', textRightOffset + textColumnMultiplier * 2, textRow1);
		this.ctx.fillText('the flag', textRightOffset + textColumnMultiplier * 2, textRow2);
		this.ctx.fillText('Augment', textRightOffset + textColumnMultiplier * 0, textRow3);
		this.ctx.fillText('your bullets', textRightOffset + textColumnMultiplier * 0, textRow4);
		this.ctx.fillText('Enemies', textRightOffset + textColumnMultiplier * 1, textRow3);
		this.ctx.fillText('self-destruct', textRightOffset + textColumnMultiplier * 1, textRow4);
		this.ctx.fillText('Extra life', textRightOffset + textColumnMultiplier * 2, textRow3);

		this.ctx.font = headerFont;
		this.ctx.textAlign = 'center';
		this.ctx.fillText('------', centerX, 520);
		this.ctx.fillText('Environment', centerX, 540);

		const envLeftOffset: number = 30;
		const envColumnMultiplier: number = 47;
		const envScaledRow: number = 195;
		this.ctx.save();
		this.ctx.scale(SPRITE_SCALE, SPRITE_SCALE);
		getStructure(CONSTS.STRUCTURE_BRICK, CONSTS.STRUCTURE_WHOLE).drawAt(this.ctx, envLeftOffset + envColumnMultiplier * 0, envScaledRow);
		getStructure(CONSTS.STRUCTURE_STEEL, CONSTS.STRUCTURE_WHOLE).drawAt(this.ctx, envLeftOffset + envColumnMultiplier * 1, envScaledRow);
		getTerrain(CONSTS.TERRAIN_TREES, 0).drawAt(this.ctx, envLeftOffset + envColumnMultiplier * 2, envScaledRow);
		getTerrain(CONSTS.TERRAIN_WATER, 0).drawAt(this.ctx, envLeftOffset + envColumnMultiplier * 3, envScaledRow);
		getTerrain(CONSTS.TERRAIN_ICE, 0).drawAt(this.ctx, envLeftOffset + envColumnMultiplier * 4, envScaledRow);
		this.ctx.restore();

		const envLine: number = envScaledRow + 410;
		const envOffset: number = envLeftOffset + 69;
		const envMultiplier: number = 135;
		this.ctx.font = regularFont;
		this.ctx.textAlign = 'center';
		this.ctx.fillText('Brick', envOffset + envMultiplier * 0, envLine);
		this.ctx.fillText('Steel', envOffset + envMultiplier * 1, envLine);
		this.ctx.fillText('Trees', envOffset + envMultiplier * 2, envLine);
		this.ctx.fillText('Water', envOffset + envMultiplier * 3, envLine);
		this.ctx.fillText('Ice', envOffset + envMultiplier * 4 + 2, envLine);

		this.ctx.font = headerFont;
		this.ctx.textAlign = 'center';
		this.ctx.fillStyle = 'red';
		this.ctx.fillText('Press ENTER to go back', centerX, canvasHeight - 30);
		this.ctx.fillStyle = 'white';
	}
}
