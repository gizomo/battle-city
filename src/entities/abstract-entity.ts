import { CONSTS } from '../globals';
import type Bullet from './bullet';
import type EntitiesManager from './manager';

export default abstract class Entity {
	private isDead: boolean = false;
	private _position: Position = { x: 0, y: 0 };

	protected readonly manager: EntitiesManager = window.$game.entitiesManager;

	protected abstract type: CONSTS;
	protected abstract halfWidth: number;
	protected abstract halfHeight: number;

	public readonly collisional: boolean = true;
	public readonly takeBulletHit?: (bullet: Bullet) => boolean = undefined;

	public abstract update(units?: number): boolean;
	public abstract render(): void;

	constructor(params: Record<string, any>) {
		if (params) {
			this.isDead = params.isDead ?? false;
			this.position = params.position ?? { x: 0, y: 0 };
		}
	}

	protected findCoolidedEntity({ x, y }: Position): Entity | undefined {
		return this.manager.findCollidedEntity(x - this.halfWidth, y - this.halfHeight, x + this.halfWidth, y + this.halfHeight, this);
	}

	protected findCollidedEntities({ x, y }: Position): Entity[] {
		return this.manager.findCollidedEntities(x - this.halfWidth, y - this.halfHeight, x + this.halfWidth, y + this.halfHeight);
	}

	public get rect(): RectCoordinates {
		return {
			rx1: this.position.x - this.halfWidth,
			ry1: this.position.y - this.halfHeight,
			rx2: this.position.x + this.halfWidth,
			ry2: this.position.y + this.halfHeight,
		};
	}

	public set position(position: Position) {
		this._position = position;
	}

	public get position(): Position {
		return this._position;
	}

	public get radius(): number {
		return 0;
	}

	public getType(): CONSTS {
		return this.type;
	}

	public isEnemyTank(): boolean {
		switch (this.type) {
			case CONSTS.TANK_ENEMY_BASIC:
			case CONSTS.TANK_ENEMY_FAST:
			case CONSTS.TANK_ENEMY_POWER:
			case CONSTS.TANK_ENEMY_ARMOR:
				return true;
			default:
				return false;
		}
	}

	public isPowerup(): boolean {
		switch (this.type) {
			case CONSTS.POWERUP_HELMET:
			case CONSTS.POWERUP_TIMER:
			case CONSTS.POWERUP_SHOVEL:
			case CONSTS.POWERUP_STAR:
			case CONSTS.POWERUP_GRENADE:
			case CONSTS.POWERUP_TANK:
				return true;
			default:
				return false;
		}
	}

	public kill(): void {
		this.isDead = true;
	}

	public resurect(): void {
		this.isDead = false;
	}

	public isKilled(): boolean {
		return this.isDead;
	}
}
