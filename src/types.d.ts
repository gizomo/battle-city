declare type GameMode = 'single' | 'tandem' | 'versus';

declare type GameOptions = {
	playersCount: number;
	friendlyFire: boolean;
	enemiesEnabled: boolean;
	level: number;
};

declare type Position = { x: number; y: number };
