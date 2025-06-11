// Entity Classes
class Patient extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, null);

        // Create a colored rectangle as sprite
        this.patientRect = scene.add.rectangle(x, y, 12, 12, 0xff6b6b);
        this.patientRect.setStrokeStyle(2, 0x000000);

        // Patient properties
        this.id = Math.random().toString(36).substr(2, 9);
        this.state = 'arriving'; // arriving, waiting, in_examination, treated, leaving
        this.waitTime = 0;
        this.treatmentTime = 0;
        this.assignedDoctor = null;
        this.target = null;
        this.speed = 20;
        this.isMoving = false;

        // Health status
        this.severity = Math.random() > 0.7 ? 'critical' : Math.random() > 0.4 ? 'moderate' : 'mild';
        this.treatmentDuration = this.severity === 'critical' ? 8000 :
            this.severity === 'moderate' ? 5000 : 3000;

        // Color based on severity
        const colors = { critical: 0xff4757, moderate: 0xffa502, mild: 0x2ed573 };
        this.patientRect.setFillStyle(colors[this.severity]);

        // Add to scene
        scene.add.existing(this);
        scene.patients.push(this);

        console.log(`Patient ${this.id} arrived with ${this.severity} condition`);
    }

    update() {
        if (this.isMoving && this.target) {
            const distance = Phaser.Math.Distance.Between(
                this.patientRect.x, this.patientRect.y,
                this.target.x, this.target.y
            );

            if (distance > 2) {
                const angle = Phaser.Math.Angle.Between(
                    this.patientRect.x, this.patientRect.y,
                    this.target.x, this.target.y
                );

                this.patientRect.x += Math.cos(angle) * this.speed * (1 / 60);
                this.patientRect.y += Math.sin(angle) * this.speed * (1 / 60);
            } else {
                this.isMoving = false;
                this.onReachTarget();
            }
        }

        if (this.state === 'waiting') {
            this.waitTime += 1 / 60;
        }

        if (this.state === 'in_examination') {
            this.treatmentTime += 1 / 60;
        }
    }

    moveTo(x, y) {
        this.target = { x, y };
        this.isMoving = true;
    }

    onReachTarget() {
        switch (this.state) {
            case 'arriving':
                this.state = 'waiting';
                this.scene.addToWaitingQueue(this);
                break;
            case 'going_to_examination':
                this.state = 'in_examination';
                this.scene.startTreatment(this);
                break;
            case 'leaving':
                this.destroy();
                break;
        }
    }

    destroy() {
        this.patientRect.destroy();
        const index = this.scene.patients.indexOf(this);
        if (index > -1) {
            this.scene.patients.splice(index, 1);
        }
        super.destroy();
    }
}

class Doctor extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, roomX, roomY) {
        super(scene, x, y, null);

        // Create a colored rectangle as sprite
        this.doctorRect = scene.add.rectangle(x, y, 12, 12, 0x3742fa);
        this.doctorRect.setStrokeStyle(2, 0x000000);

        // Doctor properties
        this.id = Math.random().toString(36).substr(2, 9);
        this.state = 'idle'; // idle, busy, moving
        this.currentPatient = null;
        this.roomPosition = { x: roomX, y: roomY };
        this.idlePosition = { x, y };
        this.target = null;
        this.speed = 30;
        this.isMoving = false;
        this.experience = Math.random() * 0.5 + 0.5; // 0.5 to 1.0

        // Add to scene
        scene.add.existing(this);
        scene.doctors.push(this);

        console.log(`Doctor ${this.id} assigned to room at (${roomX}, ${roomY})`);
    }

    update() {
        if (this.isMoving && this.target) {
            const distance = Phaser.Math.Distance.Between(
                this.doctorRect.x, this.doctorRect.y,
                this.target.x, this.target.y
            );

            if (distance > 2) {
                const angle = Phaser.Math.Angle.Between(
                    this.doctorRect.x, this.doctorRect.y,
                    this.target.x, this.target.y
                );

                this.doctorRect.x += Math.cos(angle) * this.speed * (1 / 60);
                this.doctorRect.y += Math.sin(angle) * this.speed * (1 / 60);
            } else {
                this.isMoving = false;
                this.onReachTarget();
            }
        }
    }

    moveTo(x, y) {
        this.target = { x, y };
        this.isMoving = true;
        this.state = 'moving';
    }

    onReachTarget() {
        if (this.currentPatient) {
            this.state = 'busy';
        } else {
            this.state = 'idle';
        }
    }

    assignPatient(patient) {
        if (this.state === 'idle') {
            this.currentPatient = patient;
            this.state = 'busy';
            patient.assignedDoctor = this;
            return true;
        }
        return false;
    }

    finishTreatment() {
        if (this.currentPatient) {
            console.log(`Doctor ${this.id} finished treating Patient ${this.currentPatient.id}`);
            this.currentPatient.assignedDoctor = null;
            this.currentPatient = null;
            this.state = 'idle';
            this.moveTo(this.idlePosition.x, this.idlePosition.y);
        }
    }
}

