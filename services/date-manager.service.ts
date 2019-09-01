import {Injectable} from '@angular/core';
import {HttpClientModule, HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import * as moment from 'moment';
import {Validation} from '../base/validation';
import {Package} from '../shared/models/package.model';

// import { User } from '../shared/models/user.model';

@Injectable()
export class DateManagerService {

  constructor(private http: HttpClient) {
  }

  //get how many days and nights are within a date range
  // getNumberOfDaysNight(): Observable<User> {
  //   return this.http.post<User>('/api/user', user);
  // }

  //acs or decending order for multiple dates
  arrangeDates(dates, order?): Observable<any> {
    let tmpArray;
    dates.forEach(function (v, k) {
      tmpArray.push(moment(v).toDate());
    });
    return tmpArray.sort(function (a, b) {
      return a + b;
    })
  }

  // get list of component for return range of first and last component
  rangeOfTrip(packages:any[]):string{
    let hours=0;
    if(packages.length>1){
      let startDate=packages[0].details.from.departure.date.toString().substring(0,10);
      let startTime=packages[0].details.from.departure.time.split(':');
      let endDate;
      let endTime
      if(packages[packages.length-1].details.roundTrip){
        endDate=packages[packages.length-1].details.to.arrival.date.toString().substring(0,10);
        endTime=packages[packages.length-1].details.to.arrival.time.split(':');
      }else {
        endDate=packages[packages.length-1].details.from.departure.date.toString().substring(0,10);
        endTime=packages[packages.length-1].details.from.departure.time.split(':');
      }

      let temp=startDate.split('-');
      let temp2=endDate.split('-');
      let start=new Date(temp[0],temp[1],temp[2],startTime[0]);
      let end=new Date(temp2[0],temp2[1],temp2[2],endTime[0]);
      let duration = moment.duration(moment(end).diff(moment(start)));
      hours = duration.asHours();
    }
    return `${Math.floor(hours/24)} Days and ${Math.floor(hours/24)-1} nights`
  }


  //check the last trip added to packages isValid or not.get list of component and return the last one isValid or not
  checkValidTrip(packages:any[]):boolean{
   let isValid=true;
   if(packages.length>1){
     isValid=Validation.sameDayOrAfterCompare(packages[packages.length-2].details.from.arrival.date.toString().substring(0,10),packages[packages.length-1].details.from.departure.date.toString().substring(0,10))
   }
    return isValid;
  }

  //check the all trips isValid or not.get list of component and return the list that check isValid or not
  checkAllValidTrip(packages:any[]):any[]{
   let isValid=true;
   if(packages.length>1){
     let self=this;
     packages.forEach(function (item,index) {
       if(index>0){
         if(item.pair){
           if(packages[index-1].pair){
             item.isValid=Validation.sameDayOrAfterCompare(packages[index-1].details.to.arrival.date.toString().substring(0,10),item.details.to.departure.date.toString().substring(0,10))
           }else{
             item.isValid=Validation.sameDayOrAfterCompare(packages[index-1].details.from.arrival.date.toString().substring(0,10),item.details.to.departure.date.toString().substring(0,10))
           }

         }else{
           if(packages[index-1].pair){
             item.isValid=Validation.sameDayOrAfterCompare(packages[index-1].details.to.arrival.date.toString().substring(0,10),item.details.from.departure.date.toString().substring(0,10))
           }else{
             item.isValid=Validation.sameDayOrAfterCompare(packages[index-1].details.from.arrival.date.toString().substring(0,10),item.details.from.departure.date.toString().substring(0,10))
           }

         }

       }else{
         item.isValid=true;
       }
     })
   }else if(packages.length===1){
     packages[0].isValid=true;
   }
    return packages;
  }

}
