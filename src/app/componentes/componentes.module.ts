import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MascotaComponent } from './mascota/mascota.component';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    MascotaComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
  ], exports: [
    MascotaComponent,
  ]
})
export class ComponentesModule { }
