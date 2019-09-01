import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-twitter',
  templateUrl: './twitter.component.html',
  styleUrls: ['./twitter.component.scss']
})
export class TwitterComponent implements OnInit {
  @Input('inp')twitterInfo;
  @Output() someEvent = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
    console.table(this.twitterInfo)
  }
  reShare() {
    this.someEvent.next(this.twitterInfo);
  }
}
