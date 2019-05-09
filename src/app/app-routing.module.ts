import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChordsComponent } from './chords/chords.component';
import { MelodyComponent } from './melody/melody.component';

const routes: Routes = [
    { path: '', redirectTo: '/melody', pathMatch: 'full'},
    { path: 'chords', component: ChordsComponent },
    { path: 'melody', component: MelodyComponent }    
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