class Nurse extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, null);

        // Create a colored rectangle as sprite
        this.nurseRect = scene.add.rectangle(x, y, 10, 10, 0x00d2d3);
        this.nurseRect.setStrokeStyle(2, 0x000000);

        // Nurse properties
        this.id = Math.random().toString(36).substr(2, 9);
        this.state = 'idle'; // idle, assisting, moving
        this.target = null;
        this.speed = 25;
        this.isMoving = false;

        // Add to scene
        scene.add.existing(this);
        scene.nurses.push(this);

        console.log(`Nurse ${this.id} ready for duty`);
    }

    update() {
        if (this.isMoving && this.target) {
            const distance = Phaser.Math.Distance.Between(
                this.nurseRect.x, this.nurseRect.y,
                this.target.x, this.target.y
            );

            if (distance > 2) {
                const angle = Phaser.Math.Angle.Between(
                    this.nurseRect.x, this.nurseRect.y,
                    this.target.x, this.target.y
                );

                this.nurseRect.x += Math.cos(angle) * this.speed * (1 / 60);
                this.nurseRect.y += Math.sin(angle) * this.speed * (1 / 60);
            } else {
                this.isMoving = false;
                this.state = 'idle';
            }
        }
    }

    moveTo(x, y) {
        this.target = { x, y };
        this.isMoving = true;
        this.state = 'moving';
    }
}

// Main Hospital Scene
class HospitalScene extends Phaser.Scene {
    constructor() {
        super({ key: 'HospitalScene' });

        // Arrays to hold entities
        this.patients = [];
        this.doctors = [];
        this.nurses = [];

        // Hospital areas
        this.areas = {
            entrance: { x: 100, y: 400 },
            reception: { x: 200, y: 400 },
            waitingArea: { x: 300, y: 400 },
            examinationRooms: [
                { x: 500, y: 200 },
                { x: 500, y: 300 },
                { x: 500, y: 400 }
            ],
            exit: { x: 700, y: 400 }
        };

        // Queues and management
        this.waitingQueue = [];
        this.patientSpawnTimer = null;
        this.patientSpawnInterval = 3; // seconds

        // Statistics
        this.stats = {
            totalPatients: 0,
            treatedPatients: 0,
            averageWaitTime: 0,
            averageTreatmentTime: 0
        };
    }

    preload() {
        console.log('Preload started');

        // Load the tilemap JSON file
        this.load.tilemapTiledJSON('hospitalMap', 'public/assets/Hospital-tiled/miniature_hospital_new.json');
        console.log('Loading hospital map JSON');

        // Load tileset images
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

        // Add tilesets with proper error handling
        let tilesetBase, tilesetObjects;

        try {
            // Try with explicit tile size first
            tilesetBase = map.addTilesetImage('castle', 'castle', 16, 16, 0, 0);
        } catch (error) {
            console.warn('Using auto-detect for castle tileset');
            tilesetBase = map.addTilesetImage('castle', 'castle');
        }

        try {
            tilesetObjects = map.addTilesetImage('shop-and-hospital', 'shop-and-hospital', 16, 16, 0, 0);
        } catch (error) {
            console.warn('Using auto-detect for shop-and-hospital tileset');
            tilesetObjects = map.addTilesetImage('shop-and-hospital', 'shop-and-hospital');
        }

        const allTilesets = [tilesetBase, tilesetObjects];

        // Create layers
        const layers = {
            'Bottom': map.createLayer('Bottom', allTilesets, 0, 0),
            'top': map.createLayer('top', allTilesets, 0, 0),
        };

        console.log('Layers created');

        // Handle text labels
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

        // Initialize staff from spawn points
        const objectsLayer = map.getObjectLayer('spawns');
        if (objectsLayer) {
            objectsLayer.objects.forEach(obj => {
                const { x, y, type } = obj;

                if (type === 'Doctors') {
                    // Assign doctors to examination rooms
                    const roomIndex = this.doctors.length % this.areas.examinationRooms.length;
                    const room = this.areas.examinationRooms[roomIndex];
                    new Doctor(this, x, y, room.x, room.y);
                } else if (type === 'Nurses') {
                    new Nurse(this, x, y);
                }
            });
        }

        // Set up camera and physics
        const zoom = Math.min(this.scale.width / map.widthInPixels, this.scale.height / map.heightInPixels);
        this.cameras.main.setZoom(zoom);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.setBackgroundColor('#ffffff');

        // Create UI
        this.createUI();

        // Start simulation
        this.startSimulation();

        console.log('Hospital simulation started!');
    }

    createUI() {
        // Create UI background
        this.uiBackground = this.add.rectangle(10, 10, 200, 150, 0x000000, 0.7);
        this.uiBackground.setOrigin(0, 0);
        this.uiBackground.setScrollFactor(0);

        // Create UI text
        this.uiText = this.add.text(20, 20, '', {
            font: '12px Arial',
            fill: '#ffffff'
        });
        this.uiText.setScrollFactor(0);

        // Create legend
        this.legendText = this.add.text(20, 200,
            'Legend:\n' +
            '🟦 Doctors\n' +
            '🟩 Nurses\n' +
            '🔴 Critical Patients\n' +
            '🟠 Moderate Patients\n' +
            '🟢 Mild Patients', {
            font: '10px Arial',
            fill: '#000000',
            backgroundColor: '#ffffff',
            padding: { x: 5, y: 5 }
        });
        this.legendText.setScrollFactor(0);
    }

