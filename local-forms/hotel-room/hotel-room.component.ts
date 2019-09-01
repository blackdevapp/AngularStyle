import { Component, OnInit,Input,ViewChild } from '@angular/core';
import { ComponentService} from '../../services/component.service';
import { AmazingTimePickerService } from 'amazing-time-picker';
import * as moment from 'moment';
import {ValidationModel} from '../../base/validationModel';
import {Validation} from '../../base/validation';
import {DateManagerService} from '../../services/date-manager.service';
import {UploadService} from "../../services/upload.service";
import {NotifyConfig} from '../../base/notify/notify-config';
import {Notify} from '../../base/notify/notify';
import {DatePipe} from '@angular/common';
import {Memory} from "../../base/memory";
import {Router} from "@angular/router";
import {AppSettings} from "../../app.setting";
import { ComponentObject } from '../../shared/models/component-object.model';
declare var $: any;

@Component({
  selector: 'app-hotel-room',
  templateUrl: './hotel-room.component.html',
  styleUrls: ['./hotel-room.component.scss']
})
export class HotelRoomComponent implements OnInit {
  tripValidationIntial:Array<any>;
  tripValidation:ValidationModel;

	@Input() airlines:Array<any>;
	@Input() contentData;
	@Input() componentName;
  @Input() editMode: boolean;

  @ViewChild('slickModal') slickModal;
  @ViewChild('slickModal1') slickModal1;

  mainSlideConfig = {
      "slidesToShow": 1,
      "slidesToScroll": 1,
      "dots": false,
      "infinite": true,
      "autoplay": false,
      "autoplaySpeed": 2500
  };
  coverState: boolean = false;
  card = {
    cover: []
  };

