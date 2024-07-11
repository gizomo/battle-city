import { bind } from 'helpful-decorators';
import Keyboard, { KEYS } from './keyboard';

const UP: number = Keyboard.getKeyCode(KEYS.UP);
const DOWN: number = Keyboard.getKeyCode(KEYS.DOWN);
const LEFT: number = Keyboard.getKeyCode(KEYS.LEFT);
const RIGHT: number = Keyboard.getKeyCode(KEYS.RIGHT);
const SPACE: number = Keyboard.getKeyCode(KEYS.SPACE);

class Gamepads {
	private gamepads: (Gamepad | null)[] = window.navigator.getGamepads();
	private connected: number = 0;

	public getGamepad(): Gamepad | undefined {
		if (this.gamepads[this.connected]) {
			return this.gamepads[this.connected++] as Gamepad;
		}

		return;
	}

	@bind
	public updateForMenu(): void {
		this.gamepads = window.navigator.getGamepads();

		if (this.gamepads[0]) {
			const gp: Gamepad = this.gamepads[0];
			const y: number = gp.axes[1];
			const button0: GamepadButton = gp.buttons[0];
			const button1: GamepadButton = gp.buttons[1];

			this.updateAxle('y', y);
			this.updateButtons(button0, button1);
		}
	}

	public initForGame(gp: Gamepad): void {
		this.gamepads = window.navigator.getGamepads();

		const x: number = gp.axes[0];
		const y: number = gp.axes[1];
		const button0: GamepadButton = gp.buttons[0];
		const button1: GamepadButton = gp.buttons[1];

		this.updateAxle('x', x);
		this.updateAxle('y', y);
		this.updateButtons(button0, button1);
	}

	private updateAxle(axle: 'x' | 'y', value: number): void {
		const a: number = 'x' === axle ? LEFT : UP;
		const b: number = 'x' === axle ? RIGHT : DOWN;

		if (value < -0.5) {
			Keyboard.updateKey(a, true);
			Keyboard.updateKey(b, false);
		} else if (value > 0.5) {
			Keyboard.updateKey(b, true);
			Keyboard.updateKey(a, false);
		} else {
			Keyboard.updateKey(a, false);
			Keyboard.updateKey(b, false);
		}
	}

	private updateButtons(button0: GamepadButton, button1: GamepadButton): void {
		if (button0.pressed || button1.pressed) {
			Keyboard.updateKey(SPACE, true);
		} else {
			Keyboard.updateKey(SPACE, false);
		}
	}
}

export default new Gamepads();
