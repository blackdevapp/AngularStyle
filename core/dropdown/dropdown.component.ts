import { Component, OnInit, Input,Output,EventEmitter } from '@angular/core';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css']
})
export class DropdownComponent implements OnInit {
	@Input() dropData;
	@Output() selectedEvent = new EventEmitter<any>()
	storeSelectedData;
  constructor() { }

  ngOnInit() {
    this.storeSelectedData=this.dropData[0];
  	console.log(this.dropData)

  }
  selectedItem(item:string){
  	this.storeSelectedData = item;
  	this.selectedEvent.emit(item)
  }

}
