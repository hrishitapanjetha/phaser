class HospitalScene extends Phaser.Scene {
    constructor() {
        super({ key: 'HospitalScene' });
    }

    preload() {
        console.log('Preload started');

        // Load the tilemap JSON file
        this.load.tilemapTiledJSON('hospitalMap', 'public/assets/maps/Hospital-updated-map.json');
        console.log('Loading hospital map JSON');

        // Load tileset images based on .tsx files
        this.load.image('Tileset', 'public/assets/tilesets/kenney_platformer-art-extended-tileset/PNG Castle/Spritesheet/sheet.png');
        this.load.image('Grass-tileset', 'public/assets/tilesets/kenney_platformer-art-extended-tileset/PNG Grass/Spritesheet/sheet.png');
        this.load.image('Nature-tileset', 'public/assets/tilesets/Kauzz Free Tiles I/nature_outside-tilef.png');
        this.load.image('Objects', 'public/assets/tilesets/Kauzz Free Tiles I/shop-and-hospital.png');
        this.load.image('neo-tiles', 'public/assets/tilesets/Kauzz Free Tiles I/neotiles.png');
        this.load.image('Street-tilev2', 'public/assets/tilesets/Kauzz Free Tiles I/street-tilev2.png');
        this.load.image('Flooring-tileset', 'public/assets/tilesets/Modern tiles_Free/Interiors_free/16x16/Room_Builder_free_16x16.png');
        this.load.image('Furniture-tileset', 'public/assets/tilesets/Modern tiles_Free/Interiors_free/16x16/Interiors_free_16x16.png');
        this.load.image('Character-tileset', 'public/assets/tilesets/Modern tiles_Free/Characters_free/RPGMAKERMV/Characters_MV.png');
        console.log('Loading tileset images');

        // this.load.json('Furniture-tileset', 'public/assets/tilesets/Furniture-tileset.json');
        // this.load.json('Character-tileset', 'public/assets/tilesets/Character-tileset.json');
        // this.load.json('Grass-tileset', 'public/assets/tilesets/Grass-tileset.json');
        // this.load.json('Nature-tileset', 'public/assets/tilesets/Nature-tileset.json');
        // this.load.json('Objects-hospital', 'public/assets/tilesets/Objects-hospital.json');
        // this.load.json('neo-tiles', 'public/assets/tilesets/neo-tiles.json');
        // this.load.json('Street-tilev2', 'public/assets/tilesets/Street-tilev2.json');
        // this.load.json('Tileset', 'public/assets/tilesets/Tileset.json');
        // this.load.json('Flooring-tileset', 'public/assets/tilesets/Flooring-tileset.json');
        // console.log('Loading tileset JSON');

    }

    create() {
        console.log('Create started');

        // Create the tilemap
        const map = this.make.tilemap({ key: 'hospitalMap' });
        console.log('Tilemap created');

        // Add tilesets with correct tile sizes
        const tilesetBase = map.addTilesetImage('Tileset', 'Tileset', 16, 16, 1, 1);
        const tilesetGrass = map.addTilesetImage('Grass-tileset', 'Grass-tileset', 16, 16, 1, 1);
        const tilesetNature = map.addTilesetImage('Nature-tileset', 'Nature-tileset', 16, 16, 1, 1);
        const tilesetObjects = map.addTilesetImage('Objects', 'Objects', 16, 16, 1, 1);
        const tilesetNeo = map.addTilesetImage('neo-tiles', 'neo-tiles', 16, 16, 1, 1);
        const tilesetStreet = map.addTilesetImage('Street-tilev2', 'Street-tilev2', 32, 32, 1, 1);
        const tilesetFlooring = map.addTilesetImage('Flooring-tileset', 'Flooring-tileset', 32, 32, 1, 1);
        const tilesetFurniture = map.addTilesetImage('Furniture-tileset', 'Furniture-tileset', 32, 32, 1, 1);
        const tilesetCharacter = map.addTilesetImage('Character-tileset', 'Character-tileset', 32, 32, 1, 1);
        console.log('Tilesets added');

        // Create all tile layers from Tiled
        const layers = {};
        map.layers.forEach(layerData => {
            if (layerData.type === 'tilelayer') {
                layers[layerData.name] = map.createLayer(layerData.name, [
                    tilesetBase, tilesetGrass, tilesetNature, tilesetObjects, tilesetNeo,
                    tilesetStreet, tilesetFlooring, tilesetFurniture, tilesetCharacter
                ], 0, 0);
                console.log('Created layer:', layerData.name);
            }
        });

        // Set up collision layer
        if (layers['Collision']) {
            layers['Collision'].setCollisionByProperty({ collides: true });
        }

        // Set up camera
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    }
}

// Game configuration
const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    parent: 'game-container',
    scene: HospitalScene,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true  // Enable debug mode to see physics bodies
        }
    }
};

// Initialize the game
const game = new Phaser.Game(config);
