/**
 * Created by Milad Ahmadi in Dec 2018.
 */

import {StringObject, ToValid, ValidationModel} from './validationModel';
import {isUndefined} from "util";
import * as moment from 'moment';
import {Pattern} from './pattern';

export class Validation {

  // Intialize ur object for check validation with set Array of ur field name an toBe valid
  public static intialObject(fields):ValidationModel{
    let object:ValidationModel=new ValidationModel();
    object.isValid=true;
    fields.forEach(function (field) {
      let item:Object=new Object;
      let itemToValid:ToValid=new ToValid();
      itemToValid.isValid=true;
      itemToValid.toBe=field.toBe;
      item[field.field]=itemToValid;
      Object.assign(object.fields,item);
    });
    return object;
  }



  public static checkObject(object:ValidationModel):ValidationModel{
    object.isValid=true;
    for(let key in object.fields){
      object.fields[key].toBe[0]!=='date'?object.fields[key].isValid=true:object.fields[key].isValid;
      object.fields[key].toBe.forEach(function (item) {
        let toBe=item.split('-');
        switch (toBe[0]) {
          case 'cs':
            object.fields[key].isValid=Validation.checkString(object.fields[key].originalValue,toBe[1]) && object.fields[key].isValid;
            break;
          case 'csPass':
            object.fields[key].isValid=Validation.checkStringPass(object.fields[key].originalValue,toBe[1]) && object.fields[key].isValid;
            break;
          case 'cso':
            object.fields[key].isValid=Validation.checkStringOptional(object.fields[key].originalValue,toBe[1]) && object.fields[key].isValid;
            break;
          case 'cn':
            object.fields[key].isValid=Validation.checkNumber(object.fields[key].originalValue,toBe[1]) && object.fields[key].isValid;
            break;
          case 'ce':
            object.fields[key].isValid=Validation.checkEmail(object.fields[key].originalValue,toBe[1]) && object.fields[key].isValid;
            break;
          case 'compare':
            object.fields[key].isValid=Validation.compareNumber(object.fields[key].originalValue,object.fields[toBe[2]].originalValue,toBe[1]) && object.fields[key].isValid;
            break;
          case 'compareS':
            object.fields[key].isValid=Validation.compareString(object.fields[key].originalValue,object.fields[toBe[2]].originalValue,toBe[1]) && object.fields[key].isValid;
            break;
          case 'list':
            object.fields[key].isValid=Validation.checkList(object.fields[key].originalValue,toBe) && object.fields[key].isValid;
            break;


        }
        object.isValid=object.isValid && object.fields[key].isValid;
      });
    }

    return object
  }



  // isoCode cs:check value is string and length(optional)
  public static checkString(value,n?){
    if (isUndefined(value)) {
      return false;
    } else {
      if(n){
        if(value.length>1&&value.length<n){
          return true;
        }
      }else{
        if(value.length>1){
          return true;
        }
      }
    }
    return false
  }
  public static checkStringPass(value,n?){
    if (isUndefined(value)) {
      return false;
    } else {
      if(n){
        if(value.length>7&&value.length<n){
          return true;
        }
      }else{
        if(value.length>2){
          return true;
        }
      }
    }
    return false
  }


  public static checkList(value:any[],to:any[]){
    let isValid:boolean=true;
    to.splice(0,1);
    value.forEach(function (item, index) {
      for(let sub of to){
        let object=sub.split('_');
        if(item[object[0]].length>=2&&item[object[0]].length<=object[1]){
        }else{
          isValid=false;
        }
      }
    });
    return isValid;
  }


  public static checkEmail(value,n?){
    if (isUndefined(value)) {
      return false;
    } else {
      if(n){
        if(value.length>2&&value.length<n &&value.match(Pattern.email)){
          return true;
        }
      }else{
        if(value.length>2){
          return true;
        }
      }
    }
    return false
  }


  // isoCode cs:check value is string and length(optional)
  public static checkNumber(value,n?){
    value=value.toString();
    if (isUndefined(value)) {
      return false;
    } else {
      if(n){
        if(value.length<=n && value.match(Pattern.number)){
          return true;
        }
      }else{
        if( value.match(Pattern.number)){
          return true;
        }
      }
    }
    return false
  }



  // isoCode cs:check value length(optional)
  public static checkStringOptional(value,n?){
    if (isUndefined(value)) {
      return true;
    } else {
      if(n){
        if(value.length<n){
          return true;
        }else{
          return false
        }
      }else{
        return true;
      }
    }
  }



  // isoCode cA:check value is number&text and length(optional)
  public static checkAlphanumeric(value,n?){

  }


  public static compareNumber(first,twice,type){
    first=parseFloat(first);
    twice=parseFloat(twice);
    if(type==='gt'){
      return first>twice;
    }
    else if(type==='gtt'){
      return first>=twice;
    }
    else if(type==='lt'){
      return first<twice;
    }
    else if(type==='ltt'){
      return first<=twice;
    }
    else if(type==='equal'){
      return first===twice;
    }
  }
  public static compareString(first,twice,type){
    if(type==='equal'){
      return first===twice;
    }
  }


