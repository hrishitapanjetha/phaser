class HospitalScene extends Phaser.Scene {
    constructor() {
        super({ key: 'HospitalScene' });
    }

    preload() {
        console.log('Preload started');

        // Load the tilemap JSON file
        this.load.tilemapTiledJSON('hospitalMap', 'public/assets/Hospital-updated-map.json');
        console.log('Loading hospital map JSON');

        // Load tileset images from Old directory
        // 16x16 tilesets
        this.load.image('tileset_16x16_1', 'public/assets/images/Old/Tileset_16x16_1.png');
        this.load.image('tileset_16x16_2', 'public/assets/images/Old/Tileset_16x16_2.png');
        this.load.image('tileset_16x16_3', 'public/assets/images/Old/Tileset_16x16_3.png');
        this.load.image('tileset_16x16_9', 'public/assets/images/Old/Tileset_16x16_9.png');
        this.load.image('tileset_16x16_16', 'public/assets/images/Old/Tileset_16x16_16.png');
        console.log('Loading 16x16 tilesets');

        // 32x32 tilesets
        this.load.image('tileset_32x32_1', 'public/assets/images/Old/Tileset_32x32_1.png');
        this.load.image('tileset_32x32_2', 'public/assets/images/Old/Tileset_32x32_2.png');
        this.load.image('tileset_32x32_3', 'public/assets/images/Old/Tileset_32x32_3.png');
        this.load.image('tileset_32x32_9', 'public/assets/images/Old/Tileset_32x32_9.png');
        this.load.image('tileset_32x32_16', 'public/assets/images/Old/Tileset_32x32_16.png');
        console.log('Loading 32x32 tilesets');

        // 48x48 tilesets
        this.load.image('tileset_48x48_1', 'public/assets/images/Old/Tileset_48x48_1.png');
        this.load.image('tileset_48x48_2', 'public/assets/images/Old/Tileset_48x48_2.png');
        this.load.image('tileset_48x48_3', 'public/assets/images/Old/Tileset_48x48_3.png');
        this.load.image('tileset_48x48_9', 'public/assets/images/Old/Tileset_48x48_9.png');
        this.load.image('tileset_48x48_16', 'public/assets/images/Old/Tileset_48x48_16.png');
        console.log('Loading 48x48 tilesets');

        // Character animations as spritesheets
        // 16x16 animations
        this.load.spritesheet('idle_16x16', 'public/assets/images/Old/idle_16x16_2.png', {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.spritesheet('run_16x16', 'public/assets/images/Old/run_horizontal_16x16_2.png', {
            frameWidth: 16,
            frameHeight: 16
        });
        console.log('Loading 16x16 character animations');

        // 32x32 animations
        this.load.spritesheet('idle_32x32', 'public/assets/images/Old/idle_32x32_2.png', {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.spritesheet('run_32x32', 'public/assets/images/Old/run_horizontal_32x32_2.png', {
            frameWidth: 32,
            frameHeight: 32
        });
        console.log('Loading 32x32 character animations');

        // 48x48 animations
        this.load.spritesheet('idle_48x48', 'public/assets/images/Old/idle_48x48_2.png', {
            frameWidth: 48,
            frameHeight: 48
        });
        this.load.spritesheet('run_48x48', 'public/assets/images/Old/run_horizontal_48x48_2.png', {
            frameWidth: 48,
            frameHeight: 48
        });
        console.log('Loading 48x48 character animations');

        // Load images from old/mv folder
        this.load.spritesheet('character_2_16x16', 'public/assets/images/Old/mv/Character_2_16x16_RPGMAKER.png', {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.spritesheet('character_2_32x32', 'public/assets/images/Old/mv/Character_2_32x32_RPGMAKER.png', {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.spritesheet('character_2_48x48', 'public/assets/images/Old/mv/Character_2_48x48_RPGMAKER.png', {
            frameWidth: 48,
            frameHeight: 48
        });
        console.log('Loading characters from old/mv folder');
    }

    create() {
        console.log('Create started');

        // Create the tilemap
        const map = this.make.tilemap({ key: 'hospitalMap' });
        console.log('Tilemap created');

        // Add all tilesets
        // 16x16 tilesets
        const tileset16_1 = map.addTilesetImage('Tileset', 'tileset_16x16_1', 16, 16);
        const tileset16_2 = map.addTilesetImage('Grass-tileset', 'tileset_16x16_2', 16, 16);
        const tileset16_3 = map.addTilesetImage('Nature-tileset', 'tileset_16x16_3', 16, 16);
        const tileset16_9 = map.addTilesetImage('Objects-hospital', 'tileset_16x16_9', 16, 16);
        const tileset16_16 = map.addTilesetImage('neo-tiles', 'tileset_16x16_16', 16, 16);

        // 32x32 tilesets
        const tileset32_1 = map.addTilesetImage('Street-tilev2', 'tileset_32x32_1', 32, 32);
        const tileset32_2 = map.addTilesetImage('Flooring-tileset', 'tileset_32x32_2', 32, 32);
        const tileset32_3 = map.addTilesetImage('Furniture-tileset', 'tileset_32x32_3', 32, 32);
        const tileset32_9 = map.addTilesetImage('Character-tileset', 'tileset_32x32_9', 32, 32);
        const tileset32_16 = map.addTilesetImage('Tileset', 'tileset_32x32_16', 32, 32);

        // 48x48 tilesets
        const tileset48_1 = map.addTilesetImage('Grass-tileset', 'tileset_48x48_1', 48, 48);
        const tileset48_2 = map.addTilesetImage('Nature-tileset', 'tileset_48x48_2', 48, 48);
        const tileset48_3 = map.addTilesetImage('Objects-hospital', 'tileset_48x48_3', 48, 48);
        const tileset48_9 = map.addTilesetImage('neo-tiles', 'tileset_48x48_9', 48, 48);
        const tileset48_16 = map.addTilesetImage('Street-tilev2', 'tileset_48x48_16', 48, 48);
        console.log('Tilesets added');

        // Create all tile layers from Tiled
        map.layers.forEach(layerData => {
            if (layerData.type === 'tilelayer') {
                const layer = map.createLayer(layerData.name, [
                    tileset16_1, tileset16_2, tileset16_3, tileset16_9, tileset16_16,
                    tileset32_1, tileset32_2, tileset32_3, tileset32_9, tileset32_16,
                    tileset48_1, tileset48_2, tileset48_3, tileset48_9, tileset48_16
                ], 0, 0);
                console.log('Created layer:', layerData.name);
            }
        });

        // Create animations
        // 16x16 animations
        this.anims.create({
            key: 'idle_16x16_anim',
            frames: this.anims.generateFrameNumbers('idle_16x16', { start: 0, end: -1 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'run_16x16_anim',
            frames: this.anims.generateFrameNumbers('run_16x16', { start: 0, end: -1 }),
            frameRate: 10,
            repeat: -1
        });

        // 32x32 animations
        this.anims.create({
            key: 'idle_32x32_anim',
            frames: this.anims.generateFrameNumbers('idle_32x32', { start: 0, end: -1 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'run_32x32_anim',
            frames: this.anims.generateFrameNumbers('run_32x32', { start: 0, end: -1 }),
            frameRate: 10,
            repeat: -1
        });

        // 48x48 animations
        this.anims.create({
            key: 'idle_48x48_anim',
            frames: this.anims.generateFrameNumbers('idle_48x48', { start: 0, end: -1 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'run_48x48_anim',
            frames: this.anims.generateFrameNumbers('run_48x48', { start: 0, end: -1 }),
            frameRate: 10,
            repeat: -1
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

                // Log navigation area properties with proper type handling
                if (obj.properties) {
                    const getPropertyValue = (name) => {
                        const prop = obj.properties.find(p => p.name === name);
                        if (!prop) return null;

                        // Handle different property types
                        switch (prop.type) {
                            case 'float':
                                return parseFloat(prop.value);
                            case 'int':
                                return parseInt(prop.value);
                            case 'bool':
                                return prop.value === 'true';
                            default:
                                return prop.value;
                        }
                    };

                    console.log('Navigation Area:', {
                        name: getPropertyValue('name'),
                        function: getPropertyValue('function'),
                        zone_id: getPropertyValue('zone_id'),
                        speed: getPropertyValue('speed'),
                        type: getPropertyValue('type')
                    });
                }
            });
        } else {
            console.log('No navigation layer found');
        }
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
