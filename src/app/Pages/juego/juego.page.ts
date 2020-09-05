import { Component, OnInit } from '@angular/core';
import { PartidaService } from 'src/app/services/partida.service';
import { AlertController, PopoverController, Platform } from '@ionic/angular';
import { Partida } from '../../../clases/partida';
import { MenuPopComponent } from 'src/app/Components/menu-pop/menu-pop.component';

@Component({
  selector: 'app-juego',
  templateUrl: './juego.page.html',
  styleUrls: ['./juego.page.scss'],
})
export class JuegoPage implements OnInit {

  constructor(
    private alertCtrl: AlertController,
    private popoverController: PopoverController,
    private platform: Platform,
    private partidaService: PartidaService,
  ) { }

  partida: Partida;
  cargando: boolean = true;

  ngOnInit() {
    this.configurarPartida();
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.partida.primerTurno();
    }, 1000)
  }

  /*********** CONFIGURACIONES ***************/

  configurarPartida() {
    this.bloquearBack()
    this.partidaService.nuevaPartida().then(()=>{
      this.partida = this.partidaService.partida;
      this.cargando = false;
    })
  }

  jugadores(){
    return this.partida.jugadores.filter(j => j.nickname !== this.partida.jugador.nickname)
  }

  bloquearBack() {

    this.platform.backButton.subscribeWithPriority(10, (processNextHandler) => {

      this.presentAlertConfirm()

    });

  }

  async presentAlertConfirm() {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Confirm!',
      message: 'Quieres salir de la partida?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          text: 'Okay',
          handler: () => {
            // this.abandonarPartida()
          }
        }
      ]
    });

    await alert.present();
  }

  async menu(ev: any) {
    const popover = await this.popoverController.create({
      component: MenuPopComponent,
      cssClass: 'popover',
      event: ev,
      translucent: true,
      mode: 'ios'
    });
    
    return await popover.present();
  }

  abandonarPartida(){
    this.partidaService.abandonarPartida();
    this.popoverController.dismiss();
  }

}