  moment = moment;
  memory = Memory;
	selectedTime;
  endDate;
  today=new Date();
  // images1: Array<any> = [];
  appSetting = AppSettings;
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
	];
	trip;
  init:ComponentObject =new ComponentObject('hotel-room',localStorage.getItem("nj.user_id"),'accomodation','hotel')
  // {
	// 	type: "hotel-room",
	// 	company: "Airasia",
	// 	user: localStorage.getItem("nj.user_id"),
  //   soloPrice: 10,
  //   soloPriceChild: 10,
  //   bulkPrice: 10,
  //   quantity:10,
  //   tax:10,
  //   bulkPriceChild: 10,
	// 	asSolo: false,
	// 	asPackage: true ,
	// 	mode: 'accomodation',
	// 	icon: 'hotel',
	// 	deadline: {
	// 		date: new Date(),
	// 		time: "00:00"
	// 	},
	// 	details: {
	// 		roundTrip: false,
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

  constructor(private componentService:ComponentService,private router:Router,
              private atp: AmazingTimePickerService,public datepipe: DatePipe,
              private dateService:DateManagerService,
              private uploadService: UploadService) {
    this.tripValidationIntial=[
      {field:'company',toBe:['cs-46']},
      {field:'city',toBe:['cs-85']},
      {field:'address',toBe:['cso-85']},
        {field:'originalPriceAdult',toBe:['cn-10']},
        {field:'originalPriceChild',toBe:['cn-10']},
      {field:'soloPrice',toBe:['compare-gtt-bulkPrice']},
      {field:'bulkPrice',toBe:['compare-ltt-soloPrice']},
      {field:'soloPriceChild',toBe:['compare-gtt-bulkPriceChild']},
      {field:'bulkPriceChild',toBe:['compare-ltt-soloPriceChild']},
      {field:'tax',toBe:['cn-2']},
      {field:'quantity',toBe:['cn-7']},
      {field:'checkIn',toBe:['date']},
      {field:'checkOut',toBe:['date']},
      {field:'deadline',toBe:['date']},
    ];
    this.tripValidation=Validation.intialObject(this.tripValidationIntial);
  }
  cancel(){
	  this.router.navigateByUrl('/panel/packages')
  }
  changeMaxDate(){
    this.maxDate=new Date(this.trip.details.from.departure.date.getFullYear(),this.trip.details.from.departure.date.getMonth(),this.trip.details.from.departure.date.getDate())
    this.trip.deadline.date=new Date(this.trip.details.from.departure.date.getFullYear(),this.trip.details.from.departure.date.getMonth(),this.trip.details.from.departure.date.getDate()-1)
  }

  openMap() {
    $('#map2').modal()
  }
  ngOnInit() {
  	if (this.contentData &&  (this.contentData.type === this.init.type)) {
  		this.trip = this.contentData;
      this.tripValidation.fields.company.originalValue=this.trip.company;
      this.tripValidation.fields.soloPrice.originalValue=this.trip.soloPrice;
      this.tripValidation.fields.bulkPrice.originalValue=this.trip.bulkPrice;
      this.tripValidation.fields.bulkPriceChild.originalValue=this.trip.bulkPriceChild;
      this.tripValidation.fields.soloPriceChild.originalValue=this.trip.soloPriceChild;

        this.tripValidation.fields.originalPriceAdult.originalValue=this.trip.originalPriceAdult;
        this.tripValidation.fields.originalPriceChild.originalValue=this.trip.originalPriceChild;
      this.tripValidation.fields.tax.originalValue=this.trip.tax;
      this.tripValidation.fields.quantity.originalValue=this.trip.quantity;
      this.tripValidation.fields.address.originalValue=this.trip.details.address;
      this.tripValidation.fields.city.originalValue=this.trip.details.to.city;
  		this.editMode = true;
  	}else{
      this.init.details.roundTrip=false;
  		this.trip = this.init;
      this.trip.details.addons=[
        {
          name: "Free wifi",
          availability: true,
          icon: "airline_seat_legroom_extra",
          type:'mat'
        },
        {
          name: "Breakfast",
          availability: true,
          icon: "beenhere",
          type:'mat'
        },
        {
          name: "Air conditioning",
          availability: true,
          icon: "event_seat",
          type:'mat'
        },
        {
          name: "Airport transfer",
          availability: true,
          icon: "fastfood",
          type:'mat'
        }]
  		this.editMode = false;
      this.tripValidation.fields.bulkPriceChild.originalValue=this.init.bulkPriceChild;
      this.tripValidation.fields.soloPriceChild.originalValue=this.init.soloPriceChild;
      this.tripValidation.fields.tax.originalValue=this.init.tax;
      this.tripValidation.fields.quantity.originalValue=this.init.quantity;
      this.tripValidation.fields.company.originalValue=this.init.company;

        this.tripValidation.fields.originalPriceAdult.originalValue=this.init.originalPriceAdult;
        this.tripValidation.fields.originalPriceChild.originalValue=this.init.originalPriceChild;

      this.tripValidation.fields.soloPrice.originalValue=this.init.soloPrice;
      this.tripValidation.fields.bulkPrice.originalValue=this.init.bulkPrice;
      this.tripValidation.fields.address1.originalValue=this.init.details.from.city;
      this.tripValidation.fields.address2.originalValue=this.init.details.to.city;
  	}

  }
  submitComponent(){
    this.trip.componentName=this.componentName;
    Memory.setLoading(true);
      setTimeout(function(){
          Memory.setLoading(false)
      },5000)
	  this.tripValidation=Validation.checkDate(this.trip.details.from.departure,'BNNY',this.tripValidation,'checkIn');
    this.tripValidation=Validation.compareDate(this.trip.deadline,this.trip.details.from.departure,'CDL',this.tripValidation,'deadline');
	  this.tripValidation=Validation.checkDate(this.trip.details.from.arrival,'BNNY',this.tripValidation,'checkOut');
	  this.tripValidation=Validation.compareDate(this.trip.details.from.departure,this.trip.details.from.arrival,'CDOM',this.tripValidation,'checkOut');
    this.tripValidation=Validation.checkObject(this.tripValidation);
    this.trip.associated_agency=Memory.getAgencyId();
    this.trip.currency=Memory.getActiveCurrency()?Memory.getActiveCurrency():'PHP';
      this.trip.originalPriceInfant=this.trip.originalPriceChild;

      if(this.tripValidation.isValid){
      // this.trip.details.from.city=this.trip.details.from.city.toLowerCase();
      this.trip.details.to.city=this.trip.details.to.city.toLowerCase();
      if (!this.editMode) {
        // code...
        this.componentService.addComponent(this.trip).subscribe(
        (response:any) => {
            if (response) {
              Memory.setLoading(false);
              this.trip=new ComponentObject('hotel-room',localStorage.getItem("nj.user_id"),'accomodation','hotel') 
              this.maxDate=new Date();
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
      }else{
        this.trip.status="DRAFT";
        this.componentService.editComponent(this.trip).subscribe(
        (response:any) => {
            if (response) {
              this.trip=new ComponentObject('hotel-room',localStorage.getItem("nj.user_id"),'accomodation','hotel') 
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
    fromResult:Array<any>=[];
    toResult:Array<any>=[];

    getCitiesFrom(city){
        this.componentService.autoSuggestionAirport(city,false).subscribe((res:any)=>{
            if(res.isSuccessful) {
                    this.fromResult=res.result;

            }
        })
    }
    // selectCityFrom(){
    //     for(let item of this.fromResult){
    //         if(item.CityName===this.trip.details.to.airport){
    //             this.trip.details.to.city=item.CityName
    //         }
    //     }
    // }
  showNotification(from, align, t, message){
      const type = ['','info','success','warning','danger'];

      const color = Math.floor((Math.random() * 4) + 1);

      $.notify({
          icon: "notifications",
          message: message

      },{
          type: t[color],
          timer: 4000,
          placement: {
              from: from,
              align: align
          }
      });
  }
  uploadFinished(event) {
      // TODO

      if (!this.trip.images) {
          this.trip.images = []
      }
      if(!event.serverResponse.response.body){

        event.serverResponse.response['body'] = JSON.parse(event.serverResponse.response._body)

      }
      let newImage = event.serverResponse.response.body.result.path;
      this.trip.images.push(newImage);
  }

  onRemoved(event) {
      let toRemoveImage = event.serverResponse.response.body.result.path,
          index = this.trip.images.indexOf(toRemoveImage);

      this.trip.images.splice(index, 1);
      // this.images1.splice(index, 1);
  }
  startCoverUpload(){
      $('.cover-image label.img-ul-upload input[multiple]').trigger('click')
  }

}
