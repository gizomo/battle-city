import { bind } from 'helpful-decorators';
import { KEYS } from '../globals';

class Keyboard {
	private readonly keys: boolean[] = [];

	constructor() {
		window.addEventListener('keydown', this.onKeyDown);
		window.addEventListener('keyup', this.onKeyUp);
	}

	@bind
	private onKeyDown(event: KeyboardEvent): void {
		if (
			event.keyCode === KEYS.ACTION ||
			event.keyCode === KEYS.UP2 || // UP ARROW
			event.keyCode === KEYS.DOWN2 || // DOWN ARROW
			event.keyCode === KEYS.LEFT2 || // LEFT ARROW
			event.keyCode === KEYS.RIGHT2 // RIGHT ARROW
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
