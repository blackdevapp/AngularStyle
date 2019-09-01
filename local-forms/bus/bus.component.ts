import { Component, OnInit,Input } from '@angular/core';
import { ComponentService} from '../../services/component.service';
import * as moment from 'moment';
declare var $: any;

@Component({
  selector: 'app-bus',
  templateUrl: './bus.component.html',
  styleUrls: ['./bus.component.scss']
})
export class BusComponent implements OnInit {

  @Input() contentData;
	moment = moment;
	endDate;
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
	editMode: boolean = false;
	init = {
		type: "bus",
		company: "Airasia",
		user: localStorage.getItem("nj.user_id"),
		soloPrice: 10,
		bulkPrice: 10,
		asSolo: false,
		asPackage: true ,
		mode: 'transport',
		icon: 'directions_bus',
		deadline: {
			date: new Date(),
			time: "00:00"
		},
		details: {
			roundTrip: true,
			addons:[
				{
					name: "Business Class",
					availability: true,
					icon: "airline_seat_legroom_extra"
				},
				{
					name: "Insurance",
					availability: true,
					icon: "beenhere"
				},
				{
					name: "Seat Pick",
					availability: true,
					icon: "event_seat"
				},
				{
					name: "Food",
					availability: true,
					icon: "fastfood"
				}],
			from: {
				city: "Manila",
				airport: "NINOYAIRPORT",
				departure: {
					date: new Date(),
					time: "00:00"
				},
				arrival: {
					date: new Date(),
					time: "00:00"
				},
				class: "ECONOMY"
			},
			to: {
				city: "Boracay",
				airport: "PLWNAIRPORT",
				departure: {
					date: new Date(),
					time: "00:00"
				},
				arrival: {
					date: new Date(),
					time: "00:00"
				},
				class: "ECONOMY"
			}
		},
	}
  constructor(private componentService:ComponentService) { }

  ngOnInit() {
  	if (this.contentData &&  (this.contentData.type === this.init.type)) {
  		this.trip = this.contentData;
  		this.editMode = true;
  	}else{
  		this.trip = this.init;
  		this.editMode = false;
  	}
  }
  getSelected(event: any){
  	console.log(event)
  }
  submitComponent(){
  	if (!this.editMode) {
  		// code...
  	this.componentService.addComponent(this.trip).subscribe(
        (response:any) => {
	        if (response) {
	        	console.log(response)
	        	this.showNotification('top','center',"success","Component sucessfully added.")
	        }
	    });
  	}else{
  		this.componentService.editComponent(this.trip).subscribe(
        (response:any) => {
	        if (response) {
	        	console.log(response)
	        	this.showNotification('top','center',"success","Component sucessfully updated.")
	        }
	    });
  	}
  }
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

}
