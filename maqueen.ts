/** 
 * @file pxt-maqueen/maqueen.ts
 * @brief DFRobot's maqueen makecode library.
 * @n [Get the module here](https://www.dfrobot.com.cn/goods-1802.html)
 * @n This is a MakeCode graphical programming education robot.
 * 
 * @copyright    [DFRobot](http://www.dfrobot.com), 2016
 * @copyright    MIT Lesser General Public License
 * 
 * @author [email](jie.tang@dfrobot.com)
 * @version  V1.0.2
 * @date  2019-10-08
*/

let maqueencb: Action
let maqueenmycb: Action
let maqueene = "1"
let maqueenparam = 0
let alreadyInit = 0
let IrPressEvent = 0
const MOTER_ADDRESSS = 0x10

enum PingUnit {
    //% block="cm"
    Centimeters,
    //% block="μm"
    MicroSeconds
}

//% weight=10 color=#008B00 icon="\uf136" block="Maqueen"
namespace maqueen {

    export class Packeta {
        public mye: string;
        public myparam: number;
    }

    export enum Motors {
        //% blockId="left motor" block="Moteur gauche"
        M1 = 0,
        //% blockId="right motor" block="Moteur droit"
        M2 = 1,
        //% blockId="all motor" block="Les deux moteurs"
        All = 2
    }

    export enum Servos {
        //% blockId="S1" block="S1"
        S1 = 0,
        //% blockId="S2" block="S2"
        S2 = 1
    }

    export enum Dir {
        //% blockId="CW" block="avancer"
        CW = 0x0,
        //% blockId="CCW" block="reculer"
        CCW = 0x1
    }

    export enum Patrol {
        //% blockId="patrolLeft" block="gauche"
        PatrolLeft = 13,
        //% blockId="patrolRight" block="droit"
        PatrolRight = 14
    }

    export enum LED {
        //% blockId="LEDLeft" block="gauche"
        LEDLeft = 8,
        //% blockId="LEDRight" block="droit"
        LEDRight = 12
    }

    export enum LEDswitch {
        //% blockId="turnOn" block="allumée"
        turnOn = 0x01,
        //% blockId="turnOff" block="éteinte"
        turnOff = 0x00
    }

    //% advanced=true shim=maqueenIR::initIR
    function initIR(pin: Pins): void {
        return
    }

    //% advanced=true shim=maqueenIR::onPressEvent
    function onPressEvent(btn: RemoteButton, body: Action): void {
        return
    }

    //% advanced=true shim=maqueenIR::getParam
    function getParam(): number {
        return 0
    }

    function maqueenInit(): void {
        if (alreadyInit == 1) {
            return
        }
        initIR(Pins.P16)
        alreadyInit = 1
    }

    //% weight=100
	//% blockGap=2
    //% blockId=IR_callbackUser block="Quand l'Infrarouge reçoit un signal, écrire dans la variable"
    export function IR_callbackUser(maqueencb: (message: number) => void) {
        maqueenInit();
        IR_callback(() => {
            const packet = new Packeta();
            packet.mye = maqueene;
            maqueenparam = getParam();
            packet.myparam = maqueenparam;
            maqueencb(packet.myparam);
        });
    }
	/**
	* A= 45,B= 46,C= 47,D= 44,E= 43,F= D,
	* Haut = 40,Gauche = 7,Bas = 19,Droite = 9,Parametre = 15,
	* Touche_0 = 16,Touche_1 = C,Touche_2 = 18,Touche_3 = 5E,
	* Touche_4 = 8,Touche_5 = 1C,Touche_6 = 5A,Touche_7 = 42,
	* Touche_8 = 52,Touche_9 = 4A,
	 */
    //% blockId=IR_descriptif
    //% block="Descriptif en commentaire des codes Infrarouge de la télécommande Mbot"
	//% weight=97
	//% blockGap=50
    export function IR_descriptif(): void {
    }
	
	
    /**
     * Read IR sensor value.
     */

    //% weight=98
	//% blockGap=2
    //% blockId=IR_read block="lire la valeur reçue par infrarouge"
    export function IR_read(): number {
        maqueenInit()
        return getParam()
    }

    

    function IR_callback(a: Action): void {
        maqueencb = a
        IrPressEvent += 1
        onPressEvent(IrPressEvent, maqueencb)
    }

    /**
     * Read ultrasonic sensor.
     */

    //% blockId=ultrasonic_sensor block="lire la valeur du capteur ultrason - unité |%unit "
    //% weight=95
	//% blockGap=50
    export function Ultrasonic(unit: PingUnit, maxCmDistance = 500): number {
        let d
        pins.digitalWritePin(DigitalPin.P1, 0);
        if (pins.digitalReadPin(DigitalPin.P2) == 0) {
            pins.digitalWritePin(DigitalPin.P1, 1);
            pins.digitalWritePin(DigitalPin.P1, 0);
            d = pins.pulseIn(DigitalPin.P2, PulseValue.High, maxCmDistance * 58);
        } else {
            pins.digitalWritePin(DigitalPin.P1, 0);
            pins.digitalWritePin(DigitalPin.P1, 1);
            d = pins.pulseIn(DigitalPin.P2, PulseValue.Low, maxCmDistance * 58);
        }
        let x = d / 39;
        if (x <= 0 || x > 500) {
            return 0;
        }
        switch (unit) {
            case PingUnit.Centimeters: return Math.round(x);
            default: return Math.idiv(d, 2.54);
        }

    }

    /**
     * Set the direction and speed of Maqueen motor.
     */

