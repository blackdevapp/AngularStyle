import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {ServiceBase2} from "./serivce-base2.service";
let BASE_URL = '';
@Injectable()
export class ImageService extends ServiceBase2{

  constructor(public _HttpClient: HttpClient) {
    super();
    this._objectName = '/';
  }
  getImageSuggestion(q,all){
    return this.getService(`package/image/${q}&all=${all}`);
  }
}
