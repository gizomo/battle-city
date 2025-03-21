import Entity from './abstract-entity';
import { CONSTS, GAME_CTX, SPRITE_SCALE } from '../globals';
import { Sprite, getEffect } from '../sprites';

type EffectOptions = {
	cycles: number;
	frames: number;
	speed: number;
};

export default class Effect extends Entity {
	protected halfWidth: number;
	protected halfHeight: number;
	protected type: CONSTS = CONSTS.EFFECT_POINTS;

	private static readonly options: Record<number, EffectOptions> = {
		[CONSTS.EFFECT_SPAWNFLASH]: { frames: 4, cycles: 2.5, speed: 3 },
		[CONSTS.EFFECT_SMALLEXPLOSION]: { frames: 3, cycles: 0.5, speed: 4 },
		[CONSTS.EFFECT_LARGEEXPLOSION]: { frames: 2, cycles: 1, speed: 4 },
		[CONSTS.EFFECT_INVULNERABLE]: { frames: 2, cycles: 50, speed: 2 },
		[CONSTS.EFFECT_POINTS]: { frames: 1, cycles: 1, speed: 15 },
	};

	private target: Entity & { hasStrongField?: () => boolean; points?: number };
	private onFinished: () => void = () => undefined;

	private cycles: number = 0;
	private frames: number = 0;
	private speed: number = 0;

	private animationFrame: number = 0;
	private animationFrameCounter: number = 0;
	private countDelta: number = 1;

	constructor(params: Record<string | 'target', any>) {
		super(params);

		if (params) {
			this.type = params.type ?? CONSTS.EFFECT_POINTS;
			this.target = params.target;
			this.onFinished = params.onFinished ?? (() => undefined);
		}

		const { cycles, frames, speed }: EffectOptions = Effect.options[this.type];

		this.cycles = this.isInvulnarable() && this.target.hasStrongField?.() ? 200 : cycles;
		this.frames = frames;
		this.speed = this.isPoints() && 500 === this.target.points ? 70 : speed;

		if (this.isPoints()) {
			this.animationFrame = (this.target.points ?? 0) / 100 - 1;
		}
	}

	public isInvulnarable(): boolean {
		return CONSTS.EFFECT_INVULNERABLE === this.type;
	}

	public isPoints(): boolean {
		return CONSTS.EFFECT_POINTS === this.type;
	}

	public killEffect(): true {
		return true;
	}

	public update(): boolean {
		const numFramesSingleCycle: number = 2 * this.frames - 1;
		const numFramesTotal: number = (numFramesSingleCycle - 1) * this.cycles + 1;

		this.animationFrameCounter++;

		if (0 === this.animationFrameCounter % this.speed) {
			this.animationFrame += this.countDelta;

			if (0 === this.animationFrame % (this.frames - 1)) {
				this.countDelta = -this.countDelta;
			}
		}

		if (this.animationFrameCounter / this.speed >= numFramesTotal) {
			if (this.onFinished) this.onFinished();
			return true;
		}

		return false;
	}

	public render(): void {
		const sprite: Sprite = getEffect(this.type, this.animationFrame);

		if (undefined === this.halfWidth) {
			this.halfWidth = (sprite.getWidth() / 2) * SPRITE_SCALE;
			this.halfHeight = (sprite.getHeight() / 2) * SPRITE_SCALE;
		}

		if (this.target) {
			sprite.drawCentredAt(GAME_CTX, this.target.position.x, this.target.position.y, this.halfWidth!, this.halfHeight!);
		} else {
			console.log('Trying to spawn effect but have no co-ordinates');
		}
	}
}
