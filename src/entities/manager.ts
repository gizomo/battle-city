import Border from './border';
import Brick from './brick';
import Effect from './effect';
import EnemyTank from './enemy-tank';
import Entity from './abstract-entity';
import PlayerTank from './player-tank';
import Statue from './statue';
import Terrain from './terrain';
import { CONSTS, GAME_CANVAS, GRID_SIZE } from '../globals';
import { bind } from 'helpful-decorators';

export default class EntitiesManager {
	private readonly terrain: (Border | Terrain)[] = [];
	private readonly bricks: Brick[] = [];
	private readonly statue: Statue[] = [];
	private readonly bullets: [] = [];
	private readonly playerTanks: PlayerTank[] = [];
	private readonly enemyTanks: EnemyTank[] = [];
	private readonly enemyTanksInPlay: EnemyTank[] = [];
	private readonly powerups: [] = [];
	private readonly trees: Terrain[] = [];
	private readonly effects: Effect[] = [];
	private readonly border: [] = [];
	private readonly points: Effect[] = [];
	private readonly categories: Entity[][] = [this.terrain, this.bricks, this.statue, this.bullets, this.playerTanks, this.enemyTanksInPlay, this.effects, this.trees, this.powerups, this.border, this.points];

	private fortressHandle(use: (brick: Brick) => void): void {
		const width: number = GAME_CANVAS.width / GRID_SIZE;
		const leftWall: number = width * 11;
		const rightWall: number = width * 15;
		const frontWall: number = (GAME_CANVAS.height / GRID_SIZE) * 22;

		this.bricks.forEach(({ position: { x, y } }: Brick, index: number) => {
			if (x >= leftWall && x <= rightWall && y >= frontWall) use(this.bricks[index]);
		});
	}

	@bind
	private putEnemyInPlay() {
		if (this.enemyTanks.length) {
			this.enemyTanksInPlay.concat(this.enemyTanks.splice(0, 1));
		}
	}

	public generateEffect(type: CONSTS, target: Entity, onFinished: () => void): void {
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
		this.terrain.push(new Border(params));
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

	public getPlayerTank(index: number): PlayerTank {
		return this.playerTanks[index];
	}

	public hasEnemies(): boolean {
		return this.enemyTanks.length + this.enemyTanksInPlay.length > 0;
	}

	public hasEnemyToSpawn(): boolean {
		return this.enemyTanksInPlay.length < 4 && this.enemyTanks.length > 0;
	}

	public spawnEnemyTank(): void {
		this.generateEffect(CONSTS.EFFECT_SPAWNFLASH, this.enemyTanks[0], this.putEnemyInPlay);
	}

	public update(units: number): void {
		this.categories.forEach((category: Entity[], index: number) => {
			let i: number = 0;

			while (i < category.length) {
				if (category[i].update(units)) {
					if (5 === index && (category[i] as EnemyTank).isUnique()) {
						// generatePowerup();
					}

					category.splice(i, 1);
				} else {
					++i;
				}
			}
		});
	}

	public render(): void {
		this.categories.forEach((category: Entity[]) => category.forEach((entity: Entity) => entity.render()));
	}
}
