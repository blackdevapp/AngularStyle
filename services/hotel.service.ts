import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { RoomModel } from '../shared/models/room.model';
import { EventModel } from '../shared/models/event.model';

import { ComponentModel } from '../shared/models/component.model';
import {ServiceBase2} from "./serivce-base2.service";
let BASE_URL = '';
@Injectable()
export class HotelService extends ServiceBase2{

  constructor(public _HttpClient: HttpClient) {
    super();
    this._objectName = '/';
  }
  getRooms(){
    return this.getServiceF(`component/filter/type=hotel-room`);
  }
  reservations(){
    return this.getServiceF(`reservation`);
  }
  insertReservation(event) {
    return this.postServiceF(`room/reservation`,event);
  }
}
