import { Component, OnInit,Inject } from '@angular/core';
declare var moment:any;
// import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/';
import { HotelService} from './../../services/hotel.service';
import { UserService} from './../../services/user.service';
import { User } from '../../shared/models/user.model';

export interface DialogData {
  start: Date, 
  end: Date,
  event: Object, 
  view: Object, 
  resource: any,
  _id: String
}

@Component({
  selector: 'app-checkin',
  templateUrl: './checkin.component.html',
  styleUrls: ['./checkin.component.scss']
})
export class CheckinComponent implements OnInit {
	moment = moment;
	revisedData;
	registrationForm: boolean = false;
	checkInForm: boolean = false;
	step1: boolean = true;
	step2: boolean = false;
	step3: boolean = false;

	step1Completed: boolean = false;
	step2Completed: boolean = false;
	step3Completed: boolean = false;

	search = "";
	results: User;
	currentUser :User;
	addons = [
		{
			name: "Restaurant",
			availability: false,
			icon: "fastfood"
		},
		{
			name: "Laundry",
			availability: false,
			icon: "beenhere"
		},
		{
			name: "House Keeping",
			availability: false,
			icon: "event_seat"
		},
    {
      name: "Transportation",
      availability: false,
      icon: "event_seat"
    }]
  constructor(
    // public dialogRef: MatDialogRef<CheckinComponent>,
    // @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private hotelService:HotelService,
    private userService: UserService
    ) {}

  // onNoClick(): void {
  //   this.dialogRef.close({ data: [this.revisedData] });
  // }
  ngOnInit() {
  	this.revisedData = {
  		type: 'event',
  		user: '2121312',
  		deleted: false,
  		details: {
			// start: moment(this.data.start).format(), 
			// end: moment(this.data.end).format(), 
			// resourceId: this.data.resource.id,
      start: '23',
      end: '23',
      resourceId: 'assd',
			title: 'My Title',
			_id: ""
  		}
  	}
  }
  stepperControl(trigger){
  	this.step1 = trigger;
	this.step2 = trigger;
	this.step3 = trigger;
  }
  insetReservations(){
      this.hotelService.insertReservation(this.revisedData).subscribe(
        (response:any) => {
            if (response) {
            	// this.revisedData.details._id = response._id
                // this.onNoClick();
              }
            
        });
  }
  autoComplete(){
      this.userService.getAutoComplete(this.search).subscribe(
        (response:any) => {
            if (response) {
            	// this.revisedData.details._id = response._id
             //    this.onNoClick();
             	this.results = response;
             	// this.getuserById(response._id)
              }
            
        });
  }
  getRegisteredUser(user){
    console.log('newuser', user)
    this.currentUser = user;
    this.stepperControl(false);
    this.step2 = true;
    this.step1Completed = true;
    this.registrationForm = false;
    this.search = '';
  }
  openForm(name){
    console.log(name)
  }
  getUserById(u){
      this.userService.getUser(u).subscribe(
        (response:any) => {
            if (response) {
            	// this.revisedData.details._id = response._id
             	// this.onNoClick();
             	// this.results = response;
             	this.currentUser = response;
             	console.log(this.currentUser);
             	// console.log(this.data.resource);
             	this.step1Completed = true;
              }
            
        });
  }
  selectedUser(u){
  	this.getUserById(u)
  }
}
