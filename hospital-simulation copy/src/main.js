class HospitalScene extends Phaser.Scene {
    constructor() {
        super({ key: 'HospitalScene' });
    }

    preload() {
        this.load.tilemapTiledJSON('hospitalMap', 'public/assets/Hospital-tiled/miniature_hospital_new.json');
        this.load.image('castle', 'public/assets/Hospital-tiled/kenney_platformer-art-extended-tileset/PNG Castle/Spritesheet/sheet.png');
        this.load.image('shop-and-hospital', 'public/assets/Hospital-tiled/Kauzz Free Tiles I/shop-and-hospital.png');

        this.load.on('loaderror', (file) => {
            console.error('Error loading file:', file.src);
        });

        this.load.on('complete', () => {
            console.log('All assets loaded successfully');
        });
    }

    create() {
        const map = this.make.tilemap({ key: 'hospitalMap' });
        const tileset1 = map.addTilesetImage('castle', 'castle', 16, 16, 0, 0);
        const tileset2 = map.addTilesetImage('shop-and-hospital', 'shop-and-hospital', 16, 16, 0, 0);
        const allTilesets = [tileset1, tileset2];

        map.createLayer('Bottom', allTilesets, 0, 0);
        map.createLayer('top', allTilesets, 0, 0);

        const labelLayer = map.getObjectLayer('Object Layer 1');
        if (labelLayer) {
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
        }

        const agent = this.physics.add.sprite(730, 750, null).setCircle(6).setTint(0x00ff00);

        const pathPoints = [
            { name: 'Reception', x: 400, y: 300 },
            { name: 'Examine Room', x: 100, y: 350 },
            { name: 'MRI/LAB', x: 100, y: 250 },
            { name: 'Treatment Room 1', x: 200, y: 100 },
            { name: 'Treatment Room 2', x: 300, y: 100 },
            { name: 'Treatment Room 3', x: 400, y: 100 },
            { name: 'Treatment Room 4', x: 500, y: 100 },
            { name: 'Pharmacy', x: 700, y: 100 },
            { name: 'ICU Room 1', x: 700, y: 250 },
            { name: 'ICU Room 2', x: 700, y: 350 },
            { name: 'Exit', x: 400, y: 300 }
        ];

        let index = 0;

        const moveToNext = () => {
            if (index >= pathPoints.length) {
                console.log('Agent has exited the hospital. Restarting...');
                index = 0;
                agent.setPosition(730, 750); // Reset agent to starting point
                this.time.delayedCall(1000, moveToNext); // Restart after delay
                return;
            }

            const point = pathPoints[index];
            this.tweens.add({
                targets: agent,
                x: point.x,
                y: point.y,
                duration: 1500,
                ease: 'Linear',
                onComplete: () => {
                    console.log(`Visited: ${point.name}`);
                    index++;
                    this.time.delayedCall(1000, moveToNext);
                }
            });
        };

        moveToNext();

        const zoom = Math.min(this.scale.width / map.widthInPixels, this.scale.height / map.heightInPixels);
        this.cameras.main.setZoom(zoom);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.setBackgroundColor('#ffffff');
    }
}

const config = {
    type: Phaser.AUTO,
    width: 780,
    height: 782,
    parent: 'game-container',
    scene: HospitalScene,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    }
};

const game = new Phaser.Game(config);