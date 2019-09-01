import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-event-drag',
  templateUrl: './event-drag.component.html',
  styleUrls: ['./event-drag.component.scss']
})
export class EventDragComponent implements OnInit {
  @Input() event:any
  constructor() { }

  ngOnInit() {
  }

}