  public static sameDay(checkDate){
    let today=new Date();
    return checkDate.isSame(moment(today),'year') && checkDate.isSame(moment(today),'month') && checkDate.isSame(moment(today),'day')
  }
  public static sameDayOrAfter(checkDate){
    let today=new Date();
    return checkDate.isSameOrAfter(moment(today),'year') && checkDate.isSameOrAfter(moment(today),'month') && checkDate.isSameOrAfter(moment(today),'day')
  }


  public static sameDayOrAfterCompare(date1,date2){
    return moment(date2).isSameOrAfter(moment(date1),'year') && moment(date2).isSameOrAfter(moment(date1),'month') && moment(date2).isSameOrAfter(moment(date1),'day')
  }

  //Date validation

  //BNNY
  public static betweenNowNextYear(date,time):boolean{
    let today=new Date();
    let min=new Date(today.getTime());
    let time1=time.toString().split(':');
    let checkDate=moment(date);
    let checkTime=true;
    if(Validation.sameDay(checkDate)){
      if(time1[0]>today.getHours()){
        checkTime=true;
      }else if(time1[0]===today.getHours() && time1[1]>today.getMinutes()){
        checkTime=true;
      }else{
        checkTime=false;
      }
    }
    return Validation.sameDayOrAfter(checkDate) && checkDate.isSameOrBefore(moment(today.setFullYear(new Date().getFullYear() + 1))) && checkTime;
  }

  //CDOM  30 min until 3 days
  public static compareDateOneMonth(base,current):boolean{
    base.date=new Date(base.date)
    base.current=new Date(base.current)
    let baseTime=base.time.split(':')[0]*60+base.time.split(':')[1];
    let currentTime=current.time.split(':')[0]*60 + current.time.split(':')[1];
    let currentMoment=moment(current.date);
    let checkDateTime=true;
    let min=new Date(base.date.getTime());
    let max=new Date(base.date.getTime());
    if(currentMoment.isSame(moment(min))){
      if(currentTime-baseTime>=30){
        checkDateTime=true;
      }else{
        checkDateTime=false;
      }
    }
    return currentMoment.isSameOrAfter(moment(min)) && currentMoment.isSameOrBefore(moment(max.setDate(min.getDate()+3))) && checkDateTime;
  }
  //CDL  compare date lesser
  public static compareDateLess(base,current):boolean{
    base.date=new Date(base.date)
    base.current=new Date(base.current)
    let baseTime=base.time.split(':')[0]*60+base.time.split(':')[1];
    let currentTime=current.time.split(':')[0]*60 + current.time.split(':')[1];
    let currentMoment=moment(current.date);
    let checkDateTime=true;
    let min=new Date(base.date.getTime());
    if(currentMoment.isSame(moment(min))){
      if(currentTime>baseTime){
        checkDateTime=true;
      }else{
        checkDateTime=false;
      }
    }
    return currentMoment.isSameOrAfter(moment(min)) && checkDateTime;
  }
  public static twoWay(base,current):boolean{
    base.date=new Date(base.date)
    base.current=new Date(base.current)
    let baseTime=base.time.split(':')[0]*60+base.time.split(':')[1];
    let currentTime=current.time.split(':')[0]*60 + current.time.split(':')[1];
    let currentMoment=moment(current.date);
    let checkDateTime=true;
    let min=new Date(base.date.getTime());
    let max=new Date(base.date.getTime());
    if(currentMoment.isSame(moment(min))){
      if(currentTime-baseTime>=1){
        checkDateTime=true;
      }else{
        checkDateTime=false;
      }
    }
    return currentMoment.isSameOrAfter(moment(min)) && checkDateTime;
  }


  //date manager
  public static checkDate(date, toBe: string,object:ValidationModel,field:string):ValidationModel {
    object.fields[field].isValid=true;
    switch (toBe) {
      case 'BNNY':
        object.fields[field].isValid = Validation.betweenNowNextYear(date.date,date.time);
        break;
    }
    return object
  }


  public static compareDate(baseDate, currentDate, toBe: string,object:ValidationModel,currentField):ValidationModel {
    // object.fields[currentField].isValid=true;
    switch (toBe) {
      case 'CDOM':
        object.fields[currentField].isValid = Validation.compareDateOneMonth(baseDate,currentDate) && object.fields[currentField].isValid ;
        break;
      case 'CDL':
        object.fields[currentField].isValid = Validation.compareDateLess(baseDate,currentDate) ;
        break;
    }
    return object
  }

  public static convertDateToString(date){
    let cDate=new Date(date);
    return `${cDate.getDate()}/${Validation.convertMonth((cDate.getMonth()+1).toString())}/${cDate.getFullYear()}`
  }
  public static convertMonth(month){
    if(month.length==1){
      return `0${month}`
    }else{
      return month;
    }
  }
}
