const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create
    }
};

const game = new Phaser.Game(config);

function preload() {
    // Load the tilemap JSON
    this.load.tilemapTiledJSON('map', 'assets/Hospital-map(json).json');

    // Load the tileset image (JPEG)
    this.load.image('tiles', 'assets/tilemap.jpeg');
}


function create() {
    const map = this.make.tilemap({ key: 'map' });

    // Replace 'MyTileset' with the exact tileset name from the JSON
    const tileset = map.addTilesetImage('Hospital-tiled', 'tiles');

    // Replace 'Tile Layer 1' with your actual layer name from Tiled
    const layer1 = map.createLayer('Bottomlayer', tileset, 0, 0);
    const layer2 = map.createLayer('Toplayer', tileset, 0, 0);

    // Optional: Set collision if defined
    layer1.setCollisionByProperty({ collides: true });
    layer2.setCollisionByProperty({ collides: true });

    // Optional: Log to confirm
    console.log('Map, tileset, and layer loaded:', map, tileset, layer1, layer2);
}

