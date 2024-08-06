import { bind } from 'helpful-decorators';
import { KEYS } from '../globals';

class Keyboard {
	private readonly keys: Record<number, boolean> = {};

	constructor() {
		window.addEventListener('keydown', this.onKeyDown);
		window.addEventListener('keyup', this.onKeyUp);
	}

	@bind
	private onKeyDown(event: KeyboardEvent): void {
		if (
			event.keyCode === KEYS.ACTION1 ||
			event.keyCode === KEYS.UP1 || // UP ARROW
			event.keyCode === KEYS.DOWN1 || // DOWN ARROW
			event.keyCode === KEYS.LEFT1 || // LEFT ARROW
			event.keyCode === KEYS.RIGHT1 // RIGHT ARROW
		) {
			event.preventDefault();
			event.stopPropagation();
		}

		this.updateKey(event.keyCode, true);
	}

	@bind
	private onKeyUp(event: KeyboardEvent): void {
		this.updateKey(event.keyCode, false);
	}

	public isPressed(keyCode: number): boolean {
		return this.keys[keyCode];
	}

	public updateKey(keyCode: number, value: boolean): void {
		this.keys[keyCode] = value;
	}

	public handleKey(keyCode: number): boolean {
		const isDown: boolean = this.keys[keyCode];
		this.updateKey(keyCode, false);

		return isDown;
	}
}

export default new Keyboard();
