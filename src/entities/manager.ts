import Border from './border';
import Brick from './brick';
import Bullet from './bullet';
import Effect from './effect';
import EnemyTank from './enemy-tank';
import Entity from './abstract-entity';
import PlayerTank from './player-tank';
import Powerup from './powerup';
import Sounds from '../modules/sounds';
import Statue from './statue';
import Terrain from './terrain';
import type Game from '../game';
import { CONSTS, FIRST_STEP, GAME_CANVAS, GRID_SIZE, GRID_STEP, SOUNDS, UPDATE_INTERVAL } from '../globals';
import { bind } from 'helpful-decorators';

export default class EntitiesManager {
	private readonly game: Game;
	private readonly terrain: Terrain[] = [];
	private readonly bricks: Brick[] = [];
	private readonly statue: Statue[] = [];
	private readonly bullets: Bullet[] = [];
	private readonly playerTanks: PlayerTank[] = [];
	private readonly enemyTanks: EnemyTank[] = [];
	private readonly enemyTanksInPlay: EnemyTank[] = [];
	private readonly powerups: Powerup[] = [];
	private readonly trees: Terrain[] = [];
	private readonly effects: Effect[] = [];
	private readonly borders: Border[] = [];
	private readonly points: Effect[] = [];
	private readonly categories: Entity[][] = [this.terrain, this.bricks, this.statue, this.bullets, this.playerTanks, this.enemyTanksInPlay, this.effects, this.trees, this.powerups, this.borders, this.points];

	private spawnTimer: number = 0;
	private freezeTimer: number = 0;

	constructor(game: Game) {
		this.game = game;
	}

	private fortressHandle(use: (brick: Brick) => void): void {
		const leftWall: number = GRID_STEP * 11;
		const rightWall: number = GRID_STEP * 15;
		const frontWall: number = GRID_STEP * 22;

		this.bricks.forEach(({ position: { x, y } }: Brick, index: number) => {
			if (x >= leftWall && x <= rightWall && y >= frontWall) use(this.bricks[index]);
		});
	}

	private createTempSteelFortress(): void {
		this.removeFortress();

		const type: CONSTS = CONSTS.STRUCTURE_STEEL;
		const look: CONSTS = CONSTS.STRUCTURE_WHOLE;

		this.generateBrick({ position: { x: FIRST_STEP + GRID_STEP * 11, y: FIRST_STEP + GRID_STEP * 23 }, type, look });
		this.generateBrick({ position: { x: FIRST_STEP + GRID_STEP * 12, y: FIRST_STEP + GRID_STEP * 23 }, type, look });
		this.generateBrick({ position: { x: FIRST_STEP + GRID_STEP * 13, y: FIRST_STEP + GRID_STEP * 23 }, type, look });
		this.generateBrick({ position: { x: FIRST_STEP + GRID_STEP * 14, y: FIRST_STEP + GRID_STEP * 23 }, type, look });
		this.generateBrick({ position: { x: FIRST_STEP + GRID_STEP * 11, y: FIRST_STEP + GRID_STEP * 24 }, type, look });
		this.generateBrick({ position: { x: FIRST_STEP + GRID_STEP * 14, y: FIRST_STEP + GRID_STEP * 24 }, type, look });
		this.generateBrick({ position: { x: FIRST_STEP + GRID_STEP * 11, y: FIRST_STEP + GRID_STEP * 25 }, type, look });
		this.generateBrick({ position: { x: FIRST_STEP + GRID_STEP * 14, y: FIRST_STEP + GRID_STEP * 25 }, type, look });

		setTimeout(() => {
			for (var i = 0; i < this.bricks.length; i++) {
				if (this.bricks[i].position.x >= GRID_STEP * 11 && this.bricks[i].position.x <= GRID_STEP * 15 && this.bricks[i].position.y >= GRID_STEP * 22) {
					this.bricks[i].transformToBrick();
				}
			}
		}, 20000);
	}

