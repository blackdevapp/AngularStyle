import { Component, OnInit,Input } from '@angular/core';
import { ComponentService} from '../../services/component.service';
import { AmazingTimePickerService } from 'amazing-time-picker';
import * as moment from 'moment';
import {Validation} from '../../base/validation';
import {ValidationModel} from '../../base/validationModel';
import {NotifyConfig} from '../../base/notify/notify-config';
import {Notify} from '../../base/notify/notify';
import {Memory} from "../../base/memory";
import {Router} from "@angular/router";
import { ComponentObject } from '../../shared/models/component-object.model';
declare var $: any;


@Component({
  selector: 'app-airplane',
  templateUrl: './airplane.component.html',
  styleUrls: ['./airplane.component.scss']
})
export class AirplaneComponent implements OnInit {
  tripValidationIntial:Array<any>;
  tripValidation:ValidationModel;


	@Input() contentData;
	@Input() componentName;
	@Input() airlines:Array<any>;
  moment = moment;
  lineResult:Array<any>=[];
	memory = Memory;
	endDate;
  popUpMap: boolean = false
  selectedTime
  today=new Date();
	seatClass = [
		{
			displayName: "Business Class",
			name: "business-class",
			icon: "airline_seat_legroom_extra"
		},
		{
			displayName: "Economy Class",
			name: "economy-class",
			icon: "airline_seat_legroom_reduced"
		}
	]
	trip;
  @Input() editMode: boolean = false;
  init:ComponentObject=new ComponentObject('AIRPLANE',localStorage.getItem("nj.user_id"),'transport','airplanemode_active')
  // {
	// 	type: "AIRPLANE",
  //   componentName:"",
	// 	company: "Airasia",
	// 	user: localStorage.getItem("nj.user_id"),
	// 	soloPrice: 10,
	// 	soloPriceChild: 10,
	// 	bulkPrice: 10,
  //   quantity:10,
  //   tax:10,
	// 	bulkPriceChild: 10,
	// 	asSolo: false,
	// 	asPackage: true ,
	// 	mode: 'transport',
	// 	icon: 'airplanemode_active',
	// 	deadline: {
	// 		date: new Date(),
	// 		time: "00:00"
	// 	},
	// 	details: {
	// 		roundTrip: true,
	// 		addons:[
	// 			{
	// 				name: "Business Class",
	// 				availability: true,
	// 				icon: "airline_seat_legroom_extra"
	// 			},
	// 			{
	// 				name: "Insurance",
	// 				availability: true,
	// 				icon: "beenhere"
	// 			},
	// 			{
	// 				name: "Seat Pick",
	// 				availability: true,
	// 				icon: "event_seat"
	// 			},
	// 			{
	// 				name: "Food",
	// 				availability: true,
	// 				icon: "fastfood"
	// 			}],
	// 		from: {
	// 			city: "Manila",
	// 			airport: "NINOYAIRPORT",
	// 			departure: {
	// 				date: new Date(),
	// 				time: "00:00"
	// 			},
	// 			arrival: {
	// 				date: new Date(),
	// 				time: "00:00"
	// 			},
	// 			class: "ECONOMY"
	// 		},
	// 		to: {
	// 			city: "Boracay",
	// 			airport: "PLWNAIRPORT",
	// 			departure: {
	// 				date: new Date(),
	// 				time: "00:00"
	// 			},
	// 			arrival: {
	// 				date: new Date(),
	// 				time: "00:00"
	// 			},
	// 			class: "ECONOMY"
	// 		}
	// 	},
  // }
  maxDate:Date=new Date();
  constructor(private componentService:ComponentService,private atp: AmazingTimePickerService,
              private router:Router) {
    this.tripValidationIntial=[
      {field:'company',toBe:['cs-46']},
      {field:'from',toBe:['cs-85']},
      {field:'to',toBe:['cs-85']},
      {field:'tax',toBe:['cn-2']},
      {field:'quantity',toBe:['cn-7']},
      {field:'originalPriceAdult',toBe:['cn-10']},
      {field:'originalPriceChild',toBe:['cn-10']},
      {field:'soloPrice',toBe:['compare-gtt-bulkPrice']},
      {field:'soloPriceChild',toBe:['compare-gtt-bulkPriceChild']},
      {field:'bulkPriceChild',toBe:['compare-ltt-soloPriceChild']},
      {field:'bulkPrice',toBe:['compare-ltt-soloPrice']},
      {field:'arrivalTo',toBe:['date']},
      {field:'arrivalFrom',toBe:['date']},
      {field:'departureTo',toBe:['date']},
      {field:'departureFrom',toBe:['date']},
      {field:'deadline',toBe:['date']},
    ];
    this.tripValidation=Validation.intialObject(this.tripValidationIntial);
  }
  changeMaxDate(){
    this.maxDate=new Date(this.trip.details.from.departure.date.getFullYear(),this.trip.details.from.departure.date.getMonth(),this.trip.details.from.departure.date.getDate())
    this.trip.deadline.date=new Date(this.trip.details.from.departure.date.getFullYear(),this.trip.details.from.departure.date.getMonth(),this.trip.details.from.departure.date.getDate()-1)
  }
  openMap() {
    this.popUpMap = true;
    $('#map2').modal();
  }
  ngOnInit() {
  	if (this.contentData && (this.contentData.type === this.init.type)) {
  		this.trip = this.contentData;
      this.tripValidation.fields.company.originalValue=this.trip.company;
      this.tripValidation.fields.soloPrice.originalValue=this.trip.soloPrice;
      this.tripValidation.fields.bulkPrice.originalValue=this.trip.bulkPrice;
      this.tripValidation.fields.bulkPriceChild.originalValue=this.trip.bulkPriceChild;

      this.tripValidation.fields.soloPriceChild.originalValue=this.trip.soloPriceChild;
      this.tripValidation.fields.originalPriceAdult.originalValue=this.trip.originalPriceAdult;
      this.tripValidation.fields.originalPriceChild.originalValue=this.trip.originalPriceChild;
      this.tripValidation.fields.company.originalValue=this.trip.company;



      this.tripValidation.fields.tax.originalValue=this.trip.tax;
      this.tripValidation.fields.quantity.originalValue=this.trip.quantity;
      this.tripValidation.fields.from.originalValue=this.trip.details.from.city;
      this.tripValidation.fields.to.originalValue=this.trip.details.to.city;
  		this.editMode = true;
  	}else{

  		this.trip = this.init;
  		// this.trip.deadline.date=new Date(new Date().setDate(new Date().getDate()+5))
      this.tripValidation.fields.bulkPriceChild.originalValue=this.init.bulkPriceChild;
      this.tripValidation.fields.soloPriceChild.originalValue=this.init.soloPriceChild;
      this.tripValidation.fields.tax.originalValue=this.init.tax;
      this.tripValidation.fields.quantity.originalValue=this.init.quantity;
  		this.tripValidation.fields.company.originalValue=this.init.company;
  		this.tripValidation.fields.soloPrice.originalValue=this.init.soloPrice;
      this.tripValidation.fields.originalPriceAdult.originalValue=this.init.originalPriceAdult;
      this.tripValidation.fields.originalPriceChild.originalValue=this.init.originalPriceChild;
  		this.tripValidation.fields.bulkPrice.originalValue=this.init.bulkPrice;
  		this.tripValidation.fields.from.originalValue=this.init.details.from.city;
  		this.tripValidation.fields.to.originalValue=this.init.details.to.city;
  		this.editMode = false;
    }
  }

