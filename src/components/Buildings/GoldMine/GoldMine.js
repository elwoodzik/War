import Buildings from "../Buildings";
import Animations from "./Animations";
import Sounds from "./Sounds";

class GoldMine extends Buildings {
    constructor(game, options) {
        super(game, options);

        this.dir = 'complete';
        this.usersInMine = 0;

        this.info = {
            imageKey: 'goldmine',
            name: 'Kopalnia',
            descriptios: () => [
                'Zasoby:',
                'Nieskończone',
                // 'Wood: 100'
            ],
            inProgress: false,
            inProgressTime: 0,
        }

        new Animations(this);
        this.sounds = new Sounds();
        this.unWalkable(4, 'gold');
    }

    onRightClick() {
        if (this.game.VAR.sellectedObj && this.game.VAR.sellectedObj.type === 'worker' && this.game.VAR.sellectedObj.cargo === 'empty') {
            // this.game.VAR.sellectedObj.pathMove.restartPosition();
            this.game.VAR.sellectedObj.toBuilding = this;
            this.game.VAR.sellectedObj.goToBuilding(this, 1);
            this.game.VAR.sellectedObj.getRandomMoveSound();
        } else if (this.game.VAR.sellectedObj && this.game.VAR.sellectedObj.type === 'worker' && (this.game.VAR.sellectedObj.cargo === 'gold' || this.game.VAR.sellectedObj.cargo === 'wood')) {
            // this.game.VAR.sellectedObj.pathMove.restartPosition();
            this.game.VAR.sellectedObj.goToBuilding(Main.SETTINGS.player.town, 2);
            this.game.VAR.sellectedObj.getRandomMoveSound();
        } else {
            return false;
        }
    }

    update(dt) {
        super.update(dt);

        if (this.usersInMine > 0) {
            this.dir = 'inMine';
        } else {
            this.dir = 'complete';
        }
    }

    addUserToMine() {
        this.usersInMine++;
    }

    removeUserFromMine() {
        this.usersInMine--;
    }
}
export default GoldMine;