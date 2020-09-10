import { Component, OnInit } from '@angular/core';
import { Platform, AlertController } from '@ionic/angular';
import { PartidaService } from 'src/app/services/partida.service';
import { SalaService } from '../../services/sala.service';
import { Sala } from 'src/clases/sala';
import { Jugador } from 'src/clases/jugador';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.page.html',
  styleUrls: ['./lobby.page.scss'],
})
export class LobbyPage implements OnInit {

  constructor(
    private platform: Platform,
    private alertController: AlertController,
    private salaService: SalaService
    ) { }

  sala: Sala;
  jugador: Jugador;
  
  ngOnInit() {

    this.bloquearBack();

    this.sala = this.salaService.sala;
    this.jugador = this.salaService.sala.jugador;

  }

  /*********** VALIDACIONES ************/

  puedeEmpezar() {

    const jugadores = this.sala.jugadores.length;
    const listos = this.sala.jugadores.filter(j => j.listo === true).length;
    
    if (this.sala.admin === this.sala.jugador.nickname && jugadores === listos && jugadores > 1) {
      return true;
    } else {
      return false;
    }

  }


  /*********** ACCIONES **************/

  empezarPartida() { this.salaService.empezarPartida(); }

  getReady() { this.salaService.getReady(); }

  salirSala() { this.salaService.salirSala(); }

  bloquearBack() {
    this.platform.backButton.subscribeWithPriority(10, (processNextHandler) => {
      this.presentAlertConfirm()
    });
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm!',
      message: 'Quieres salir de la sala?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Salir',
          handler: () => {
            this.salaService.salirSala();
          }
        }
      ]
    });

    await alert.present();
  }

}
