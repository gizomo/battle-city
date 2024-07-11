import PlayerTank from './player-tank';

export default class EntitiesManager {
	private readonly KILL_ME_NOW: number = -1;

	private readonly terrain: [] = [];
	private readonly bricks: [] = [];
	private readonly statue: [] = [];
	private readonly bullets: [] = [];
	private readonly playerTanks: [] = [];
	private readonly enemyTanks: [] = [];
	private readonly enemyTanksInPlay: [] = [];
	private readonly powerups: [] = [];
	private readonly trees: [] = [];
	private readonly effects: [] = [];
	private readonly border: [] = [];
	private readonly points: [] = [];
	private readonly categories: [][] = [this.terrain, this.bricks, this.statue, this.bullets, this.playerTanks, this.enemyTanksInPlay, this.effects, this.trees, this.powerups, this.border, this.points];

	public update(frameUnits: number): void {
		for (let c: number = 0; c < this.categories.length; ++c) {
			const category = this.categories[c];
			let i = 0;

			// while (i < category.length) {
			// 	var status = category[i].update(du);

			// 	if (this.KILL_ME_NOW === status) {
			// 		if (3 === c && category[i].powerLevel === consts.TANK_POWER_DROPSPOWERUP) {
			// 			generatePowerup();
			// 		}

			// 		category.splice(i, 1);
			// 	} else {
			// 		++i;
			// 	}
			// }
		}
	}

	public createPlayerTank(descr): void {
		this.playerTanks.push(new PlayerTank(descr));
		var tankIndex = this._playerTanks.length - 1;
		this.playerTanks[tankIndex].isDead = true;
		this.playerTanks[tankIndex].reset();
	}
}
