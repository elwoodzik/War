import Pathfinder from "../../lib/Pathfinder";
import EasyStar from 'easystarjs';
import Map from "../../lib/Map";
import Peasant from "./Units/Peasant/Peasant";
import Town from "./Buildings/Town/Town";
import GoldMine from "./Buildings/GoldMine/GoldMine";
import HudLeft from "./Hud/HudLeft";
import HudTop from "./Hud/HudTop";


class Main {

    constructor(game) {
        this.game = game;
    }

    create() {
        this.game.add.map({
            key: 'world',
            json: '../../jsons/map2.json',
        }).then((map) => {
            this.game.VAR.map = map;

            this.game.VAR.settings = {
                gold: 100,
                goldUpdateBy: 100,
                wood: 100,
                woodUpdateBy: 100,
                homeMax: 4,
                people: []
            }
            // new Pathfinder(this.game, {
            //     json: '../../jsons/path2.json',
            //     isRender: true
            // }).then((pathfinder) => {
            //     this.game.VAR.pathfinder = pathfinder;

            this.game.easystar = new EasyStar.js();

            this.game.easystar.setAcceptableTiles([266, 349, 116, 117, 137]);
            this.game.easystar.enableDiagonals();

            this.game.easystar.enableCornerCutting();
            //   this.game.easystar.setIterationsPerCalculation(500);

            this.game.VAR.cameraMan = this.game.add.rect({
                x: 350,
                y: 200,
                width: 20,
                height: 20
            });

            this.game.VAR.cameraSpeed = 700;

            this.game.setPortView(2240, 2240);

            this.game.add.camera({
                followed: this.game.VAR.cameraMan
            })

            this.game.VAR.settings.people.push(new Peasant(this.game, {
                key: 'peasant',
                x: 32 * 9,
                y: 32 * 4,
                zIndex: 100
            }));

            this.game.VAR.town = new Town(this.game, {
                key: 'buildings',
                x: 32 * 15,
                y: 32 * 12
            })

            this.game.VAR.goldMine = new GoldMine(this.game, {
                key: 'gold',
                x: 32 * 2,
                y: 32 * 7
            })
            this.game.easystar.setAdditionalPointCost(13, 7, 3)
            this.game.easystar.setAdditionalPointCost(12, 7, 3)
            this.game.easystar.setAdditionalPointCost(11, 7, 3)
            this.game.easystar.setAdditionalPointCost(13, 8, 3)
            // this.game.easystar.setAdditionalPointCost(12, 8, 3)
            this.game.easystar.setAdditionalPointCost(11, 8, 3)
            this.game.easystar.setAdditionalPointCost(13, 9, 3)
            this.game.easystar.setAdditionalPointCost(12, 9, 3)
            this.game.easystar.setAdditionalPointCost(11, 9, 3)
            this.game.easystar.setGrid(this.game.VAR.map.mapTilesLayers[0].pathfinder);
            const endPos = this.game.VAR.map.getTileBySprite(this.game.VAR.goldMine);

            for (let i = 0; i < 20; i++) {
                new Peasant(this.game, {
                    key: 'peasant',
                    x: 32 * i,
                    y: 32 * 21
                });
            }
            for (let i = 0; i < 20; i++) {
                new Peasant(this.game, {
                    key: 'peasant',
                    x: 32 * i,
                    y: 32 * 20
                });
            }
            for (let i = 0; i < 5; i++) {
                const pes = new Peasant(this.game, {
                    key: 'peasant',
                    x: 32 * (i + 3),
                    y: 32 * 19
                });
                //  pes.move(null, this.game.VAR.goldMine, 1);

            }

            this.game.VAR.hudLeft = new HudLeft(this.game, {})
            this.game.VAR.hudTop = new HudTop(this.game, {})
            this.game.VAR.hudTop.goldText.use(this.game.VAR.settings.gold)
            this.game.VAR.hudTop.woodText.use(this.game.VAR.settings.wood)
            this.game.VAR.hudTop.homeTextMax.use(this.game.VAR.settings.homeMax)
            this.game.VAR.hudTop.homeTextCurrent.use(this.game.VAR.settings.people.length)

            this.game.VAR.sellectedObj = null;
            this.game.VAR.sellectedBorder = this.game.add.rect({ fill: null, strokeColor: 'yellow', zIndex: 2 })
            this.game.VAR.sellectedBorder.hide();

            this.normalMouseClick();
        })
    }

    update(dt) {
        if (this.game.VAR.cameraMan) {
            if (this.game.keyboard.trigger('D') || this.game.keyboard.trigger('right')) {
                this.game.VAR.cameraMan.body.velocity.x = this.game.VAR.cameraSpeed;
            } else if (this.game.keyboard.trigger('A') || this.game.keyboard.trigger('left')) {
                this.game.VAR.cameraMan.body.velocity.x = -this.game.VAR.cameraSpeed;
            } else {
                this.game.VAR.cameraMan.body.velocity.x = 0
            }
            if (this.game.keyboard.trigger('W') || this.game.keyboard.trigger('up')) {
                this.game.VAR.cameraMan.body.velocity.y = -this.game.VAR.cameraSpeed;
            } else if (this.game.keyboard.trigger('S') || this.game.keyboard.trigger('down')) {
                this.game.VAR.cameraMan.body.velocity.y = this.game.VAR.cameraSpeed;
            } else {
                this.game.VAR.cameraMan.body.velocity.y = 0;
            }
        }

    }

    normalMouseClick() {
        this.game.mouse.trigger((mouse) => {
            // this.game.VAR.pathfinder.reRenderTile(Math.floor(this.game.mouse.mouseX / 32), Math.floor(this.game.mouse.mouseY / 32), 6);
            if (this.game.VAR.sellectedObj && this.game.VAR.sellectedObj.move) {
                const endPos = this.game.VAR.map.getTileByMouse();

                if (this.game.VAR.sellectedObj.inWooding) {
                    this.game.VAR.sellectedObj.doInTimeStop();
                    this.game.VAR.sellectedObj.inWooding = false;
                }
                this.game.VAR.sellectedObj.restartPosition();
                this.game.VAR.sellectedObj.move(endPos);
            }
        }, false)
    }
};

export default Main;
