import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {InqueriesService} from "../../../services/inqueries.service";
import {AuthService} from "../../../services/auth.service";
import {Memory} from "../../../base/memory";
import {AgenciesService} from "../../../services/agencies.service";
import {ComponentService} from "../../../services/component.service";
import * as moment from 'moment';
import {PackageDataService} from "../../../services/dataService/package-data.service";
import {isNullOrUndefined} from "util";

declare var $;

@Component({
  selector: 'app-theme-one-header',
  templateUrl: './theme-one-header.component.html',
  styleUrls: ['./theme-one-header.component.scss']
})
export class ThemeOneHeaderComponent implements OnInit {
  @Input() headerItem;
  @Input() agency;
  @Input() color;
  @Input() border;
  count: any;
  loggedIn: boolean;
  agencyId: string;
  packages: Array<any> = [];
  package: any;
  items: any;
  item: Array<any> = []

  constructor(private router: Router,
              private activeRoute: ActivatedRoute,
              private inqueriesService: InqueriesService,
              private agencyService: AgenciesService,
              private componentService: ComponentService,
              private packageDataService: PackageDataService,
              private auth: AuthService) {
  }

  ngOnInit() {
    this.loggedIn = this.auth.loggedIn;
    if (this.auth.loggedIn) {
      this.inqueriesService.getInqueiesByFilter(`to=${Memory.getAgencyId()}&inquirer=${Memory.getUserIdStorage()}&count=1`).subscribe((res: any) => {
        this.count = res;
      })
    }

    this.activeRoute.params.subscribe(params => {
      if (params['agencyId']) {
        this.agencyId = params['agencyId']
        this.agencyService.getByReferalCode(this.agencyId).subscribe((res: any) => {
          if (res.result) {
            this.agency = res.result;
          }
        })
      }
    });
  }

  goToVisa() {
    this.router.navigateByUrl('/public/1/' + this.agencyId + '/visa')
  }

  goToContact() {
    this.router.navigateByUrl('/public/1/' + this.agencyId + '/contact')
  }

  goToHome() {
    this.router.navigateByUrl('/public/1/' + this.agencyId)
  }

  panel() {
    this.router.navigateByUrl('login')
  }

}
