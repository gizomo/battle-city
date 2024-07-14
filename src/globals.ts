export const BACKGROUND_CANVAS: HTMLCanvasElement = window.document.getElementById('background') as HTMLCanvasElement;
export const DRAFT_CANVAS: HTMLCanvasElement = window.document.getElementById('draft') as HTMLCanvasElement;
export const GAME_CANVAS: HTMLCanvasElement = window.document.getElementById('game') as HTMLCanvasElement;
export const BG_CTX: CanvasRenderingContext2D = BACKGROUND_CANVAS.getContext('2d') as CanvasRenderingContext2D;
export const DRAFT_CTX: CanvasRenderingContext2D = DRAFT_CANVAS.getContext('2d') as CanvasRenderingContext2D;
export const GAME_CTX: CanvasRenderingContext2D = GAME_CANVAS.getContext('2d') as CanvasRenderingContext2D;

export const UPDATE_INTERVAL: number = 16.666;
export const GRID_SIZE: number = 26;
export const LEVEL_START_POSITION: Position = { x: 0, y: 0 };
export const SPRITE_SCALE: number = 600 / 208;
export const FULL_CIRCLE: number = Math.PI * 2;
export const RADIANS_PER_DEGREE: number = Math.PI / 180.0;
export const GRID_STEP = GAME_CANVAS.width / GRID_SIZE;
export const FIRST_STEP: number = LEVEL_START_POSITION.x + GRID_STEP / 2;

export enum CONSTS {
	DIRECTION_UP,
	DIRECTION_RIGHT,
	DIRECTION_DOWN,
	DIRECTION_LEFT,

	TANK_PLAYER1,
	TANK_PLAYER2,
	TANK_ENEMY_BASIC,
	TANK_ENEMY_FAST,
	TANK_ENEMY_POWER,
	TANK_ENEMY_ARMOR,

	TANK_POWER_NONE,
	TANK_POWER_1STAR,
	TANK_POWER_2STARS,
	TANK_POWER_3STARS,
	TANK_POWER_DROPSPOWERUP,

	STRUCTURE_BRICK,
	STRUCTURE_STEEL,
	STRUCTURE_FLAG,

	STRUCTURE_WHOLE,
	STRUCTURE_LEFT_GONE,
	STRUCTURE_TOP_GONE,
	STRUCTURE_BOTTOM_GONE,
	STRUCTURE_RIGHT_GONE,
	STRUCTURE_ALL_GONE,

	TERRAIN_WATER,
	TERRAIN_TREES,
	TERRAIN_ICE,
	TERRAIN_BLANK,

	POWERUP_HELMET,
	POWERUP_TIMER,
	POWERUP_SHOVEL,
	POWERUP_STAR,
	POWERUP_GRENADE,
	POWERUP_TANK,

	EFFECT_SPAWNFLASH,
	EFFECT_SMALLEXPLOSION,
	EFFECT_LARGEEXPLOSION,
	EFFECT_INVULNERABLE,
	EFFECT_POINTS,

	BULLET,
	BORDER,
}
