import { SOUNDS } from '../globals';

class Sounds {
	private readonly requests: Record<SOUNDS, boolean> = {} as Record<SOUNDS, boolean>;
	private readonly audios: Record<SOUNDS, HTMLAudioElement> = {} as Record<SOUNDS, HTMLAudioElement>;

	constructor() {
		Object.keys(SOUNDS).forEach((key: string) => {
			this.requests[SOUNDS[key as keyof typeof SOUNDS]] = false;
			this.audios[SOUNDS[key as keyof typeof SOUNDS]] = new Audio(SOUNDS[key as keyof typeof SOUNDS]);
		});
	}

	private isTankIdle(sound: SOUNDS): boolean {
		return SOUNDS.TANK_IDLE === sound;
	}

	private isTankMove(sound: SOUNDS): boolean {
		return SOUNDS.TANK_MOVE === sound;
	}

	private isTankMovements(sound: SOUNDS): boolean {
		return this.isTankIdle(sound) || this.isTankMove(sound);
	}

	private repeat(audio: HTMLAudioElement): void {
		audio.currentTime = 0;
		audio.play();
	}

	public request(sound: SOUNDS): void {
		this.requests[sound] = true;
	}

	public play(sound: SOUNDS): void {
		if ((!this.isTankIdle(sound) && !this.isTankMove(sound)) || this.audios[sound]?.paused) {
			this.stop(sound);

			if (this.isTankMovements(sound)) {
				this.audios[sound].addEventListener('ended', () => this.repeat(this.audios[sound]));
			}

			this.audios[sound].play();
		}
	}

	public stop(sound: SOUNDS): void {
		if (this.isTankMovements(sound)) {
			this.audios[sound].removeEventListener('ended', () => this.repeat(this.audios[sound]));
		}

		this.audios[sound].pause();
		this.audios[sound].currentTime = 0;

		this.requests[sound] = false;
	}

	public playSounds(): void {
		(Object.keys(this.requests) as SOUNDS[]).forEach((sound: SOUNDS) => {
			if (this.requests[sound]) {
				if (!this.isTankIdle(sound) && !this.isTankMove(sound)) {
					this.play(sound);
					this.requests[sound] = false;
				} else {
					if (this.isTankIdle(sound)) {
						if (!this.requests[SOUNDS.TANK_MOVE]) {
							this.stop(SOUNDS.TANK_MOVE);
							this.play(sound);
						}

						this.requests[sound] = false;
					} else {
						this.stop(SOUNDS.TANK_IDLE);
						this.play(sound);

						this.requests[sound] = false;
					}
				}
			}
		});
	}

	public stopSounds(): void {
		(Object.keys(this.requests) as SOUNDS[]).forEach((sound: SOUNDS) => this.stop(sound));
	}
}

export default new Sounds();
