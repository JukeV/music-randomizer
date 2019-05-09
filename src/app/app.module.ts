import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { ChordsComponent } from './chords/chords.component';
import { MelodyComponent } from './melody/melody.component';

import { NouisliderModule } from 'ng2-nouislider';
import { MelodyDifficultyDescriptionPipe } from './melody-difficulty-description.pipe';

@NgModule({
  declarations: [
      AppComponent,      
      ChordsComponent,
      MelodyComponent,
      MelodyDifficultyDescriptionPipe
    ],
  entryComponents: [],
  exports: [
    
  ],
  imports: [
      BrowserModule,
      IonicModule.forRoot(),
      AppRoutingModule,      
      FormsModule,
      NouisliderModule
    ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