    //% weight=90
	//% blockGap=2
    //% blockId=motor_MotorRun block="Moteur|%index|direction|%Dir|à la vitesse|%speed"
    //% speed.min=0 speed.max=255
    //% index.fieldEditor="gridpicker" index.fieldOptions.columns=2
    //% direction.fieldEditor="gridpicker" direction.fieldOptions.columns=2
    export function motorRun(index: Motors, direction: Dir, speed: number): void {
        let buf = pins.createBuffer(3);
        if (index == 0) {
            buf[0] = 0x00;
            buf[1] = direction;
            buf[2] = speed;
            pins.i2cWriteBuffer(0x10, buf);
        }
        if (index == 1) {
            buf[0] = 0x02;
            buf[1] = direction;
            buf[2] = speed;
            pins.i2cWriteBuffer(0x10, buf);
        }
        if (index == 2) {
            buf[0] = 0x00;
            buf[1] = direction;
            buf[2] = speed;
            pins.i2cWriteBuffer(0x10, buf);
            buf[0] = 0x02;
            pins.i2cWriteBuffer(0x10, buf);
        }
    }

    /**
     * Stop the Maqueen motor.
     */
    //% weight=89
	//% blockGap=50
    //% blockId=motor_motorStop block="stopper |%motors"
    //% motors.fieldEditor="gridpicker" motors.fieldOptions.columns=2 
    export function motorStop(motors: Motors): void {
        let buf = pins.createBuffer(3);
        if (motors == 0) {
            buf[0] = 0x00;
            buf[1] = 0;
            buf[2] = 0;
            pins.i2cWriteBuffer(0x10, buf);
        }
        if (motors == 1) {
            buf[0] = 0x02;
            buf[1] = 0;
            buf[2] = 0;
            pins.i2cWriteBuffer(0x10, buf);
        }

        if (motors == 2) {
            buf[0] = 0x00;
            buf[1] = 0;
            buf[2] = 0;
            pins.i2cWriteBuffer(0x10, buf);
            buf[0] = 0x02;
            pins.i2cWriteBuffer(0x10, buf);
        }

    }

    /**
     * lire le détecteur de ligne
	 * 0 - noir et 1 - blanc
     */

    //% weight=20
	//% blockGap=2
    //% blockId=read_Patrol block="Lire le détecteur de ligne |%patrol "
    //% patrol.fieldEditor="gridpicker" patrol.fieldOptions.columns=2 
    export function readPatrol(patrol: Patrol): number {
        if (patrol == Patrol.PatrolLeft) {
            return pins.digitalReadPin(DigitalPin.P13)
        } else if (patrol == Patrol.PatrolRight) {
            return pins.digitalReadPin(DigitalPin.P14)
        } else {
            return -1
        }
    }

	/**
     * renvoie vrai si le détecteur de ligne gauche détecte du noir
     */
    //% blockId=Gnoir
    //% block="Le détecteur de ligne gauche détecte du noir"
	//% weight=19 blockGap=2
    export function gnoir(): boolean {
		 if (pins.digitalReadPin(DigitalPin.P13) == 0) {
            return true;
        } else return false;
    }
	
	/**
     * renvoie vrai si le détecteur de ligne gauche détecte du blanc
     */
    //% blockId=Gblanc
    //% block="Le détecteur de ligne gauche détecte du blanc"
	//% weight=18 blockGap=2
    export function gblanc(): boolean {
		 if (pins.digitalReadPin(DigitalPin.P13) == 1) {
            return true;
        } else return false;
    }

	/**
     * renvoie vrai si le détecteur de ligne droit détecte du noir
     */
    //% blockId=Dnoir
    //% block="Le détecteur de ligne droit détecte du noir"
	//% weight=17 blockGap=2
    export function dnoir(): boolean {
		 if (pins.digitalReadPin(DigitalPin.P14) == 0) {
            return true;
        } else return false;
    }
	
	/**
     * renvoie vrai si le détecteur de ligne droit détecte du blanc
     */
    //% blockId=Dblanc
    //% block="Le détecteur de ligne droit détecte du blanc"
	//% weight=16 blockGap=2
    export function dblanc(): boolean {
		 if (pins.digitalReadPin(DigitalPin.P14) == 1) {
            return true;
        } else return false;
    }




    /**
     * LED rouge allumé - éteinte.
     */

    //% weight=30
	//% blockGap=50
    //% blockId=writeLED block="LED rouge |%led action: |%ledswitch"
    //% led.fieldEditor="gridpicker" led.fieldOptions.columns=2 
    //% ledswitch.fieldEditor="gridpicker" ledswitch.fieldOptions.columns=2
    export function writeLED(led: LED,ledswitch: LEDswitch): void {
        if (led == LED.LEDLeft) {
            pins.digitalWritePin(DigitalPin.P8, ledswitch)
        } else if (led == LED.LEDRight) {
            pins.digitalWritePin(DigitalPin.P12, ledswitch)
        } else {
            return
        }
    }

    /**
     * Servomoteur S1 et S2.
     */

    //% weight=70
	//% blockGap=50
    //% blockId=servo_ServoRun block="servomoteur sur: |%index|angle:|%angle"
    //% angle.min=0 angle.max=180
    //% index.fieldEditor="gridpicker" index.fieldOptions.columns=2
    export function servoRun(index: Servos, angle: number): void {
        let buf = pins.createBuffer(2);
        if (index == 0) {
            buf[0] = 0x14;
        }
        if (index == 1) {
            buf[0] = 0x15;
        }
        buf[1] = angle;
        pins.i2cWriteBuffer(0x10, buf);
    }

}
