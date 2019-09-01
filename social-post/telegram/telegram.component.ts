import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-telegramPost',
  templateUrl: './telegram.component.html',
  styleUrls: ['./telegram.component.scss']
})
export class TelegramComponent implements OnInit {
  @Input('inp')telInfo;
  @Output() someEvent = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
  }

  reShare() {
    this.someEvent.next(this.telInfo);
  }
}
