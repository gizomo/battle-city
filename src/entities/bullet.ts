import { CONSTS, GAME_CTX, SPRITE_SCALE } from '../globals';
import { getBullet } from '../sprites';
import Entity from './abstract-entity';
import EnemyTank from './enemy-tank';
import PlayerTank from './player-tank';

export default class Bullet extends Entity {
	protected halfWidth: number = (4 * SPRITE_SCALE) / 2;
	protected halfHeight: number = (4 * SPRITE_SCALE) / 2;
	protected type: CONSTS = CONSTS.BULLET;

	public readonly direction: CONSTS = CONSTS.DIRECTION_UP;
	public readonly tank: EnemyTank | PlayerTank;
	public readonly strength: number = 1;
	public readonly velocity: number = 0;

	constructor(params: Record<string, any>) {
		super(params);

		if (params) {
			this.direction = params.direction ?? CONSTS.DIRECTION_UP;
			this.tank = params.tank;
			this.strength = params.stregth ?? 1;
			this.velocity = params.velocity ?? 0;
		}
	}

	public kill(): void {
		setTimeout(() => {
			this.tank.decrementBulletCount();
			super.kill();
		}, 150);
	}

	public takeBulletHit = (bullet: Bullet) => {
		this.kill();

		return true;
	};

	public isPlayer(): boolean {
		return this.tank.getType() === CONSTS.TANK_PLAYER1 || this.tank.getType() === CONSTS.TANK_PLAYER2;
	}

	public update(units: number): boolean {
		if (this.isKilled()) {
			return true;
		}

		const hitted: Entity | undefined = this.findHitEntities(this.position).find((entity: Entity) => Boolean(entity.takeBulletHit) && entity.takeBulletHit!(this));

		if (hitted) {
			if (CONSTS.BULLET === hitted.getType()) {
				this.manager.generateEffect(CONSTS.EFFECT_SMALLEXPLOSION, this);
			}

			this.kill();

			return true;
		}

		switch (this.direction) {
			case CONSTS.DIRECTION_UP:
				this.position.y -= this.velocity * units;
				break;
			case CONSTS.DIRECTION_DOWN:
				this.position.y += this.velocity * units;
				break;
			case CONSTS.DIRECTION_RIGHT:
				this.position.x += this.velocity * units;
				break;
			case CONSTS.DIRECTION_LEFT:
				this.position.x -= this.velocity * units;
				break;
		}

		return false;
	}

	public render(): void {
		getBullet(this.direction).drawCentredAt(GAME_CTX, this.position.x, this.position.y, this.halfWidth, this.halfHeight);
	}
}
