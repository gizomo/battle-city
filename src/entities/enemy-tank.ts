import Entity from './abstract-entity';
import Sounds from '../modules/sounds';
import type Bullet from './bullet';
import type PlayerTank from './player-tank';
import { CONSTS, GAME_CTX, GRID_STEP, SCORES, SOUNDS } from '../globals';
import { getTank } from '../sprites';

type EnemyDefaults = {
	position: Position;
	orientation: CONSTS;
};

type EnemyOptions = {
	moveDistance: number;
	bulletVelocity: number;
	numberOfLives: number;
	points: SCORES;
};

export default class EnemyTank extends Entity {
	protected halfWidth: number;
	protected halfHeight: number;
	protected type: CONSTS = CONSTS.TANK_ENEMY_BASIC;

	private static readonly options: Record<number, EnemyOptions> = {
		[CONSTS.TANK_ENEMY_BASIC]: { moveDistance: 1, bulletVelocity: 6, numberOfLives: 1, points: SCORES.BASIC },
		[CONSTS.TANK_ENEMY_FAST]: { moveDistance: 3, bulletVelocity: 9, numberOfLives: 1, points: SCORES.FAST },
		[CONSTS.TANK_ENEMY_POWER]: { moveDistance: 2, bulletVelocity: 12, numberOfLives: 1, points: SCORES.POWER },
		[CONSTS.TANK_ENEMY_ARMOR]: { moveDistance: 2, bulletVelocity: 9, numberOfLives: 4, points: SCORES.ARMOR },
	};

	public readonly points: number;

	private moving: boolean = false;
	private moveDistance: number = 2;
	private canMoveWhileColliding: boolean = false;
	private numberOfLives: number = 1;
	private orientation: CONSTS = CONSTS.DIRECTION_DOWN;
	private power: CONSTS = CONSTS.TANK_POWER_NONE;
	private slideCounter: number = 0;
	private defaults: EnemyDefaults;

	private chanceOfBulletFire: number = 0.95;
	private bulletsAlive: number = 0;
	private bulletDelayCounter: number = 0;
	private bulletStrength: number = 1;
	private bulletVelocity: number = 6;

	private animationFrame: number = 0;
	private animationFrameCounter: number = 0;
	private animationFramePowerup: number = 0;
	private animationFramePowerupCounter: number = 0;

	constructor(params: Record<string, any>) {
		super(params);

		if (params) {
			this.type = params.type ?? CONSTS.TANK_ENEMY_BASIC;
			this.power = params.power ?? CONSTS.TANK_POWER_NONE;
		}

		const { moveDistance, bulletVelocity, numberOfLives, points }: EnemyOptions = EnemyTank.options[this.type];

		this.moveDistance = moveDistance;
		this.bulletVelocity = bulletVelocity;
		this.numberOfLives = numberOfLives;
		this.points = points;

		this.defaults = {
			position: { ...this.position },
			orientation: this.orientation,
		};
	}

	private lockToNearestGrid(): void {
		const lock: (axle: 'x' | 'y') => void = (axle: 'x' | 'y') => {
			const module: number = this.position[axle] % GRID_STEP;
			this.position[axle] = this.position[axle] - module + (module >= GRID_STEP / 2 ? GRID_STEP : 0);
		};

		switch (this.orientation) {
			case CONSTS.DIRECTION_UP:
			case CONSTS.DIRECTION_DOWN:
				lock('x');
				break;
			case CONSTS.DIRECTION_LEFT:
			case CONSTS.DIRECTION_RIGHT:
				lock('y');
				break;
			default:
				break;
		}
	}

	private doesContainUncrossableObject(entities: Entity[]): boolean {
		return entities.some((entity: Entity) => {
			switch (entity.getType()) {
				case CONSTS.STRUCTURE_BRICK:
				case CONSTS.STRUCTURE_STEEL:
				case CONSTS.STRUCTURE_FLAG:
				case CONSTS.TERRAIN_WATER:
				case CONSTS.BORDER:
					return true;
				default:
					return false;
			}
		});
	}

