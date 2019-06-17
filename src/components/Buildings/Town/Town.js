import Buildings from "../Buildings";
import Peasant from "../../Units/Peasant/Peasant";
import Animations from "./Animations";
import Sounds from "./Sounds";
import Main from "../../Pages/Main";


class Town extends Buildings {
    constructor(game, options) {
        super(game, options);

        this.dir = 'complete';
        this.armor = 0;
        this.hitPointsMax = 2230;
        this.currentHp = this.hitPointsMax;

        this.info = {
            imageKey: 'town',
            name: 'Ratusz',
            hitPointsMax: this.hitPointsMax,
            currentHp: this.currentHp,
            descriptios: () => [
                'Produkuja:',
                'Złoto: 100',
                'Drewno: 100'
            ],
            inProgress: false,
            inProgressTime: 0,
            actions: [
                {
                    key: 'peasant',
                    woodCost: 0,
                    goldCost: 400,
                    time: 45000 / Main.SETTINGS.buildSpeed,
                    onActionClick: this.onActionClick,
                    used: true,
                    create: {
                        class: Peasant,
                        key: 'peasant',
                        name: 'Chłop',
                        prefix: 'Trenuj'
                    },
                },
            ],
        }
        new Animations(this);
        this.sounds = new Sounds();
        this.unWalkable(5, 'town');
    }

    update(dt) {
        super.update(dt);
    }

    onRightClick() {
        if (this.game.VAR.sellectedObj && this.game.VAR.sellectedObj.type === 'worker' && (this.game.VAR.sellectedObj.cargo === 'gold' || this.game.VAR.sellectedObj.cargo === 'wood')) {
            this.game.VAR.sellectedObj.pathMove.restartPosition();
            this.game.VAR.sellectedObj.goToBuilding(this.game.VAR.town, 2);
            this.game.VAR.sellectedObj.getRandomMoveSound();
        } else {
            return false;
        }
    }
}
export default Town;