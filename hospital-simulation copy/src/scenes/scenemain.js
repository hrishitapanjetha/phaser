
class HospitalScene extends Phaser.Scene {
    constructor() {
        super({ key: 'HospitalScene' });
    }

    preload() {
        this.load.tilemapTiledJSON('hospitalMap', 'assets/hospital-map.json');
        this.load.image('tiles', 'assets/hospital-tileset.png');
        this.load.spritesheet('agents', 'assets/agents.png', {
            frameWidth: 32,
            frameHeight: 32
        });
    }

    create() {
        const map = this.make.tilemap({ key: 'hospitalMap' });
        const tileset = map.addTilesetImage('hospital-tileset', 'tiles');
        const belowLayer = map.createLayer('Background', tileset, 0, 0);

        this.agent = this.physics.add.sprite(100, 250, 'agents', 0);
        this.agent.setData('state', 'walkingToTreatment');

        this.treatmentX = 350;
        this.treatmentY = 110;
        this.speed = 50;
    }

    update() {
        const agent = this.agent;
        const state = agent.getData('state');

        if (state === 'walkingToTreatment') {
            const dx = this.treatmentX - agent.x;
            const dy = this.treatmentY - agent.y;

            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance > 5) {
                const angle = Math.atan2(dy, dx);
                agent.setVelocity(this.speed * Math.cos(angle), this.speed * Math.sin(angle));
            } else {
                agent.setVelocity(0, 0);
                agent.setData('state', 'arrived');
                console.log('Agent arrived at Treatment Room!');
            }
        }
    }
}