	private doesContainTank(entities: Entity[]): boolean {
		return entities.some((entity: Entity) => {
			switch (entity.getType()) {
				case CONSTS.TANK_PLAYER1:
				case CONSTS.TANK_PLAYER2:
				case CONSTS.TANK_ENEMY_BASIC:
				case CONSTS.TANK_ENEMY_FAST:
				case CONSTS.TANK_ENEMY_POWER:
				case CONSTS.TANK_ENEMY_ARMOR:
					return true;
				default:
					return false;
			}
		});
	}

	private isAnyTankInListAllowedToMove(entities: Entity[]): boolean {
		return this.extractTanks(entities).some((tank: EnemyTank | PlayerTank) => tank.canMove());
	}

	private extractTanks(entities: Entity[]): (EnemyTank | PlayerTank)[] {
		return entities.filter((entity: Entity) => {
			switch (entity.getType()) {
				case CONSTS.TANK_PLAYER1:
				case CONSTS.TANK_PLAYER2:
				case CONSTS.TANK_ENEMY_BASIC:
				case CONSTS.TANK_ENEMY_FAST:
				case CONSTS.TANK_ENEMY_POWER:
				case CONSTS.TANK_ENEMY_ARMOR:
					return true;
				default:
					return false;
			}
		}) as (EnemyTank | PlayerTank)[];
	}

	private changeDirection(): void {
		let newDirection: number = NaN;

		const generateTurn: (from: number, to: number) => number = (from: number, to: number) => {
			let value: number = from + 1;

			while (value > from && value <= to) {
				value = Math.floor(Math.random() * 100);
			}

			return value;
		};

		switch (this.orientation) {
			case CONSTS.DIRECTION_DOWN:
				newDirection = generateTurn(0, 30);
				break;
			case CONSTS.DIRECTION_LEFT:
				newDirection = generateTurn(30, 55);
				break;
			case CONSTS.DIRECTION_RIGHT:
				newDirection = generateTurn(55, 80);
				break;
			case CONSTS.DIRECTION_UP:
				newDirection = generateTurn(80, 100);
				break;
		}

		if (newDirection <= 30) {
			this.orientation = CONSTS.DIRECTION_DOWN;
		} else if (newDirection > 30 && newDirection <= 55) {
			this.orientation = CONSTS.DIRECTION_LEFT;
		} else if (newDirection > 55 && newDirection <= 80) {
			this.orientation = CONSTS.DIRECTION_RIGHT;
		} else {
			this.orientation = CONSTS.DIRECTION_UP;
		}
	}

	private move(position: Position): void {
		const entities: Entity[] = this.findHitEntities(position);

		if (0 === entities.length) {
			this.position = position;
			this.canMoveWhileColliding = false;
		} else if (this.doesContainUncrossableObject(entities)) {
			this.changeDirection();
		} else if (this.doesContainTank(entities)) {
			if (this.doesContainTank(this.findHitEntities(this.position))) {
				if (!this.isAnyTankInListAllowedToMove(entities)) {
					this.canMoveWhileColliding = true;
					this.position = position;
				} else {
					this.canMoveWhileColliding = false;
				}
			} else {
				this.changeDirection();
			}
		} else {
			this.position = position;
			this.canMoveWhileColliding = false;
		}

		this.animationFrameCounter++;

		if (0 === this.animationFrameCounter % 3) {
			this.animationFrame = 0 === this.animationFrame ? 1 : 0;
		}

		if (this.power === CONSTS.TANK_POWER_DROPSPOWERUP) {
			this.animationFramePowerupCounter++;

			if (0 === this.animationFrameCounter % 6) {
				this.animationFramePowerup = 0 === this.animationFramePowerup ? 1 : 0;
			}
		}

		this.moving = true;
	}

	private slide(position: Position): void {
		if (!this.findHitEntity(position)) {
			this.position = position;
		}
	}

	private maybeFireBullet(): void {
		this.bulletDelayCounter++;

		if (0 === this.bulletsAlive && 0 === this.bulletDelayCounter % 30) {
			const alpha: number = 7;
			const position: Position = this.position;

			switch (this.orientation) {
				case CONSTS.DIRECTION_UP:
					position.x = position.x - 2;
					position.y = position.y - this.halfHeight - alpha;
					break;
				case CONSTS.DIRECTION_DOWN:
					position.x = position.x - 3;
					position.y = position.y + this.halfHeight + alpha;
					break;
				case CONSTS.DIRECTION_LEFT:
					position.x = position.x - this.halfWidth - alpha;
					break;
				case CONSTS.DIRECTION_RIGHT:
					position.x = position.x + this.halfWidth + alpha;
					break;
			}

			if (Math.random() <= this.chanceOfBulletFire) {
				this.chanceOfBulletFire = 0.3;
				this.bulletsAlive++;
				this.manager.generateBullet(position, this.orientation, this.bulletVelocity, this.bulletStrength, this);
			} else {
				this.chanceOfBulletFire += 0.05;
			}
		}
	}

