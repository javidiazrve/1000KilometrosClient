import { Carta, EstadosJugador } from './interfaces';

export class Jugador {

    nickname: string;
    cartas: Carta[];
    kilometros: number;
    listo: boolean;
    sentado: boolean;
    estados: EstadosJugador;

    constructor(apodo: string) {
        this.nickname = apodo;
        this.cartas = [];
        this.kilometros = 0;
        this.listo = false;
        this.sentado = false;
        this.estados = {
            luz: false,
            gasolina: true,
            ruedas: true,
            coche: true,
            libre: true,
            gasolinaInfinita: false,
            impinchable: false,
            asVolante: false,
            prioritario: false
        }
    }

    actualizarJugador(jugador: Jugador){
        this.nickname = jugador.nickname
        this.cartas = jugador.cartas;
        this.kilometros = jugador.kilometros;
        this.listo = jugador.listo;
        this.sentado = jugador.sentado;
        this.estados = jugador.estados;
    }
}