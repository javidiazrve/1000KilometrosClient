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
    this.ps.jugarCarta(this.carta);
  }

  descartarCarta(): void {
    this.ps.descartarCarta(this.carta);
  }

}
