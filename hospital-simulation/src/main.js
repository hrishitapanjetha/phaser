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

    // Load the tileset image
    this.load.image('tiles', 'assets/tilemap.jpeg');
}


function create() {

}

