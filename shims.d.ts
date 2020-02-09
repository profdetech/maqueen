// Auto-generated. Do not edit.



    //% color=50 weight=11
    //% icon="\uf1eb"
declare namespace maqueen_MBOT_IR {

    /**
     *  Lorsque le bouton de la telecommande du robot mbot est appuyé. Attention à initialiser le port du recepteur infrarouge.
     */
    //% blockId=ir_received_left_event
    //% block="Lorsque le signal du bouton |%btn| de la télécommande est reçu" shim=maqueenIR::onPressEvent
    function onPressEvent(btn: RemoteButton, body: () => void): void;

    /**
     * initialiser infrarouge du robot maqueen sur P16
     */
    //% blockId=ir_init
    //% block="initialiser le capteur infrarouge sur %pin" shim=maqueenIR::initIR
    function initIR(pin: Pins): void;
}

// Auto-generated. Do not edit. Really.
