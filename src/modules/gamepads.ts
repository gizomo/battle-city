import { CONSTS } from '../globals';
import Keyboard, { KEYS } from './keyboard';

type PlayerKeys = Record<'up' | 'down' | 'left' | 'right' | 'action', number>;

const UP1: number = Keyboard.getKeyCode(KEYS.UP);
const DOWN1: number = Keyboard.getKeyCode(KEYS.DOWN);
const LEFT1: number = Keyboard.getKeyCode(KEYS.LEFT);
const RIGHT1: number = Keyboard.getKeyCode(KEYS.RIGHT);
const ACTION1: number = Keyboard.getKeyCode(KEYS.SPACE);
const UP2: number = 38;
const DOWN2: number = 40;
const LEFT2: number = 37;
const RIGHT2: number = 39;
const ACTION2: number = 17;

class Gamepads {
	private gamepads: (Gamepad | null)[] = window.navigator.getGamepads();
	private connected: number = 0;

	public getGamepad(): Gamepad | undefined {
		if (this.gamepads[this.connected]) {
			return this.gamepads[this.connected++] as Gamepad;
		}

		return;
	}

	public initForMenu(): void {
		this.gamepads = window.navigator.getGamepads();

		if (this.gamepads[0]) {
			const gp: Gamepad = this.gamepads[0];
			const y: number = gp.axes[1];
			const button0: GamepadButton = gp.buttons[0];
			const button1: GamepadButton = gp.buttons[1];
			const keys: PlayerKeys = this.getPlayerKeys();

			this.updateAxle('y', y, keys);
			this.updateButtons(button0, button1, keys);
		}
	}

	public initForGame(gp: Gamepad, player: CONSTS = CONSTS.TANK_PLAYER1): void {
		this.gamepads = window.navigator.getGamepads();

		const x: number = gp.axes[0];
		const y: number = gp.axes[1];
		const button0: GamepadButton = gp.buttons[0];
		const button1: GamepadButton = gp.buttons[1];
		const keys: PlayerKeys = this.getPlayerKeys(player);

		this.updateAxle('x', x, keys);
		this.updateAxle('y', y, keys);
		this.updateButtons(button0, button1, keys);
	}

	private updateAxle(axle: 'x' | 'y', value: number, { up, down, left, right }: PlayerKeys): void {
		const a: number = 'x' === axle ? left : up;
		const b: number = 'x' === axle ? right : down;

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

	private updateButtons(button0: GamepadButton, button1: GamepadButton, { action }: PlayerKeys): void {
		if (button0.pressed || button1.pressed) {
			Keyboard.updateKey(action, true);
		} else {
			Keyboard.updateKey(action, false);
		}
	}

	private getPlayerKeys(player: CONSTS = CONSTS.TANK_PLAYER1): PlayerKeys {
		if (CONSTS.TANK_PLAYER2 === player) {
			return {
				up: UP2,
				down: DOWN2,
				left: LEFT2,
				right: RIGHT2,
				action: ACTION2,
			};
		}

		return {
			up: UP1,
			down: DOWN1,
			left: LEFT1,
			right: RIGHT1,
			action: ACTION1,
		};
	}
}

export default new Gamepads();
