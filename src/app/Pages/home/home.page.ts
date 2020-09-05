import { Component, OnInit, ViewChild} from '@angular/core';
import { Platform, IonSlides, AlertController } from '@ionic/angular';
import { SalaService } from '../../services/sala.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  slideOpts = {
    initialSlide: 1,
    speed: 400,
  }

  id: number;
  nickname: string;

  @ViewChild('Slider') slides: IonSlides;

  constructor(
    private platform: Platform,
    private salaService: SalaService ,
    private alertCtrl: AlertController
    ) {}

  ngOnInit(){
    this.bloquearBack()
  }

  IonViewDidEnter(){
    this.slides.lockSwipes(true);
  }

  bloquearBack() {
    this.platform.backButton.subscribeWithPriority(10, () => { /*no hacemos nada*/});
  }

  irCrear(){
    this.slides.lockSwipes(false);
    this.slides.slideTo(0);
    this.slides.lockSwipes(true);
  }

  irBotones(){
    this.slides.lockSwipes(false);
    this.slides.slideTo(1);
    this.slides.lockSwipes(true)
  }

  irUnirse(){
    this.id = null;
    this.slides.lockSwipes(false);
    this.slides.slideTo(2);
    this.slides.lockSwipes(true)
  }

  crearSala(){ this.salaService.crearSala(this.nickname); }

  joinSala(){
    this.salaService.validarSala(this.id.toString(), this.nickname).then((res: any)=>{
      if(res.existe){
        if(res.full){
          this.presentAlert('La sala esta llena')
        }else{
          if(res.ocupado){
            this.presentAlert('El nickname esta ocupado');
          }else{
            this.salaService.unirseSala(this.id.toString(),this.nickname);
          }
        }
      }else{
        this.presentAlert('La sala no existe');
      }
    })
  }

  async presentAlert(mensaje) {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Error',
      message: mensaje,
      buttons: ['OK']
    });

    await alert.present();
  }


}
