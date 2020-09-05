import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JuegoPageRoutingModule } from './juego-routing.module';

import { JuegoPage } from './juego.page';
import { CartaComponent } from '../../Components/carta/carta.component';
import { ManoComponent } from '../../Components/mano/mano.component';
import { LongPressModule } from 'ionic-long-press';

@NgModule({
  entryComponents:[
    CartaComponent,
    ManoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    JuegoPageRoutingModule,
    LongPressModule
  ],
  declarations: [JuegoPage, CartaComponent, ManoComponent]
})
export class JuegoPageModule {}
