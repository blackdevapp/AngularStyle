import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Memory} from "../base/memory";
import {ServiceBase2} from "./serivce-base2.service";
@Injectable()
export class AccountingService extends ServiceBase2{

  constructor(public _HttpClient: HttpClient) {
    super();
    this._objectName = '/accounting/';
  }


  getFilteredTransactions(params:string,page,limit){
    return this.getService(`transaction/${params}/${page}/${limit}`);
  }
  getFilterTransactions(query){
    return this.postService(`transaction/find`,query);
  }
  getFilterTransactionsPdf(){
    return this._HttpClient.get(`${Memory.getUrl()}${this._objectName}transaction/pdf?agency_id=${Memory.getAgencyId()}`,{responseType:'arraybuffer'});
  }
  getFilteredTransactionsTotal(params:string){
    return this.getService(`transaction/totalPrice/${params}`);
  }
  insertTransaction(transaction){
    return this.postService(`insert`,transaction);
  }
  getLasTwoWeekData(){
    return this.getService(`lastTransactions?dayCount=15&agency=${Memory.getAgencyId()}`);
  }
}
