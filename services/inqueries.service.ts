import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {ComponentModel} from '../shared/models/component.model';
import {InquiryModel} from '../shared/models/inquiry.model';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Memory} from "../base/memory";
import {ServiceBase2} from "./serivce-base2.service";

@Injectable()
export class InqueriesService extends ServiceBase2{

  constructor(public _HttpClient: HttpClient) {
    super();
    this._objectName = '/agencies/inquerie'
  }
  getAllInqueries(agencyId: string,page,limit) {
    return this.getService(`/${agencyId}/${page}/${limit}`);
  }
  getLastInqueries(count) {
    return this.getServiceF(`/last/filter?agency_id=${Memory.getAgencyId()}&count=${count}`);
  }
  deleteInqueryById(inquery,id){
    return this.putService(`/${id}`,inquery)
  }
  changeStatus(inquery,id){
    return this.putService(`/${id}`,inquery)
  }
// //multiple
  deleteMultipleInquery(inqueries){

    return this.putService(`/multiple`,inqueries)
  }

  getInqueiesByFilter(params:string) {
    return this.getService(`/filter/${params}`);
  }getInqueiesByFilterCheckout(params:string) {
    return this.getService(`/filter-checkout/${params}`);
  }
  getInqueiesByFilterPagination(params:string,page,limit) {
    return this.getService(`/filter/${params}/${page}/${limit}`);
  }

  createInquery(inquery:InquiryModel){
    return this.postService(``,inquery)
  }
}
