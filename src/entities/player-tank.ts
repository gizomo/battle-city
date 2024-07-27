import Entity from './abstract-entity';
import Keyboard from '../modules/keyboard';
import Sounds from '../modules/sounds';
import type Bullet from './bullet';
import type Powerup from './powerup';
import { CONSTS, GAME_CTX, GRID_STEP, KEYS, SOUNDS } from '../globals';
import { getTank } from '../sprites';

type PlayerDefaults = {
	position: Position;
	bulletVelocity: number;
	bulletStrength: number;
	canFireTwice: boolean;
	orientation: CONSTS;
};

enum ForceField {
	NONE,
	BRIEF,
	STRONG,
}

export default class PlayerTank extends Entity {
	protected halfWidth: number = GRID_STEP - 3;
	protected halfHeight: number = GRID_STEP - 3;
	protected type: CONSTS = CONSTS.TANK_PLAYER1;

	private bulletsAlive: number = 0;
	private bulletStrength: number = 1;
	private bulletVelocity: number = 6;
	private canFireTwice: boolean = false;

	private canMoveWhileColliding: boolean = true;
	private forceField: ForceField = ForceField.NONE;
	private frozen: boolean = false;
	private gamepad: Gamepad;
	private moving: boolean = false;
	private moveDistance: number = 2;
	private slideCounter: number = 0;
	private numberOfLives: number = 2;
	private orientation: CONSTS = CONSTS.DIRECTION_UP;
	private defaults: PlayerDefaults;
	private starLevel: CONSTS = CONSTS.TANK_POWER_NONE;

	private animationFrame: 0 | 1 = 0;
	private animationFrameCounter: number = 0;

	constructor(params: Record<string, any>) {
		super(params);

		if (params) {
			this.gamepad = params.gamepad ?? undefined;
		}

		this.defaults = {
			position: { ...this.position },
			bulletVelocity: this.bulletVelocity,
			bulletStrength: this.bulletStrength,
			canFireTwice: this.canFireTwice,
			orientation: this.orientation,
		};
	}

	private get keyUp(): KEYS {
		return this.isFirstPlayer() ? KEYS.UP1 : KEYS.UP2;
	}

	private get keyDown(): KEYS {
		return this.isFirstPlayer() ? KEYS.DOWN1 : KEYS.DOWN2;
	}

	private get keyLeft(): KEYS {
		return this.isFirstPlayer() ? KEYS.LEFT1 : KEYS.LEFT2;
	}

	private get keyRight(): KEYS {
		return this.isFirstPlayer() ? KEYS.RIGHT1 : KEYS.RIGHT2;
	}

