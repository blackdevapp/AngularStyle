import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-linkdin',
  templateUrl: './linkdin.component.html',
  styleUrls: ['./linkdin.component.scss']
})
export class LinkdinComponent implements OnInit {
  @Input('inp')linkdinInfo;
  @Output() someEvent = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
  }
  reShare() {
    this.someEvent.next(this.linkdinInfo);
  }
}
