import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Sala } from '../../clases/sala';
import { NavController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Partida } from 'src/clases/partida';

@Injectable({
  providedIn: 'root'
})
export class SalaService {

  sala: Sala;

  constructor(
    private socket: Socket,
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private router: Router) {

    this.escucharEventos()

  }

  /************ VALIDACIONES ************/
  
  validarSala(id: string, jugador: string) {
    this.socket.emit('validar-sala', id, jugador);
    return this.socket.fromOneTimeEvent('sala-validada');
  }

  /************ ACCIONES ************/

  crearSala(nickname: string) {
    this.socket.emit('crearSala', nickname);
  }

  unirseSala(id: string, nickname: string) {
    this.socket.emit('joinSala', { id, nickname });
  }
  
  getReady() {
    this.socket.emit('ready', this.sala.jugador.nickname);
  }

  empezarPartida() {
    this.socket.emit('empezarPartida');
    this.navCtrl.navigateRoot('juego');
  }

  salirSala() {
    this.socket.emit('abandonarSala');
    this.navCtrl.navigateRoot('/home');
  }

  sentarse() {
    this.socket.emit('sentarse');
  }

  /********* CONFIGURACIONES ***********/

  nuevaPartida() {
    this.sala.partida = new Partida(this.sala.id, this.sala.admin, this.sala.jugadores, this.sala.jugador, this.socket);
  }

  escucharEventos() {
    this.socket.fromEvent('nueva-sala').subscribe((res: any) => {

      this.sala = new Sala(res.sala, res.jugador.nickname);

      this.navCtrl.navigateRoot('lobby');

    })

    this.socket.fromEvent('user-changed').subscribe((data: any) => {

      this.sala.actualizarSala(data.sala)

      if (data.event === 'joined') {
        this.mostrarMensaje(data.player + ' se ha unido a la sala');
      } else if (data.event === 'left') {
        this.mostrarMensaje(data.player + ' ha abandonado la sala');
      }

    })

    this.socket.fromEvent('ir-mesa').subscribe(() => {

      this.router.navigate(['/juego']);

    })

  }

  async mostrarMensaje(mensaje) {

    const toast = await this.toastCtrl.create({
      position: "bottom",
      duration: 2000,
      message: mensaje
    })

    toast.present();

  }

}
