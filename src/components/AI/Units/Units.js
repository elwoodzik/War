import Sprite from "../../../../lib/Sprite";
import PathMove from "../../../../lib/PathMove";

class Units extends Sprite {
    constructor(game, options) {
        super(game, options);
        this.game = game;

        this.objectType = 'unit';
        this.speed = 35;
        this.attackTarget = null;
        this.isAttacking = false;

        this.pathMove = new PathMove(this.game, {
            sprite: this,
            spriteAnimation: this.getAnimationInMove,
            extendsMove: this.extendsMove
        })
    }

    draw(dt) {
        super.draw(dt);
    }


    update(dt) {
        this.animations.play({
            key: this.dir
        })
        if (!this.attackTarget) {
            this.inRange.rectCircleColliding(this.pathMove.followEnemy)
        }
        super.update(dt);

        this.updateBorder();
    }


    onClick() {
        return false;
    }

    onRightClick() {
        if (this.game.VAR.sellectedObj && this.game.VAR.sellectedObj.objectType === 'unit') {
            // this.game.VAR.sellectedObj.pathMove.restartPosition();
            // const endPos = this.game.VAR.map.getTileBySprite(this);
            // this.game.easystar.stopAvoidingAdditionalPoint(endPos.row, endPos.column);
            this.game.VAR.sellectedObj.pathMove.followEnemy(this);
            // this.game.easystar.avoidAdditionalPoint(endPos.row, endPos.column);
            // this.game.VAR.sellectedObj.pathMove.move(null, (path, player) => {

            // }, this);
        }
    }

    // this.pathMove.move(null, (path, player) => {
    //     console.log('atakuj')
    //     console.log(enemy.pathMove.isMoving)
    //     if (enemy.pathMove.isMoving) {
    //         this.followEnemy(enemy);
    //     }
    // }, enemy);


    getRandomSelectedSound() {
        if (this.sounds && this.sounds.selected && this.sounds.selected.length > 0) {
            const rand = this.game.rand(0, this.sounds.selected.length - 1);
            this.AssetManager.play(this.sounds.selected[rand]);
        }
    }

    getRandomMoveSound() {
        if (this.sounds && this.sounds.move && this.sounds.move.length > 0) {
            const rand = this.game.rand(0, this.sounds.move.length - 1);
            this.AssetManager.play(this.sounds.move[rand]);
        }
    }

    selectedBorder() {
        if (this.isRender) {
            this.game.VAR.sellectedObj = this;
            this.game.VAR.sellectedBorder.show();
        }
    }

    unSelectedBorder() {
        if (this.game.VAR.sellectedObj && this.game.VAR.sellectedObj.objID === this.objID) {
            this.game.VAR.sellectedObj = null;
            this.game.VAR.sellectedBorder.hide();
        }
    }

    hideBorder() {
        if (this.game.VAR.sellectedObj && this.game.VAR.sellectedObj.objID === this.objID) {
            this.game.VAR.sellectedBorder.hide();
        }
    }

    showBorder() {
        if (this.game.VAR.sellectedObj && this.game.VAR.sellectedObj.objID === this.objID) {
            this.game.VAR.sellectedBorder.show();
        }
    }

    updateBorder() {
        if (this.game.VAR.sellectedObj && this.game.VAR.sellectedObj.objID === this.objID) {
            this.game.VAR.sellectedBorder.x = this.x; //+ this.width / 4
            // this.game.VAR.sellectedBorder.y = this.y + 8//+ this.height / 2
            this.game.VAR.sellectedBorder.y = this.y + (this.height - 32)//+ this.height / 2
            this.game.VAR.sellectedBorder.width = 32//this.width;
            this.game.VAR.sellectedBorder.height = 32//this.height;
        }
    }



