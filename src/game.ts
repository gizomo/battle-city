import EntitiesManager from './entities/manager';
import Gamepads from './modules/gamepads';
import type Brick from './entities/brick';
import type PlayerTank from './entities/player-tank';
import { BG_CTX, CONSTS, FIRST_STEP, GAME_CANVAS, GAME_CTX, GRID_SIZE, GRID_STEP, SCORES } from './globals';
import { enemies } from './enemies';
import { getEnemyIcon, getFlagIcon, getGameOver, getNumber, getPlayerIcon, getPlayerTankIcon, Sprite } from './sprites';
import { levels } from './levels';

type ScoreName = Lowercase<keyof typeof SCORES>;

type LevelScore = Record<ScoreName, number>;

type GameStats = {
	[level: number]: LevelScore;
	points: number;
};

export default class Game {
	public readonly playersCount: number;
	public readonly friendlyFire: boolean;
	public readonly enemiesEnabled: boolean;
	public readonly entitiesManager: EntitiesManager;

	private firstPlayerStats: GameStats = { points: 0 } as GameStats;
	private secondPlayerStats: GameStats = { points: 0 } as GameStats;

	private fortress: Brick[] = [];

	private gameOver: boolean = false;
	private gameOverCalled: boolean = false;
	private gameOverPosition: Position = { x: GAME_CANVAS.width / 2, y: GAME_CANVAS.height };
	private gameOverSprite: Sprite = getGameOver();
	private nextLevelRequested: boolean = false;
	private level: number;

	private onGameOver: () => void;

	constructor({ playersCount, friendlyFire, enemiesEnabled, level }: GameOptions, onGameOver: () => void) {
		window.$game = this;
		this.entitiesManager = new EntitiesManager(this);
		this.playersCount = playersCount;
		this.friendlyFire = friendlyFire;
		this.enemiesEnabled = enemiesEnabled;
		this.level = level;
		this.onGameOver = onGameOver;

		this.createPlayersTanks();
		this.prepareLevel();
	}

	private hasSecondPlayer(): boolean {
		return 2 === this.playersCount;
	}

	private createPlayersTanks(): void {
		this.entitiesManager.generatePlayerTank(CONSTS.TANK_PLAYER1, Gamepads.getGamepad());

		if (this.hasSecondPlayer()) {
			this.entitiesManager.generatePlayerTank(CONSTS.TANK_PLAYER2, Gamepads.getGamepad());
		}
	}

	private createEnemyTank(position: number, type: CONSTS, powerup: CONSTS) {
		this.entitiesManager.generateEnemyTank({
			position: {
				x: GAME_CANVAS.width / 26 + position * (GAME_CANVAS.width / 2 - GAME_CANVAS.width / 26),
				y: GAME_CANVAS.height / 26,
			},
			type,
			power: powerup,
		});
	}

	private createBorders(): void {
		this.entitiesManager.generateBorder({
			position: { x: GAME_CANVAS.width / 2, y: -50 },
			halfWidth: GAME_CANVAS.width / 2,
			halfHeight: 50,
		});
		this.entitiesManager.generateBorder({
			position: { x: GAME_CANVAS.width / 2, y: GAME_CANVAS.height + 50 },
			halfWidth: GAME_CANVAS.width / 2,
			halfHeight: 50,
		});
		this.entitiesManager.generateBorder({
			position: { x: -50, y: GAME_CANVAS.height / 2 },
			halfWidth: 50,
			halfHeight: GAME_CANVAS.height / 2,
		});
		this.entitiesManager.generateBorder({
			position: { x: GAME_CANVAS.width + 50, y: GAME_CANVAS.height / 2 },
			halfWidth: 50,
			halfHeight: GAME_CANVAS.height / 2,
		});
	}

