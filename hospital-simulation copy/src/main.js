class HospitalScene extends Phaser.Scene {
    constructor() {
        super({ key: 'HospitalScene' });
    }

    preload() {
        console.log('Preload started');

        // Load the tilemap JSON file
        this.load.tilemapTiledJSON('hospitalMap', 'public/assets/Hospital-tiled/miniature_hospital_new.json');
        console.log('Loading hospital map JSON');

        // Load tileset images based on .tsx files
        this.load.image('castle', 'public/assets/Hospital-tiled/kenney_platformer-art-extended-tileset/PNG Castle/Spritesheet/sheet.png');
        this.load.image('shop-and-hospital', 'public/assets/Hospital-tiled/Kauzz Free Tiles I/shop-and-hospital.png');

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

        // Example with explicit tile size:
        const tilesetBase = map.addTilesetImage('castle', 'castle', 16, 16, 0, 0);
        const tilesetObjects = map.addTilesetImage('shop-and-hospital', 'shop-and-hospital', 16, 16, 0, 0);

        console.log('Tilesets added');

        const allTilesets = [
            tilesetBase, tilesetObjects
        ];

        const layers = {
            'Bottom': map.createLayer('Bottom', allTilesets, 0, 0),
            'top': map.createLayer('top', allTilesets, 0, 0),
        };
        map.layers.forEach(layer => {
            console.log(`Layer "${layer.name}" size:`, layer.width, layer.height);

        });


        console.log('Layers created');

        const labelLayer = map.getObjectLayer('Object Layer 1');

        labelLayer.objects.forEach(obj => {
            const { x, y, text } = obj;
            if (text && text.text) {
                this.add.text(x, y, text.text, {
                    font: `${text.pixelsize || 16}px ${text.fontfamily || 'Arial'}`,
                    fill: '#000000',
                    wordWrap: { width: obj.width }
                });
            }
        });
        // Load object layer
        const objectsLayer = map.getObjectLayer('spawns');

        // Spawn entities at defined points
        objectsLayer.objects.forEach(obj => {
            const { x, y, type } = obj;
            if (type === 'Patients') {
                this.add.sprite(x, y, 'patientSprite');
            } else if (type === 'Doctors') {
                this.add.sprite(x, y, 'doctorSprite');
            } else if (type === 'Nurses') {
                this.add.sprite(x, y, 'nurseSprite');
            }
        });


        // Set up collision layer
        if (layers['Collision']) {
            layers['Collision'].setCollisionByProperty({ collides: true });
            console.log('Collision layer set up');
        }

        const zoom = Math.min(this.scale.width / map.widthInPixels, this.scale.height / map.heightInPixels);
        this.cameras.main.setZoom(zoom);


        //this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        // Add a background color to verify the scene is rendering
        this.cameras.main.setBackgroundColor('#ffffff');
    }
}

// Game configuration
const config = {
    type: Phaser.AUTO,
    width: 780,
    height: 782,
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
const map = this.make.tilemap({ key: 'hospitalMap' });
console.log('Map layers:', map.layers.map(l => l.name));