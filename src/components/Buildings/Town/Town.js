import Buildings from "../Buildings";
import Peasant from "../../Units/Peasant/Peasant";
import Animations from "./Animations";
import Sounds from "./Sounds";


class Town extends Buildings {
    constructor(game, options) {
        super(game, options);

        this.dir = 'complete';

        this.info = {
            imageKey: 'town',
            name: 'Ratusz',
            descriptios: [
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
                    time: 45000 / this.game.VAR.settings.buildSpeed,
                    onActionClick: this.onActionClick,
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
        this.unWalkable(5, 'town', 30);
    }

    update(dt) {
        super.update(dt);
    }

    onRightClick() {
        if (this.game.VAR.sellectedObj && this.game.VAR.sellectedObj.type === 'worker' && (this.game.VAR.sellectedObj.cargo === 'gold' || this.game.VAR.sellectedObj.cargo === 'wood')) {
            this.game.VAR.sellectedObj.restartPosition();
            this.game.VAR.sellectedObj.goToBuilding(this.game.VAR.town, 2);
            this.game.VAR.sellectedObj.getRandomMoveSound();
        } else {
            return false;
        }
    }
}
export default Town;