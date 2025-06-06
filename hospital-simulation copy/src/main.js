class HospitalScene extends Phaser.Scene {
    constructor() {
        super({ key: 'HospitalScene' });
    }

    preload() {
        console.log('🚀 Preload started');

        // Create loading progress display
        this.createLoadingScreen();

        // Load the tilemap JSON file - try the most likely path first
        this.load.tilemapTiledJSON('hospitalMap', 'public/assets/Hospital-tiled/Hospital-updated-map(newjson).json');

        // Add specific error handling for the tilemap
        this.load.on('filecomplete-tilemapJSON-hospitalMap', (key) => {
            console.log('✅ Tilemap JSON loaded successfully:', key);
        });

        this.load.on('loaderror-tilemapJSON-hospitalMap', (file) => {
            console.error('❌ CRITICAL: Tilemap JSON failed to load from:', file.src);
            console.log('🔄 Trying alternative path...');

            // Try alternative path without 'public/'
            this.load.tilemapTiledJSON('hospitalMapAlt', 'assets/Hospital-tiled/Hospital-updated-map(newjson).json');
        });

        // Add specific error handling for the tilemap
        this.load.on('filecomplete-tilemapJSON-hospitalMap', (key) => {
            console.log('✅ Tilemap JSON loaded successfully:', key);
        });

        this.load.on('loaderror-tilemapJSON-hospitalMap', (file) => {
            console.error('❌ CRITICAL: Tilemap JSON failed to load:', file);
            this.displayError('Tilemap JSON not found - check file path');
        });
        console.log('📋 Loading hospital map JSON');

        // Load tileset images with corrected paths and validation
        const tilesets = [
            { key: 'Tileset', path: 'public/assets/Hospital-tiled/kenney_platformer-art-extended-tileset/PNG Castle/Spritesheet/sheet.png' },
            { key: 'Grass-tileset', path: 'public/assets/Hospital-tiled/kenney_platformer-art-extended-tileset/PNG Grass/Spritesheet/sheet.png' },
            { key: 'Nature-tileset', path: 'public/assets/Hospital-tiled/Kauzz Free Tiles I/nature_outside-tilef.png' },
            { key: 'Objects', path: 'public/assets/Hospital-tiled/Kauzz Free Tiles I/shop-and-hospital.png' },
            { key: 'neo-tiles', path: 'public/assets/Hospital-tiled/Kauzz Free Tiles I/neotiles.png' },
            { key: 'Street-tilev2', path: 'public/assets/Hospital-tiled/Kauzz Free Tiles I/street-tilev2.png' },
            { key: 'Flooring-tileset', path: 'public/assets/Hospital-tiled/Modern tiles_Free/Interiors_free/16x16/Room_Builder_free_16x16.png' },
            { key: 'Furniture-tileset', path: 'public/assets/Hospital-tiled/Modern tiles_Free/Interiors_free/16x16/Interiors_free_16x16.png' },
            { key: 'Character-tileset', path: 'public/assets/Hospital-tiled/Modern tiles_Free/Characters_free/RPGMAKERMV/Characters_MV.png' },
            { key: 'building-inner-tiles', path: 'public/assets/Hospital-tiled/Kauzz Free Tiles I/building_inner-tileg.png' }
        ];

        // Pre-test image loading with fetch
        console.log('🖼️ Testing image accessibility...');
        tilesets.forEach(async (tileset) => {
            try {
                const response = await fetch(tileset.path);
                if (response.ok) {
                    console.log(`✅ Image accessible: ${tileset.key}`);
                } else {
                    console.error(`❌ Image not accessible: ${tileset.key} (${response.status})`);
                    // Try alternative path without 'public/'
                    const altPath = tileset.path.replace('public/', '');
                    const altResponse = await fetch(altPath);
                    if (altResponse.ok) {
                        console.log(`✅ Alternative path works: ${altPath}`);
                        tileset.path = altPath; // Update to working path
                    }
                }
            } catch (error) {
                console.error(`❌ Error testing image ${tileset.key}:`, error);
            }
        });

        tilesets.forEach(tileset => {
            this.load.image(tileset.key, tileset.path);
            console.log(`🖼️ Loading tileset: ${tileset.key} from ${tileset.path}`);
        });

        // Enhanced load event handlers
        this.load.on('loaderror', (file) => {
            console.error('❌ Error loading file:', file.key, 'from:', file.src);
            this.displayError(`Failed to load: ${file.key}`);
        });

        this.load.on('filecomplete', (key, type, data) => {
            console.log('✅ Loaded:', key, type);
            if (type === 'image' && data) {
                console.log(`   Image dimensions: ${data.width}x${data.height}`);
            }
        });

        this.load.on('complete', () => {
            console.log('🎉 All assets loaded successfully');
            this.hideLoadingScreen();
        });

        this.load.on('progress', (progress) => {
            this.updateLoadingProgress(progress);
        });
    }

    createLoadingScreen() {
        // Create loading screen elements
        this.loadingText = this.add.text(640, 300, 'Loading Hospital Scene...', {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        this.progressText = this.add.text(640, 350, '0%', {
            fontSize: '18px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        this.errorText = this.add.text(640, 400, '', {
            fontSize: '16px',
            fill: '#ff0000',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
    }

    updateLoadingProgress(progress) {
        if (this.progressText) {
            this.progressText.setText(`${Math.round(progress * 100)}%`);
        }
    }

    displayError(message) {
        if (this.errorText) {
            this.errorText.setText(message);
        }
    }

    hideLoadingScreen() {
        if (this.loadingText) this.loadingText.destroy();
        if (this.progressText) this.progressText.destroy();
        if (this.errorText) this.errorText.destroy();
    }

    create() {
        console.log('🏗️ Create started');

        // Clear any loading screen remnants
        this.hideLoadingScreen();

        // Create debug info display
        this.createDebugDisplay();

        try {
            // Try to create the tilemap with primary key, fallback to alternative
            let map = this.make.tilemap({ key: 'hospitalMap' });

            if (!map || !map.layers || map.layers.length === 0) {
                console.log('🔄 Trying alternative tilemap key...');
                map = this.make.tilemap({ key: 'hospitalMapAlt' });
            }

            console.log('🗺️ Tilemap created');

            this.debugTilemapInfo(map);

            // Check if map data exists
            if (!map) {
                throw new Error('Tilemap failed to create - check if JSON loaded properly');
            }

            if (!map.layers || map.layers.length === 0) {
                console.error('❌ CRITICAL: No layers found in tilemap');
                console.error('Available map properties:', Object.keys(map));

                // Try alternative approaches to access the map data
                if (map.json) {
                    console.log('Map JSON data:', map.json);
                }

                throw new Error(`Tilemap has no layers. Map dimensions: ${map.width}x${map.height}, Tilesets: ${map.tilesets ? map.tilesets.length : 0}`);
            }

            // Add tilesets with improved error handling and flexible tile sizes
            const tilesetConfigs = [
                { name: 'Tileset', key: 'Tileset', tileWidth: 16, tileHeight: 16 },
                { name: 'Grass-tileset', key: 'Grass-tileset', tileWidth: 16, tileHeight: 16 },
                { name: 'Nature-tileset', key: 'Nature-tileset', tileWidth: 16, tileHeight: 16 },
                { name: 'Objects', key: 'Objects', tileWidth: 16, tileHeight: 16 },
                { name: 'neo-tiles', key: 'neo-tiles', tileWidth: 16, tileHeight: 16 },
                { name: 'Street-tilev2', key: 'Street-tilev2', tileWidth: 16, tileHeight: 16 },
                { name: 'Flooring-tileset', key: 'Flooring-tileset', tileWidth: 16, tileHeight: 16 },
                { name: 'Furniture-tileset', key: 'Furniture-tileset', tileWidth: 16, tileHeight: 16 },
                { name: 'Character-tileset', key: 'Character-tileset', tileWidth: 16, tileHeight: 16 },
                { name: 'building-inner-tiles', key: 'building-inner-tiles', tileWidth: 16, tileHeight: 16 }
            ];

            const allTilesets = [];
            const failedTilesets = [];

            tilesetConfigs.forEach(config => {
                try {
                    // Check if the texture was loaded successfully
                    const texture = this.textures.get(config.key);
                    if (!texture || texture.key === '__MISSING') {
                        console.error(`❌ Texture not found: ${config.key}`);
                        failedTilesets.push(config.name);
                        return;
                    }

                    console.log(`🔍 Texture found for ${config.key}: ${texture.source[0].width}x${texture.source[0].height}`);

                    // Try to add the tileset with the exact name from the JSON
                    const tileset = map.addTilesetImage(config.name, config.key, config.tileWidth, config.tileHeight, 0, 0);
                    if (tileset) {
                        allTilesets.push(tileset);
                        console.log(`✅ Tileset loaded: ${config.name}`);
                        this.debugTilesetInfo(tileset);
                    } else {
                        // If that fails, try with just the key name
                        const altTileset = map.addTilesetImage(config.key, config.key, config.tileWidth, config.tileHeight, 0, 0);
                        if (altTileset) {
                            allTilesets.push(altTileset);
                            console.log(`✅ Tileset loaded with alternative name: ${config.key}`);
                            this.debugTilesetInfo(altTileset);
                        } else {
                            failedTilesets.push(config.name);
                            console.error(`❌ Failed to create tileset: ${config.name}`);
                        }
                    }
                } catch (error) {
                    failedTilesets.push(config.name);
                    console.error(`❌ Error creating tileset ${config.name}:`, error);
                }
            });

            if (failedTilesets.length > 0) {
                console.warn('⚠️ Failed tilesets:', failedTilesets);
                this.updateDebugInfo(`Failed tilesets: ${failedTilesets.join(', ')}`);
            }

            if (allTilesets.length === 0) {
                throw new Error('No tilesets loaded successfully');
            }

            // Create layers in correct order (bottom to top)
            const layers = {};
            const layerOrder = ['Bottom layer', 'Middle layer', 'Toplayer'];

            layerOrder.forEach((layerName, index) => {
                try {
                    console.log(`🎨 Attempting to create layer: ${layerName}`);

                    // Check if layer exists in the tilemap
                    const layerData = map.getLayer(layerName);
                    if (!layerData) {
                        console.warn(`⚠️ Layer "${layerName}" not found in tilemap`);
                        return;
                    }

                    const layer = map.createLayer(layerName, allTilesets, 0, 0);
                    if (layer) {
                        layers[layerName] = layer;
                        layer.setDepth(index * 10); // Give more space between depths
                        layer.setVisible(true);
                        layer.setAlpha(1);
                        console.log(`✅ Layer created: ${layerName} at depth ${index * 10}`);
                        this.debugLayerInfo(layer, layerName);
                    } else {
                        console.warn(`⚠️ Failed to create layer: ${layerName}`);
                    }
                } catch (error) {
                    console.error(`❌ Error creating layer ${layerName}:`, error);
                }
            });

            // Check for object layers (like NPCs, furniture, etc.)
            this.createObjectLayers(map);

            // Detailed layer analysis
            this.analyzeLayerData(map);

            // Set up camera with better bounds
            const mapWidth = map.widthInPixels || map.width * map.tileWidth;
            const mapHeight = map.heightInPixels || map.height * map.tileHeight;

            this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);
            this.cameras.main.setBackgroundColor('#87CEEB'); // Sky blue background

            // Start camera at a better position (center of map)
            this.cameras.main.centerOn(mapWidth / 2, mapHeight / 2);
            this.cameras.main.setZoom(0.8); // Start slightly zoomed out

            // Add zoom and pan controls
            this.setupCameraControls();

            // Update debug display
            this.updateDebugInfo(`Map: ${mapWidth}x${mapHeight}, Layers: ${Object.keys(layers).length}`);

            console.log('🎯 Scene setup complete');

        } catch (error) {
            console.error('💥 Fatal error in create():', error);
            this.displayFatalError(error.message);
        }
    }

    createObjectLayers(map) {
        console.log('🏗️ Creating object layers...');

        // Check for object layers in the tilemap
        if (map.objects && map.objects.length > 0) {
            map.objects.forEach((objectLayer, index) => {
                console.log(`📦 Processing object layer: ${objectLayer.name} (${objectLayer.objects ? objectLayer.objects.length : 0} objects)`);

                if (objectLayer.objects && objectLayer.objects.length > 0) {
                    objectLayer.objects.forEach((obj, objIndex) => {
                        console.log(`   Object ${objIndex}: type="${obj.type || ''}", gid=${obj.gid || 'undefined'}, pos=(${obj.x}, ${obj.y}), width=${obj.width || 'undefined'}, height=${obj.height || 'undefined'}`);

                        // Handle different object types
                        if (obj.gid && obj.gid > 0) {
                            // This is a tile object - find the appropriate tileset
                            let tilesetToUse = null;
                            let localTileId = obj.gid;

                            // Find which tileset this GID belongs to
                            for (let i = map.tilesets.length - 1; i >= 0; i--) {
                                const tileset = map.tilesets[i];
                                if (obj.gid >= tileset.firstgid) {
                                    tilesetToUse = tileset;
                                    localTileId = obj.gid - tileset.firstgid;
                                    break;
                                }
                            }

                            if (tilesetToUse && tilesetToUse.image && tilesetToUse.image.key) {
                                try {
                                    // Create a sprite for this object using the tileset's image
                                    const sprite = this.add.sprite(obj.x, obj.y - (obj.height || 16), tilesetToUse.image.key);
                                    sprite.setOrigin(0, 0);
                                    sprite.setDepth(1000); // Objects should be on top

                                    // Calculate frame based on tileset layout
                                    const tilesPerRow = Math.floor(tilesetToUse.imagewidth / tilesetToUse.tilewidth);
                                    const frameX = localTileId % tilesPerRow;
                                    const frameY = Math.floor(localTileId / tilesPerRow);

                                    // Try to set the frame if the tileset has multiple tiles
                                    if (tilesetToUse.total > 1) {
                                        try {
                                            // Create the frame if it doesn't exist
                                            const texture = this.textures.get(tilesetToUse.image.key);
                                            if (!texture.has(localTileId)) {
                                                texture.add(localTileId, 0,
                                                    frameX * tilesetToUse.tilewidth,
                                                    frameY * tilesetToUse.tileheight,
                                                    tilesetToUse.tilewidth,
                                                    tilesetToUse.tileheight
                                                );
                                            }
                                            sprite.setFrame(localTileId);
                                        } catch (frameError) {
                                            console.warn(`Could not set frame ${localTileId} for sprite: ${frameError.message}`);
                                        }
                                    }

                                    console.log(`➕ Created object sprite: ${tilesetToUse.name} at (${obj.x}, ${obj.y - (obj.height || 16)}), localId: ${localTileId}, frame: (${frameX}, ${frameY})`);
                                } catch (error) {
                                    console.error(`❌ Error creating object sprite:`, error);
                                }
                            } else {
                                console.warn(`⚠️ Could not find valid tileset for object with GID ${obj.gid}`);
                                if (tilesetToUse) {
                                    console.warn(`   Tileset found: ${tilesetToUse.name}, but image key: ${tilesetToUse.image?.key || 'undefined'}`);
                                }
                            }
                        } else if (obj.type && obj.type.trim() !== '') {
                            // Handle named object types (like spawn points, triggers, etc.)
                            console.log(`📍 Found named object: ${obj.type} at (${obj.x}, ${obj.y})`);

                            // You can add custom logic here for different object types
                            if (obj.type === 'spawn' || obj.type === 'player_spawn') {
                                // Mark spawn points
                                const marker = this.add.circle(obj.x + (obj.width || 16) / 2, obj.y + (obj.height || 16) / 2, 8, 0x00ff00, 0.5);
                                marker.setDepth(2000);
                            }
                        } else if (obj.width && obj.height) {
                            // This might be a rectangular object or area trigger
                            console.log(`📐 Found rectangular object: ${obj.width}x${obj.height} at (${obj.x}, ${obj.y})`);

                            // Draw a debug rectangle to show object boundaries
                            const rect = this.add.rectangle(
                                obj.x + obj.width / 2,
                                obj.y + obj.height / 2,
                                obj.width,
                                obj.height
                            );
                            rect.setStrokeStyle(2, 0xff0000, 0.5);
                            rect.setFillStyle(0xff0000, 0.1);
                            rect.setDepth(1500);
                        } else {
                            console.warn(`⚠️ Object ${objIndex} has no valid GID, type, or dimensions`);
                        }
                    });
                }
            });
        } else {
            console.log('📦 No object layers found in tilemap');
        }
    }

    debugTilemapInfo(map) {
        console.log('📊 TILEMAP DEBUG INFO:');
        console.log(`   Map object:`, map);
        console.log(`   Dimensions: ${map.widthInPixels || 'undefined'}x${map.heightInPixels || 'undefined'} pixels`);
        console.log(`   Tile size: ${map.tileWidth || 'undefined'}x${map.tileHeight || 'undefined'}`);
        console.log(`   Map size: ${map.width || 'undefined'}x${map.height || 'undefined'} tiles`);
        console.log(`   Layers: ${map.layers ? map.layers.length : 'undefined'}`);
        console.log(`   Tilesets: ${map.tilesets ? map.tilesets.length : 'undefined'}`);

        // Check if there's raw JSON data
        if (map.json) {
            console.log('📋 Raw JSON data found:');
            console.log(`   JSON layers: ${map.json.layers ? map.json.layers.length : 'none'}`);
            console.log(`   JSON tilesets: ${map.json.tilesets ? map.json.tilesets.length : 'none'}`);
            if (map.json.layers) {
                map.json.layers.forEach((layer, index) => {
                    console.log(`   JSON Layer ${index}: "${layer.name}" type: ${layer.type}`);
                });
            }
        }

        if (map.layers && map.layers.length > 0) {
            map.layers.forEach((layer, index) => {
                console.log(`   Layer ${index}: "${layer.name}" (${layer.width}x${layer.height})`);
            });
        } else {
            console.warn('⚠️ NO LAYERS FOUND IN TILEMAP!');
        }

        if (map.objects) {
            console.log(`   Object layers: ${map.objects.length}`);
            map.objects.forEach((objLayer, index) => {
                console.log(`   Object Layer ${index}: "${objLayer.name}" (${objLayer.objects ? objLayer.objects.length : 0} objects)`);
            });
        }
    }

    debugTilesetInfo(tileset) {
        console.log(`📋 TILESET DEBUG: ${tileset.name}`);
        console.log(`   First GID: ${tileset.firstgid}`);
        console.log(`   Tile count: ${tileset.total}`);
        console.log(`   Tile size: ${tileset.tileWidth}x${tileset.tileHeight}`);
        console.log(`   Image: ${tileset.image ? tileset.image.width + 'x' + tileset.image.height : 'No image'}`);
    }

    debugLayerInfo(layer, layerName) {
        console.log(`🎭 LAYER DEBUG: ${layerName}`);
        console.log(`   Visible: ${layer.visible}`);
        console.log(`   Alpha: ${layer.alpha}`);
        console.log(`   Depth: ${layer.depth}`);

        // Count non-empty tiles
        let tileCount = 0;
        let emptyCount = 0;

        if (layer.layer && layer.layer.data) {
            layer.layer.data.forEach(row => {
                row.forEach(tile => {
                    if (tile.index > 0) {
                        tileCount++;
                    } else {
                        emptyCount++;
                    }
                });
            });
        }

        console.log(`   Tiles with data: ${tileCount}`);
        console.log(`   Empty tiles: ${emptyCount}`);

        if (tileCount === 0) {
            console.warn(`⚠️ Layer "${layerName}" appears to be empty!`);
        }
    }

    analyzeLayerData(map) {
        console.log('🔍 DETAILED LAYER ANALYSIS:');

        map.layers.forEach((layerData, layerIndex) => {
            console.log(`\n--- Layer ${layerIndex}: "${layerData.name}" ---`);
            console.log(`Size: ${layerData.width}x${layerData.height}`);

            const tileStats = {};
            let totalTiles = 0;
            let emptyTiles = 0;

            // Analyze tile data
            if (layerData.data && layerData.data.length > 0) {
                layerData.data.forEach((row, y) => {
                    if (row && row.length > 0) {
                        row.forEach((tile, x) => {
                            totalTiles++;
                            if (tile.index === -1 || tile.index === 0) {
                                emptyTiles++;
                            } else {
                                tileStats[tile.index] = (tileStats[tile.index] || 0) + 1;
                            }
                        });
                    }
                });

                console.log(`Total tiles: ${totalTiles}`);
                console.log(`Empty tiles: ${emptyTiles}`);
                console.log(`Tiles with data: ${totalTiles - emptyTiles}`);

                if (Object.keys(tileStats).length > 0) {
                    console.log('Tile IDs found:', Object.keys(tileStats).slice(0, 10));
                } else {
                    console.warn('⚠️ NO TILE DATA FOUND - Layer is completely empty!');
                }
            } else {
                console.error('❌ Layer data is null or empty');
            }
        });
    }

    setupCameraControls() {
        // Add keyboard controls for camera
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys('W,S,A,D');

        // Mouse wheel zoom
        this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
            const camera = this.cameras.main;
            if (deltaY > 0) {
                camera.setZoom(Math.max(0.1, camera.zoom - 0.1));
            } else {
                camera.setZoom(Math.min(3, camera.zoom + 0.1));
            }
        });

        // Mouse drag to pan
        let isDragging = false;
        let lastPointer = { x: 0, y: 0 };

        this.input.on('pointerdown', (pointer) => {
            isDragging = true;
            lastPointer.x = pointer.x;
            lastPointer.y = pointer.y;
        });

        this.input.on('pointerup', () => {
            isDragging = false;
        });

        this.input.on('pointermove', (pointer) => {
            if (isDragging) {
                const camera = this.cameras.main;
                const deltaX = (pointer.x - lastPointer.x) / camera.zoom;
                const deltaY = (pointer.y - lastPointer.y) / camera.zoom;

                camera.scrollX -= deltaX;
                camera.scrollY -= deltaY;

                lastPointer.x = pointer.x;
                lastPointer.y = pointer.y;
            }
        });
    }

    update() {
        // Camera movement
        const speed = 5 / this.cameras.main.zoom;

        if (this.cursors.left.isDown || this.wasd.A.isDown) {
            this.cameras.main.scrollX -= speed;
        }
        if (this.cursors.right.isDown || this.wasd.D.isDown) {
            this.cameras.main.scrollX += speed;
        }
        if (this.cursors.up.isDown || this.wasd.W.isDown) {
            this.cameras.main.scrollY -= speed;
        }
        if (this.cursors.down.isDown || this.wasd.S.isDown) {
            this.cameras.main.scrollY += speed;
        }
    }

    createDebugDisplay() {
        // Create debug info display
        this.debugDisplay = this.add.text(10, 10, 'Debug Info Loading...', {
            fontSize: '14px',
            fill: '#000000',
            backgroundColor: '#ffffff',
            padding: { x: 10, y: 5 },
            fontFamily: 'monospace'
        }).setScrollFactor(0).setDepth(1000);
    }

    updateDebugInfo(info) {
        if (this.debugDisplay) {
            const debugText = [
                'HOSPITAL SCENE DEBUG',
                '===================',
                info,
                '',
                'Controls:',
                'Arrow Keys/WASD: Move camera',
                'Mouse Wheel: Zoom',
                'Mouse Drag: Pan camera',
                '',
                'Check console for detailed logs'
            ];
            this.debugDisplay.setText(debugText.join('\n'));
        }
    }

    displayFatalError(message) {
        this.add.text(640, 360, 'FATAL ERROR', {
            fontSize: '32px',
            fill: '#ff0000',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        this.add.text(640, 400, message, {
            fontSize: '16px',
            fill: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 },
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        this.add.text(640, 450, 'Check console for details', {
            fontSize: '14px',
            fill: '#cccccc',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
    }
}

// Enhanced game configuration
const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    parent: 'game-container',
    scene: HospitalScene,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false, // Set to true for collision debugging
            gravity: { y: 0 }
        }
    },
    render: {
        pixelArt: true,
        antialias: false
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

// Initialize the game with error handling
try {
    console.log('🎮 Initializing Phaser game...');
    const game = new Phaser.Game(config);

    game.events.on('ready', () => {
        console.log('🎮 Game ready!');
    });

} catch (error) {
    console.error('💥 Failed to initialize game:', error);

    // Display error message in the game container
    const container = document.getElementById('game-container');
    if (container) {
        container.innerHTML = `
            <div style="color: red; padding: 20px; font-family: Arial;">
                <h2>Game Initialization Error</h2>
                <p>${error.message}</p>
                <p>Check the console for more details.</p>
            </div>
        `;
    }
}