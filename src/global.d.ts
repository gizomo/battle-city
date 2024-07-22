import type Game from './game';

declare global {
	interface Window {
		$game: Game;
	}
}
