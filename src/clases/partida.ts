import { PopoverController, ToastController, AlertController, NavController } from '@ionic/angular';
import { Socket } from 'ngx-socket-io';
import { Jugador } from './jugador';
import { Carta } from './interfaces';

export class Partida {

  salaID: string;
  admin: string;
  jugadores: Jugador[];
  turnoActual?: Jugador;
  todosSentados: boolean;
  mazoPrincipal: Carta[];
  mazoPozo: Carta[];
  mazoDescarte: Carta[];
  jugador: Jugador;

  //Etapas
  tomandoCarta: boolean;
  jugando: boolean;

  //boleanos
  iniciada: boolean;

  // labels
  mensaje: string = "Buena Suerte!!!";
  turno: string;

  // Controladores
  popoverController: PopoverController;
  toastCtrl: ToastController;
  alertCtrl: AlertController;
  navCtrl: NavController;
  socket: Socket;


  constructor(id, admin, jugadores, jugador, socket: Socket) {
    this.salaID = id;
    this.admin = admin;
    this.jugadores = jugadores;
    this.todosSentados = false;
    this.mazoPrincipal = [];
    this.mazoPozo = [];
    this.mazoDescarte = [];
    this.socket = socket;
    this.jugador = jugador;
  }

  /************* CONFIGURACIONES ****************/

  actualizarPartida(partida: Partida) {
    this.salaID = partida.salaID;
    this.jugadores = partida.jugadores;
    this.mazoPrincipal = partida.mazoPrincipal;
    this.mazoPozo = partida.mazoPozo;
    this.mazoDescarte = partida.mazoDescarte;
    this.turnoActual = partida.turnoActual;
    this.actualizarJugador();
  }

  actualizarJugador() {
    this.jugador.actualizarJugador(this.jugadores.find(j => j.nickname === this.jugador.nickname));    
  }

  // setJugador(jugador: Jugador) {
  //   this.jugador = jugador;
  // }

  setCtrls(popover: PopoverController, alert: AlertController, navCtrl: NavController, toastCtrl: ToastController) {
    this.alertCtrl = alert;
    this.popoverController = popover;
    this.navCtrl = navCtrl;
    this.toastCtrl = toastCtrl;
  }

  escucharEventos() {
    this.socket.fromOneTimeEvent('partida-iniciada').then((res: any) => {
      this.actualizarPartida(res.partida);
      this.iniciada = true;
    })

    this.socket.fromEvent('cartaTomada').subscribe((res: any) => {

      this.actualizarPartida(res.partida);
      
      if (res.jugador === this.jugador.nickname) {
        this.mostrarMensaje('Tomaste una carta');
      } else {
        this.mostrarMensaje(`${res.jugador} tomó una carta`)
      }

    })

    this.socket.fromEvent('cartaJugada').subscribe((res: any) => {

      this.actualizarPartida(res.partida);
      
      switch (res.jugada.tipo) {

        case 'kilometros':
          this.aumentarKilometros(res.jugada, res.ganador).then(() => this.nuevoTurno(res.nuevoTurno));
          break;
        case 'ataque':
          this.atacar(res.jugada).then(() => this.nuevoTurno(res.nuevoTurno));
          break;
        case 'defensa':
          this.defender(res.jugada).then(() => this.nuevoTurno(res.nuevoTurno));
          break;
        case 'escudo':
          this.proteger(res.jugada).then(() => this.nuevoTurno(res.nuevoTurno));
          break;
        case 'descarte':
          this.descartar(res.jugada).then(() => this.nuevoTurno(res.nuevoTurno));
          break;
      }

    })

    this.socket.fromEvent('abandono').subscribe((res:any)=>{

      this.actualizarPartida(res.partida);

      this.abandono(res.jugador);

      if(res.ganador.gano){
        this.terminarPartida(res.ganador.jugador);
      }

    })
  }

  /*********** ACCIONES FUERA DE JUEGO  *************/

  sentarse() {
    this.escucharEventos();
    this.socket.emit('sentarse');
  }

