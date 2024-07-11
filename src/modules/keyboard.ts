import { bind } from 'helpful-decorators';

export enum KEYS {
	PAUSE = 'P',
	STEP = 'O',
	SPACE = ' ',
	UP = 'W',
	DOWN = 'S',
	LEFT = 'A',
	RIGHT = 'D',
	CLEAR = 'C',
	BOX = 'B',
	UNDO = 'U',
	FLIP_FLOP = 'F',
	RENDER = 'R',
}

class Keyboard {
	private readonly keys: boolean[] = [];

	constructor() {
		window.addEventListener('keydown', this.onKeyDown);
		window.addEventListener('keyup', this.onKeyUp);
	}

	@bind
	private onKeyDown(event: KeyboardEvent): void {
		if (
			event.keyCode === this.getKeyCode(KEYS.SPACE) ||
			event.keyCode === 37 || // LEFT ARROW
			event.keyCode === 38 || // UP ARROW
			event.keyCode === 39 || // RIGHT ARROW
			event.keyCode === 40 // DOWN ARROW
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

	public updateKey(keyCode: number, value: boolean): void {
		this.keys[keyCode] = value;
	}

	public handleKey(keyCode: number): boolean {
		const isDown: boolean = this.keys[keyCode];
		this.updateKey(keyCode, false);

		return isDown;
	}

	public handleChar(char: string): boolean {
		return this.handleKey(this.getKeyCode(char));
	}

	public getKeyCode(char: string): number {
		return char.charCodeAt(0);
	}
}

export default new Keyboard();
