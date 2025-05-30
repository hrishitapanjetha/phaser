class HospitalScene extends Phaser.Scene {
    constructor() {
        super({ key: 'HospitalScene' });
    }

    preload() {
        console.log('Preload started');

        // Load the tilemap JSON file
        this.load.tilemapTiledJSON('hospitalMap', 'public/assets/Hospital-tiled/Hospital-updated-map(newjson).json');
        console.log('Loading hospital map JSON');

        // Load tileset images based on .tsx files
        this.load.image('Tileset', 'public/assets/Hospital-tiled/kenney_platformer-art-extended-tileset/PNG Castle/Spritesheet/sheet.png');
        this.load.image('Grass-tileset', 'public/assets/Hospital-tiled/kenney_platformer-art-extended-tileset/PNG Grass/Spritesheet/sheet.png');
        this.load.image('Nature-tileset', 'public/assets/Hospital-tiled/Kauzz Free Tiles I/nature_outside-tilef.png');
        this.load.image('Objects', 'public/assets/Hospital-tiled/Kauzz Free Tiles I/shop-and-hospital.png');
        this.load.image('neo-tiles', 'public/assets/Hospital-tiled/Kauzz Free Tiles I/neotiles.png');
        this.load.image('Street-tilev2', 'public/assets/Hospital-tiled/Kauzz Free Tiles I/street-tilev2.png');
        this.load.image('Flooring-tileset', 'public/assets/Hospital-tiled/Modern tiles_Free/Interiors_free/16x16/Room_Builder_free_16x16.png');
        this.load.image('Furniture-tileset', 'public/assets/Hospital-tiled/Modern tiles_Free/Interiors_free/16x16/Interiors_free_16x16.png');
        this.load.image('Character-tileset', 'public/assets/Hospital-tiled/Modern tiles_Free/Characters_free/RPGMAKERMV/Characters_MV.png');
        this.load.image('building-inner-tiles', 'public/assets/Hospital-tiled/Kauzz Free Tiles I/building_inner-tileg.png');
        console.log('Loading tileset images');

        // Add load error handler
        this.load.on('loaderror', (file) => {
            console.error('Error loading file:', file.src);
        });

        // Add complete handler
        this.load.on('complete', () => {
            console.log('All assets loaded successfully');
        });
    }

    create() {
        console.log('Create started');

        // Create the tilemap
        const map = this.make.tilemap({ key: 'hospitalMap' });
        console.log('Tilemap created, map data:', {
            width: map.widthInPixels,
            height: map.heightInPixels,
            tileWidth: 16,

            tileHeight: 16,
            layers: map.layers.map(layer => layer.name)
        });

        console.log('Map size:', map.widthInPixels, map.heightInPixels);


        // Add tilesets with correct tile sizes
        const tilesetBase = map.addTilesetImage('Tileset', 'Tileset', 16, 16, 0, 0);
        const tilesetGrass = map.addTilesetImage('Grass-tileset', 'Grass-tileset', 16, 16, 0, 0);
        const tilesetNature = map.addTilesetImage('Nature-tileset', 'Nature-tileset', 16, 16, 0, 0);
        const tilesetObjects = map.addTilesetImage('Objects', 'Objects', 16, 16, 0, 0);
        const tilesetNeo = map.addTilesetImage('neo-tiles', 'neo-tiles', 16, 16, 0, 0);
        const tilesetStreet = map.addTilesetImage('Street-tilev2', 'Street-tilev2', 16, 16, 0, 0);
        const tilesetFlooring = map.addTilesetImage('Flooring-tileset', 'Flooring-tileset', 16, 16, 0, 0);
        const tilesetFurniture = map.addTilesetImage('Furniture-tileset', 'Furniture-tileset', 16, 16, 0, 0);

        const tilesetCharacter = map.addTilesetImage('Character-tileset', 'Character-tileset', 16, 16, 0, 0);
        const tilesetBuildingInner = map.addTilesetImage('building-inner-tiles', 'building-inner-tiles', 16, 16, 0, 0);
        console.log('Tilesets added');

        const allTilesets = [
            tilesetBase, tilesetGrass, tilesetNature, tilesetObjects, tilesetNeo,
            tilesetStreet, tilesetFlooring, tilesetFurniture, tilesetCharacter, tilesetBuildingInner
        ];

        const layers = {
            'Bottom layer': map.createLayer('Bottom layer', allTilesets, 0, 0),
            'Middle layer': map.createLayer('Middle layer', allTilesets, 0, 0),
            'Toplayer': map.createLayer('Toplayer', allTilesets, 0, 0),
        };
        map.layers.forEach(layer => {
            console.log(`Layer "${layer.name}" size:`, layer.width, layer.height);

        });


        console.log('Layers created');

        // Set up collision layer
        if (layers['Collision']) {
            layers['Collision'].setCollisionByProperty({ collides: true });
            console.log('Collision layer set up');
        }


        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        // Add a background color to verify the scene is rendering
        this.cameras.main.setBackgroundColor('#ffffff');
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