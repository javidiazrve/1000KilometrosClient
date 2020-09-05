import { Jugador } from './jugador';
import { Partida } from './partida';

export class Sala{

    id: string = '';
    admin: string = '';
    jugadores: Jugador[] = [];
    jugador: Jugador;
    partida?: Partida;

    constructor(sala: any, jugador: string){

        this.id = sala.id.toString(),
        this.admin = sala.admin,
        this.jugadores = sala.jugadores;
        this.jugador = new Jugador(jugador)
    }

    setPartida(partida){
        this.partida = partida;
    }

    actualizarJugadores(jugadores: Jugador[]) {
        this.jugadores = jugadores;
    }

    actualizarSala(sala: Sala){
        this.id = sala.id,
        this.admin = sala.admin,
        this.jugadores = sala.jugadores
    }

}