	@bind
	private putEnemyInPlay() {
		if (this.enemyTanks.length) {
			this.enemyTanksInPlay.concat(this.enemyTanks.splice(0, 1));
		}
	}

	private expodeEnemyTanksInPlay(tank: PlayerTank) {
		Sounds.request(SOUNDS.DESTROY_ENEMY);
		this.game.addScore(tank.getType(), CONSTS.POWERUP_GRENADE);
		this.enemyTanksInPlay.forEach((tank: EnemyTank) => tank.explode());
	}

	public resetSpawnTimer(): void {
		this.spawnTimer = 0;
	}

	public generateEffect(type: CONSTS, target: Entity, onFinished?: () => void): void {
		if (CONSTS.EFFECT_LARGEEXPLOSION === type) {
			type = CONSTS.EFFECT_SMALLEXPLOSION;
			onFinished = () => this.generateEffect(CONSTS.EFFECT_LARGEEXPLOSION, target, onFinished);
		}

		if (CONSTS.EFFECT_POINTS === type) {
			this.points.push(new Effect({ type, target, onFinished }));
		} else {
			this.effects.push(new Effect({ type, target, onFinished }));
		}
	}

	public generateBorder(params: { position: Position; halfWidth: number; halfHeight: number }): void {
		this.borders.push(new Border(params));
	}

	public generateBrick(params: { position: Position; type: CONSTS; look?: CONSTS }): void {
		this.bricks.push(new Brick(params));
	}

	public generateTerrain(params: { position: Position; type: CONSTS }) {
		const terrain: Terrain = new Terrain(params);

		if (terrain.isTrees()) {
			this.trees.push(terrain);
		} else {
			this.terrain.push(terrain);
		}
	}

	public generatePowerup(): void {
		this.powerups.push(
			new Powerup({
				type: Math.floor(Math.random() * (CONSTS.POWERUP_TANK - CONSTS.POWERUP_HELMET + 1)) + CONSTS.POWERUP_HELMET,
				position: {
					x: Math.floor(Math.random() * (GAME_CANVAS.width - GRID_STEP * 4)) + GRID_STEP * 2,
					y: Math.floor(Math.random() * (GAME_CANVAS.height - GRID_STEP * 6)) + GRID_STEP * 2,
				},
			})
		);
	}

	public saveFortress(save: (brick: Brick) => void): void {
		this.fortressHandle(save);
	}

	public restoreFortress(savedBricks: Brick[]): void {
		this.removeFortress();
		this.bricks.concat(savedBricks);
	}

	public removeFortress(): void {
		this.fortressHandle((brick: Brick) => brick.kill());
	}

	public generateEnemyTank(params: { position: Position; type: CONSTS; powerup: CONSTS }): void {
		this.enemyTanks.push(new EnemyTank(params));
	}

	public generatePlayerTank(type: CONSTS, gamepad?: Gamepad): void {
		const playerSpriteOffset: number = CONSTS.TANK_PLAYER1 === type ? 0 : 128;
		const position: Position = {
			x: GAME_CANVAS.width / 26 + (GAME_CANVAS.width / 13) * (CONSTS.TANK_PLAYER1 === type ? 4 : 8),
			y: GAME_CANVAS.height / 26 + (GAME_CANVAS.height / 13) * 12,
		};

		this.playerTanks.push(new PlayerTank({ type, gamepad, position, playerSpriteOffset }));

		const tankIndex: number = this.playerTanks.length - 1;

		this.playerTanks[tankIndex].kill();
		this.playerTanks[tankIndex].reset();
	}

	public generateStatue(): void {
		this.statue.push(new Statue());
	}

	public generateBullet(position: Position, direction: CONSTS, velocity: number, strength: number, tank: EnemyTank | PlayerTank): void {
		this.bullets.push(new Bullet({ position, velocity, direction, strength, tank }));
	}

	public getPlayerTank(index: number): PlayerTank {
		return this.playerTanks[index];
	}

