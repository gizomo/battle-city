import { CONSTS, KEYS } from '../globals';
import Keyboard from './keyboard';

type PlayerKeys = Record<'up' | 'down' | 'left' | 'right' | 'action', number>;

class Gamepads {
	private gamepads: (Gamepad | null)[] = window.navigator.getGamepads();
	private connected: number = 0;

	public getGamepad(): Gamepad | undefined {
		if (this.gamepads[this.connected]) {
			return this.gamepads[this.connected++] as Gamepad;
		}

		return;
	}

	public hasGamepads(): boolean {
		return Boolean(this.getGamepad());
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

		console.log('%cFile: gamepads.ts, Line: 36', 'color: green;', gp);

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
				up: KEYS.UP2,
				down: KEYS.DOWN2,
				left: KEYS.LEFT2,
				right: KEYS.RIGHT2,
				action: KEYS.ACTION2,
			};
		}

		return {
			up: KEYS.UP1,
			down: KEYS.DOWN1,
			left: KEYS.LEFT1,
			right: KEYS.RIGHT1,
			action: KEYS.ACTION1,
		};
	}
}

export default new Gamepads();
