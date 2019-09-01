import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  @Input() notify:any;
  @Output() clicked=new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
    if(this.notify.details.details){
      this.notify.details.details=JSON.parse(this.notify.details.details)
    }
  }
  clickItem(item){
    this.clicked.emit(item);
  }

}
