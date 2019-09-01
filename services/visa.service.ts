import { Injectable } from '@angular/core';
import {HttpClientModule, HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import {ServiceBase2} from "./serivce-base2.service";

// import { User } from '../shared/models/user.model';
let BASE_URL = '';
@Injectable()
export class VisaService extends ServiceBase2{
  visa = {
    '3' : 'visa-free travel',
    '2' : 'eTA is required',
    '1' : 'visa can be obtained on arrival (which Passport Index considers visa-free)',
    '0' : 'visa is required'
  }
  constructor(public _HttpClient: HttpClient) {
    super();
    this._objectName = '/';
  }  // 3 = visa-free travel
  // 2 = eTA is required
  // 1 = visa can be obtained on arrival (which Passport Index considers visa-free)
  // 0 = visa is required
  // -1 is for all instances where row = column


  autoSuggestionCountries(query: String) {
    return this.getServiceF(`visa/countries/search/${query}`);
  }
  getPassportInfo(query: String) {
    return this.getServiceF(`visa/passports/filter/${query}`);
  }


}
