import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-hotel-management',
  templateUrl: './hotel-management.component.html',
  styleUrls: ['./hotel-management.component.scss']
})
export class HotelManagementComponent implements OnInit {
	scheduler: boolean = true;
  constructor() { }

  ngOnInit() {
  }
  

}
