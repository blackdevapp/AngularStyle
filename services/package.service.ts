import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

import { Package } from '../shared/models/package.model';
import {Memory} from "../base/memory";
import {ServiceBase2} from "./serivce-base2.service";
let BASE_URL = '';
declare var moment;
@Injectable()
export class PackageService extends ServiceBase2{
  moment = moment;
  constructor(public _HttpClient: HttpClient) {
    super();
    this._objectName = '/';
  }
  test(){
    return this.getServiceF('payment')
  }
  priceCalculator(p) {
    let price = 0;
    p.componentsData.forEach((v, k) => {
      if(v.associated_agency==='amadeus'){
          if('EUR'===Memory.getActiveCurrency()){
            price += parseFloat(v.bulkPrice);
          }else{
            price+=parseFloat(v.bulkPrice)*parseFloat(Memory.getCurrency()[`EUR_${Memory.getActiveCurrency()}`])
          }
      }else{
        if(v.currency){
          if(v.currency===Memory.getActiveCurrency()){
            price += parseFloat(v.bulkPrice);
          }else if(v.currency!=Memory.getActiveCurrency()){
            price+=parseFloat(v.bulkPrice)*parseFloat(Memory.getCurrency()[`${v.currency}_${Memory.getActiveCurrency()}`])
          }
        }else{
          if(p.currency!=Memory.getActiveCurrency()){
            price+=parseFloat(v.bulkPrice)*parseFloat(Memory.getCurrency()[`${p.currency}_${Memory.getActiveCurrency()}`])
          }else{
            price += parseFloat(v.bulkPrice);
          }
        }
      }
    });

    return `${Memory.getActiveCurrency() ? Memory.getActiveCurrency() : 'PHP'} ${Math.round((price - (p.packageData.discount * price) / 100)*100)/100}`;
  }
  getFilteredPackage(params:string){
    return this.getServiceF(`package/filter/${params}`);
  }
  checkValidForBook(packages){
    return this.postService(`package/check/valid`,packages);
  } checkValidForCustomBook(packages){
    return this.postService(`package/check/custom/valid`,packages);
  }


  payVisa(packages){
    return this.postService(`package/check/visa`,packages);
  }

  pay(amount){
    return this.postService(`package/check/pay`,{amount:amount,agencyId:Memory.getAgencyId(),userId:Memory.getUserIdStorage(),currency:Memory.getActiveCurrency()});
  }


  exchangePrice(from,to){
    return this._HttpClient.get(`https://free.currencyconverterapi.com/api/v6/convert?q=${from}_${to}&compact=ultra&apiKey=e3c621e128127f8e3a06`)
  }
  // /component/filter
  // router.route('/package/:id').delete(packageCtrl.delete);

}
