class HospitalScene extends Phaser.Scene {
    constructor() {
        super({ key: 'HospitalScene' });
    }

    preload() {
        console.log('Preload started');

        // Load the tilemap JSON file
        this.load.tilemapTiledJSON('hospitalMap', 'public/assets/Hospital-updated-map.json');
        console.log('Loading hospital map JSON');

        // Load tileset images based on .tsx files
        this.load.image('Tileset', 'public/assets/tilesets/kenney_platformer-art-extended-tileset/PNG Castle/Spritesheet/sheet.png');
        this.load.image('Grass-tileset', 'public/assets/tilesets/kenney_platformer-art-extended-tileset/PNG Grass/Spritesheet/sheet.png');
        this.load.image('Nature-tileset', 'public/assets/tilesets/kenney_platformer-art-extended-tileset/PNG Nature/Spritesheet/sheet.png');
        this.load.image('Objects-hospital', 'public/assets/tilesets/kenney_platformer-art-extended-tileset/PNG Objects/Spritesheet/sheet.png');
        this.load.image('neo-tiles', 'public/assets/tilesets/Modern tiles_Free/Modern tiles_Free/PNG/Modern tiles_Free.png');
        this.load.image('Tileset', 'public/assets/images/kenney_platformer-art-extended-tileset/PNG Castle/Spritesheet/sheet.png');
        this.load.image('Grass-tileset', 'public/assets/images/kenney_platformer-art-extended-tileset/PNG Grass/Spritesheet/sheet.png');
        this.load.image('Nature-tileset', 'public/assets/images/kenney_platformer-art-extended-tileset/PNG Nature/Spritesheet/sheet.png');
        this.load.image('Objects-hospital', 'public/assets/images/kenney_platformer-art-extended-tileset/PNG Objects/Spritesheet/sheet.png');
        this.load.image('neo-tiles', 'public/assets/images/kenney_platformer-art-extended-tileset/PNG Modern/Spritesheet/sheet.png');
        this.load.image('Street-tilev2', 'public/assets/images/kenney_platformer-art-extended-tileset/PNG City/Spritesheet/sheet.png');
        this.load.image('Flooring-tileset', 'public/assets/images/kenney_platformer-art-extended-tileset/PNG Interior/Spritesheet/sheet.png');
        this.load.image('Furniture-tileset', 'public/assets/images/kenney_platformer-art-extended-tileset/PNG Interior/Spritesheet/sheet.png');
        this.load.image('Character-tileset', 'public/assets/images/kenney_platformer-art-extended-tileset/PNG Characters/Spritesheet/sheet.png');
        console.log('Loading tileset images');

        // Character animations as spritesheets
        // 16x16 animations
        this.load.spritesheet('idle_16x16', 'public/assets/tilesets/Kauzz Free Tiles I/Characters/Idle.png', {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.spritesheet('run_16x16', 'public/assets/tilesets/Kauzz Free Tiles I/Characters/Run.png', {
            frameWidth: 16,
            frameHeight: 16
        });
        console.log('Loading 16x16 character animations');

        // 32x32 animations
        this.load.spritesheet('idle_32x32', 'public/assets/tilesets/Kauzz Free Tiles I/Characters/Idle.png', {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.spritesheet('run_32x32', 'public/assets/tilesets/Kauzz Free Tiles I/Characters/Run.png', {
            frameWidth: 32,
            frameHeight: 32
        });
        console.log('Loading 32x32 character animations');

        // 48x48 animations
        this.load.spritesheet('idle_48x48', 'public/assets/tilesets/Kauzz Free Tiles I/Characters/Idle.png', {
            frameWidth: 48,
            frameHeight: 48
        });
        this.load.spritesheet('run_48x48', 'public/assets/tilesets/Kauzz Free Tiles I/Characters/Run.png', {
            frameWidth: 48,
            frameHeight: 48
        });
        console.log('Loading 48x48 character animations');

        // Load images from old/mv folder
        this.load.spritesheet('character_2_16x16', 'public/assets/tilesets/Modern tiles_Free/Old/mv/Character_2_16x16_RPGMAKER.png', {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.spritesheet('character_2_32x32', 'public/assets/tilesets/Modern tiles_Free/Old/mv/Character_2_32x32_RPGMAKER.png', {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.spritesheet('character_2_48x48', 'public/assets/tilesets/Modern tiles_Free/Old/mv/Character_2_48x48_RPGMAKER.png', {
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

        // Add tilesets with correct tile sizes
        const tilesetBase = map.addTilesetImage('Tileset', 'Tileset', 16, 16, 1, 1);
        const tilesetGrass = map.addTilesetImage('Grass-tileset', 'Grass-tileset', 16, 16, 1, 1);
        const tilesetNature = map.addTilesetImage('Nature-tileset', 'Nature-tileset', 16, 16, 1, 1);
        const tilesetObjects = map.addTilesetImage('Objects-hospital', 'Objects-hospital', 16, 16, 1, 1);
        const tilesetNeo = map.addTilesetImage('neo-tiles', 'neo-tiles', 16, 16, 1, 1);
        const tilesetStreet = map.addTilesetImage('Street-tilev2', 'Street-tilev2', 32, 32, 1, 1);
        const tilesetFlooring = map.addTilesetImage('Flooring-tileset', 'Flooring-tileset', 32, 32, 1, 1);
        const tilesetFurniture = map.addTilesetImage('Furniture-tileset', 'Furniture-tileset', 32, 32, 1, 1);
        const tilesetCharacter = map.addTilesetImage('Character-tileset', 'Character-tileset', 32, 32, 1, 1);
        console.log('Tilesets added');

        // Create all tile layers from Tiled
        map.layers.forEach(layerData => {
            if (layerData.type === 'tilelayer') {
                const layer = map.createLayer(layerData.name, [
                    tilesetBase, tilesetGrass, tilesetNature, tilesetObjects, tilesetNeo,
                    tilesetStreet, tilesetFlooring, tilesetFurniture, tilesetCharacter
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
