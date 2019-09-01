import {Component, OnInit} from '@angular/core';
import * as Chartist from 'chartist';
import {Memory} from "../../base/memory";
import {UserService} from "../../services/user.service";
import {PackageService} from "../../services/package.service";
// INQUERIES
import {InquiryModel} from '../../shared/models/inquiry.model';
import {InqueriesService} from '../../services/inqueries.service';
import {ComponentService} from '../../services/component.service';
import {Router} from '@angular/router';
import {AccountingService} from '../../services/accounting.service';
import * as moment from 'moment';
import {AppSettings} from "../../app.setting";
import { ContentLoaderModule } from '@netbasal/ngx-content-loader';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  appSetting=AppSettings;
  allInqueries: Array<InquiryModel> = [];
  hasNextPage: boolean = true;
  trips: any = {totalTrips: 0, totalActiveTrips: 0};
  totalSale: number;
  attentionTrip: number = 0;
  page: number = 1;
  limit: number = 5;
  inqueriesLoading: boolean = false;
  labels: Array<string> = [];
  total: Array<number> = [];

  tripNeedAttention: number=0;
  activeTripsLoading:boolean=false;
  memory = Memory;
  math = Math;
preloading: boolean = true;

  constructor(private userService: UserService,
              private router: Router,
              private accSrv: AccountingService,
              private componentService: ComponentService,
              private inqueriesService: InqueriesService,
              private packageService: PackageService
  ) {
  }

  startAnimationForLineChart(chart) {
    let seq: any, delays: any, durations: any;
    seq = 0;
    delays = 80;
    durations = 500;

    chart.on('draw', function (data) {
      if (data.type === 'line' || data.type === 'area') {
        data.element.animate({
          d: {
            begin: 600,
            dur: 700,
            from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
            to: data.path.clone().stringify(),
            easing: Chartist.Svg.Easing.easeOutQuint
          }
        });
      } else if (data.type === 'point') {
        seq++;
        data.element.animate({
          opacity: {
            begin: seq * delays,
            dur: durations,
            from: 0,
            to: 1,
            easing: 'ease'
          }
        });
      }
    });

    seq = 0;
  };

  startAnimationForBarChart(chart) {
    let seq2: any, delays2: any, durations2: any;

    seq2 = 0;
    delays2 = 80;
    durations2 = 500;
    chart.on('draw', function (data) {
      if (data.type === 'bar') {
        seq2++;
        data.element.animate({
          opacity: {
            begin: seq2 * delays2,
            dur: durations2,
            from: 0,
            to: 1,
            easing: 'ease'
          }
        });
      }
    });

    seq2 = 0;
  };

  getDateOfChart() {
    var today = new Date();
    this.labels.push(moment(today).format('MMM_DD'));
    for (let i = 0; i <= 13; i++) {
      var d = moment(new Date(today.getTime() - ((i + 1) * 24 * 60 * 60 * 1000))).format('MMM_DD');
      this.labels.push(d)
    }
    this.labels = this.labels.reverse();
  }


  ngOnInit() {
    let self2 =this;
    setTimeout(function () {
      self2.preloading=false
    },1500)
    this.getInqueries();
    this.collectInfo();
    this.getDateOfChart();
    this.getPackages();
    let sumObj = [];
    var dataDailySalesChart: any;
    this.accSrv.getLasTwoWeekData().subscribe((res: any) => {
      if (res.isSuccessful) {
        for (let item of this.labels) {
          if (res.transactions[item.replace(' ', '_')]) {
            let total = 0;
            if(res.transactions[item]){
              for (let sub of res.transactions[item]) {
                total += sub.credit;
              }
            }else{
              total=0
            }

            this.total.push(total);
          } else {
            this.total.push(0)
          }
        }
        let labels = [];
        for (let item of this.labels) {
          item = item.replace('_', ' ')
          labels.push(item);
        }

        dataDailySalesChart = {
          labels: labels,
          series: [
            this.total
          ]
        };
        const optionsDailySalesChart: any = {
          lineSmooth: Chartist.Interpolation.cardinal({
            tension: 0
          }),
          low: 0,
          high: Math.max(...this.total), // creative tim: we recommend you to set the high sa the biggest value + something for a better look
          chartPadding: {top: 0, right: 0, bottom: 0, left: 0},
        };

        setTimeout(function () {
          var dailySalesChart = new Chartist.Line('#dailySalesChart', dataDailySalesChart, optionsDailySalesChart);

          self2.startAnimationForLineChart(dailySalesChart);
        },1000)
      }
    });
    let members = Memory.getMembers();
    let self = this;
    if (members) {
      members.forEach(function (item) {
        self.userService.addEmployee(item, Memory.getAgencyId()).subscribe(
        (response:any) => {

          });
      })
    }

  }

  collectInfo() {
    this.getActiveTrips();
    this.totalSales();
    this.attentionTrips();
  }

  getActiveTrips() {
    this.packageService.getFilteredPackage(`status=PUBLISHED&count=1&associated_agency=${Memory.getAgencyId()}`).subscribe(
        (response:any) => {
        this.trips.totalActiveTrips = response;
      });
    this.packageService.getFilteredPackage(`count=1&associated_agency=${Memory.getAgencyId()}`).subscribe(
        (response:any) => {
        this.trips.totalTrips = response;
      });
  }

  totalSales() {
    this.accSrv.getFilteredTransactionsTotal(`meta.agency=${Memory.getAgencyId()}`).subscribe((res: any) => {
      if (res.isSuccessful) {
        this.totalSale = res.totalPrice ? res.totalPrice : 0;
      } else {
        this.totalSale = 0;
      }
    })
  }

  attentionTrips() {
    this.packageService.getFilteredPackage(`status=INACTIVE&count=1&associated_agency=${Memory.getAgencyId()}`).subscribe(
        (response:any) => {
        this.attentionTrip = response;
      });
  }

  count = 5;

  // Inqueries Info
  getInqueries() {
    Memory.setLoading(true);
    this.inqueriesLoading = true;
    this.inqueriesService.getLastInqueries(this.count).subscribe((res: any) => {
      if (res.isSuccessful) {
        this.inqueriesLoading = false;
        Memory.setLoading(false);
        this.allInqueries = res.result
      }
    })
  }

  goToTrip(mode?) {
    this.router.navigate(['panel/packages'], {queryParams: {mode: mode}})
  }


  packages: Array<any> = [];

  getPackages() {
    this.packages = [];
    this.componentService.getPackagesFilter(`associated_agency=${Memory.getAgencyId()}`).subscribe(
        (response:any) => {
        if (response) {
          this.tripNeedAttention = 0;
          response.forEach((v, k) => {
            this.getMultipleComponent(v)
          })

        }
      });
  }


  getMultipleComponent(data) {
    this.componentService.getMultipleComponent(data).subscribe(
      (response: any) => {
        let tmpPackage: any;
        var valid: boolean = true;
        Memory.setLoading(false);
        // for (let item of response){
        //   if(item.details.roundTrip===true){
        //     let newComp=Object.assign({},item);
        //     newComp.pair=newComp._id;
        //     newComp.bulkPrice=0;
        //     response.push(newComp);
        //   }
        // }
        if (response) {
          for (let item of response) {
            if (new Date(item.updatedDate).getTime() > new Date(data.updatedDate).getTime()) {
              valid = false;
            }
          }
          if (!valid) {
            this.tripNeedAttention++
          } else {

          }
        }
      }, err => {
        Memory.setLoading(false);
      });
  }

  intToString (value) {
    var suffixes = ["", "k", "m", "b","t"];
    var suffixNum = Math.floor((""+value).length/3);
    var shortValue = parseFloat((suffixNum != 0 ? (value / Math.pow(1000,suffixNum)) : value).toPrecision(2));
    if (shortValue % 1 != 0) {
      var shortNum = shortValue.toFixed(1);
    }
    return shortValue+suffixes[suffixNum];
  }

  config = {
    actions: {
      edit: false,
      delete: false,
      pagination: false,
      select: false,
      action: false
    },
    columns: [
      {
        type: 'string',
        title: 'Inquery',
        field: 'type'
      }, {
        type: 'string',
        title: '',
        field: ''
      }, {
        type: 'string',
        title: '',
        field: ''
      }, {
        type: 'string',
        title: 'Status',
        field: 'status',
        data: ['PENDING', 'APPROVED', 'REJECTED', 'ESCALATED']
      }
    ]
  };

}
