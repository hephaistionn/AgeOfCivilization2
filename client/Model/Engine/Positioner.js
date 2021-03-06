const ENTITIES = require('./Entity/listEntity');

module.exports = class Positioner {

    constructor(config) {
        this.selected = null;
        this.tilesHeight = config.tilesHeight;
        this.nbPointZ = config.nbPointZ;
        this.nbPointX = config.nbPointX;
        this.nbTileX = config.nbTileX;
        this.nbTileZ = config.nbTileZ;
        this.rotation = 0;
        this.undroppable = false;
        this.x = 0;
        this.z = 0;
    }

    placeSelectedEntity(x, z, map) {
        this.x = x;
        this.z = z;

        const y = this.getHeightTile(x, z);

        this.selected.move(x, y, z, this.rotation);

        const tiles = this.selected.getTiles();

        this.undroppable = false;

        for(let i = 0; i < tiles.length; i += 2) {
            if(!map.grid.isWalkableAt(tiles[i], tiles[i + 1])) {
                this.undroppable = true;
                return;
            }
        }
    }

    getHeightTile(x, z) {
        const index = Math.floor(z) * this.nbTileX + Math.floor(x);
        return this.tilesHeight[index] / 255;
    }

    selectEnity(id) {
        this.selected = new ENTITIES[id]({x: 0, y: 0, z: 0, a: this.rotation});
        this.rotation = 0;
    }

    unselectEnity() {
        this.selected = null;
        this.rotation = 0;
    }

    increaseRotation(map) {
        this.rotation += Math.PI / 2;
        if(this.rotation >= Math.PI * 2) {
            this.rotation = 0;
        }

        const y = this.getHeightTile(this.x, this.z);

        this.selected.move(this.x, y, this.z, this.rotation);

        const tiles = this.selected.getTiles();

        this.undroppable = false;

        for(let i = 0; i < tiles.length; i += 2) {
            if(!map.grid.isWalkableAt(tiles[i], tiles[i + 1])) {
                this.undroppable = true;
                return;
            }
        }
    }

    dismount() {
        this.selected = null;
    }
};