	public canMove(): boolean {
		return this.canMoveWhileColliding;
	}

	public isUnique(): boolean {
		return CONSTS.TANK_POWER_DROPSPOWERUP === this.power;
	}

	public decrementBulletCount(): void {
		this.bulletsAlive = Math.max(0, this.bulletsAlive - 1);
	}

	public explode(): void {
		this.kill();
		const target: EnemyTank = { ...this, points: 0 };
		this.manager.generateEffect(CONSTS.EFFECT_LARGEEXPLOSION, target, () => this.manager.generateEffect(CONSTS.EFFECT_POINTS, target));
	}

	public takeBulletHit = (bullet: Bullet) => {
		if (bullet.isPlayer()) {
			if (this.numberOfLives > 1) {
				Sounds.request(SOUNDS.BULLET_SHIELD_HIT);
				this.numberOfLives -= 1;
			} else {
				window.$game.addScore(bullet.tank.getType(), this.type);

				if (CONSTS.TANK_POWER_DROPSPOWERUP === this.power) {
					this.manager.generatePowerup();
				}

				this.kill();

				Sounds.request(SOUNDS.DESTROY_ENEMY);

				this.manager.generateEffect(CONSTS.EFFECT_LARGEEXPLOSION, this, () => this.manager.generateEffect(CONSTS.EFFECT_POINTS, this));
			}

			return true;
		}

		return false;
	};

	public update(units: number): boolean {
		if (this.isKilled()) {
			return true;
		}

		const wasMoving: boolean = this.moving;
		this.moving = false;

		const distance: number = this.moveDistance * units;

		if (!this.manager.isEnemiesFreezed()) {
			this.lockToNearestGrid();

			const movePosition: Position = this.position;

			switch (this.orientation) {
				case CONSTS.DIRECTION_UP:
					movePosition.y = movePosition.y - distance;
					break;
				case CONSTS.DIRECTION_DOWN:
					movePosition.y = movePosition.y + distance;
					break;
				case CONSTS.DIRECTION_LEFT:
					movePosition.x = movePosition.x - distance;
					break;
				case CONSTS.DIRECTION_RIGHT:
					movePosition.x = movePosition.x + distance;
					break;
			}

			this.move(movePosition);
		}

		if (!this.manager.isEnemiesFreezed()) {
			this.maybeFireBullet();
		}

		if (wasMoving && !this.moving && this.manager.isOnIce(this.position)) {
			this.slideCounter = 30;
		}

		if (!this.manager.isOnIce(this.position) || this.moving) {
			this.slideCounter = 0;
		}

		if (this.slideCounter > 0) {
			const slidePosition: Position = this.position;

			switch (this.orientation) {
				case CONSTS.DIRECTION_UP:
					slidePosition.y = slidePosition.y - distance;
					break;
				case CONSTS.DIRECTION_DOWN:
					slidePosition.y = slidePosition.y + distance;
					break;
				case CONSTS.DIRECTION_LEFT:
					slidePosition.x = slidePosition.x - distance;
					break;
				case CONSTS.DIRECTION_RIGHT:
					slidePosition.x = slidePosition.x + distance;
					break;
			}

			this.slide(slidePosition);
			this.slideCounter -= 1 * units;
		}

		return false;
	}

	public render(): void {
		const powerlevelSprite: CONSTS = CONSTS.TANK_POWER_DROPSPOWERUP === this.power && 0 === this.animationFramePowerup ? CONSTS.TANK_POWER_NONE : this.power;
		getTank(this.type, powerlevelSprite, this.orientation, this.animationFrame, this.numberOfLives).drawCentredAt(GAME_CTX, this.position.x, this.position.y, this.halfWidth, this.halfHeight);
	}
}
