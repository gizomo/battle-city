import { CONSTS } from '../globals';
import Entity from './abstract-entity';

type EffectOptions = Record<'cycles' | 'frames' | 'speed', number>;

export default class Effect extends Entity {
	protected halfWidth: number;
	protected halfHeight: number;
	protected type: CONSTS = CONSTS.EFFECT_POINTS;

	private static readonly options: Record<number, EffectOptions> = {
		[CONSTS.EFFECT_SPAWNFLASH]: { frames: 4, cycles: 3, speed: 2.5 },
		[CONSTS.EFFECT_SMALLEXPLOSION]: { frames: 3, cycles: 4, speed: 0.5 },
		[CONSTS.EFFECT_LARGEEXPLOSION]: { frames: 2, cycles: 4, speed: 1 },
		[CONSTS.EFFECT_INVULNERABLE]: { frames: 2, cycles: 2, speed: 50 },
		[CONSTS.EFFECT_POINTS]: { frames: 1, cycles: 15, speed: 1 },
	};

	private target: Entity & { hasStrongField?: () => boolean; points?: number };
	private onFinished: () => void = () => undefined;

	private cycles: number = 0;
	private frames: number = 0;
	private speed: number = 0;

	private animationFrame: number = 0;
	private animationFrameCounter: number = 0;
	private animationCycles: number = 0;
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

	public killEffect(): true {
		return true;
	}
}
