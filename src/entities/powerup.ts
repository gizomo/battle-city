import Entity from './abstract-entity';
import PlayerTank from './player-tank';
import Sounds from '../modules/sounds';
import { CONSTS, GAME_CTX, GRID_STEP, SCORES, SOUNDS, SPRITE_SCALE } from '../globals';
import { getPowerup, Sprite } from '../sprites';

export default class Powerup extends Entity {
	protected halfWidth: number = GRID_STEP;
	protected halfHeight: number = GRID_STEP;
	protected type: CONSTS;

	public readonly points: number = SCORES.POWERUP;

	private display: boolean = true;
	private frameCounter: number = 0;
	private cycleSpeed: number = 7;

	constructor(params: Record<string, any>) {
		super(params);

		if (params) {
			this.type = params.type;
		}

		Sounds.request(SOUNDS.POWERUP_SPAWN);
	}

	private isExtraLife(): boolean {
		return CONSTS.POWERUP_TANK === this.type;
	}

	public pickedUp(tank: PlayerTank): void {
		if (this.isExtraLife()) {
			Sounds.request(SOUNDS.EXTRA_LIFE);
		} else {
			Sounds.request(SOUNDS.POWERUP_PICKUP);
		}

		this.manager.activatePowerup(tank, this.type);
		this.manager.generateEffect(CONSTS.EFFECT_POINTS, this);
		this.kill();
	}

	public update(): boolean {
		this.frameCounter++;

		if (0 === this.frameCounter % this.cycleSpeed) {
			this.display = !this.display;
		}

		return this.isKilled();
	}

	public render(): void {
		if (this.display) {
			const sprite: Sprite = getPowerup(this.type);
			sprite.drawCentredAt(GAME_CTX, this.position.x, this.position.y, (sprite.getWidth() / 2) * SPRITE_SCALE, (sprite.getHeight() / 2) * SPRITE_SCALE);
		}
	}
}
