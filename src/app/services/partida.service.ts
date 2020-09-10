import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { NavController, ToastController, AlertController, PopoverController, ActionSheetController } from '@ionic/angular';
import { Partida } from 'src/clases/partida';
import { Jugador } from 'src/clases/jugador';
import { SalaService } from './sala.service';
import { Carta } from 'src/clases/interfaces';

@Injectable({
  providedIn: 'root'
})
export class PartidaService {

  partida: Partida;
  jugador: Jugador;

  constructor(
    private socket: Socket,
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private popoverCtrl: PopoverController,
    private salaService: SalaService,
    private AsCtrl: ActionSheetController
  ) { }

  nuevaPartida() {
    return new Promise((resolve, rejected)=>{
      const sala = this.salaService.sala;
      this.partida = new Partida(sala.id, sala.admin, sala.jugadores, sala.jugador, this.socket)
      this.jugador = this.partida.jugador;
      this.partida.setCtrls(this.popoverCtrl, this.alertCtrl, this.navCtrl, this.toastCtrl)
      this.partida.sentarse();
      resolve();
    })
  }

  /************* VALIDACIONES ***************/

  miTurno() {
    return this.partida.turnoActual.nickname === this.jugador.nickname;
  }

  parpadea(mazo: number): Boolean {
    //mazo === 0 -> mazo de cartas
    //mazo === 1 -> mazo pozo

    if (this.partida.tomandoCarta && this.miTurno()) {
      if (mazo === 1 && this.partida.mazoPozo.length !== 0) return true;
      else if (mazo === 0) return true;
    } else {
      return false;
    }

  }

  algunBloqueo(carta: Carta) {

    if (!this.jugador.estados.luz || !this.jugador.estados.coche || !this.jugador.estados.ruedas || !this.jugador.estados.gasolina) {
      return true;
    } else if (!this.jugador.estados.libre && carta.valor > 50) {
      return true;
    } else {
      return false;
    }
  }

  posibleJugar(carta: Carta) {

    if (this.miTurno() && this.partida.jugando) {
      switch (carta.funcion) {
        case 'Aumentar':
          if (this.algunBloqueo(carta)) {
            return false;
          } else {
            if (this.jugador.kilometros + carta.valor > 1000)
              return false;
            else
              return true;
          }
        case 'Gasolina':
          if (this.jugador.estados.gasolinaInfinita || this.jugador.estados.gasolina) {
            return false;
          } else {
            return true;
          }
        case 'Rueda Recambio':
          if (this.jugador.estados.impinchable || this.jugador.estados.ruedas) {
            return false;
          } else {
            return true;
          }
        case 'Reparacion':
          if (this.jugador.estados.asVolante || this.jugador.estados.coche) {
            return false;
          } else {
            return true;
          }
        case 'Fin Limite Velocidad':
          if (this.jugador.estados.prioritario || this.jugador.estados.libre) {
            return false;
          } else {
            return true;
          }
        case 'Semaforo Verde':
          if (this.jugador.estados.prioritario || this.jugador.estados.luz) {
            return false;
          } else {
            return true;
          }
        case 'Gasolina Infinita':
        case 'Impinchable':
        case 'As Volante':
        case 'Vehiculo Prioritario':
          return true;
      }
    } else {
      return true;
    }

  }

  posibleAtacar(carta: Carta, jugador: Jugador): Boolean {

    switch (carta.funcion) {
      case 'Sin Gasolina':
        if (jugador.estados.gasolina && !jugador.estados.gasolinaInfinita) {
          return true;
        } else {
          return false;
        }
      case 'Pinchazo':
        if (jugador.estados.ruedas && !jugador.estados.impinchable) {
          return true;
        } else {
          return false;
        }
      case 'Accidente':
        if (jugador.estados.coche && !jugador.estados.asVolante) {
          return true;
        } else {
          return false;
        }
      case 'Limite Velocidad':
        if (jugador.estados.libre && !jugador.estados.prioritario) {
          return true;
        } else {
          return false;
        }
      case 'Semaforo Rojo':
        if (jugador.estados.luz && !jugador.estados.prioritario) {
          return true;
        } else {
          return false;
        }
    }

  }

  cartaPozo() {
    const index = this.partida.mazoPozo.length - 1;
    return this.partida.mazoPozo[index];
  }

  /************* ACCIONES FUERA DEL JUEGO ******************/

  abandonarPartida(){
    this.partida.abandonarPartida();
  }

  /************* ACCIONES DENTRO DEL JUEGO ******************/

  async jugarCarta(carta: Carta) {

    if (this.miTurno()) {
      if (carta.tipo === 'Ataque' && this.partida.jugando) {

        let botones: any[] = [];

        this.partida.jugadores.forEach(j => {

          if (j.nickname !== this.partida.jugador.nickname && this.posibleAtacar(carta, j)) {

            botones.push({
              text: j.nickname,
              handler: () => {
                this.partida.jugarCarta(carta, j.nickname);
              }
            })

          }

        })

        botones.push({
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
          handler: () => {
          }
        })

        const actionSheet = await this.AsCtrl.create({
          header: 'Atacar',
          subHeader: 'Elige a una persona para atacar',
          cssClass: 'my-custom-class',
          mode: 'ios',
          buttons: botones
        });
        await actionSheet.present();


      } else {
        if (this.posibleJugar(carta) && this.partida.jugando) {
          this.partida.jugarCarta(carta, '');
        }
      }
    }
    
  }


  tomarCarta(mazo: string) {

    if (this.partida.tomandoCarta && this.miTurno()) {
      if (mazo === 'mazo') {
        this.partida.tomarCartaMazo();
      } else {
        if (this.partida.mazoPozo.length !== 0) {
          this.partida.tomarCartaPozo();
        }
      }

    }

  }

  descartarCarta(carta: Carta) {
    if (this.miTurno() && this.partida.jugando) {
      if (carta) {
        this.partida.descartarCarta(carta);
      }
    }
  }


}
