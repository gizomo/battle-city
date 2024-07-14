import Brick from './entities/brick';
import EntitiesManager from './entities/manager';
import Gamepads from './modules/gamepads';
import { CONSTS, FIRST_STEP, GAME_CANVAS, GRID_SIZE, GRID_STEP, LEVEL_START_POSITION, UPDATE_INTERVAL } from './globals';
import { levels } from './levels';
import { enemies } from './enemies';

export default class Game {
	private readonly playersCount: number;
	private readonly friendlyFire: boolean;
	private readonly enemiesEnabled: boolean;
	private readonly entitiesManager: EntitiesManager = new EntitiesManager();

	private fortress: Brick[] = [];
	private freezeTimer: number = 0;
	private spawnTimer: number = 0;
	private gameOver: boolean = false;
	private gameOverCalled: boolean = false;
	private gameOverPosition: number = GAME_CANVAS.height;
	private nextLevelRequested: boolean = false;
	private level: number;

	private onGameOver: () => void;

	constructor({ playersCount, friendlyFire, enemiesEnabled, level }: GameOptions, onGameOver: () => void) {
		this.playersCount = playersCount;
		this.friendlyFire = friendlyFire;
		this.enemiesEnabled = enemiesEnabled;
		this.level = level;
		this.onGameOver = onGameOver;

		this.createPlayersTanks();
		this.prepareLevel();
	}

	private createPlayersTanks(): void {
		this.entitiesManager.generatePlayerTank(CONSTS.TANK_PLAYER1, Gamepads.getGamepad());

		if (this.playersCount >= 2) {
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
			powerup,
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
		const levelData: number[][] = levels[`stage_${this.level}`];

		for (let i: number = 0; i < GRID_SIZE; i++) {
			for (let j: number = 0; j < GRID_SIZE; j++) {
				const position: Position = { x: FIRST_STEP + GRID_STEP * j, y: FIRST_STEP + GRID_STEP * i };

				switch (levelData[i][j]) {
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
		const enemiesData: number[] = enemies[`stage_${this.level}`];
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

	private initSpawnTimer(): void {
		this.spawnTimer = 0;
	}

	private resetSpawnTimer(): void {
		this.spawnTimer = 3000 / UPDATE_INTERVAL;
	}

	private prepareLevel(): void {
		this.createBorders();
		this.createLevel();
		this.restoreFortress();
		this.createEnemies();
		this.createStatue();
		this.initSpawnTimer();
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

	public update(units: number): void {
		this.entitiesManager.update(units);

		if (this.gameOver) {
			this.gameOverPosition = Math.max(GAME_CANVAS.height / 2, this.gameOverPosition - 2 * units);

			if (GAME_CANVAS.height / 2 === this.gameOverPosition && !this.nextLevelRequested) {
				this.nextLevelRequested = true;

				setTimeout(() => {
					this.nextLevelRequested = false;
					this.gameOverCalled = false;
					this.gameOverPosition = GAME_CANVAS.height;
					this.gameOver = false;
					this.onGameOver();
				}, 2000);
			}
		}

		this.spawnTimer -= units;
		this.freezeTimer -= units;

		if (!this.gameOverCalled && !this.entitiesManager.getPlayerTank(0).hasLifes()) {
			if (2 === this.playersCount && !this.entitiesManager.getPlayerTank(1).hasLifes()) {
				this.gameOverCalled = true;
				setTimeout(() => this.onGameOver(), 1000);
			}
		}

		if (!this.nextLevelRequested && this.entitiesManager.hasEnemies()) {
			this.nextLevelRequested = true;
			setTimeout(() => this.nextLevel(), 2000);
		}

		if (this.spawnTimer < 0 && this.entitiesManager.hasEnemyToSpawn()) {
			this.entitiesManager.spawnEnemyTank();
			this.resetSpawnTimer();
		}
	}
}
