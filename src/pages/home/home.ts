import { Component } from '@angular/core';
import { NavController, Platform, normalizeURL, ToastController, LoadingController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Evento } from '../../Models/Evento';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { EventoServiceProvider } from './../../providers/evento-service/evento-service';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private latitude:string;
  private longitude:string;
  private evento:Evento;
  foto:string;
  private tirou : boolean = false;
  private API_URL = 'http://192.168.0.107:8080/api/evento/'
  private _status : number = 1;

  constructor(private platform: Platform, public navCtrl: NavController,
    private _geolocation: Geolocation, private _camera:Camera,
     private _toast: ToastController, private load: LoadingController,
     private _eventoService : EventoServiceProvider,private _http:HttpClient,
     private _load: LoadingController ) {

      this.evento = new Evento();

      platform.ready().then(() => {
        _geolocation.getCurrentPosition().then(pos => {
          this.evento.latitude = pos.coords.latitude.toString();
          this.evento.longitude = pos.coords.longitude.toString();

          console.log('Latitude: ' + pos.coords.latitude + ', Longitude: ' + pos.coords.longitude);
        });
      }
    );    
  }

  public tiraFoto(){

    this.foto ='';

    const options: CameraOptions = {
      quality: 100,
      destinationType: this._camera.DestinationType.DATA_URL,
      encodingType: this._camera.EncodingType.JPEG,
      mediaType: this._camera.MediaType.PICTURE,
      allowEdit:true,
    }

    this._camera.getPicture(options)
    .then((imageData) => {
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.foto = base64Image;
      this.evento.imagem = this.foto;
      this.tirou = true;
     }, (err) => {
      console.log(err)
      this.toastMessage(err)
     })
     .catch((error)=>{
       console.error(error);
       this.toastMessage(error)
     })
     ;
  }

  criarEvento(){
    let url = this.API_URL+"criar";

    this.evento.latitude = "545d4"
    this.evento.longitude = "df4d54";

    if(this.tirou==false){
      this.toastMessage("Ops, você ainda não tirou uma foto !")
    }
    if(this.evento.nome == ""){
      this.toastMessage("Digite um nome para o evento !")
    } else{
      return new Promise((resolve, reject) => {
        this._http.post(url,this.evento)
        .subscribe((result: any) => {
        this._load.create({ content: "Fazendo requisição", duration: 1000 }).present();
        this.foto = "";
        this.evento.nome = "";
        this.toastMessage("Evento criado com sucesso")
        },
        (resposta : HttpErrorResponse)=> {
          this._status = resposta.status;
          if(resposta.status == 0){
            this.toastMessage("Sem comunicação com o servidor !");
          }else if(resposta.status == 400){
            this.toastMessage(resposta.error.message);
          }else if(resposta.status == 500){
            this.toastMessage("Erro interno no servidor");
          }else {
            this.toastMessage(resposta.statusText)
          }
        })
      }); 
    }
  }

  toastMessage(mensagem: string) {
    return this._toast.create({
      message: mensagem,
      position: "botton",
      duration: 5000
    }).present();
  }
  
}
