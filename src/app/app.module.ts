import { NgModule } from '@angular/core';
import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { LongPressModule } from 'ionic-long-press';
const config: SocketIoConfig = { url: 'https://juego1000km.herokuapp.com/', options: {} };
// const config: SocketIoConfig = { url: 'http://localhost:4008', options: {} };

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule, 
    SocketIoModule.forRoot(config),
    LongPressModule
  ],
    providers: [
      StatusBar,
      SplashScreen,
      ScreenOrientation,
      { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
