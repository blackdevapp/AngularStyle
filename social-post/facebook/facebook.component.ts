import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-facebook',
  templateUrl: './facebook.component.html',
  styleUrls: ['./facebook.component.scss']
})
export class FacebookComponent implements OnInit {
  @Input('inp')fbInfo;
  @Output() someEvent = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
    console.log('########################    kkk')
    console.log(this.fbInfo)
  }

  reShare() {
    this.someEvent.next(this.fbInfo);
  }
}
