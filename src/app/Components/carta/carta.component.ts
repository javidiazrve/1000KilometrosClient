import { Component, OnInit, Input } from '@angular/core';
import { Carta } from '../../../clases/interfaces';
import { PartidaService } from '../../services/partida.service';

@Component({
  selector: 'app-carta',
  templateUrl: './carta.component.html',
  styleUrls: ['./carta.component.scss'],
})
export class CartaComponent implements OnInit {

  @Input() carta: Carta;

  constructor(private ps: PartidaService) { }

  ngOnInit() {
  }

  jugarCarta(): void {
    if (this.ps.partida.jugando && !this.ps.partida.tomandoCarta) {
      this.ps.jugarCarta(this.carta);
    }
  }

  descartarCarta(): void {
    if (this.ps.partida.jugando && !this.ps.partida.tomandoCarta) {
      this.ps.descartarCarta(this.carta);
    }
  }

}
