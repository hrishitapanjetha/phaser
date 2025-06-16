class HospitalScene extends Phaser.Scene {
    constructor() {
        super({ key: 'HospitalScene' });
        this.patients = [];
        this.doctors = [];
        this.availableRooms = {
            'Examine Room': { x: 100, y: 350, occupied: false, patient: null, doctor: null },
            'Treatment Room 1': { x: 200, y: 100, occupied: false, patient: null, doctor: null },
            'Treatment Room 2': { x: 300, y: 100, occupied: false, patient: null, doctor: null },
            'Treatment Room 3': { x: 400, y: 100, occupied: false, patient: null, doctor: null },
            'Treatment Room 4': { x: 500, y: 100, occupied: false, patient: null, doctor: null },
            'ICU Room 1': { x: 700, y: 250, occupied: false, patient: null, doctor: null },
            'ICU Room 2': { x: 700, y: 350, occupied: false, patient: null, doctor: null }
        };
        this.patientQueue = [];
        this.patientIdCounter = 1;
    }

    preload() {
        this.load.tilemapTiledJSON('hospitalMap', 'public/assets/Hospital-tiled/miniature_hospital_new.json');
        this.load.image('castle', 'public/assets/Hospital-tiled/kenney_platformer-art-extended-tileset/PNG Castle/Spritesheet/sheet.png');
        this.load.image('shop-and-hospital', 'public/assets/Hospital-tiled/Kauzz Free Tiles I/shop-and-hospital.png');

        this.load.on('complete', () => {
            this.createCharacterSprites();
        });

        this.load.on('loaderror', (file) => {
            console.error('Error loading file:', file.src);
        });
    }

    createCharacterSprites() {
        // Create patient sprites with different colors
        const patientColors = [
            { shirt: 0xFF6B6B, pants: 0x4ECDC4 }, // Red shirt, teal pants
            { shirt: 0x45B7D1, pants: 0x96CEB4 }, // Blue shirt, green pants
            { shirt: 0xFFA07A, pants: 0x98D8C8 }, // Orange shirt, mint pants
            { shirt: 0xDDA0DD, pants: 0xF7DC6F }, // Purple shirt, yellow pants
            { shirt: 0x87CEEB, pants: 0xDEB887 }  // Sky blue shirt, tan pants
        ];

        patientColors.forEach((colors, index) => {
            this.createPersonSprite(`patient_${index}`, colors.shirt, colors.pants, 0xFFDBB3);
        });

        // Create doctor sprite (white coat)
        this.createPersonSprite('doctor', 0xFFFFFF, 0x2F4F4F, 0xFFDBB3);

        // Create nurse sprite (scrubs)
        this.createPersonSprite('nurse', 0x20B2AA, 0x20B2AA, 0xFFDBB3);
    }

    createPersonSprite(name, shirtColor, pantsColor, skinColor) {
        // Create walking frames
        for (let i = 0; i < 4; i++) {
            const graphics = this.add.graphics();
            const frameTexture = this.add.renderTexture(0, 0, 16, 20);

            const legOffset = Math.sin(i * Math.PI / 2) * 1;

            // Head
            graphics.fillStyle(skinColor);
            graphics.fillCircle(8, 4, 3);

            // Body
            graphics.fillStyle(shirtColor);
            graphics.fillRect(6, 7, 4, 8);

            // Arms
            graphics.fillStyle(skinColor);
            graphics.fillRect(4 + legOffset * 0.5, 8, 2, 6);
            graphics.fillRect(10 - legOffset * 0.5, 8, 2, 6);

            // Legs
            graphics.fillStyle(pantsColor);
            graphics.fillRect(6 + legOffset, 15, 1.5, 5);
            graphics.fillRect(8.5 - legOffset, 15, 1.5, 5);

            frameTexture.draw(graphics, 0, 0);
            frameTexture.saveTexture(`${name}_walk_${i}`);
            graphics.destroy();
        }

        // Create standing frame
        const standingGraphics = this.add.graphics();
        const standingTexture = this.add.renderTexture(0, 0, 16, 20);

        standingGraphics.fillStyle(skinColor);
        standingGraphics.fillCircle(8, 4, 3);
        standingGraphics.fillStyle(shirtColor);
        standingGraphics.fillRect(6, 7, 4, 8);
        standingGraphics.fillStyle(skinColor);
        standingGraphics.fillRect(4, 8, 2, 6);
        standingGraphics.fillRect(10, 8, 2, 6);
        standingGraphics.fillStyle(pantsColor);
        standingGraphics.fillRect(6, 15, 1.5, 5);
        standingGraphics.fillRect(8.5, 15, 1.5, 5);

        standingTexture.draw(standingGraphics, 0, 0);
        standingTexture.saveTexture(`${name}_standing`);
        standingGraphics.destroy();
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

        // Create animations for all character types
        this.createAnimations();

        // Create doctors (stationary in rooms initially)
        this.createDoctor(150, 350, 'Examine Room'); // Doctor in exam room
        this.createDoctor(250, 100, 'Treatment Room 1'); // Doctor in treatment room
        this.createDoctor(750, 250, 'ICU Room 1'); // Doctor in ICU

        // Create a nurse at reception
        this.createNurse(400, 300);

        // Start spawning patients
        this.spawnPatient();

        // Set up regular patient spawning
        this.time.addEvent({
            delay: Phaser.Math.Between(3000, 8000),
            callback: this.spawnPatient,
            callbackScope: this,
            loop: true
        });

        // Set up room management
        this.time.addEvent({
            delay: 1000,
            callback: this.manageRooms,
            callbackScope: this,
            loop: true
        });

        const zoom = Math.min(this.scale.width / map.widthInPixels, this.scale.height / map.heightInPixels);
        this.cameras.main.setZoom(zoom);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.setBackgroundColor('#ffffff');

        // Add hospital status display
        this.createStatusDisplay();
    }

    createAnimations() {
        const characterTypes = ['patient_0', 'patient_1', 'patient_2', 'patient_3', 'patient_4', 'doctor', 'nurse'];

        characterTypes.forEach(type => {
            this.anims.create({
                key: `${type}_walk`,
                frames: [
                    { key: `${type}_walk_0` },
                    { key: `${type}_walk_1` },
                    { key: `${type}_walk_2` },
                    { key: `${type}_walk_3` }
                ],
                frameRate: 8,
                repeat: -1
            });

            this.anims.create({
                key: `${type}_stand`,
                frames: [{ key: `${type}_standing` }],
                frameRate: 1
            });
        });
    }

    createDoctor(x, y, assignedRoom) {
        const doctor = this.physics.add.sprite(x, y, 'doctor_standing');
        doctor.setScale(1.5);
        doctor.setDepth(10);
        doctor.role = 'doctor';
        doctor.assignedRoom = assignedRoom;
        doctor.isExamining = false;
        doctor.play('doctor_stand');

        // Add doctor name tag
        const nameTag = this.add.text(x - 15, y - 25, 'Dr. Smith', {
            font: '8px Arial',
            fill: '#0066CC',
            backgroundColor: '#FFFFFF',
            padding: { x: 2, y: 1 }
        });
        nameTag.setDepth(15);
        doctor.nameTag = nameTag;

        this.doctors.push(doctor);
        return doctor;
    }

    createNurse(x, y) {
        const nurse = this.physics.add.sprite(x, y, 'nurse_standing');
        nurse.setScale(1.5);
        nurse.setDepth(10);
        nurse.role = 'nurse';
        nurse.play('nurse_stand');

        const nameTag = this.add.text(x - 15, y - 25, 'Nurse Joy', {
            font: '8px Arial',
            fill: '#20B2AA',
            backgroundColor: '#FFFFFF',
            padding: { x: 2, y: 1 }
        });
        nameTag.setDepth(15);
        nurse.nameTag = nameTag;

        return nurse;
    }

    spawnPatient() {
        const patientType = Phaser.Math.Between(0, 4);
        const patient = this.physics.add.sprite(730, 750, `patient_${patientType}_standing`);
        patient.setScale(1.5);
        patient.setDepth(10);
        patient.role = 'patient';
        patient.id = this.patientIdCounter++;
        patient.state = 'arriving';
        patient.patientType = patientType;
        patient.treatmentTime = Phaser.Math.Between(5000, 15000);
        patient.hasBeenTreated = false;

        // Add patient ID tag
        const idTag = this.add.text(patient.x - 10, patient.y - 25, `P${patient.id}`, {
            font: '8px Arial',
            fill: '#FF6B6B',
            backgroundColor: '#FFFFFF',
            padding: { x: 2, y: 1 }
        });
        idTag.setDepth(15);
        patient.idTag = idTag;

        this.patients.push(patient);
        this.movePatientToReception(patient);

        console.log(`Patient ${patient.id} arrived at the hospital`);
    }

    movePatientToReception(patient) {
        patient.state = 'moving_to_reception';
        patient.play(`patient_${patient.patientType}_walk`);

        this.tweens.add({
            targets: [patient, patient.idTag],
            x: 450,
            y: 320,
            duration: 2000,
            ease: 'Linear',
            onComplete: () => {
                patient.play(`patient_${patient.patientType}_stand`);
                patient.state = 'waiting_in_queue';
                this.patientQueue.push(patient);
                console.log(`Patient ${patient.id} joined the queue`);
            }
        });
    }

    manageRooms() {
        // Assign patients from queue to available rooms
        if (this.patientQueue.length > 0) {
            const availableRoom = this.findAvailableRoom();
            if (availableRoom) {
                const patient = this.patientQueue.shift();
                this.assignPatientToRoom(patient, availableRoom);
            }
        }

        // Check for patients who have completed treatment
        Object.keys(this.availableRooms).forEach(roomName => {
            const room = this.availableRooms[roomName];
            if (room.occupied && room.patient && room.patient.treatmentEndTime &&
                this.time.now > room.patient.treatmentEndTime) {
                this.completePatientTreatment(room.patient, roomName);
            }
        });
    }

    findAvailableRoom() {
        const rooms = Object.keys(this.availableRooms);
        for (let roomName of rooms) {
            if (!this.availableRooms[roomName].occupied) {
                return roomName;
            }
        }
        return null;
    }

    assignPatientToRoom(patient, roomName) {
        const room = this.availableRooms[roomName];
        room.occupied = true;
        room.patient = patient;
        patient.state = 'moving_to_treatment';
        patient.assignedRoom = roomName;

        // Find doctor for this room
        const doctor = this.doctors.find(d => d.assignedRoom === roomName);
        if (doctor) {
            room.doctor = doctor;
            doctor.isExamining = true;
        }

        console.log(`Patient ${patient.id} assigned to ${roomName}`);

        // Move patient to room
        patient.play(`patient_${patient.patientType}_walk`);
        this.tweens.add({
            targets: [patient, patient.idTag],
            x: room.x + 15, // Offset so patient doesn't overlap with doctor
            y: room.y + 15,
            duration: 2000,
            ease: 'Linear',
            onComplete: () => {
                patient.play(`patient_${patient.patientType}_stand`);
                patient.state = 'receiving_treatment';
                patient.treatmentEndTime = this.time.now + patient.treatmentTime;

                // Make doctor examine patient
                if (doctor) {
                    this.animateExamination(doctor, patient);
                }

                console.log(`Patient ${patient.id} started treatment in ${roomName}`);
            }
        });
    }

    animateExamination(doctor, patient) {
        // Doctor moves slightly toward patient and back
        const originalX = doctor.x;
        const originalY = doctor.y;

        this.tweens.add({
            targets: [doctor, doctor.nameTag],
            x: doctor.x + 10,
            y: doctor.y + 5,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    completePatientTreatment(patient, roomName) {
        const room = this.availableRooms[roomName];

        // Free up the room
        room.occupied = false;
        room.patient = null;

        // Stop doctor examination
        if (room.doctor) {
            room.doctor.isExamining = false;
            this.tweens.killTweensOf([room.doctor, room.doctor.nameTag]);
            room.doctor = null;
        }

        patient.state = 'treatment_complete';
        console.log(`Patient ${patient.id} completed treatment in ${roomName}`);

        // Move patient to pharmacy or exit
        if (!patient.hasBeenTreated) {
            patient.hasBeenTreated = true;
            this.movePatientToPharmacy(patient);
        } else {
            this.movePatientToExit(patient);
        }
    }

    movePatientToPharmacy(patient) {
        patient.state = 'moving_to_pharmacy';
        patient.play(`patient_${patient.patientType}_walk`);

        this.tweens.add({
            targets: [patient, patient.idTag],
            x: 700,
            y: 130,
            duration: 2000,
            ease: 'Linear',
            onComplete: () => {
                patient.play(`patient_${patient.patientType}_stand`);
                console.log(`Patient ${patient.id} picked up medication`);

                // Wait at pharmacy then exit
                this.time.delayedCall(2000, () => {
                    this.movePatientToExit(patient);
                });
            }
        });
    }

    movePatientToExit(patient) {
        patient.state = 'leaving';
        patient.play(`patient_${patient.patientType}_walk`);

        this.tweens.add({
            targets: [patient, patient.idTag],
            x: 730,
            y: 750,
            duration: 2000,
            ease: 'Linear',
            onComplete: () => {
                console.log(`Patient ${patient.id} left the hospital`);
                this.removePatient(patient);
            }
        });
    }

    removePatient(patient) {
        // Remove patient from arrays
        const index = this.patients.indexOf(patient);
        if (index > -1) {
            this.patients.splice(index, 1);
        }

        // Destroy sprites
        patient.idTag.destroy();
        patient.destroy();
    }

    createStatusDisplay() {
        this.statusText = this.add.text(this.scale.width - 200, this.scale.height - 120, '', {
            font: '11px Arial',
            fill: '#000000',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            padding: { x: 8, y: 6 }
        });
        this.statusText.setDepth(20);
        this.statusText.setScrollFactor(0);
        this.statusText.setOrigin(0, 0);

        // Update status every second
        this.time.addEvent({
            delay: 1000,
            callback: this.updateStatusDisplay,
            callbackScope: this,
            loop: true
        });
    }

    updateStatusDisplay() {
        const queueLength = this.patientQueue.length;
        const totalPatients = this.patients.length;
        const occupiedRooms = Object.values(this.availableRooms).filter(room => room.occupied).length;
        const totalRooms = Object.keys(this.availableRooms).length;

        this.statusText.setText([
            `Hospital Status:`,
            `Patients in Hospital: ${totalPatients}`,
            `Queue Length: ${queueLength}`,
            `Rooms Occupied: ${occupiedRooms}/${totalRooms}`,
            `Doctors on Duty: ${this.doctors.length}`
        ]);
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