	private createLevel(): void {
		for (let i: number = 0; i < GRID_SIZE; i++) {
			for (let j: number = 0; j < GRID_SIZE; j++) {
				const position: Position = { x: FIRST_STEP + GRID_STEP * j, y: FIRST_STEP + GRID_STEP * i };

				switch (this.getLevelData()[i][j]) {
					case 0:
						this.entitiesManager.generateBrick({ position, type: CONSTS.STRUCTURE_BRICK, look: CONSTS.STRUCTURE_WHOLE });
						break;
					case 1:
						this.entitiesManager.generateBrick({ position, type: CONSTS.STRUCTURE_STEEL, look: CONSTS.STRUCTURE_WHOLE });
						break;
					case 2:
						this.entitiesManager.generateTerrain({ position, type: CONSTS.TERRAIN_WATER });
						break;
					case 3:
						this.entitiesManager.generateTerrain({ position, type: CONSTS.TERRAIN_TREES });
						break;
					case 4:
						this.entitiesManager.generateTerrain({ position, type: CONSTS.TERRAIN_ICE });
						break;
					default:
						break;
				}
			}
		}
	}

	private restoreFortress(): void {
		if (this.fortress.length) {
			this.entitiesManager.restoreFortress(this.fortress);
		}
	}

	private createEnemies(): void {
		const enemiesData: number[] = enemies[`stage_${this.level + 1}`];
		let position: number = 1;

		for (let i: number = 0; i < 20; i++) {
			const powerup: CONSTS = 3 === i || 10 === i || 17 === i ? CONSTS.TANK_POWER_DROPSPOWERUP : CONSTS.TANK_POWER_NONE;

			switch (enemiesData[i]) {
				case 0:
					this.createEnemyTank(position % 3, CONSTS.TANK_ENEMY_BASIC, powerup);
					break;
				case 1:
					this.createEnemyTank(position % 3, CONSTS.TANK_ENEMY_FAST, powerup);
					break;
				case 2:
					this.createEnemyTank(position % 3, CONSTS.TANK_ENEMY_POWER, powerup);
					break;
				case 3:
					this.createEnemyTank(position % 3, CONSTS.TANK_ENEMY_ARMOR, powerup);
					break;
			}

			position++;
		}
	}

	private createStatue(): void {
		this.entitiesManager.generateStatue();
	}

	private initEnemiesSpawn(): void {
		this.entitiesManager.resetSpawnTimer();
	}

	private prepareLevel(): void {
		this.createBorders();
		this.createLevel();
		this.restoreFortress();
		this.createEnemies();
		this.createStatue();
		this.initEnemiesSpawn();
	}

	private previousLevel(): void {
		this.nextLevelRequested = false;

		if (this.level > 0) {
			this.level--;
			// this.entitiesManager.destroyLevel();
			this.prepareLevel();
		}
	}

	private nextLevel(): void {
		this.nextLevelRequested = false;

		if (this.level < 34) {
			this.level++;
			// this.entitiesManager.destroyLevel();
			this.prepareLevel();
		}
	}

	private setGameOver(): void {
		if (!this.gameOver) {
			this.gameOver = true;
		}
	}

	private drawInfo(): void {
		getPlayerIcon(1).drawScaledAt(BG_CTX, 685, 390);
		getPlayerTankIcon().drawScaledAt(BG_CTX, 670, 422);
		getNumber(Math.min(9, this.entitiesManager.getPlayerTank(0).getLifes())).drawScaledAt(BG_CTX, 695, 422);

		if (this.hasSecondPlayer()) {
			getPlayerIcon(2).drawScaledAt(BG_CTX, 685, 470);
			getPlayerTankIcon().drawScaledAt(BG_CTX, 670, 502);
			getNumber(Math.min(9, this.entitiesManager.getPlayerTank(1).getLifes())).drawScaledAt(BG_CTX, 695, 502);
		}

		getFlagIcon().drawScaledAt(BG_CTX, 685, 555);

		const level: number = this.level + 1;
		const firstDigit: number = Math.floor(level / 10);
		const secondDigit: number = level % 10;

		if (firstDigit > 0) {
			getNumber(firstDigit).drawScaledAt(BG_CTX, 670, 595);
		}

		getNumber(secondDigit).drawScaledAt(BG_CTX, 695, 595);

		const enemiesLeft: number = this.entitiesManager.getEnemiesTanks().length;
		let x: number = 675;
		let y: number = 70;

		for (let i: number = 0; i < enemiesLeft; i++) {
			y = y + ((i + 1) % 2) * 24;
			getEnemyIcon().drawScaledAt(BG_CTX, x + (i % 2) * 24, y);
		}
	}

