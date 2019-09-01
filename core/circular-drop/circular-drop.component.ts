import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';

@Component({
  selector: 'app-circular-drop',
  templateUrl: './circular-drop.component.html',
  styleUrls: ['./circular-drop.component.scss']
})
export class CircularDropComponent implements OnInit {
	@Input() data;
	@Output() clicked: EventEmitter<any> = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }
  clickedData(e){
  	this.clicked.emit(e)
  }

}