  cancel(){
    this.router.navigateByUrl('/panel/packages')
  }


  fromResult:Array<any>=[];
  toResult:Array<any>=[];

  getCitiesFrom(city,isDestination){
    this.componentService.autoSuggestionAirport(city,isDestination).subscribe((res:any)=>{
      if(res.isSuccessful) {
        if(isDestination){
          this.toResult=res.result;
        }else{
          this.fromResult=res.result;
        }
      }
    })
  }
  selectCityFrom(){
    for(let item of this.fromResult){
      if(item.PlaceId===this.trip.details.from.airport){
        this.trip.details.from.city=item.CityName
      }
    }
  }
  selectCityTo(){
    for(let item of this.toResult){
      if(item.PlaceId===this.trip.details.to.airport){
        this.trip.details.to.city=item.CityName
      }
    }
  }
  getAirlines(search){
    this.tripValidation.fields.company.originalValue='';
    this.trip.company='';
    this.lineResult = this.airlines.filter((item) => item.AlternativeBusinessName.indexOf(search.toLowerCase())>-1);
  }
  submitComponent(){
	  this.trip.componentName=this.componentName;
    Memory.setLoading(true);
    setTimeout(function(){
      Memory.setLoading(false)
    },5000)
    this.tripValidation=Validation.checkDate(this.trip.details.from.departure,'BNNY',this.tripValidation,'departureFrom');
	  if(this.trip.details.roundTrip){
      this.tripValidation=Validation.checkDate(this.trip.details.to.departure,'BNNY',this.tripValidation,'departureTo');
      this.tripValidation=Validation.checkDate(this.trip.details.to.arrival,'BNNY',this.tripValidation,'arrivalTo');
      this.tripValidation=Validation.compareDate(this.trip.details.to.departure,this.trip.details.to.arrival,'CDOM',this.tripValidation,'arrivalTo');
	  }
    this.tripValidation=Validation.checkDate(this.trip.details.from.arrival,'BNNY',this.tripValidation,'arrivalFrom');
    this.tripValidation=Validation.compareDate(this.trip.deadline,this.trip.details.from.departure,'CDL',this.tripValidation,'deadline');
    this.tripValidation=Validation.compareDate(this.trip.details.from.departure,this.trip.details.from.arrival,'CDOM',this.tripValidation,'arrivalFrom');
    this.tripValidation=Validation.checkObject(this.tripValidation);
    this.trip.associated_agency=Memory.getAgencyId();
    this.trip.currency=Memory.getActiveCurrency()?Memory.getActiveCurrency():'PHP';
    this.trip.originalPriceInfant=this.trip.originalPriceChild;
    if(this.tripValidation.isValid){

      this.trip.details.from.city=this.trip.details.from.city.toLowerCase();
      this.trip.details.to.city=this.trip.details.to.city.toLowerCase();
      if(this.trip.details.roundTrip){
        if(Validation.twoWay(this.trip.details.from.arrival,this.trip.details.to.departure)){
          if (!this.editMode) {
            this.componentService.addComponent(this.trip).subscribe(
        (response:any) => {
                if (response) {
                  Memory.setLoading(false)
                  this.trip=new ComponentObject('AIRPLANE',localStorage.getItem("nj.user_id"),'transport','airplanemode_active');
                  this.maxDate=new Date()
                  const notifyConfig = new NotifyConfig(
                    Notify.Type.SUCCESS,
                    Notify.Placement.BOTTOM_CENTER,
                    Notify.TEMPLATES.Template2,
                    'Component sucessfully added.',
                    ''
                  );
                  Notify.showNotify(notifyConfig);
                }else{
                  Memory.setLoading(false)
                }
              });
          }
          else{
            this.trip.status="DRAFT";
            this.componentService.editComponent(this.trip).subscribe(
        (response:any) => {
                if (response) {
                  Memory.setLoading(false)
                  this.trip=new ComponentObject('AIRPLANE',localStorage.getItem("nj.user_id"),'transport','airplanemode_active');
                  this.maxDate=new Date()
                  const notifyConfig = new NotifyConfig(
                    Notify.Type.SUCCESS,
                    Notify.Placement.BOTTOM_CENTER,
                    Notify.TEMPLATES.Template2,
                    'Component sucessfully updated.',
                    ''
                  );
                  Notify.showNotify(notifyConfig);
                }else{
                  Memory.setLoading(false)
                }
              });
          }
        }
        else{
          Memory.setLoading(false)
          const notifyConfig = new NotifyConfig(
            Notify.Type.WARNING,
            Notify.Placement.TOP_CENTER,
            Notify.TEMPLATES.Template2,
            'From Arrival Date must be before than To Departure Date',
            ''
          );
          Notify.showNotify(notifyConfig);
        }
      }else{
        if (!this.editMode) {
          this.componentService.addComponent(this.trip).subscribe(
        (response:any) => {
              if (response) {
                Memory.setLoading(false)
                const notifyConfig = new NotifyConfig(
                  Notify.Type.SUCCESS,
                  Notify.Placement.BOTTOM_CENTER,
                  Notify.TEMPLATES.Template2,
                  'Component sucessfully added.',
                  ''
                );
                Notify.showNotify(notifyConfig);
              }else{
                Memory.setLoading(false)
              }
            });
        }
        else{
          this.trip.status="DRAFT";
          this.componentService.editComponent(this.trip).subscribe(
        (response:any) => {
              if (response) {
                Memory.setLoading(false)
                const notifyConfig = new NotifyConfig(
                  Notify.Type.SUCCESS,
                  Notify.Placement.BOTTOM_CENTER,
                  Notify.TEMPLATES.Template2,
                  'Component sucessfully updated.',
                  ''
                );
                Notify.showNotify(notifyConfig);
              }else{
                Memory.setLoading(false)
              }
            });
        }
      }
    }else{
      Memory.setLoading(false)
      const notifyConfig = new NotifyConfig(
        Notify.Type.WARNING,
        Notify.Placement.TOP_CENTER,
        Notify.TEMPLATES.Template2,
        'The Form is Not Valid',
        ''
      );
      Notify.showNotify(notifyConfig);
    }

  }

}







