import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';

@Component({
  selector: 'app-addons',
  templateUrl: './addons.component.html',
  styleUrls: ['./addons.component.scss']
})
export class AddonsComponent implements OnInit {
	@Input() addon;
	@Output() isChecked: EventEmitter<any> = new EventEmitter();
  	checked: boolean;

  constructor() { }

  ngOnInit() {
  	console.log(this.addon)
  }
  returnData(checked:boolean){
  	this.isChecked.emit(checked);
  }

}