    getAnimationInMove(startPos, nextStep, callback) {
        const _nextStep = { x: nextStep.x * 32, y: nextStep.y * 32 };

        if (this.type === 'worker') {
            this.image = this.AssetManager.get('peasant');
        }
        // this.image = this.AssetManager.get('chop')

        if (_nextStep.x > startPos.x && _nextStep.y > startPos.y) {
            if (this.cargo === 'gold') {
                this.dir = 'move_gold_right_down';
            } else if (this.cargo === 'wood') {
                this.dir = 'move_wood_right_down';
            } else if (this.inWooding) {
                this.image = this.AssetManager.get('chop');
                this.dir = 'chop_right_down';
            } else if (this.isAttacking) {
                this.image = this.AssetManager.get('chop');
                this.dir = 'atck_right_down';
            } else if (this.isMoving) {
                this.dir = 'move_right_down';
            } else {
                this.dir = 'idle_right_down';
            }
        } else if (_nextStep.x === startPos.x && _nextStep.y > startPos.y) {
            if (this.cargo === 'gold') {
                this.dir = 'move_gold_down';
            } else if (this.cargo === 'wood') {
                this.dir = 'move_wood_down';
            } else if (this.inWooding) {
                this.image = this.AssetManager.get('chop');
                this.dir = 'chop_down';
            } else if (this.isAttacking) {
                this.image = this.AssetManager.get('chop');
                this.dir = 'atck_down';
            } else if (this.isMoving) {
                this.dir = 'move_down';
            } else {
                this.dir = 'idle_down';
            }
        } else if (_nextStep.x < startPos.x && _nextStep.y > startPos.y) {
            if (this.cargo === 'gold') {
                this.dir = 'move_gold_left_down';
            } else if (this.cargo === 'wood') {
                this.dir = 'move_wood_left_down';
            } else if (this.inWooding) {
                this.image = this.AssetManager.get('chop');
                this.dir = 'chop_left_down';
            } else if (this.isAttacking) {
                this.image = this.AssetManager.get('chop');
                this.dir = 'atck_left_down';
            } else if (this.isMoving) {
                this.dir = 'move_left_down';
            } else {
                this.dir = 'idle_left_down';
            }
        } else if (_nextStep.x < startPos.x && _nextStep.y === startPos.y) {
            if (this.cargo === 'gold') {
                this.dir = 'move_gold_left';
            } else if (this.cargo === 'wood') {
                this.dir = 'move_wood_left';
            } else if (this.inWooding) {
                this.image = this.AssetManager.get('chop');
                this.dir = 'chop_left';
            } else if (this.isAttacking) {
                this.image = this.AssetManager.get('chop');
                this.dir = 'atck_left';
            } else if (this.isMoving) {
                this.dir = 'move_left';
            } else {
                this.dir = 'idle_left';
            }
        } else if (_nextStep.x < startPos.x && _nextStep.y < startPos.y) {
            if (this.cargo === 'gold') {
                this.dir = 'move_gold_left_up';
            } else if (this.cargo === 'wood') {
                this.dir = 'move_wood_left_up';
            } else if (this.inWooding) {
                this.image = this.AssetManager.get('chop');
                this.dir = 'chop_left_up';
            } else if (this.isAttacking) {
                this.image = this.AssetManager.get('chop');
                this.dir = 'atck_left_up';
            } else if (this.isMoving) {
                this.dir = 'move_left_up';
            } else {
                this.dir = 'idle_left_up';
            }
        } else if (_nextStep.x === startPos.x && _nextStep.y < startPos.y) {
            if (this.cargo === 'gold') {
                this.dir = 'move_gold_up';
            } else if (this.cargo === 'wood') {
                this.dir = 'move_wood_up';
            } else if (this.inWooding) {
                this.image = this.AssetManager.get('chop');
                this.dir = 'chop_up';
            } else if (this.isAttacking) {
                this.image = this.AssetManager.get('chop');
                this.dir = 'atck_up';
            } else if (this.isMoving) {
                this.dir = 'move_up';
            } else {
                this.dir = 'idle_up';
            }
        } else if (_nextStep.x > startPos.x && _nextStep.y < startPos.y) {
            if (this.cargo === 'gold') {
                this.dir = 'move_gold_right_up';
            } else if (this.cargo === 'wood') {
                this.dir = 'move_wood_right_up';
            } else if (this.inWooding) {
                this.image = this.AssetManager.get('chop');
                this.dir = 'chop_right_up';
            } else if (this.isAttacking) {
                this.image = this.AssetManager.get('chop');
                this.dir = 'atck_right_up';
            } else if (this.isMoving) {
                this.dir = 'move_right_up';
            } else {
                this.dir = 'idle_right_up';
            }
        } else if (_nextStep.x > startPos.x && _nextStep.y === startPos.y) {
            if (this.cargo === 'gold') {
                this.dir = 'move_gold_right';
            } else if (this.cargo === 'wood') {
                this.dir = 'move_wood_right';
            } else if (this.inWooding) {
                this.image = this.AssetManager.get('chop');
                this.dir = 'chop_right';
            } else if (this.isAttacking) {
                this.image = this.AssetManager.get('chop');
                this.dir = 'atck_right';
            } else if (this.isMoving) {
                this.dir = 'move_right';
            } else {
                this.dir = 'idle_right';
            }
        }

        this.animations.play({
            key: this.dir,
            callback: callback ? callback : null
        })

        this.width = this.states[this.state].frames[this.current_f].fW;
        this.height = this.states[this.state].frames[this.current_f].fH;

        this.pathMove.currentTile = this.game.VAR.map.getTileBySprite(this);
        this.y = this.pathMove.currentTile.y - this.height + 32;
    }
}
export default Units;