import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AppSettings} from "../app.setting";

@Injectable()
export class UploadService {

  constructor(private http: HttpClient) { }
  upload(data,id){
    let formData=new FormData();
    formData.append('image',data)
    return this.http.post(`${AppSettings.UPLOAD_URL}/api/upload/${id}`,formData)
  }
}
