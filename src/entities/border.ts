import { CONSTS } from '../globals';
import Entity from './abstract-entity';

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

	public takeBulletHit(bullet: any): boolean {
		// if (bullet.player)
		//     g_SFX.request(bullet.soundHitSteel);
		return true;
	}

	public update(): boolean {
		// spatialManager.unregister(this);
		// if (this._isDeadNow)
		//     return entityManager.KILL_ME_NOW;
		// spatialManager.register(this);
		return false;
	}

	public render(): void {
		throw new Error('Method not implemented.');
	}
}
