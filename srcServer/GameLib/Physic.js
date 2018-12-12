class Physic {

    constructor(game) {
        this.game = game;
    }

    outOfScreen(item, callback) {
        if (Array.isArray(item)) {
            for (let i = 0, max = item.length; i < max; i++) {
                if (item[i] && item[i].used && !item[i].static) {
                    this.outOfScreenHandler(item[i], callback);
                }
            }
        } else {
            this.outOfScreenHandler(item, callback);
        }
    }
    // Poprawic by dzialaly poprawnie wszystkie kierunki
    outOfScreenHandler(item, callback) {
        if (item) {
            if (item.type === 'CAMERA') {
                return false;
            }
            if (!item.isOutOfScreen) {
                if (item.y >= this.game.height + this.game.camera.yScroll || item.y + item.height <= 0 + this.game.camera.yScroll) {
                    item.isOutOfScreen = true;

                    if (typeof callback === 'function') {
                        return callback.call(this, item);
                    }
                }
                else if (item.x >= this.game.width + this.game.camera.xScroll || item.x + item.width <= 0 + this.game.camera.xScroll) {
                    item.isOutOfScreen = true;
                    if (typeof callback === 'function') {
                        return callback.call(this, item);
                    }
                }
            }
            else if (item.isOutOfScreen) {
                if (item.x < this.game.width + this.game.camera.xScroll && item.x + item.width > 0 + this.game.camera.xScroll
                    && item.y < this.game.height + this.game.camera.yScroll && item.y + item.height > 0 + this.game.camera.yScroll) {
                    return item.isOutOfScreen = false;
                }
            }
        }
    }

    overlap(obj1, obj2, margin, callback, bounds) {
        if (!obj1 || !obj2 || (Array.isArray(obj1) && obj1.length <= 0) || (Array.isArray(obj2) && obj2.length <= 0)) {
            return false;
        }
        if (!Array.isArray(obj1) && Array.isArray(obj2)) {
            if (typeof obj1 === 'object') {
                for (let i = 0, max = obj2.length; i < max; i++) {
                    if (obj2[i] !== null && obj1 !== null && obj1 !== obj2[i]) {
                        this.collectedHandler(obj1, obj2[i], margin, callback, bounds);
                    }

                }
            } else {
                throw 'overlap(): oczekiwano obiektu jako pierwszy parametr';
            }
        }
        if (Array.isArray(obj1) && !Array.isArray(obj2)) {
            if (typeof obj2 === 'object') {
                for (let i = 0, max = obj1.length; i < max; i++) {
                    this.collectedHandler(obj1[i], obj2, margin, callback, bounds);
                }
            } else {
                throw 'overlap(): oczekiwano obiektu jako drugi parametr';
            }
        }
        if (Array.isArray(obj1) && Array.isArray(obj2)) {
            for (let i = 0, max = obj1.length; i < max; i++) {
                if (obj1[i]) {
                    obj1[i].checked = false;
                } else {
                    return false;
                }
                for (let j = 0, max1 = obj2.length; j < max1; j++) {
                    if (obj2[j]) {
                        obj2[j].checked = false;
                        this.collectedHandler(obj1[i], obj2[j], margin, callback, bounds);
                    } else {
                        return false;
                    }
                }
            }
        }
        if (!Array.isArray(obj1) && !Array.isArray(obj2)) {
            obj1.checked = false;
            obj2.checked = false;
            this.collectedHandler(obj1, obj2, margin, callback, bounds);
        }
    }

    collectedHandler(entity1, entity2, margin, callback, bounds) {
        if (entity1 != entity2 && entity1 && entity2) {
            if (entity1.useCollision && entity2.useCollision) {
                let vX = (entity1.x + (entity1.halfWidth - margin)) - (entity2.x + (entity2.halfWidth - margin)),
                    vY = (entity1.y + (entity1.halfHeight - margin)) - (entity2.y + (entity2.halfHeight - margin)),
                    hWidths = (entity1.halfWidth - margin) + (entity2.halfWidth - margin),
                    hHeights = (entity1.halfHeight - margin) + (entity2.halfHeight - margin),
                    colDir = null;

                if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
                    if (typeof callback === 'function') {
                        return callback.call(this, this, entity1, entity2, colDir);
                    }
                }
            }
        }
    }

    collide(obj1, obj2, callback, bounds) {
        if (!obj1 || !obj2 || (Array.isArray(obj1) && obj1.length <= 0) || (Array.isArray(obj2) && obj2.length <= 0)) {
            return false;
        }
       
        if (!Array.isArray(obj1) && Array.isArray(obj2)) {
            if (typeof obj1 === 'object') {
                for (let i = 0, max = obj2.length; i < max; i++) {
                    if (obj2[i] !== null && obj2[i].used)
                        this.collideHandler(obj1, obj2[i], callback, bounds)
                }
            } else {
                throw 'oczekiwano obiektu jako pierwszy parametr';
            }
        }
        if (Array.isArray(obj1) && !Array.isArray(obj2)) {
            if (typeof obj2 === 'object') {
                for (let i = 0, max = obj1.length; i < max; i++) {
                    this.collideHandler(obj1[i], obj2, callback, bounds)
                }
            } else {
                throw 'oczekiwano obiektu jako drugi parametr';
            }
        }
        if (Array.isArray(obj1) && Array.isArray(obj2)) {
            for (let i = 0, max = obj1.length; i < max; i++) {
                if (obj1[i]  && obj1[i].used) {
                    obj1[i].checked = false;
                } 
                for (let j = 0, max1 = obj2.length; j < max1; j++) {
                    if (obj2[j] && obj2[j].used) {
                        obj2[j].checked = false;
                       
                        this.collideHandler(obj1[i], obj2[j], callback, bounds)
                    }
                }
            }
        }
        if (!Array.isArray(obj1) && !Array.isArray(obj2)) {
            obj1.checked = false;
            obj2.checked = false;
            this.collideHandler(obj1, obj2, callback, bounds);
        }
    }

    collideHandler(entity1, entity2, callback, bounds) {
        if (entity1 && entity2 && entity1 != entity2) {
            //if(!entity1.checked && !entity2.checked && entity1.useCollision && entity2.useCollision){
            if (entity1.useCollision && entity2.useCollision) {
               
                let vX = (entity1.x + (entity1.halfWidth)) - (entity2.x + (entity2.halfWidth)),
                    vY = (entity1.y + (entity1.halfHeight)) - (entity2.y + (entity2.halfHeight)),
                    hWidths = (entity1.halfWidth) + (entity2.halfWidth),
                    hHeights = (entity1.halfHeight) + (entity2.halfHeight),
                    colDir = null;

                if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
                    let oX = hWidths - Math.abs(vX),
                        oY = hHeights - Math.abs(vY);

                    if (oX >= oY) {
                        if (vY > 0) {
                            colDir = "t";
                            entity1.y += entity1.body.immoveable ? oY : 0;
                            entity2.y -= entity2.body.immoveable ? oY : 0;

                            entity1.body.velocity.y = bounds ? entity1.body.velocity.y * -1 : entity1.body.velocity.y;
                            entity2.body.velocity.y = bounds ? entity2.body.velocity.y * -1 : entity2.body.velocity.y;
                        } else {
                            colDir = "b";
                            entity1.y -= entity1.body.immoveable ? oY : 0;
                            entity2.y += entity2.body.immoveable ? oY : 0;

                            //entity1.body.falling = false;
                            //entity1.body.jumping = false;
                            entity1.body.velocity.y = bounds ? entity1.body.velocity.y * -1 : 0;
                            entity2.body.velocity.y = bounds ? entity2.body.velocity.y * -1 : entity2.body.velocity.y;
                        }
                    } else {
                        if (vX > 0) {
                            colDir = "l";
                            entity1.x += entity1.body.immoveable ? oX : 0;
                            entity2.x -= entity2.body.immoveable ? oX : 0;
                            entity2.body.pushedLeft = !entity2.body.pushedLeft ? true : false;
                            entity1.body.velocity.x = bounds ? entity1.body.velocity.x * -1 : entity1.body.velocity.x;
                            entity2.body.velocity.x = bounds ? entity2.body.velocity.x * -1 : entity2.body.velocity.x;
                        } else {
                            colDir = "r";
                            entity1.x -= entity1.body.immoveable ? oX : 0;
                            entity2.x += entity2.body.immoveable ? oX : 0;
                            entity2.body.pushedRight = !entity2.body.pushedRight ? true : false;
                            entity1.body.velocity.x = bounds ? entity1.body.velocity.x * -1 : entity1.body.velocity.x;
                            entity2.body.velocity.x = bounds ? entity2.body.velocity.x * -1 : entity2.body.velocity.x;
                        }
                    }
                    if (colDir != null) {
                        entity1.checked = true;
                        entity2.checked = true;

                        if (typeof callback === 'function') {
                            return callback.call(this, entity1, entity2, colDir, oY, oX)
                        }
                    }
                }
            }
        }
    }

    inRange(circle, rect, radius, callback) {
        if (Array.isArray(rect)) {
            for (let i = 0, max = rect.length; i < max; i++) {
                this.rectCircleColliding(circle, rect[i], radius, callback);
            }
        } else {
            this.rectCircleColliding(circle, rect, radius, callback);
        }
    }

    rectCircleColliding(circle, rect, radius, callback) {
        let distX = Math.abs(circle.x + circle.halfWidth - rect.x - rect.halfWidth);
        let distY = Math.abs(circle.y + circle.halfHeight - rect.y - rect.halfHeight);
        let dx;
        let dy;
        if (distX > (rect.halfWidth + radius)) { return rect.used = false; }
        if (distY > (rect.halfHeight + radius)) { return rect.used = false; }

        if (!rect.used) {
            if (distX <= (rect.halfWidth)) {
                return true;
            }
            if (distY <= (rect.halfHeight)) {
                return true;
            }

            dx = distX - rect.halfWidth;
            dy = distY - rect.halfHeight;

            if (typeof callback === 'function') {
                rect.used = true;
                return callback.call(Leya, circle, rect);
            } else {
                return false;
            }
        }
    }
};

export default Physic;