	public getLevelData(): number[][] {
		return levels[`stage_${this.level + 1}`];
	}

	private updateStats(stats: GameStats, points: number, score: ScoreName): void {
		stats.points += points;

		if (!stats[this.level + 1]) {
			stats[this.level + 1] = {
				basic: 0,
				fast: 0,
				power: 0,
				armor: 0,
				powerup: 0,
			};
		}

		stats[this.level + 1][score] += 1;
	}

	public addScore(player: CONSTS, type: CONSTS): void {
		const stats: GameStats = CONSTS.TANK_PLAYER1 === player ? this.firstPlayerStats : this.secondPlayerStats;

		switch (type) {
			case CONSTS.TANK_ENEMY_BASIC:
				this.updateStats(stats, SCORES.BASIC, 'basic');
				break;
			case CONSTS.TANK_ENEMY_FAST:
				this.updateStats(stats, SCORES.FAST, 'fast');
				break;
			case CONSTS.TANK_ENEMY_POWER:
				this.updateStats(stats, SCORES.POWER, 'power');
				break;
			case CONSTS.TANK_ENEMY_ARMOR:
				this.updateStats(stats, SCORES.ARMOR, 'armor');
				break;
			case CONSTS.POWERUP_HELMET:
			case CONSTS.POWERUP_TIMER:
			case CONSTS.POWERUP_SHOVEL:
			case CONSTS.POWERUP_STAR:
			case CONSTS.POWERUP_GRENADE:
			case CONSTS.POWERUP_TANK:
				this.updateStats(stats, SCORES.POWERUP, 'powerup');
				break;
		}
	}

	private updateGamepads(): void {
		if (Gamepads.hasGamepads()) {
			this.entitiesManager.getPlayerTanks().forEach((tank: PlayerTank) => Gamepads.initForGame(tank.getGamepad(), tank.getType()));
		}
	}

	public update(units: number): void {
		this.updateGamepads();

		this.entitiesManager.update(units);

		if (this.gameOver) {
			this.gameOverPosition.y = Math.max(GAME_CANVAS.height / 2, this.gameOverPosition.y - 2 * units);

			if (GAME_CANVAS.height / 2 === this.gameOverPosition.y && !this.nextLevelRequested) {
				this.nextLevelRequested = true;

				setTimeout(() => {
					this.nextLevelRequested = false;
					this.gameOverCalled = false;
					this.gameOverPosition.y = GAME_CANVAS.height;
					this.onGameOver();
				}, 2000);
			}
		}

		if (!this.gameOverCalled && !this.entitiesManager.getPlayerTank(0).hasLifes()) {
			if (this.hasSecondPlayer() && !this.entitiesManager.getPlayerTank(1).hasLifes()) {
				this.gameOverCalled = true;
				setTimeout(() => this.setGameOver(), 1000);
			}
		}

		if (!this.gameOverCalled && this.entitiesManager.getStatue().isKilled()) {
			this.gameOverCalled = true;
			setTimeout(() => this.setGameOver(), 1000);
		}

		if (!this.nextLevelRequested && !this.entitiesManager.hasEnemies()) {
			this.nextLevelRequested = true;
			setTimeout(() => this.nextLevel(), 2000);
		}
	}

	public render(): void {
		this.entitiesManager.render();

		if (this.gameOver) {
			this.gameOverSprite.drawScaledAt(GAME_CTX, this.gameOverPosition.x, this.gameOverPosition.y);
		}

		this.drawInfo();
	}
}
