import { Component, OnInit } from '@angular/core';
import { HotelService} from './../../services/hotel.service';
@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class CardsComponent implements OnInit {
	resources: Array<any> = [];
  	reservations: Array<any> = [];
  constructor(
  	private hotelService:HotelService,
  	) { }

  ngOnInit() {
  	this.getRescources();
  }
  getRescources(){
      this.hotelService.getRooms().subscribe(
        (response:any) => {
            if (response) {
                this.resources = response.map(rooms => (
                  { 
                    id: rooms._id,
                    // title: rooms.details.title
                  }

                ));
                this.getReservations()
              }
            
        });
  }
  getReservations(){
      this.hotelService.reservations().subscribe(
        (response:any) => {
            if (response) {
                this.reservations = this.mapEvents(response)
                // this.init()
              }
            
        });
  }
  mapEvents(event){
    return event.map(reserve => (
                  { 
                    id: reserve._id,
                    title: reserve.details.title,
                    start: reserve.details.start,
                    end: reserve.details.end,
                    resourceId: reserve.details.resourceId,
                  }

                ));
  }

}
