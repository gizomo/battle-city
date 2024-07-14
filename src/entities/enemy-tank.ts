import { CONSTS } from '../globals';
import Entity from './abstract-entity';

export default class EnemyTank extends Entity {
	protected halfWidth: number;
	protected halfHeight: number;
	protected type: CONSTS = CONSTS.TANK_ENEMY_BASIC;

	private powerup: CONSTS = CONSTS.TANK_POWER_NONE;

	constructor(params: Record<string, any>) {
		super(params);

		if (params) {
			this.type = params.type ?? CONSTS.TANK_ENEMY_BASIC;
			this.powerup = params.powerup ?? CONSTS.TANK_POWER_NONE;
		}
	}

	public isUnique(): boolean {
		return CONSTS.TANK_POWER_DROPSPOWERUP === this.powerup;
	}

	public update(units?: number): boolean {
		throw new Error('Method not implemented.');
	}

	public render(): void {
		throw new Error('Method not implemented.');
	}
}
