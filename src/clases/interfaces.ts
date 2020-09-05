

export interface Partida{   
    salaID: string;
    jugadores: Jugador[];
    turnoActual?: Jugador;
    todosSentados: boolean;
    mazoPrincipal: Carta[];
    mazoPozo: Carta[];
}

export interface Jugador{
    nickname: string;
    cartas: Carta[];
    kilometros: number;
    listo: boolean;
    sentado: boolean;
    estados: EstadosJugador;
}

export interface Carta {
    id: number,
    tipo: string,
    valor: number,
    funcion: string,
    icon: string,
    clase: string
}

export interface EstadosJugador {

    luz: boolean,
    gasolina: boolean,
    ruedas: boolean,
    coche: boolean,
    libre: boolean,
    gasolinaInfinita: boolean;
    impinchable: boolean;
    asVolante: boolean;
    prioritario: boolean;

}