    startSimulation() {
        // Spawn initial patients
        this.spawnPatient();

        // Set up timers
        this.patientSpawnTimer = this.time.addEvent({
            delay: this.patientSpawnInterval * 1000,
            callback: this.spawnPatient,
            callbackScope: this,
            loop: true
        });
    }

    spawnPatient() {
        const patient = new Patient(this, this.areas.entrance.x, this.areas.entrance.y);
        patient.moveTo(this.areas.reception.x, this.areas.reception.y);
        this.stats.totalPatients++;

        // Add some randomness to spawn timing
        this.patientSpawnInterval = 2 + Math.random() * 4; // 2-6 seconds

        // Update the timer's delay if it exists
        if (this.patientSpawnTimer) {
            this.patientSpawnTimer.delay = this.patientSpawnInterval * 1000;
        }
    }

    addToWaitingQueue(patient) {
        this.waitingQueue.push(patient);
        console.log(`Patient ${patient.id} added to waiting queue (${this.waitingQueue.length} waiting)`);

        // Move to waiting area
        const waitingSpot = this.getWaitingSpot();
        patient.moveTo(waitingSpot.x, waitingSpot.y);

        // Try to assign to available doctor
        this.assignPatientToDoctor();
    }

    getWaitingSpot() {
        const baseX = this.areas.waitingArea.x;
        const baseY = this.areas.waitingArea.y;
        const queueLength = this.waitingQueue.length;

        return {
            x: baseX + ((queueLength - 1) % 3) * 20,
            y: baseY + Math.floor((queueLength - 1) / 3) * 20
        };
    }

    assignPatientToDoctor() {
        if (this.waitingQueue.length === 0) return;

        // Find available doctor
        const availableDoctor = this.doctors.find(doctor => doctor.state === 'idle');
        if (!availableDoctor) return;

        // Get next patient (priority to critical patients)
        let patientIndex = this.waitingQueue.findIndex(p => p.severity === 'critical');
        if (patientIndex === -1) {
            patientIndex = this.waitingQueue.findIndex(p => p.severity === 'moderate');
        }
        if (patientIndex === -1) {
            patientIndex = 0; // Take first mild patient
        }

        const patient = this.waitingQueue.splice(patientIndex, 1)[0];

        // Assign patient to doctor
        availableDoctor.assignPatient(patient);
        patient.state = 'going_to_examination';
        patient.moveTo(availableDoctor.roomPosition.x, availableDoctor.roomPosition.y);

        console.log(`Patient ${patient.id} assigned to Doctor ${availableDoctor.id}`);
    }

    startTreatment(patient) {
        console.log(`Treatment started for Patient ${patient.id} (${patient.severity})`);

        // Treatment will finish after specified duration
        this.time.delayedCall(patient.treatmentDuration, () => {
            this.finishTreatment(patient);
        });
    }

    finishTreatment(patient) {
        console.log(`Treatment finished for Patient ${patient.id}`);

        // Update statistics
        this.stats.treatedPatients++;
        this.stats.averageWaitTime = (this.stats.averageWaitTime * (this.stats.treatedPatients - 1) + patient.waitTime) / this.stats.treatedPatients;
        this.stats.averageTreatmentTime = (this.stats.averageTreatmentTime * (this.stats.treatedPatients - 1) + patient.treatmentTime) / this.stats.treatedPatients;

        // Release doctor
        if (patient.assignedDoctor) {
            patient.assignedDoctor.finishTreatment();
        }

        // Send patient to exit
        patient.state = 'leaving';
        patient.moveTo(this.areas.exit.x, this.areas.exit.y);

        // Try to assign next patient
        this.assignPatientToDoctor();
    }

    update() {
        // Update all entities
        this.patients.forEach(patient => patient.update());
        this.doctors.forEach(doctor => doctor.update());
        this.nurses.forEach(nurse => nurse.update());

        // Update UI
        this.updateUI();
    }

    updateUI() {
        const idleDoctors = this.doctors.filter(d => d.state === 'idle').length;
        const busyDoctors = this.doctors.filter(d => d.state === 'busy').length;

        this.uiText.setText(
            `Hospital Status:\n` +
            `Total Patients: ${this.stats.totalPatients}\n` +
            `Treated: ${this.stats.treatedPatients}\n` +
            `Waiting: ${this.waitingQueue.length}\n` +
            `In Treatment: ${this.patients.filter(p => p.state === 'in_examination').length}\n` +
            `Idle Doctors: ${idleDoctors}\n` +
            `Busy Doctors: ${busyDoctors}\n` +
            `Avg Wait: ${this.stats.averageWaitTime.toFixed(1)}s\n` +
            `Avg Treatment: ${this.stats.averageTreatmentTime.toFixed(1)}s`
        );
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
            debug: false
        }
    }
};

// Initialize the game
const game = new Phaser.Game(config);