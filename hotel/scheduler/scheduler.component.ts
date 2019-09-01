import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
declare var moment:any;
import * as $ from 'jquery';
// import 'fullcalendar';
// import 'fullcalendar-scheduler';
import { HotelService} from './../../services/hotel.service';
import { CheckinComponent } from '../checkin/checkin.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/';


@Component({
    selector: 'app-scheduler',
    styleUrls: ['scheduler.component.scss'],
    templateUrl: 'scheduler.component.html'
})

export class SchedulerComponent implements OnInit {
  checkIn = {
    startDate: "",
    endDate: ""
  }
  resources: Array<any> = [];
  reservations: Array<any> = [];
  constructor(
      private hotelService:HotelService,
      public dialog: MatDialog,
      public router: Router,
    ) { }

  ngOnInit() {
        this.getRescources();
      // });
  }
  openDialog(startDate, endDate, jsEvent, view, resource): void {
    // const dialogRef = this.dialog.open(CheckinComponent, {
    //   height: '400px',
    //   width: '900px',
    //   data: {start: startDate, end: endDate, event: jsEvent, view: view, resource: resource}
    // });


    // dialogRef.afterClosed().subscribe(result => {
    //   // console.log('The dialog was closed');
    //   // console.log(result);
    //   let newEvent = this.mapEvents(result.data)[0];
    //       newEvent.id = result.data[0].details._id;
    //   // this.reservations.push(newEvent);
    //   let containerEl: JQuery = $('#calendar');

    //     containerEl.fullCalendar('addEventSource', [newEvent]);

    //   // this.getReservations()
    // });
    this.router.navigate(['/hotel/checkin']);

  }
  init(){
    // let fns = this;
        // let containerEl: JQuery = $('#calendar');

        // containerEl.fullCalendar({
        //   now: moment().format("YYYY-MM-DD"),
        //
        //   editable: true,
        //   selectable: true,
        //   aspectRatio: 1.8,
        //   scrollTime: '00:00',
        //   header: {
        //     left: 'today prev,next',
        //     center: 'title',
        //     right: 'timelineDay,timelineThreeDays,timelineSevenDays'
        //   },
        //   defaultView: 'timelineDay',
        //   views: {
        //     timelineThreeDays: {
        //       type: 'timeline',
        //       duration: { days: 3 }
        //     },
        //     timelineSevenDays: {
        //       type: 'timeline',
        //       duration: { days: 7 }
        //     }
        //   },
        //       resourceColumns: [
        //     {
        //       labelText: 'Room',
        //       field: 'title'
        //     },
        //     {
        //       labelText: 'Occupancy',
        //       field: 'occupancy'
        //     }
        //   ],
        //   resources: this.resources,
        //
        //   // [
        //   //   { id: 'a', title: 'Room1', },
        //   //   { id: 'b', title: 'Auditorium B', eventColor: 'green' },
        //   //   { id: 'c', title: 'Auditorium C', eventColor: 'orange' },
        //   //   { id: 'd', title: 'Auditorium D', children: [
        //   //     { id: 'd1', title: 'Room D1' },
        //   //     { id: 'd2', title: 'Room D2' }
        //   //   ] },
        //   //   { id: 'e', title: 'Auditorium E' },
        //   // ],
        //   events: this.reservations,
        //   // [
        //   //   { id: '1', resourceId: 'b', start: '2018-02-07T02:00:00', end: '2018-02-07T07:00:00', title: 'event 1' },
        //   //   { id: '2', resourceId: 'c', start: '2018-02-07T05:00:00', end: '2018-02-07T22:00:00', title: 'event 2' },
        //   //   { id: '3', resourceId: 'd', start: '2018-02-06', end: '2018-02-08', title: 'event 3' },
        //   //   { id: '4', resourceId: 'e', start: '2018-02-07T03:00:00', end: '2018-02-07T08:00:00', title: 'event 4' },
        //   //   { id: '5', resourceId: 'f', start: '2018-02-07T00:30:00', end: '2018-02-07T02:30:00', title: 'event 5' }
        //   // ],
        //   select: function(startDate, endDate, jsEvent, view, resource) {
        //     // alert('selected ' + startDate.format() + ' to ' + endDate.format() + ' on resource ' + resource.id);
        //     // fns.selectedData(startDate, endDate, jsEvent, view, resource);
        //     // let modal: JQuery = $('#exampleModal');
        //     //     modal.modal('show')
        //     // console.log(startDate, endDate, jsEvent, view, resource)
        //     fns.openDialog(startDate, endDate, jsEvent, view, resource)
        //   },
        //   eventRender: function(event, element) {
        //
        //
        //     // fns.fetchDetails(event, element);
        //
        //     let html = `<div class="contains">
        //                   <i class="material-icons">fastfood</i>
        //                   <i class="material-icons disabled">hotel</i>
        //                   <i class="material-icons">3d_rotation</i>
        //                 </div>
        //                 `;
        //         element.find('.fc-title').html(html);
        //         // element.find('.fc-event-title').html(html);
        //   }
        // });
  }
  selectedData(startDate, endDate, jsEvent, view, resource){
    // console.log(startDate, endDate, jsEvent, view, resource);

    // let convertDate = function(d){
    //    return moment(d).format('DD MMM YYYY');
    // }
    // this.checkIn.startDate = convertDate(startDate);
    // this.checkIn.endDate = convertDate(endDate);

    // console.log(startDate, endDate, jsEvent, view, resource);
    // console.log(this.checkIn)


  }
  fetchDetails(event,element){

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
                this.init()
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

  // clickButton(model: any) {
  //   this.displayEvent = model;
  // }
  // eventClick(model: any) {
  //   model = {
  //     event: {
  //       id: model.event.id,
  //       start: model.event.start,
  //       end: model.event.end,
  //       title: model.event.title,
  //       allDay: model.event.allDay
  //       // other params
  //     },
  //     duration: {}
  //   }
  //   this.displayEvent = model;
  // }
  // updateEvent(model: any) {
  //   model = {
  //     event: {
  //       id: model.event.id,
  //       start: model.event.start,
  //       end: model.event.end,
  //       title: model.event.title
  //       // other params
  //     },
  //     duration: {
  //       _data: model.duration._data
  //     }
  //   }
  //   this.displayEvent = model;
  // }
}
