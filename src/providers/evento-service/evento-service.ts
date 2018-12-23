import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Evento } from '../../Models/Evento';
import { LoadingController, ToastController } from 'ionic-angular';

@Injectable()
export class EventoServiceProvider {


  private API_URL = 'http://192.168.0.107:8080/api/evento/'
  

  constructor(public _http: HttpClient, private _load: LoadingController,
    private _toast : ToastController) {
  }

  gravarEvento(evento: Evento) {
    let url = this.API_URL+"criar";
    return this._http.post(url, evento);
  }
}
