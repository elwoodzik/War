import Units from "../Units";
import Animations from "./Animations";
import Sounds from "./Sounds";
import Farm from "../../Buildings/Farm/Farm";
import Barracks from "../../Buildings/Barracks/Barracks";
import LumberMill from "../../Buildings/LumberMill/LumberMill";
import Blacksmith from "../../Buildings/Blacksmith/Blacksmith";
import BuildingPut from "../../Hud/BuildingPut";
import Tower from "../../Buildings/Tower/Tower";
import Main from "../../Pages/Main";

class Peasant extends Units {

    constructor(game, options) {
        super(game, options);

        this.type = 'worker';

        this.inBuilding = false;
        this.dir = 'idle_up';
        this.cargo = 'empty';
        this.inForestPos = {};
        this.buildingPut = new BuildingPut(this.game, { key: 'buildings', zIndex: 49 });

        this.dmg = this.setDmg(2, 9);
        this.armor = this.setArmor(0);

        this.range = 1;
        this.hitPointsMax = 1130;
        this.currentHp = this.hitPointsMax;

        this.info = {
            hitPointsMax: this.hitPointsMax,
            currentHp: this.currentHp,
            imageKey: 'peasant',
            name: 'Chłop',
            descriptios: () => [
                `Obrażenia: ${this.dmg()[0]} - ${this.dmg()[1]}`,
                `Armor: ${this.armor()}`,
                `Zasięg: ${this.range}`,
            ],
            inProgress: false,
            inProgressTime: 0,
            actions: [
                {
                    key: 'farm',
                    woodCost: 250,
                    goldCost: 500,
                    time: 100000 / Main.SETTINGS.player.buildSpeed,
                    onActionClick: this.onActionBuild,
                    used: true,
                    create: {
                        class: Farm,
                        key: 'buildings',
                        name: 'Farmę',
                        prefix: 'Buduj'
                    },
                },
                {
                    key: 'barracks',
                    woodCost: 450,
                    goldCost: 700,
                    time: 200000 / Main.SETTINGS.player.buildSpeed,
                    onActionClick: this.onActionBuild,
                    used: true,
                    create: {
                        class: Barracks,
                        key: 'buildings',
                        name: 'Koszary',
                        prefix: 'Buduj'
                    },
                },
                {
                    key: 'lumber_mill',
                    woodCost: 450,
                    goldCost: 600,
                    time: 150000 / Main.SETTINGS.player.buildSpeed,
                    onActionClick: this.onActionBuild,
                    used: true,
                    create: {
                        class: LumberMill,
                        key: 'buildings',
                        name: 'Tartak',
                        prefix: 'Buduj'
                    },
                },
                {
                    key: 'blacksmith',
                    woodCost: 450,
                    goldCost: 800,
                    time: 200000 / Main.SETTINGS.player.buildSpeed,
                    onActionClick: this.onActionBuild,
                    used: true,
                    create: {
                        class: Blacksmith,
                        key: 'buildings',
                        name: 'Kuźnia',
                        prefix: 'Buduj'
                    },
                },
                {
                    key: 'tower',
                    woodCost: 200,
                    goldCost: 550,
                    time: 60000 / Main.SETTINGS.player.buildSpeed,
                    onActionClick: this.onActionBuild,
                    used: true,
                    create: {
                        class: Tower,
                        key: 'buildings',
                        name: 'Wieżę',
                        prefix: 'Buduj'
                    },
                },
            ],
        }

        new Animations(this);
        this.sounds = new Sounds();

        this.pathMove.currentTile = this.game.VAR.map.getTileByCords(this.x, this.y);

        // this.game.easystar.avoidAdditionalPoint(this.pathMove.currentTile.row, this.pathMove.currentTile.column);

        // this.game.easystar.stopAvoidingAdditionalPoint(this.pathMove.currentTile.row, this.pathMove.currentTile.column);
        this.game.easystar.setAdditionalPointCost(this.pathMove.currentTile.row, this.pathMove.currentTile.column, 300);
        this.pathMove.currentTile.type = 'solid';
    }

    update(dt) {
        super.update(dt);
    }

    // onActionHover = (action) => {
    //     // return `Buduj ${action.create.name}.                                                                           ${action.goldCost}                              ${action.woodCost} `;
    // }

    onActionBuild = (action) => {
        if (Main.SETTINGS.player.gold >= action.goldCost && Main.SETTINGS.player.wood >= action.woodCost) {

            this.buildingPut.dir = action.key;
            this.buildingPut.used = true;
            this.buildingPut.action = action;
            this.buildingPut.border.used = true;

            this.game.VAR.hudLeft.cancelBox.used = true;
            this.game.VAR.hudLeft.actionBox.hide();
        } else {
            this.AssetManager.play('S_click');
            this.game.VAR.textError.display('resources');
        }
    }

    extendsMove(nextTile, currentTile, nextStep, startPos) {
        if (nextTile.type === 'town' && this.cargo === 'empty') {
            console.log('town 1');
            return 'restart';
        }
        if (currentTile.type === 'town' && this.cargo === 'empty') {
            console.log('town 2');
            return 'restart';
        }
        if (nextTile.type === 'gold' && this.cargo === 'gold') {
            console.log('gold 1');
            return 'restart';
        }
        if (currentTile.type === 'gold' && this.cargo === 'gold') {
            console.log('gold 2');
            return 'restart';
        }

        if (nextTile.type === 'gold' && this.cargo === 'empty' && !this.inBuilding) {
            this.inMine(nextStep, startPos);
            return 'stop';
        }
        else if (nextTile.type === 'town' && (this.cargo === 'gold' || this.cargo === 'wood') && !this.inBuilding) {
            this.inTown(nextStep, startPos);
            return 'stop';
        }
        else if (nextTile.type === 'forest' && !this.inBuilding) {
            this.inForest(nextStep, startPos);
            return 'stop';
        }
    }

