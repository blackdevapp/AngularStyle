import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
let BASE_URL = '';
@Injectable()
export class CityService {

  constructor(private http: HttpClient) { }
  getSuggestCity(city){
    return this.http.get<any>(`${BASE_URL}/api/external/cities/${city}`);
  }
  getAmadeusSuggestionCity(city){
    return this.http.get<any>(`${BASE_URL}/api/external/am/cities/${city}?type=CITY`);
  }
  getAmadeusSuggestionAirport(city){
    return this.http.get<any>(`${BASE_URL}/api/external/am/cities/${city}?type=AIRPORT`);
  }
}
