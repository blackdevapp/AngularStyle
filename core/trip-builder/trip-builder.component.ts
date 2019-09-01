import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DateManagerService} from "../../services/date-manager.service";
import {Memory} from "../../base/memory";
import {AppSettings} from "../../app.setting";
declare var moment;
declare let $:any;
@Component({
  selector: 'app-trip-builder',
  templateUrl: './trip-builder.component.html',
  styleUrls: ['./trip-builder.component.scss']
})
export class TripBuilderComponent implements OnInit {
  moment = moment;
  @Input() tripData: Array<any> = [];
  @Input() range: string;
  @Input() package: any;
  @Output() updated: EventEmitter<any> = new EventEmitter();
  @Output() deleted: EventEmitter<any> = new EventEmitter();

  constructor(public dateService:DateManagerService) {

  }

  ngOnInit() {
    this.tripData=this.dateService.checkAllValidTrip(this.tripData)

  }

  checkPrice(){
    return this.tripData.reduce((a, b) => +a + +b.bulkPrice, 0);
  }
  formatDate(date){
    return moment(date).format('DD MMM YYYY')
  }

  convertAmadeusDate(date){
    let dateOnly=moment(date).format('DD MMM YYYY');
    let time=date.split('T')[1].substring(0,5);
    return `${dateOnly} ${time}`;
  }

  update(){
    this.updated.emit(this.package)
  }

  deletePackage(){
    this.deleted.emit(this.package.packageData);
  }

  goToPublic(){
    window.open(`${AppSettings.PUBLIC_URL}/#/public/${Memory.getAgencyId()}/trip-details/${this.package.packageData._id}`,'_blank')
  }


}
