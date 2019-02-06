import Icons from "./Icons";

class Action extends Icons {
    constructor(game, options) {
        super(game, options);

        // 
    }

    onClick() {
        if (this.currentAction && this.currentAction.onActionClick) {
            this.currentAction.onActionClick(this.currentAction);
        }
    }

    update(dt) {
        super.update(dt);
    }

    onHover() {
        if (this.currentAction && this.currentAction.onActionHover) {
            this.game.VAR.hudBottom.hoverText.use(this.currentAction.onActionHover(this.currentAction));
            this.game.VAR.hudBottom.goldIcon.used = true;
            this.game.VAR.hudBottom.woodIcon.used = true;
        }
    }

    onLeave() {
        this.game.VAR.hudBottom.hoverText.use(' ');
        this.game.VAR.hudBottom.goldIcon.used = false;
        this.game.VAR.hudBottom.woodIcon.used = false;
    }
}
export default Action;