import { Component, Input, OnInit } from '@angular/core';
//import { Mascota } from '../../models';
import { FirestoreService } from '../../services/firestore.service';
//import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, MenuController, ToastController } from '@ionic/angular';
import { read } from 'fs';
import { Mascota } from 'src/app/models';
//import { FirestoreService } from '../../services/firestore.service';
import { FirestorageService } from '../../services/firestorage.service';
@Component({
  selector: 'app-mascota',
  templateUrl: './mascota.component.html',
  styleUrls: ['./mascota.component.scss'],
})
export class MascotaComponent implements OnInit {

  @Input() mascota!: Mascota;

  mascotas: Mascota[] = [];

  newMascota!: Mascota;

  enableNewMascota = false;

  private path = 'Mascotas/';

  newImage = '';
  newFile = '';

  loading: any;
  //sevent: any;

  constructor(public menucontroler: MenuController,
              public firestoreService: FirestoreService,
              public loadingController: LoadingController,
              public toastController: ToastController,
              public alertController: AlertController,
              public firestorageService: FirestorageService) { }

  ngOnInit() {
    this.getMascotas();
  }

  openMenu() {
    console.log('open menu');
    this.menucontroler.toggle('principal');
  }

  async guardarMascota() {  
    this.presentLoading();
    const path = 'Mascotas';
    const name = this.newMascota.nombre;
    const res = await this.firestorageService.uploadImage(this.newFile, path, name);
    this.newMascota.foto = res;
    this.firestoreService.createDoc(this.newMascota, this.path, this.newMascota.id).then( res => {
         this.loading.dismiss();
         this.presentToast('Guardado con exito');
    }).catch( error => {
       this.presentToast('No se pudo guardar');
    });


    //this.presentLoading();
    //const path = 'Mascotas';
    //const name = this.newMascota.nombre;
    //if (this.newFile !== undefined) {
    //const res = await this.firestorageService.uploadImage(this.newFile, path, name);
    //this.newMascota.foto = res;
    //}
    //this.firestoreService.createDoc(this.newMascota, this.path, this.newMascota.id).then( res => {
    //     this.loading.dismiss();
    //     this.presentToast('Guardado con exito');
    //}).catch( error => {
    //   this.presentToast('No se pudo guardar');
    //});
          
  }

  getMascotas() {
    this.firestoreService.getCollection<Mascota>(this.path).subscribe( res => {
            this.mascotas = res;
    });
  }

  async deleteMascota(mascota: Mascota) {

      const alert = await this.alertController.create({
        cssClass: 'normal',
        header: 'Advertencia',
        message: 'Seguro desea <strong>eliminar</strong> está mascota',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass:'normal',
            handler: (blah) => {
              console.log('Confirm Cancel: blah');
              //this.alertController.dismiss();
            }
          }, {
            text: 'Ok',
            handler: () => {
              console.log('Confirm Ok');
              this.firestoreService.deleteDoc(this.path, mascota.id).then( res => {
                this.presentToast('Eliminado con exito');
                this.alertController.dismiss();
              }).catch( error => {
                this.presentToast('No se pudo eliminar');
              });
            }
          }
        ]
      });
      await alert.present();
    // 
  }

  nuevo() {
    this.enableNewMascota = true;
    this.newMascota = {
      nombre: '',
      raza: '',
      edad: '',
      genero: '',
      peso: '',
      informacion: '',
      celular: '',
      foto: '',
      id: this.firestoreService.getId(),
      fecha: new Date()
    };
    
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      cssClass: 'normal',
      message: 'Guardando...',
    });
    await this.loading.present();
    //await loading.onDidDismiss();
    //console.log('Loading dismissed!');
  }

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      cssClass: 'normal',
      duration: 2000,
      //color: 'light',
    });
    toast.present();
  }


  async newImageUpload(event: any) {
     if (event.target.files && event.target.files[0]) {
        this.newFile = event.target.files[0]; 
        const reader = new FileReader();
        reader.onload = ((image) => {
          this.newMascota.foto = image.target?.result as string;
        });
        reader.readAsDataURL(event.target.files[0]);
     }
  }

  openWhatsapp() {
    this.getMascotas();
    window.open('https://api.whatsapp.com/send?phone='+this.newMascota.celular,'_system');
    
  }

}
