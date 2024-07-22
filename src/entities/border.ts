import Entity from './abstract-entity';
import type Bullet from './bullet';
import { CONSTS, SOUNDS } from '../globals';
import Sounds from '../modules/sounds';

export default class Border extends Entity {
	protected halfWidth: number;
	protected halfHeight: number;
	protected type: CONSTS = CONSTS.BORDER;

	constructor(params: Record<string, any>) {
		super(params);

		if (params) {
			this.halfWidth = params.halfWidth;
			this.halfHeight = params.halfHeight;
		}
	}

	public takeBulletHit = (bullet: Bullet) => {
		if (bullet.isPlayer()) {
			Sounds.request(SOUNDS.BULLET_STEEL_HIT);
		}

		return true;
	};

	public update(): boolean {
		return this.isKilled();
	}

	public render(): void {
		// There is nothing to render
	}
}
