import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';
import { ComponentService} from '../../services/component.service';
import {Router} from '@angular/router';
import {ComponentDataService} from '../../services/dataService/component-data.service';
import {Memory} from "../../base/memory";
import {AuthService} from "../../services/auth.service";
declare var moment;

@Component({
  selector: 'app-element-list',
  templateUrl: './element-list.component.html',
  styleUrls: ['./element-list.component.scss']
})
export class ElementListComponent implements OnInit {
	@Input() eachComponent;
	@Input() filter;
	@Input() mode:string;
	@Input() packages:Array<any>;
	@Input() offline:boolean = false;
	airports = {};
	counter: number = 0;
	loopStarts: boolean = true;
	moement = moment;
  tmpSelectedComponents = [];
  marked:boolean = false;
  sliderImages:Array<any> = []
	@Output() selectedData: EventEmitter<any> = new EventEmitter();
	@Output() checked: EventEmitter<any> = new EventEmitter();
	@Output() deleted: EventEmitter<any> = new EventEmitter();
  @Output() imageSelector: EventEmitter<any> = new EventEmitter();
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
    Memory.setLoading(false);
  }
  passBackOfflineData(component,marked){
    this.eachComponent.marked=!marked
  	this.checked.emit({component: component, active: this.eachComponent.marked});
  }

  checkedValue(){
    let self=this;
    this.packages.forEach(function (item) {
      if(item._id===self.eachComponent._id){
        return true
      }
    });
    return false;
  }
  selectedFlight(selectedFlight,fare){
  	// console.log( selectedFlight);
  	selectedFlight['price'] = fare
  	this.convertLiveData(selectedFlight);
  }
  onlyUnique(value, index, self) { 
	 return self.indexOf(value) === index;
  }
  formatDate(date){
  	return moment(date).format('DD MMM YYYY')
  }
  // amadeusJsonConverterCheap
  convertLiveData(data){
  	let liveDataConvertion = this.componentService.amadeusJsonConverterCheap(data);
  	this.tmpSelectedComponents.push(liveDataConvertion);
  	this.selectedData.emit(this.tmpSelectedComponents);
  }
  slideImages(imgs){
    // this.slideImages = imgs
    this.imageSelector.emit(imgs);
  }
  getAirport(q){
	 //  if(this.airports[q] !== "" && this.loopStarts){
	 //  	this.airports[q] = "";
		// console.log('its unique')

		// // this.componentService.getFilteredAirport({iata: q}).subscribe(
		// // 	response => {
		// // 	    if (response) {
		// // 	    	this.airports[q] = response[0].airportName
		// // 	    }
		// // });
	 //  }
	 // console.log(this.airports)
	  
  }
  deleteElement(component){
    if (window.confirm('Do you want to delete this inquiry?')) {
      component.deleted = true;
      this.componentService.editComponent(component).subscribe((res: any) => {
        this.deleted.emit(component);
      })
    }
  }
  goTo(component){
    this.componentDataService.setComponent(component);
    this.router.navigateByUrl('/panel/component')
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
        return parseFloat(component.bulkPrice)*parseFloat(Memory.getCurrency()[`PHP_${Memory.getActiveCurrency()}`])
      }
    }else{
      if('EUR'===Memory.getActiveCurrency()){
        return parseFloat(component.bulkPrice);
      }else{
        return parseFloat(component.bulkPrice)*parseFloat(Memory.getCurrency()[`EUR_${Memory.getActiveCurrency()}`])
      }
    }

    // }else{
    //     return parseFloat(component.bulkPrice);
    // }
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


  goToAirasia(){
    window.open(`https://www.airasia.com/select/en/gb/${this.filter.from}/${this.filter.to}/${this.filter.date}/N/1/0/0/O/N/${Memory.getActiveCurrency()}/SC?gclid=Cj0KCQjwh6XmBRDRARIsAKNInDF7bEfXyucMaZ6OPC8J0ONXlTa4BdzD_hQo_kRfw75faAmKJ3sVNj8aAuVyEALw_wcB&gclsrc=aw.ds`,'_blank')
  }
  goToAgoda(){
    window.open(`https://www.agoda.com${this.eachComponent.url}`,'_blank')
  }


  slider: boolean= false;
  images(){
    this.slider= true;
    // this.imageTemp= image;
    // $('#images').modal('toggle');
  }
  closeSlider(){
    this.slider= false;
  }
}
