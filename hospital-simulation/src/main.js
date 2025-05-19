class HospitalScene extends Phaser.Scene {
    constructor() {
        super({ key: 'HospitalScene' });
    }

    preload() {
        console.log('Preload started');

        // Load the tilemap JSON file
        this.load.tilemapTiledJSON('hospitalMap', 'public/assets/Hospital-updated-map.json');
        console.log('Loading hospital map JSON');

        // Load overview image
        this.load.image('overview', 'public/assets/images/free_overview.png');
        console.log('Loading overview image');

        // Load tileset images - 16x16
        this.load.image('tiles_16x16', 'public/assets/images/Interiors_free/16x16/Room_Builder_free_16x16.png');
        this.load.image('interiors_16x16', 'public/assets/images/Interiors_free/16x16/Interiors_free_16x16.png');
        console.log('Loading 16x16 tilesets');

        // Load tileset images - 32x32
        this.load.image('tiles_32x32', 'public/assets/images/Interiors_free/32x32/Room_Builder_free_32x32.png');
        this.load.image('interiors_32x32', 'public/assets/images/Interiors_free/32x32/Interiors_free_32x32.png');
        console.log('Loading 32x32 tilesets');

        // Load tileset images - 48x48
        this.load.image('tiles_48x48', 'public/assets/images/Interiors_free/48x48/Room_Builder_free_48x48.png');
        this.load.image('interiors_48x48', 'public/assets/images/Interiors_free/48x48/Interiors_free_48x48.png');
        console.log('Loading 48x48 tilesets');

        // Load character images - Bob
        this.load.image('bob', 'public/assets/images/Characters_free/Bob_16x16.png');
        this.load.image('bob_idle', 'public/assets/images/Characters_free/Bob_idle_16x16.png');
        this.load.image('bob_idle_anim', 'public/assets/images/Characters_free/Bob_idle_anim_16x16.png');
        this.load.image('bob_run', 'public/assets/images/Characters_free/Bob_run_16x16.png');
        this.load.image('bob_sit', 'public/assets/images/Characters_free/Bob_sit_16x16.png');
        this.load.image('bob_sit2', 'public/assets/images/Characters_free/Bob_sit2_16x16.png');
        this.load.image('bob_sit3', 'public/assets/images/Characters_free/Bob_sit3_16x16.png');
        this.load.image('bob_phone', 'public/assets/images/Characters_free/Bob_phone_16x16.png');
        console.log('Loading Bob character assets');

        // Load character images - Alex
        this.load.image('alex', 'public/assets/images/Characters_free/Alex_16x16.png');
        this.load.image('alex_idle', 'public/assets/images/Characters_free/Alex_idle_16x16.png');
        this.load.image('alex_idle_anim', 'public/assets/images/Characters_free/Alex_idle_anim_16x16.png');
        this.load.image('alex_run', 'public/assets/images/Characters_free/Alex_run_16x16.png');
        this.load.image('alex_sit', 'public/assets/images/Characters_free/Alex_sit_16x16.png');
        this.load.image('alex_sit2', 'public/assets/images/Characters_free/Alex_sit2_16x16.png');
        this.load.image('alex_sit3', 'public/assets/images/Characters_free/Alex_sit3_16x16.png');
        this.load.image('alex_phone', 'public/assets/images/Characters_free/Alex_phone_16x16.png');
        console.log('Loading Alex character assets');

        // Load character images - Adam
        this.load.image('adam', 'public/assets/images/Characters_free/Adam_16x16.png');
        this.load.image('adam_idle', 'public/assets/images/Characters_free/Adam_idle_16x16.png');
        this.load.image('adam_idle_anim', 'public/assets/images/Characters_free/Adam_idle_anim_16x16.png');
        this.load.image('adam_run', 'public/assets/images/Characters_free/Adam_run_16x16.png');
        this.load.image('adam_sit', 'public/assets/images/Characters_free/Adam_sit_16x16.png');
        this.load.image('adam_sit2', 'public/assets/images/Characters_free/Adam_sit2_16x16.png');
        this.load.image('adam_sit3', 'public/assets/images/Characters_free/Adam_sit3_16x16.png');
        this.load.image('adam_phone', 'public/assets/images/Characters_free/Adam_phone_16x16.png');
        console.log('Loading Adam character assets');

        // Load character images - Amelia
        this.load.image('amelia', 'public/assets/images/Characters_free/Amelia_16x16.png');
        this.load.image('amelia_idle', 'public/assets/images/Characters_free/Amelia_idle_16x16.png');
        this.load.image('amelia_idle_anim', 'public/assets/images/Characters_free/Amelia_idle_anim_16x16.png');
        this.load.image('amelia_run', 'public/assets/images/Characters_free/Amelia_run_16x16.png');
        this.load.image('amelia_sit', 'public/assets/images/Characters_free/Amelia_sit_16x16.png');
        this.load.image('amelia_sit2', 'public/assets/images/Characters_free/Amelia_sit2_16x16.png');
        this.load.image('amelia_sit3', 'public/assets/images/Characters_free/Amelia_sit3_16x16.png');
        this.load.image('amelia_phone', 'public/assets/images/Characters_free/Amelia_phone_16x16.png');
        console.log('Loading Amelia character assets');
    }

    create() {
        console.log('Create started');

        // Create the tilemap
        const map = this.make.tilemap({ key: 'hospitalMap' });
        console.log('Tilemap created');

        // Add all tilesets
        const tileset16 = map.addTilesetImage('Room_Builder_free_16x16', 'tiles_16x16', 16, 16);
        const interiors16 = map.addTilesetImage('Interiors_free_16x16', 'interiors_16x16', 16, 16);
        const tileset32 = map.addTilesetImage('Room_Builder_free_32x32', 'tiles_32x32', 32, 32);
        const interiors32 = map.addTilesetImage('Interiors_free_32x32', 'interiors_32x32', 32, 32);
        const tileset48 = map.addTilesetImage('Room_Builder_free_48x48', 'tiles_48x48', 48, 48);
        const interiors48 = map.addTilesetImage('Interiors_free_48x48', 'interiors_48x48', 48, 48);
        console.log('Tilesets added');

        // Create all tile layers from Tiled
        map.layers.forEach(layerData => {
            if (layerData.type === 'tilelayer') {
                // Create layer with all tilesets
                const layer = map.createLayer(layerData.name, [
                    tileset16, interiors16,
                    tileset32, interiors32,
                    tileset48, interiors48
                ], 0, 0);
                console.log('Created layer:', layerData.name);
            }
        });

        // Handle navigation areas
        const navigationLayer = map.getObjectLayer('Navigation-area');
        if (navigationLayer) {
            console.log('Navigation layer found');
            navigationLayer.objects.forEach(obj => {
                const graphics = this.add.graphics();
                graphics.lineStyle(2, 0xff0000, 0.5);

                // Handle both rectangular and polygonal navigation areas
                if (obj.polygon) {
                    const points = obj.polygon.map(p => ({
                        x: p.x + obj.x,
                        y: p.y + obj.y
                    }));
                    graphics.strokePoints(points.concat([points[0]]), false); // close the shape
                } else {
                    graphics.strokeRect(obj.x, obj.y, obj.width, obj.height);
                }

                // Log navigation area properties
                if (obj.properties) {
                    console.log('Navigation Area:', {
                        name: obj.properties.find(p => p.name === 'name')?.value,
                        function: obj.properties.find(p => p.name === 'function')?.value,
                        zone_id: obj.properties.find(p => p.name === 'zone_id')?.value,
                        speed: obj.properties.find(p => p.name === 'speed')?.value
                    });
                }
            });
        } else {
            console.log('No navigation layer found');
        }

        // Add overview image in the top-right corner
        const overviewImage = this.add.image(this.cameras.main.width - 10, 10, 'overview');
        overviewImage.setOrigin(1, 0); // Set origin to top-right
        overviewImage.setScale(0.5); // Scale down the image if needed
    }
}

// Add error handling for Phaser
window.onerror = function (msg, url, lineNo, columnNo, error) {
    console.error('Error: ' + msg + '\nURL: ' + url + '\nLine: ' + lineNo + '\nColumn: ' + columnNo + '\nError object: ' + JSON.stringify(error));
    return false;
};

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

const game = new Phaser.Game(config);
