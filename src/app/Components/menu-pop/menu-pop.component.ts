import { Component, OnInit } from '@angular/core';
import { PartidaService } from '../../services/partida.service';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-menu-pop',
  templateUrl: './menu-pop.component.html',
  styleUrls: ['./menu-pop.component.scss'],
})
export class MenuPopComponent implements OnInit {

  constructor(private partidaService: PartidaService, private popover: PopoverController) { }

  ngOnInit() {}

  abandonarPartida(){
    this.partidaService.abandonarPartida();
    this.popover.dismiss()
  }

}