	public getEnemiesTanks(): EnemyTank[] {
		return this.enemyTanks;
	}

	public getStatue(): Statue {
		return this.statue[this.statue.length - 1];
	}

	public isOnIce({ x, y }: Position): boolean {
		var j = Math.floor((x / GAME_CANVAS.width) * GRID_SIZE);
		var i = Math.floor((y / GAME_CANVAS.height) * GRID_SIZE);

		if (4 === this.game.getLevelData()[i][j]) {
			return true;
		}

		return false;
	}

	public isEnemiesFreezed(): boolean {
		return this.freezeTimer > 0;
	}

	public hasEnemies(): boolean {
		return this.enemyTanks.length + this.enemyTanksInPlay.length > 0;
	}

	public spawnEnemyTank(): void {
		this.generateEffect(CONSTS.EFFECT_SPAWNFLASH, this.enemyTanks[0], this.putEnemyInPlay);
	}

	public findEntityInRange(x1: number, y1: number, x2: number, y2: number): Entity | undefined {
		this.categories.forEach((category: Entity[]) => {
			for (let i: number = 0; i < category.length; i++) {
				if (!category[i].collisional) {
					return;
				}

				const { rx1, ry1, rx2, ry2 }: RectCoordinates = category[i].rect;

				if (x1 < rx2 && x2 > rx1 && y1 < ry2 && y2 > ry1) {
					return category[i];
				}
			}
		});

		if (x1 < 0) {
			return this.borders[2];
		}

		if (x2 > GAME_CANVAS.width) {
			return this.borders[3];
		}

		if (y1 < 0) {
			return this.borders[0];
		}

		if (y2 > GAME_CANVAS.height) {
			return this.borders[1];
		}

		return undefined;
	}

	public findEntitiesInRange(x1: number, y1: number, x2: number, y2: number): Entity[] {
		const entities: Entity[] = [];

		this.categories.forEach((category: Entity[]) => {
			for (let i: number = 0; i < category.length; i++) {
				if (!category[i].collisional) {
					continue;
				}

				const { rx1, ry1, rx2, ry2 }: RectCoordinates = category[i].rect;

				if (x1 < rx2 && x2 > rx1 && y1 < ry2 && y2 > ry1) {
					entities.push(category[i]);
				}
			}
		});

		return entities;
	}

	public activatePowerup(tank: PlayerTank, type: CONSTS): void {
		this.game.addScore(tank.getType(), type);

		switch (type) {
			case CONSTS.POWERUP_HELMET:
				tank.addForceField();
				break;
			case CONSTS.POWERUP_TIMER:
				this.freezeTimer = 15000 / UPDATE_INTERVAL;
				break;
			case CONSTS.POWERUP_SHOVEL:
				this.createTempSteelFortress();
				break;
			case CONSTS.POWERUP_STAR:
				tank.addStar();
				break;
			case CONSTS.POWERUP_GRENADE:
				this.expodeEnemyTanksInPlay(tank);
				break;
			case CONSTS.POWERUP_TANK:
				tank.addExtraLife();
				break;
		}
	}

	public update(units: number): void {
		this.freezeTimer -= units;
		this.spawnTimer -= units;

		this.categories.forEach((category: Entity[], index: number) => {
			let i: number = 0;

			while (i < category.length) {
				if (category[i].update(units)) {
					if (5 === index && (category[i] as EnemyTank).isUnique()) {
						this.generatePowerup();
					}

					category.splice(i, 1);
				} else {
					++i;
				}
			}
		});

		if (this.spawnTimer < 0 && this.enemyTanksInPlay.length < 4 && this.enemyTanks.length > 0) {
			this.spawnEnemyTank();
			this.spawnTimer = 3000 / UPDATE_INTERVAL;
		}
	}

	public render(): void {
		this.categories.forEach((category: Entity[]) => category.forEach((entity: Entity) => entity.render()));
	}
}
