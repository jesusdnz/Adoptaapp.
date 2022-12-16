import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SetMascotasComponent } from './set-mascotas/set-mascotas.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    SetMascotasComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule
  ]
})
export class BackendModule { }