	private get keyAction(): KEYS {
		return this.isFirstPlayer() ? KEYS.ACTION1 : KEYS.ACTION2;
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

	private updateDirection(): boolean {
		if (Keyboard.isPressed(this.keyUp)) {
			this.orientation = CONSTS.DIRECTION_UP;
			return true;
		}

		if (Keyboard.isPressed(this.keyDown)) {
			this.orientation = CONSTS.DIRECTION_DOWN;
			return true;
		}

		if (Keyboard.isPressed(this.keyLeft)) {
			this.orientation = CONSTS.DIRECTION_LEFT;
			return true;
		}

		if (Keyboard.isPressed(this.keyRight)) {
			this.orientation = CONSTS.DIRECTION_RIGHT;
			return true;
		}

		return false;
	}

	private move(position: Position): void {
		const entity: Entity | undefined = this.findCoolidedEntity(position);

		console.log('%cFile: player-tank.ts, Line: 131', 'color: green;', entity && CONSTS[entity?.getType()]);

		if (!entity || entity.isPowerup()) {
			this.position = position;

			if (entity) {
				(entity as Powerup).pickedUp(this);
			}
		}

		this.animationFrameCounter++;

		if (0 === this.animationFrameCounter % 3) {
			this.animationFrame = 0 === this.animationFrame ? 1 : 0;
		}

		this.moving = true;
	}

	private slide(position: Position): void {
		if (!this.findCoolidedEntity(position)) {
			this.position = position;
		}
	}

	private maybeFireBullet(): void {
		if (0 === this.bulletsAlive || (1 === this.bulletsAlive && this.canFireTwice)) {
			const alpha: number = 7;
			const position: Position = { ...this.position };

			switch (this.orientation) {
				case CONSTS.DIRECTION_UP:
					position.y = position.y - this.halfHeight - alpha;
					break;
				case CONSTS.DIRECTION_DOWN:
					position.y = position.y + this.halfHeight + alpha;
					break;
				case CONSTS.DIRECTION_LEFT:
					position.x = position.x - this.halfWidth - alpha;
					break;
				case CONSTS.DIRECTION_RIGHT:
					position.x = position.x + this.halfWidth + alpha;
					break;
			}

			this.bulletsAlive++;
			this.manager.generateBullet(position, this.orientation, this.bulletVelocity, this.bulletStrength, this);
		}
	}

	private setForceField(forceField: ForceField): void {
		this.forceField = forceField;
		this.manager.generateEffect(CONSTS.EFFECT_INVULNERABLE, this, () => (this.forceField = ForceField.NONE));
	}

	public isFirstPlayer(): boolean {
		return CONSTS.TANK_PLAYER1 === this.type;
	}

	public addForceField(): void {
		this.setForceField(ForceField.STRONG);
	}

	public reset(killed: boolean = false): void {
		if (killed) {
			this.starLevel = CONSTS.TANK_POWER_NONE;
			this.bulletVelocity = this.defaults.bulletVelocity;
			this.canFireTwice = this.defaults.canFireTwice;
			this.bulletStrength = this.defaults.bulletStrength;
		}

		this.frozen = true;
		this.position = this.defaults.position;

		this.manager.generateEffect(CONSTS.EFFECT_SPAWNFLASH, this, () => {
			this.orientation = this.defaults.orientation;
			this.frozen = false;
			this.setForceField(ForceField.BRIEF);
			this.resurect();
		});
	}

	public decrementBulletCount(): void {
		this.bulletsAlive = Math.max(0, this.bulletsAlive - 1);
	}

	public addStar(): void {
		switch (this.starLevel) {
			case CONSTS.TANK_POWER_NONE:
				this.starLevel = CONSTS.TANK_POWER_1STAR;
				this.bulletVelocity *= 2;
				break;
			case CONSTS.TANK_POWER_1STAR:
				this.starLevel = CONSTS.TANK_POWER_2STARS;
				this.canFireTwice = true;
				break;
			case CONSTS.TANK_POWER_2STARS:
				this.starLevel = CONSTS.TANK_POWER_3STARS;
				this.bulletStrength = 2;
				break;
			default:
				break;
		}
	}

	public addExtraLife(): void {
		this.numberOfLives++;
	}

	public getGamepad(): Gamepad {
		return this.gamepad;
	}

	public getLifes(): number {
		return this.numberOfLives;
	}

	public hasLifes(): boolean {
		return this.numberOfLives > 0;
	}

	public hasNoField(): boolean {
		return ForceField.NONE === this.forceField;
	}

	public hasStrongField(): boolean {
		return ForceField.STRONG === this.forceField;
	}

	public canMove(): boolean {
		return this.canMoveWhileColliding;
	}

	public takeBulletHit = (bullet: Bullet) => {
		if (!this.isKilled() && this.hasNoField()) {
			if (bullet.isPlayer() && window.$game.friendlyFire) {
				this.frozen = true;
				setTimeout(() => (this.frozen = false), 3000);
			} else {
				this.kill();
				Sounds.request(SOUNDS.DESTROY_PLAYER);
				this.numberOfLives--;

				if (this.numberOfLives >= 0) {
					this.manager.generateEffect(CONSTS.EFFECT_LARGEEXPLOSION, this, () => this.reset(true));
				} else {
					this.manager.generateEffect(CONSTS.EFFECT_LARGEEXPLOSION, this);
				}
			}
		}

		return true;
	};

	public update(units: number): boolean {
		if (this.isKilled()) {
			return true;
		}

		if (this.numberOfLives <= -1) {
			this.kill();
			return true;
		}

		const wasMoving: boolean = this.moving;
		this.moving = false;

		const distance: number = this.moveDistance * units;

		if (!this.frozen) {
			this.lockToNearestGrid();

			const movePosition: Position = { ...this.position };

			if (this.updateDirection()) {
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
		}

		if (Keyboard.isPressed(this.keyAction)) {
			this.maybeFireBullet();
		}

		if (wasMoving && !this.moving && this.manager.isOnIce(this.position)) {
			this.slideCounter = 30;
		}

		if (!this.manager.isOnIce(this.position) || this.moving) {
			this.slideCounter = 0;
		}

		if (this.slideCounter > 0) {
			const slidePosition: Position = { ...this.position };

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

		if (this.moving) {
			Sounds.request(SOUNDS.TANK_MOVE);
		} else {
			Sounds.request(SOUNDS.TANK_IDLE);
		}

		return false;
	}

	public render(): void {
		if (this.isKilled()) {
			return;
		}

		getTank(this.type, this.starLevel, this.orientation, this.animationFrame).drawCentredAt(GAME_CTX, this.position.x, this.position.y, this.halfWidth, this.halfHeight);
	}
}
