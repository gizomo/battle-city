import Gamepads from './modules/gamepads';
import Keyboard from './modules/keyboard';
import { BG_CTX, CONSTS, KEYS, SPRITE_SCALE } from './globals';
import { clearCanvas } from './utils';
import { getPowerup, getStructure, getTank, getTerrain } from './sprites';

const MENU: string[] = ['1 PLAYER', '2 PLAYERS', 'VS MODE', 'INSTRUCTIONS'];

export default class Menu {
	private readonly selectGame: (mode: GameMode, level: number) => void;
	private readonly items: (number | string)[] = MENU;
	private selected: number = 0;
	private levelsSelectionEnabled: boolean = false;
	private helpEnabled: boolean = false;

	constructor(selectGame: (mode: GameMode, level: number) => void) {
		this.selectGame = selectGame;
	}

	public update(): void {
		setInterval(() => Gamepads.initForMenu(), 3000);

		let mode: GameMode = 'single';

		if (Keyboard.handleKey(KEYS.ACTION) || Keyboard.handleKey(KEYS.ACTION1)) {
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
				clearCanvas(BG_CTX);
				BG_CTX.restore();
				this.selectGame(mode, this.selected);
			}
		} else if (!this.helpEnabled && (Keyboard.handleKey(KEYS.UP1) || Keyboard.handleKey(KEYS.UP2))) {
			this.selected--;

			if (this.selected < 0) {
				this.selected = this.items.length - 1;
			}
		} else if (!this.helpEnabled && (Keyboard.handleKey(KEYS.DOWN1) || Keyboard.handleKey(KEYS.DOWN2))) {
			this.selected = (this.selected + 1) % this.items.length;
		}
	}

	public render(): void {
		clearCanvas(BG_CTX, 'black');

		const centerX: number = BG_CTX.canvas.width / 2;
		const centerY: number = BG_CTX.canvas.height / 2;

		BG_CTX.font = '20px Arial';
		BG_CTX.textAlign = 'center';

		if (!this.levelsSelectionEnabled) {
			if (this.helpEnabled) {
				this.drawHelpMenu();
			} else {
				(this.items as string[]).forEach((text: string, index: number) => {
					BG_CTX.fillStyle = index === this.selected ? 'red' : 'white';
					BG_CTX.fillText(text, centerX, centerY - 30 + index * 30);
				});
			}
		} else {
			BG_CTX.fillStyle = 'white';
			BG_CTX.fillText('STAGE ' + this.items[this.selected], centerX, centerY);
		}
	}

	private drawHelpMenu(): void {
		const headerFont: string = '20px Arial';
		const regularFont: string = '14px Arial';
		const smallFont: string = '10px Arial';
		const centerX: number = BG_CTX.canvas.width / 2;
		const canvasWidth: number = BG_CTX.canvas.width;
		const canvasHeight: number = BG_CTX.canvas.height;

		clearCanvas(BG_CTX, 'black');

		BG_CTX.fillStyle = 'white';
		BG_CTX.textAlign = 'center';
		BG_CTX.font = headerFont;
		BG_CTX.fillText('Controls', centerX, 30);

		BG_CTX.textAlign = 'left';
		BG_CTX.fillText('Player 1', 30, 60);
		BG_CTX.save();
		BG_CTX.scale(SPRITE_SCALE, SPRITE_SCALE);
		getTank(CONSTS.TANK_PLAYER1, CONSTS.TANK_POWER_NONE, CONSTS.DIRECTION_RIGHT, 0).drawAt(BG_CTX, 16, 26);
		BG_CTX.restore();

		BG_CTX.font = regularFont;
		BG_CTX.fillText('W', 194, 74);
		BG_CTX.fillText('Movement: A-|-D', 110, 85);
		BG_CTX.fillText('S', 197, 100);
		BG_CTX.fillText('Fire: SPACEBAR', 110, 123);

		BG_CTX.textAlign = 'right';
		BG_CTX.font = headerFont;
		BG_CTX.fillText('Player 2', canvasWidth - 30, 60);
		BG_CTX.save();
		BG_CTX.scale(SPRITE_SCALE, SPRITE_SCALE);
		getTank(CONSTS.TANK_PLAYER2, CONSTS.TANK_POWER_NONE, CONSTS.DIRECTION_LEFT, 0).drawAt(BG_CTX, canvasWidth - 513, 26);
		BG_CTX.restore();

		BG_CTX.font = regularFont;
		BG_CTX.fillText('^', canvasWidth - 123, 76);
		BG_CTX.fillText('Movement: <-|->', canvasWidth - 110, 85);
		BG_CTX.fillText('v', canvasWidth - 124, 100);
		BG_CTX.fillText('Fire: CONTROL', canvasWidth - 115, 123);
		BG_CTX.font = smallFont;
		BG_CTX.fillText('(arrow keys)', canvasWidth - 153, 100);

		BG_CTX.font = headerFont;
		BG_CTX.textAlign = 'center';
		BG_CTX.fillText('------', centerX, 150);
		BG_CTX.fillText('Hotkeys & Toggles', centerX, 180);

		BG_CTX.font = regularFont;
		BG_CTX.textAlign = 'left';

		const toggleHeightLine1: number = 205;
		BG_CTX.fillText('Sound: N', 5, toggleHeightLine1);
		BG_CTX.fillText('Previous Level: 9', 80, toggleHeightLine1);
		BG_CTX.fillText('Next Level: 0', 210, toggleHeightLine1);
		BG_CTX.fillText('Add Player 2: 2', 320, toggleHeightLine1);
		BG_CTX.fillText('Pause: P', 450, toggleHeightLine1);
		BG_CTX.fillText('Collision boxes: X', 530, toggleHeightLine1);

		const toggleHeightLine2: number = 230;
		BG_CTX.fillText('Rendering: R', 5, toggleHeightLine2);
		BG_CTX.fillText('Trail: C', 110, toggleHeightLine2);
		BG_CTX.fillText('Framerate: T', 180, toggleHeightLine2);
		BG_CTX.fillText('Odd/Even boxes: F', 290, toggleHeightLine2);
		BG_CTX.fillText('Graybox: U', 440, toggleHeightLine2);
		BG_CTX.fillText('Redbox: R', 550, toggleHeightLine2);

		BG_CTX.font = headerFont;
		BG_CTX.textAlign = 'center';
		BG_CTX.fillText('------', centerX, toggleHeightLine2 + 20);
		BG_CTX.fillText('How to Play', centerX, toggleHeightLine2 + 50);

		BG_CTX.font = regularFont;
		BG_CTX.textAlign = 'center';

		const howtoLine: number = toggleHeightLine2 + 80;
		BG_CTX.fillText('Shoot these', 135, howtoLine);
		BG_CTX.fillText('Protect this', centerX, howtoLine);
		BG_CTX.fillText('Pick up these', canvasWidth - 140, howtoLine);

		BG_CTX.save();
		BG_CTX.scale(SPRITE_SCALE, SPRITE_SCALE);

		const scaledRow: number = 112;
		const leftOffset: number = 25;
		const rightOffset: number = 170;
		const rowMultiplier: number = 35;
		const columnMultiplier: number = 30;
		getTank(CONSTS.TANK_ENEMY_BASIC, CONSTS.TANK_POWER_NONE, CONSTS.DIRECTION_LEFT, 0).drawAt(BG_CTX, leftOffset + columnMultiplier * 0, scaledRow + rowMultiplier * 0);
		getTank(CONSTS.TANK_ENEMY_FAST, CONSTS.TANK_POWER_NONE, CONSTS.DIRECTION_UP, 0).drawAt(BG_CTX, leftOffset + columnMultiplier * 1, scaledRow + rowMultiplier * 0);
		getTank(CONSTS.TANK_ENEMY_POWER, CONSTS.TANK_POWER_NONE, CONSTS.DIRECTION_RIGHT, 0).drawAt(BG_CTX, leftOffset + columnMultiplier * 0, scaledRow + rowMultiplier * 1);
		getTank(CONSTS.TANK_ENEMY_ARMOR, CONSTS.TANK_POWER_NONE, CONSTS.DIRECTION_DOWN, 0).drawAt(BG_CTX, leftOffset + columnMultiplier * 1, scaledRow + rowMultiplier * 1);
		getStructure(CONSTS.STRUCTURE_FLAG, CONSTS.STRUCTURE_WHOLE).drawAt(BG_CTX, 120, scaledRow + rowMultiplier * 0);
		getPowerup(CONSTS.POWERUP_HELMET).drawAt(BG_CTX, rightOffset + columnMultiplier * 0, scaledRow + rowMultiplier * 0);
		getPowerup(CONSTS.POWERUP_TIMER).drawAt(BG_CTX, rightOffset + columnMultiplier * 1, scaledRow + rowMultiplier * 0);
		getPowerup(CONSTS.POWERUP_SHOVEL).drawAt(BG_CTX, rightOffset + columnMultiplier * 2, scaledRow + rowMultiplier * 0);
		getPowerup(CONSTS.POWERUP_STAR).drawAt(BG_CTX, rightOffset + columnMultiplier * 0, scaledRow + rowMultiplier * 1);
		getPowerup(CONSTS.POWERUP_GRENADE).drawAt(BG_CTX, rightOffset + columnMultiplier * 1, scaledRow + rowMultiplier * 1);
		getPowerup(CONSTS.POWERUP_TANK).drawAt(BG_CTX, rightOffset + columnMultiplier * 2, scaledRow + rowMultiplier * 1);
		BG_CTX.restore();

		const textRow1: number = scaledRow + 270;
		const textRow2: number = textRow1 + 15;
		const textRow3: number = textRow1 + 100;
		const textRow4: number = textRow3 + 15;
		const textLeftOffset: number = 95;
		const textRightOffset: number = 514;
		const textColumnMultiplier: number = 85;
		BG_CTX.textAlign = 'center';
		BG_CTX.font = smallFont;
		BG_CTX.fillText('Drives slow', textLeftOffset + textColumnMultiplier * 0, textRow1);
		BG_CTX.fillText('Fires slow', textLeftOffset + textColumnMultiplier * 0, textRow2);
		BG_CTX.fillText('Drives fast', textLeftOffset + textColumnMultiplier * 1, textRow1);
		BG_CTX.fillText('Fires normally', textLeftOffset + textColumnMultiplier * 1, textRow2);
		BG_CTX.fillText('Drives normally', textLeftOffset + textColumnMultiplier * 0, textRow3);
		BG_CTX.fillText('Fires fast', textLeftOffset + textColumnMultiplier * 0, textRow4);
		BG_CTX.fillText('Drives normally', textLeftOffset + textColumnMultiplier * 1, textRow3);
		BG_CTX.fillText('Fires normally', textLeftOffset + textColumnMultiplier * 1, textRow4);
		BG_CTX.fillText('If the flag is destroyed,', centerX, textRow1);
		BG_CTX.fillText('YOU LOSE THE GAME', centerX, textRow2);
		BG_CTX.fillText('Force field', textRightOffset + textColumnMultiplier * 0, textRow1);
		BG_CTX.fillText('Freeze', textRightOffset + textColumnMultiplier * 1, textRow1);
		BG_CTX.fillText('enemies', textRightOffset + textColumnMultiplier * 1, textRow2);
		BG_CTX.fillText('Barricade', textRightOffset + textColumnMultiplier * 2, textRow1);
		BG_CTX.fillText('the flag', textRightOffset + textColumnMultiplier * 2, textRow2);
		BG_CTX.fillText('Augment', textRightOffset + textColumnMultiplier * 0, textRow3);
		BG_CTX.fillText('your bullets', textRightOffset + textColumnMultiplier * 0, textRow4);
		BG_CTX.fillText('Enemies', textRightOffset + textColumnMultiplier * 1, textRow3);
		BG_CTX.fillText('self-destruct', textRightOffset + textColumnMultiplier * 1, textRow4);
		BG_CTX.fillText('Extra life', textRightOffset + textColumnMultiplier * 2, textRow3);

		BG_CTX.font = headerFont;
		BG_CTX.textAlign = 'center';
		BG_CTX.fillText('------', centerX, 520);
		BG_CTX.fillText('Environment', centerX, 540);

		const envLeftOffset: number = 30;
		const envColumnMultiplier: number = 47;
		const envScaledRow: number = 195;
		BG_CTX.save();
		BG_CTX.scale(SPRITE_SCALE, SPRITE_SCALE);
		getStructure(CONSTS.STRUCTURE_BRICK, CONSTS.STRUCTURE_WHOLE).drawAt(BG_CTX, envLeftOffset + envColumnMultiplier * 0, envScaledRow);
		getStructure(CONSTS.STRUCTURE_STEEL, CONSTS.STRUCTURE_WHOLE).drawAt(BG_CTX, envLeftOffset + envColumnMultiplier * 1, envScaledRow);
		getTerrain(CONSTS.TERRAIN_TREES, 0).drawAt(BG_CTX, envLeftOffset + envColumnMultiplier * 2, envScaledRow);
		getTerrain(CONSTS.TERRAIN_WATER, 0).drawAt(BG_CTX, envLeftOffset + envColumnMultiplier * 3, envScaledRow);
		getTerrain(CONSTS.TERRAIN_ICE, 0).drawAt(BG_CTX, envLeftOffset + envColumnMultiplier * 4, envScaledRow);
		BG_CTX.restore();

		const envLine: number = envScaledRow + 410;
		const envOffset: number = envLeftOffset + 69;
		const envMultiplier: number = 135;
		BG_CTX.font = regularFont;
		BG_CTX.textAlign = 'center';
		BG_CTX.fillText('Brick', envOffset + envMultiplier * 0, envLine);
		BG_CTX.fillText('Steel', envOffset + envMultiplier * 1, envLine);
		BG_CTX.fillText('Trees', envOffset + envMultiplier * 2, envLine);
		BG_CTX.fillText('Water', envOffset + envMultiplier * 3, envLine);
		BG_CTX.fillText('Ice', envOffset + envMultiplier * 4 + 2, envLine);

		BG_CTX.font = headerFont;
		BG_CTX.textAlign = 'center';
		BG_CTX.fillStyle = 'red';
		BG_CTX.fillText('Press ENTER to go back', centerX, canvasHeight - 30);
		BG_CTX.fillStyle = 'white';
	}
}
