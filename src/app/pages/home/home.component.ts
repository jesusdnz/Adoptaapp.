import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { FirestoreService } from '../../services/firestore.service';
import { Mascota } from '../../models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {


  private path = 'Mascotas/';

  mascotas: Mascota[] = [];

  constructor(public menucontroler: MenuController,
              public firestoreService: FirestoreService) {

                this.loadMascotas();
               }

  ngOnInit() {}


  openMenu() {
    console.log('open menu');
    this.menucontroler.toggle('principal');
  }

  loadMascotas() {
    this.firestoreService.getCollection<Mascota>(this.path).subscribe( res => {
          //console.log(res);
          this.mascotas = res;
    });
  }



}
