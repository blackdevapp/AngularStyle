import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ComponentModel } from '../shared/models/component.model';
import { Package } from '../shared/models/package.model';
import {Memory} from "../base/memory";
import {ServiceBase2} from "./serivce-base2.service";
let BASE_URL = '';
declare var moment;
@Injectable()
export class ComponentService extends ServiceBase2{
  moment = moment;
  constructor(public _HttpClient: HttpClient) {
    super();
    this._objectName = '/';
  }
  getComponents() {
    return this.getService('component');
  }

  countComponents() {
    return this.getService('component/count');
  }

  addComponent(component: ComponentModel) {

    return this.postService('component', component);
  }

  getComponent(component: ComponentModel) {
    return this.getService(`component/${component._id}`);
  }
  getFilteredComponent(params:string) {
    return this.getService(`component/filter/${params}`);
  }



  getFilteredComponentPost(params:string,body) {
    return this.postService(`component/filter/strong/${params}?userId=${Memory.getUserIdStorage()}`,body);
  }
  // getMultipleComponent(params:string)<Component[]> {
  //   return this.postService(`component/multiple`);
  // }
  getMultipleComponent(packages: any) {
    return this.postService('component/multiple', packages);
  }

  editComponent(component: ComponentModel) {
    let headers = new HttpHeaders();
    headers = headers
      .set('Content-Type', 'application/json')
      .set('Authorization','Bearer '+localStorage.getItem('nj.token'));
    return this._HttpClient.put(`${Memory.getUrl()}${this._objectName}component/${component._id}`, component, { headers:headers,responseType: 'text' });
  }

  deleteComponent(component: ComponentModel) {
    let headers = new HttpHeaders();
    headers = headers
      .set('Content-Type', 'application/json')
      .set('Authorization','Bearer '+localStorage.getItem('nj.token'));
    return this._HttpClient.delete(`${Memory.getUrl()}${this._objectName}component/${component._id}`, { headers:headers,responseType: 'text' });
  }
  addPackage(packageData:any) {
    return this.postService(`package/`, packageData);
  }
  getPackages() {
    return this.getService('package');
  }
  getPackagesFilter(params) {
    return this.getService(`package/filter/${params}`);
  }
  getPackagesFilterPagination(params,page) {
    return this.getService(`package/filter/${params}/${page}/10`);
  }
  deletePackage(packages: Package) {
    let headers = new HttpHeaders();
    headers = headers
      .set('Content-Type', 'application/json')
      .set('Authorization','Bearer '+localStorage.getItem('nj.token'));
    return this._HttpClient.put(`${Memory.getUrl()}${this._objectName}package/${packages._id}`, packages,{ headers:headers,responseType: 'text' });
  }
  editPackage(packages: any) {
    let headers = new HttpHeaders();
    headers = headers
      .set('Content-Type', 'application/json')
      .set('Authorization','Bearer '+localStorage.getItem('nj.token'));
    return this._HttpClient.put(`${Memory.getUrl()}${this._objectName}package/${packages._id}`, packages,{ headers:headers,responseType: 'text' });
  }
  getStrongFiltered(filter: Object) {
    return this.postService(`component/filter`, filter);
  }
  getStrongPackageFiltered(filter: Object){
    return this.postService(`package/filter`, filter);
  }
  getExternalHotelResource(cityCode){
    return this.getService(`external/am/hotels/${cityCode}?agency_id=${Memory.getAgencyId()}&userId=${Memory.getUserIdStorage()}`);
  }
  getExternalAirfareResource(destination: Object) {
    return this.postService(`external/am/flights/?agency_id=${Memory.getAgencyId()}&userId=${Memory.getUserIdStorage()}`, destination);
  }
  getExternalAirfareResourceAirAsia(destination: Object) {
    return this.postService(`external/ak/flights/perday?agency_id=${Memory.getAgencyId()}&userId=${Memory.getUserIdStorage()}`, destination);
  }
  getAllmylesComponents(){
    return this.getService('../../assets/allmyles/allmyles.json');
  }
  getFilteredAirport(filter: Object) {
    return this.postService(`airports/filter`, filter);
  }

  amadeusJsonConverterCheap(data) {
    var init = {
      "details": {
        "from": {
          "departure": {
            "date": moment(data.departs_at)._i,
            "time": moment(data.departs_at).format("hh:mm")
          },
          "arrival": {
            "date": moment(data.arrives_at)._i,
            "time": moment(data.arrives_at).format("hh:mm")
          },
          "city": data.origin.airport,
          "airport": data.origin.airport,
          "class": data.booking_info.travel_class
        },
        "addons": [],
        "roundTrip": false
      },
      "deleted": false,
      "onlineData": true,
      "type": "AIRPLANE",
      "company": data.operating_airline,
      "user": localStorage["nj.user_id"],
      "soloPrice": data.price.total_price,
      "bulkPrice": data.price.total_price,
      "asSolo": true,
      "asPackage": true,
      "mode": "transport",
      "icon": "airplanemode_active",
      "deadline": {
        "date": moment(data.arrives_at)._i,
        "time": moment(data.arrives_at).format("hh:mm")
      },
      "publishedDate": moment().format(),
      "updatedDate": moment().format(),
      "__v": 0
    }
    return init;
  }
  amadeusHotelJsonUnify(data){
    data.map((v) =>{
      console.log(v)
    })
    return;
  }
  autoSuggestionCity(city,isDestination){
    return this.getService(`external/ss/search?city=${city}&destination=${isDestination}&type=city`);
  }
  autoSuggestionAirport(city,isDestination){
    return this.getService(`external/ss/search?city=${city}&destination=${isDestination}&type=airport`);
  }
  getAllAirlines(){
    return this.getService(`external/sb/airline`);
  }
  getTopPackage(id){
    return this.getService(`package/sell/bestSellers?agency_id=${id}`);
  }

  getOneTopPackage(id){
    return this.getService(`package/filter/_id=${id}`);
  }


  getAgodaCity(city){
    return this.getService(`external/ag/city/${city}`);
  }
  getAgodaHotels(filter){
    return this.postService(`external/ag/listing?userId=${Memory.getUserIdStorage()}`, filter);
  }

}
