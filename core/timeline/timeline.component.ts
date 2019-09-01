import {Component, Input, OnInit} from '@angular/core';
import * as moment from 'moment';
import {Router} from '@angular/router';
import { PackageService } from '../../services/package.service';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {
  @Input() package:any;
  @Input() mode:string;
  constructor(private packageService:PackageService,
              private router:Router
  ) { }

  ngOnInit() {
  }

  cleanDate(date,component){
    return moment(date).format('DD MMM YYYY') + ` ${component.pair?component.details.to.departure.time:component.details.from.departure.time}`;
  }
  convertAmadeusDate(date){
    let dateOnly=moment(date).format('DD MMM YYYY');
    let time=date.split('T')[1].substring(0,5);
    return `${dateOnly} ${time}`;
  }
  packagePrice(p){
    return this.packageService.priceCalculator(p);
  }

  goToProfile() {
    this.router.navigateByUrl('/public/profile')
  }

}