    inMine(nextStep, startPos) {
        if (this.game.VAR.sellectedObj && this.objID === this.game.VAR.sellectedObj.objID) {
            this.game.VAR.hudLeft.infoBox.hide();
            this.game.VAR.hudLeft.actionBox.hide();
            this.buildingPut.hide();
        }

        this.unSelectedBorder();
        this.pathMove.currentTile.type = 'empty';
        this.game.easystar.setAdditionalPointCost(this.pathMove.currentTile.row, this.pathMove.currentTile.column, 0);

        this.inBuilding = true;
        this.isRender = false;

        this.x = startPos.x;
        this.y = startPos.y;


        this.toBuilding.addUserToMine();

        this.doInTime(Main.SETTINGS.player.timeInMine, () => {
            this.cargo = 'gold';
            this.toBuilding.removeUserFromMine();
            this.leaveBuilding(Main.SETTINGS[this.townPlayer].town, 2, startPos, 0, 800);
        })
    }

    inTown(nextStep, startPos) {
        if (this.game.VAR.sellectedObj && this.objID === this.game.VAR.sellectedObj.objID) {
            this.game.VAR.hudLeft.infoBox.hide();
            this.game.VAR.hudLeft.actionBox.hide();
            this.buildingPut.hide();
        }

        this.unSelectedBorder();
        this.pathMove.currentTile.type = 'empty';
        this.game.easystar.setAdditionalPointCost(this.pathMove.currentTile.row, this.pathMove.currentTile.column, 0);

        this.inBuilding = true;
        this.isRender = false;

        this.x = startPos.x;
        this.y = startPos.y;

        if (this.cargo === 'gold') {
            Main.SETTINGS.player.gold += Main.SETTINGS.player.goldUpdateBy;
            this.game.VAR.hudTop.goldText.use(Main.SETTINGS.player.gold);
        } else if (this.cargo === 'wood') {
            Main.SETTINGS.player.wood += Main.SETTINGS.player.woodUpdateBy;
            this.game.VAR.hudTop.woodText.use(Main.SETTINGS.player.wood);
        }

        this.doInTime(Main.SETTINGS.player.timeInTown, () => {
            if (this.cargo === 'gold') {
                this.cargo = 'empty';
                this.leaveBuilding(this.toBuilding, 1, startPos, 0, 800);
            } else if (this.cargo === 'wood') {
                this.cargo = 'empty';
                this.leaveBuilding(this.inForestPos, 1, startPos, 0, 800);
            }
        })
    }

    inForest(nextStep, startPos) {
        if (!this.inWooding) {
            this.inForestPos = { x: this.x, y: this.y, column: nextStep.y, row: nextStep.x };

            if (this.cargo === 'wood' || this.cargo === 'gold') {
                this.goToBuilding(Main.SETTINGS[this.townPlayer].town, 2);
            } else {
                if (this.chopSound) {
                    this.chopSound.destroy();
                }
                this.treeSound(1);
                this.inWooding = true;
                this.getAnimationInMove(startPos, nextStep);

                // this.moveToPointBreak(1);
                this.width = this.states[this.state].frames[this.current_f].fW;
                this.height = this.states[this.state].frames[this.current_f].fH;
                this.pathMove.currentTile.type = 'empty';
                this.pathMove.currentTile = this.game.VAR.map.getTileByCords(this.x, this.y + this.height - 32);

                this.y = this.pathMove.currentTile.y - this.height + 32;
                this.pathMove.currentTile.type = 'solid';

                this.doInTime(Main.SETTINGS.player.timeInForest, () => {
                    this.cargo = 'wood';
                    this.inWooding = false;
                    this.goToBuilding(Main.SETTINGS[this.townPlayer].town, 2);
                })
            }
        }
    }

    treeSound(index) {
        if (!this.AssetManager.getSrc(`S_chopTree${index}`)) {
            index = 1;
        }

        this.chopSound = this.AssetManager.play(`S_chopTree${index}`, { duration: 600, volume: !this.isOutOfScreen ? 0.5 : 0 })
        this.chopSound.on("complete", () => {
            if (this.inWooding) {
                this.treeSound(index + 1);
            }
        })
    }

    goToBuilding(building, index = 1) {
        let endPos = null;

        if (building.update) {
            endPos = this.pathMove.findShortPathToBuilding(building, index);
        } else {
            endPos = building;
        }

        this.pathMove.move(endPos);
    }

    leaveBuilding(building, index = 1, startPos, firstTime, nextTime) {
        this.doInTime(firstTime, () => {
            if (this.game.VAR.map.getTile(this.pathMove.currentTile.row, this.pathMove.currentTile.column).type !== 'solid') {
                this.isRender = true;
                this.inBuilding = false;
                this.pathMove.currentTile.type = 'solid';
                this.game.easystar.setAdditionalPointCost(this.pathMove.currentTile.row, this.pathMove.currentTile.column, 200);

                this.goToBuilding(building, index);
            } else {
                this.leaveBuilding(building, index, startPos, nextTime, nextTime);
            }
        })
    }

}
export default Peasant;