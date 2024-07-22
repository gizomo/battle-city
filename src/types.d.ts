declare type GameMode = 'single' | 'tandem' | 'versus';

declare type GameOptions = {
	playersCount: number;
	friendlyFire: boolean;
	enemiesEnabled: boolean;
	level: number;
};

declare type Position = { x: number; y: number };

declare type RectCoordinates = { rx1: number; ry1: number; rx2: number; ry2: number };
