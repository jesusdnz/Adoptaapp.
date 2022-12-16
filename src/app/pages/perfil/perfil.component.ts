import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Usuario } from 'src/app/models';
import { FirebaseauthService } from '../../services/firebaseauth.service';
import { FirestoreService } from '../../services/firestore.service';
import { FirestorageService } from '../../services/firestorage.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent implements OnInit {

  usuario: Usuario = {
    uid: '',
    email: '',
    nombre: '',
    celular: '',
    foto: '',
    referencia: '',
    ubicacion: null,
    
  };

  newFile: any;

  uid = '';

  suscriberUserInfo!: Subscription;

  ingresarEnable = false;

  constructor(public menucontroler: MenuController,
              public firebaseauthService: FirebaseauthService,
              public firestoreService: FirestoreService,
              public firestorageService: FirestorageService) { 


        this.firebaseauthService.stateAuth().subscribe( res => {
             console.log(res);
             if (res !== null) {
                this.uid = res.uid;
                this.getUserInfo(this.uid);
             }else {
               this.initUsuario();
             }
        });
  
  }

  async ngOnInit() {
        const uid = await this.firebaseauthService.getUid();
        console.log(uid);
  }


  initUsuario() {
      this.uid = '';
      this.usuario = {
        uid: '',
        email: '',
        nombre: '',
        celular: '',
        foto: '',
        referencia: '',
        ubicacion: null,
      };
      console.log(this.usuario);
  }


  openMenu() {
    console.log('open menu');
    this.menucontroler.toggle('principal');
  }

  async newImageUpload(event: any) {
    if (event.target.files && event.target.files[0]) {
       this.newFile = event.target.files[0]; 
       const reader = new FileReader();
       reader.onload = ((image) => {
         this.usuario.foto = image.target?.result as string;
       });
       reader.readAsDataURL(event.target.files[0]);
    }
 }

 async registrarse() {
  const credenciales = {
    email: this.usuario.email,
    password: this.usuario.celular,
  };
  const res = await this.firebaseauthService.registrar(credenciales.email, credenciales.password).catch( error => {
    console.log('error -> ', error);
  });
  const uid = await this.firebaseauthService.getUid();
  this.usuario.uid = uid!;
  this.guardarUser();
  
  
 }


 async guardarUser() {  
  const path = 'Usuarios';
  const name = this.usuario.nombre;
  if (this.newFile !== undefined) {
    const res = await this.firestorageService.uploadImage(this.newFile, path, name);
    this.usuario.foto = res;
  }
  this.firestoreService.createDoc(this.usuario, path, this.usuario.uid).then( res => {
    console.log('guardado con exito');
       
  }).catch( error => {
  });
        
}


 async salir() {

  //const uid = await this.firebaseauthService.getUid();
  //console.log(uid);
    this.firebaseauthService.logout();
    this.suscriberUserInfo.unsubscribe();
 }

 getUserInfo(uid: string) {
      console.log('getUserInfo');
      const path = 'Usuarios';
      this.suscriberUserInfo = this.firestoreService.getDoc<Usuario>(path, uid).subscribe( res => { 
            this.usuario = res!;
      } );
 }


 ingresar() {
    const credenciales = {
      email: this.usuario.email,
      password: this.usuario.celular,
    };
    this.firebaseauthService.login(credenciales.email, credenciales.password).then( res => {
      console.log('Ingreso con exito');
    });
 }


}
