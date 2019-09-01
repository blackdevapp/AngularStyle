import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Memory} from "../../base/memory";
import {ComponentService} from "../../services/component.service";
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {ComponentDataService} from "../../services/dataService/component-data.service";
declare var moment;

@Component({
  selector: 'app-element-drag',
  templateUrl: './element-drag.component.html',
  styleUrls: ['./element-drag.component.scss']
})
export class ElementDragComponent implements OnInit {
  @Input() eachComponent;
  @Input() filter;
  @Input() packages:Array<any>;
  @Input() offline:boolean = false;
  counter: number = 0;
  marked:boolean = false;
  memory=Memory;
  math=Math;
  role:string;
  mainSlideConfig = {
    "slidesToShow": 1,
    "slidesToScroll": 1,
    "dots": false,
    "infinite": true,
    "autoplay": false,
    "autoplaySpeed": 2500
  };
  constructor(private componentService:ComponentService,private router:Router,
              private auth:AuthService,
              private componentDataService:ComponentDataService) { }

  ngOnInit() {
    this.role=this.auth.getRole();
    console.log(this.eachComponent);
  }
  formatDate(date){
    return moment(date).format('DD MMM YYYY')
  }
  getDuration(n,nT,t,tT){
    let now = `${moment(n).format('DD/MM/YYYY')} ${nT}:00`,
      then = `${moment(t).format('DD/MM/YYYY')} ${tT}:00`,
      ms = moment(now,"DD/MM/YYYY HH:mm:ss").diff(moment(then,"DD/MM/YYYY HH:mm:ss")),
      d = moment.duration(ms);
    return Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");
  }

  exchange(component){
    if(component.currency){
      if(component.currency===Memory.getActiveCurrency()){
        return parseFloat(component.bulkPrice);
      }else if(component.currency!=Memory.getActiveCurrency()){
        return parseFloat(component.bulkPrice)*parseFloat(Memory.getCurrency()[`${component.currency}_${Memory.getActiveCurrency()}`])
      }
    }else{
      return parseFloat(component.bulkPrice);
    }
  }

  exchangeAmadeus(component){
    // if(component.currency){
    if(component.associated_agency==='airasia'){
      if('PHP'===Memory.getActiveCurrency()){
        return parseFloat(component.bulkPrice);
      }else{
        return parseFloat(component.bulkPrice)*parseFloat(Memory.getCurrency()[`USD_${Memory.getActiveCurrency()}`])
      }
    }else{
      if('EUR'===Memory.getActiveCurrency()){
        return parseFloat(component.bulkPrice);
      }else{
        return parseFloat(component.bulkPrice)*parseFloat(Memory.getCurrency()[`EUR_${Memory.getActiveCurrency()}`])
      }
    }
  }
  convertAmadeusDate(date){
    let dateOnly=moment(date).format('DD MMM YYYY');
    let time=date.split('T')[1].substring(0,5);
    return `${dateOnly} ${time}`;
  }
  convertAmadeusJustDate(date){
    let dateOnly=moment(date).format('DD MMM YYYY');
    let time=date.split('T')[1].substring(0,5);
    return `${dateOnly}`;
  }
  convertAmadeusJustTime(date){
    let dateOnly=moment(date).format('DD MMM YYYY');
    let time=date.split('T')[1].substring(0,5);
    return `${time}`;
  }




  slider: boolean= false;
  images(){
    this.slider= true;
  }
}
