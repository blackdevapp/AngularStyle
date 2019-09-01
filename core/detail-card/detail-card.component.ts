import { Component, OnInit, Input } from '@angular/core';
import { ComponentService} from '../../services/component.service';
import * as moment from 'moment';

@Component({
  selector: 'app-detail-card',
  templateUrl: './detail-card.component.html',
  styleUrls: ['./detail-card.component.scss']
})
export class DetailCardComponent implements OnInit {
	@Input() trip;
	moment = moment
	typeOfComponents;
  constructor(private componentService:ComponentService) { }

  ngOnInit() {
  	console.log(this.trip)
  	if (!this.trip.details) {
  		this.getComponentDetails(this.trip)
  	}
  	this.typeOfComponents = {
	  		AIRPLANE: {
	  			displayName: "Airplane",
	  			name: "AIRPLANE",
	  			icon: "airplanemode_active"
	  		},
	  		bus: {
	  			displayName: "Bus",
	  			name: "bus",
	  			icon: "directions_bus"
	  		},
	  		"hotel-room": {
	  			displayName: "Hotel/Room",
	  			name: "hotel-room",
	  			icon: "hotel"
	  		}
  		}
  	}
  	ngOnChanges(){
  		console.log('changed')

  	}
  	getComponentDetails(id: string){
  		this.componentService.getFilteredComponent(id).subscribe(
        (response:any) => {
	        if (response) {
	        	this.trip = response;
	        }
	    });
  	}


}
