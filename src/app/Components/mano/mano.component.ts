import { Component, OnInit, Input } from '@angular/core';
import { Carta } from '../../../clases/interfaces';
import { Partida } from '../../../clases/partida';
import { Jugador } from 'src/clases/jugador';
import { PartidaService } from '../../services/partida.service';


@Component({
  selector: 'app-mano',
  templateUrl: './mano.component.html',
  styleUrls: ['./mano.component.scss'],
})
export class ManoComponent implements OnInit {

  @Input() cartas: Carta[];
  @Input() partida: Partida;
  @Input() jugador: Jugador;

  constructor(private ps: PartidaService) { }

  ngOnInit() {
  }

  /************** VALIDACIONES *****************/

  parpadea(mazo: number): Boolean {
    return this.ps.parpadea(mazo);
  }

  posibleAtacar(carta: Carta, jugador: Jugador): Boolean {
    return this.ps.posibleAtacar(carta,jugador)
  }

  algunBloqueo(carta: Carta): Boolean {
    return this.ps.algunBloqueo(carta);
  }

  posibleJugar(carta: Carta): Boolean {
    return this.ps.posibleJugar(carta);
  }

  cartaPozo(): Carta {
    return this.ps.cartaPozo();
  }


  /************* ACCIONES DENTRO DEL JUEGO ******************/

  tomarCarta(mazo: string): void{
    this.ps.tomarCarta(mazo);
  }


}