  primerTurno() {
      let conteo = 0;
      const turnoreal = this.turnoActual.nickname;
      this.mensaje = 'Esperando primer turno...'

      const intervalo = setInterval(() => {

        if (conteo === this.jugadores.length) conteo = 0;

        this.turno = this.jugadores[conteo].nickname;
        conteo++;
      }, 100)

      setTimeout(() => {
        clearInterval(intervalo);
        this.turno = turnoreal;
        if (this.turno === this.jugador.nickname) {
          this.mostrarMensaje('Toma una carta')
          this.empezarTurno();
        }else{
          this.mostrarMensaje('')
        }
      }, 3000)
  }

  empezarTurno() {
    this.tomandoCarta = true;
    this.jugando = false;
  }

  nuevoTurno(turno: string){
    this.turno = turno;
    this.mostrarMensaje('');
    if(this.turno === this.jugador.nickname){
      this.empezarTurno();
    }
  }

  async terminarPartida(ganador: string){

      const alert = await this.alertCtrl.create({
        cssClass: 'my-custom-class',
        header: 'Partida Finalizada',
        message: `${ganador} ha ganado la partida!!!`,
        backdropDismiss: false,
        buttons: [
          {
            text: 'Salir',
            handler: () => {
              this.navCtrl.navigateRoot('home');
            }
          }
        ]
      });
  
      await alert.present();
  }

  async aumentarKilometros(jugada: any, ganador: any) {
    if(ganador.gano){
      this.terminarPartida(ganador.jugador);
    }

    if (jugada.jugador === this.jugador.nickname) {
      return await this.mostrarMensaje(`Has avanzado ${jugada.carta.valor} KM`);
    } else {
      return await this.mostrarMensaje(`${jugada.jugador} ha avanzado ${jugada.carta.valor} KM`);
    }
  }

  async atacar(jugada: any) {
    if (jugada.de === this.jugador.nickname) {
      return await this.mostrarMensaje(`Has atacado a ${jugada.para}`);
    } else {
      return await this.mostrarMensaje(`${jugada.de} ha atacado a ${jugada.para}`);
    }
  }

  async defender(jugada: any) {
    if (jugada.de === this.jugador.nickname) {
      return await this.mostrarMensaje(`Has jugado una carta de defensa`);
    } else {
      return await this.mostrarMensaje(`${jugada.de} ha jugado una carta de defensa`);
    }
  }

  async proteger(jugada: any) {
    if (jugada.de === this.jugador.nickname) {
      return await this.mostrarMensaje(`Te has blindado!!!`);
    } else {
      return await this.mostrarMensaje(`${jugada.de} se ha blindado!!!`);
    }
  }

  async descartar(jugada: any) {
    if (jugada.jugador === this.jugador.nickname) {
      return await this.mostrarMensaje(`Has botado una carta`);
    } else {
      return await this.mostrarMensaje(`${jugada.jugador} ha botado una carta`);
    }
  }

  async abandono(jugador: string){
    const toat = await this.toastCtrl.create({
      message: `${jugador} ha abandonado la partida`,
      animated: true,
      duration: 2000
    })

    await toat.present()
  }

  timeout;

  mostrarMensaje(mensaje: string) {

    return new Promise((resolve,rejected)=>{
      
      if (mensaje === '') {
        if (this.turno === this.jugador.nickname) {
          this.mensaje = 'Tu turno';
        } else {
          this.mensaje = 'Esperando Jugada...';
        }

        resolve()
      } else {
        
        if (this.timeout) clearTimeout(this.timeout);
        
        this.mensaje = mensaje;
        
        this.timeout = setTimeout(() => {
          
          if (this.turno === this.jugador.nickname) {
            this.mensaje = 'Tu turno';
          } else {
            this.mensaje = 'Esperando Jugada...';
          }
          
          resolve();
        }, 3000)
      }
    })
  }

  /************** ACCIONES DEL JUEGO ************/

  jugarCarta(carta: Carta, para: string) {

    this.socket.emit('jugarCarta', carta, para);

  }

  tomarCartaMazo() {

    this.socket.emit('tomarCartaMazo');

  }

  tomarCartaPozo() {

    this.socket.emit('tomarCartaPozo');

  }

  descartarCarta(carta){

    this.socket.emit('descartarCarta', carta)

  }

  abandonarPartida(){
    this.socket.emit('abandonarPartida');
    this.navCtrl.navigateRoot('home');
  }


}