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
    // Load assets here
}

function create() {
    this.add.text(200, 250, 'Welcome to Hospital Sim!', { fontSize: '24px', fill: '#000' });
}