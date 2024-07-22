import Entity from './abstract-entity';
import type Bullet from './bullet';
import { CONSTS, GAME_CANVAS, GAME_CTX, GRID_SIZE, KEYS, SOUNDS } from '../globals';
import { getTank } from '../sprites';
import Sounds from '../modules/sounds';
import Keyboard from '../modules/keyboard';
import Sounds from '../modules/sounds';

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
	private readonly soundIdle: string = 'tankIdle';
	private readonly soundMove: string = 'tankMove';

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
	private numberOfLives: number = 2;
	private orientation: CONSTS = CONSTS.DIRECTION_UP;
	private defaults: PlayerDefaults;
	private starLevel: CONSTS = CONSTS.TANK_POWER_NONE;

	private animationFrame: 0 | 1 = 0;
	private animationFrameCounter: number = 0;

	protected halfWidth: number = GAME_CANVAS.width / GRID_SIZE - 3;
	protected halfHeight: number = GAME_CANVAS.height / GRID_SIZE - 3;
	protected type: CONSTS = CONSTS.TANK_PLAYER1;

	constructor(params: Record<string, any>) {
		super(params);

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

		if (this.frozen) {
			// Do nothing -- just prevent rest of ifs.
		} else if (Keyboard.handleKey(this.keyUp)) {
			this.orientation = CONSTS.DIRECTION_UP;
			this.lockToNearestGrid();
			this.move(units, this.cx, this.cy - this.moveDistance * units);
		} else if (Keyboard.handleKey(this.keyDown)) {
			this.orientation = CONSTS.DIRECTION_DOWN;
			this.lockToNearestGrid();
			this.move(units, this.cx, this.cy + this.moveDistance * units);
		} else if (Keyboard.handleKey(this.keyLeft)) {
			this.orientation = CONSTS.DIRECTION_LEFT;
			this.lockToNearestGrid();
			this.move(units, this.cx - this.moveDistance * units, this.cy);
		} else if (Keyboard.handleKey(this.keyRight)) {
			this.orientation = CONSTS.DIRECTION_RIGHT;
			this.lockToNearestGrid();
			this.move(units, this.cx + this.moveDistance * units, this.cy);
		}

		this.maybeFireBullet();

		// if tank was moving but isn't moving now and is on ice...
		if (wasMoving && !this.moving && this.manager.isOnIce(this.position)) {
			this.slideCounter = 30;
		}

		if (!this.manager.isOnIce(this.position) || this.moving) {
			this.slideCounter = 0;
		}

		if (this.slideCounter > 0) {
			switch (this.orientation) {
				case CONSTS.DIRECTION_UP:
					this.slide(units, this.cx, this.cy - this.moveDistance * units);
					break;
				case CONSTS.DIRECTION_DOWN:
					this.slide(units, this.cx, this.cy + this.moveDistance * units);
					break;
				case CONSTS.DIRECTION_LEFT:
					this.slide(units, this.cx - this.moveDistance * units, this.cy);
					break;
				case CONSTS.DIRECTION_RIGHT:
					this.slide(units, this.cx + this.moveDistance * units, this.cy);
					break;
			}

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
