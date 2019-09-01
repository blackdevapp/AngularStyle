import { Component, OnInit, ViewChild } from '@angular/core';
import { ComponentService } from '../../services/component.service';
import { DateManagerService } from '../../services/date-manager.service';
import * as moment from 'moment';
import { Package } from '../../shared/models/package.model';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { PackageService } from './../../services/package.service';
import { PackageDataService } from '../../services/dataService/package-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AgenciesService } from "../../services/agencies.service";
import { VisaService } from "../../services/visa.service";
import { User } from "../../shared/models/user.model";
import { AuthService } from "../../services/auth.service";
import { UserService } from "../../services/user.service";
import { Memory } from "../../base/memory";
import { InquiryModel } from "../../shared/models/inquiry.model";
import { InqueriesService } from "../../services/inqueries.service";
import { Form } from "../../panel/form-builder/form-builder.component";
import { NotifyConfig } from "../../base/notify/notify-config";
import { Notify } from "../../base/notify/notify";
import {AppSettings} from "../../app.setting";
declare var console;

// import {NgbCarousel,NgbCarouselConfig} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-public-one',
  templateUrl: './public-one.component.html',
  styleUrls: ['./public-one.component.scss']
})
export class PublicOneComponent implements OnInit {
  mode: string = 'A';
  cardsData;
  moment = moment;
  packageBuilder: Array<Package>;
  packages: Array<any> = [];
  console = console;
  packageList: boolean = true;
  departure: Date = new Date();
  arrival: Date = new Date();
  roundTrip: boolean = true;
  filter;
  visaProcessStep: any = 1;
  publicId: number;
  passportFullName: String = '';
  visaFullName: String = '';
  searchResult;
  requirements: String = '';
  visaProcess = {
    passport: '',
    visa: '',
    passportName: '',
    visaName: '',
  };
  loader: boolean = false;


  email: string;
  password: string;
  confirmPassword: string;
  mobileNo: string;
  user: Visa = new Visa();
  // images = [1, 2, 3, 4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19].map(() => `https://picsum.photos/900/500?random&t=${Math.random()}`);
  images = [1, 2, 3, 4].map(() => `https://picsum.photos/900/500?random&t=${Math.random()}`);
  appSetting=AppSettings;
  constructor(private componentService: ComponentService,
    private dateManagerService: DateManagerService,
    private packageService: PackageService,
    private agencyService: AgenciesService,
    private router: Router,
    private inqueryService: InqueriesService,
    private auth: AuthService,
    private userService: UserService,
    private route: ActivatedRoute,
    private visaService: VisaService,
    private packageDataService: PackageDataService) {
  }
  slides = [];
  slideConfig = {
    "slidesToShow": 3,
    "slidesToScroll": 1,
    "dots": true,
    "infinite": true,
    // "autoplay": true,
    "autoplaySpeed": 2500
  };
  mainSlideConfig = {
    "slidesToShow": 1,
    "slidesToScroll": 1,
    "dots": false,
    "infinite": true,
    // "autoplay": true,
    "autoplaySpeed": 2500
  };
  agency: any;
  addons = [{
    name: "Business Class",
    availability: true,
    icon: "airline_seat_legroom_extra"
  },
  {
    name: "Insurance",
    availability: true,
    icon: "beenhere"
  },
  {
    name: "Seat Pick",
    availability: true,
    icon: "event_seat"
  },
  {
    name: "Food",
    availability: true,
    icon: "fastfood"
  }]

  roundTripData = {
    name: "Round Trip", availability: true, icon: "repeat"
  };
  // options = {
  //   layers: [
  //     tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
  //   ],
  //   zoom: 5,
  //   center: latLng(46.879966, -121.726909)
  // };
  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.publicId = params['id'];
        this.agencyService.getByReferalCode(this.publicId).subscribe((res: any) => {
          if (res.result) {
            this.agency = res.result;
          }
        })
      }
    });
    this.getComponent();
    this.getPackages();
    let all = this;
    this.images.forEach(function (v, k) {
      all.slides.push({
        img: v
      })
    })
  }

  getFeatured(filterMethod) {
    // console.log(this.packages)
    return this.packages.filter((el) => { return el.packageData.isFeatured === filterMethod });
  }
  ngOnChanges() {

  }
  addSlide() {
    this.slides.push({ img: "http://placehold.it/350x150/777777" })
  }

  removeSlide() {
    this.slides.length = this.slides.length - 1;
  }

  slickInit(e) {
    console.log('slick initialized');
  }

  breakpoint(e) {
    console.log('breakpoint');
  }

  afterChange(e) {
    console.log('afterChange');
  }

  beforeChange(e) {
    console.log('beforeChange');
  }
  collectDates(date) {
    let query = {
      "details.from.departure.date": { "$gte": this.departure, "$lt": this.arrival },
      "details.roundTrip": this.roundTrip,
    }
    this.getStrongFilterComponent(query)
  }
  getComponent() {
    this.componentService.getFilteredComponent('asPackage=true&').subscribe(
        (response:any) => {
        if (response) {
          this.cardsData = response;
          // this.showNotification('top','center',"success","Component sucessfully added.")
        }
      });
  }

  getStrongFilterComponent(q) {
    this.componentService.getStrongFiltered(q).subscribe(
        (response:any) => {
        if (response) {
          this.cardsData = response;
          // this.showNotification('top','center',"success","Component sucessfully added.")
        }
      });
  }
  managePackages(id) {
    this.packageBuilder.push(id);
    this.packageBuilder = this.packageBuilder.filter(function (elem, index, self) {
      return index === self.indexOf(elem);
    })
    console.log(this.packageBuilder);
  }
  submitPackage() {
    this.componentService.addPackage(this.packageBuilder).subscribe(
        (response:any) => {
        if (response) {
          console.log(response)
          this.packages = [];
          this.getPackages();
        }
      });
  }
  passport(event) {
    this.visaProcess.passportName = event.option.value;
    // console.log(1,this.visaProcess.passportName,this.searchResult);
    for (let item of this.searchResult) {
      if (this.visaProcess.passportName == item.official_name_en) {
        // console.log(2,item['ISO3166-1-Alpha-3']);
        this.visaProcess.passport = item['ISO3166-1-Alpha-3']
      }
    }
  }
  visa(event) {
    this.visaProcess.visaName = event.option.value;
    // console.log(1,this.visaProcess.visaName);
    for (let item of this.searchResult) {
      if (this.visaProcess.visaName == item.official_name_en) {
        // console.log(2,item['ISO3166-1-Alpha-3']);
        this.visaProcess.visa = item['ISO3166-1-Alpha-3']
      }
    }
  }
  packagePrice(p) {
    return this.packageService.priceCalculator(p);
  }
  goToLandingTour(packageOne) {
    console.log('milaaaaaaad',packageOne)
    this.packageDataService.setPackage(packageOne);
    this.router.navigateByUrl(`public/${this.publicId}/landingTour/${packageOne.packageData._id}`)
    // let self = this;
    // setTimeout(function () {
    //   self.packageDataService.getPackage.subscribe((res:any)=>{
    //     console.log(111111,res);
    //     // self.router.navigateByUrl('landingTour')
    //
    //   });
    // },2000)
  }
  getMultipleComponent(data) {
    this.componentService.getMultipleComponent(data).subscribe(
      (response: any) => {
        if (response) {
          var valid: boolean = true;
          let recursive = [];

          for (let item of response) {
            if (new Date(item.updatedDate).getTime() > new Date(data.updatedDate).getTime()) {
              valid = false;
            } else {
              if (item.details.roundTrip) {
                let newComp = Object.assign({}, item);
                // newComp.details.from = item.details.to;
                newComp.pair = newComp._id;
                newComp.bulkPrice = 0;
                recursive.push(newComp);
              }
            }


          }
          for (let item of recursive) {
            response.push(item);
          }
          for(let item of data.externalResources){
            response.push(item);
          }
          let tmpPackage = {
            packageData: data,
            componentsData: response
          };
          
          if (valid &&!this.checkExpire(tmpPackage))
            this.packages.push(tmpPackage);
          // this.dateManagerService.arrangeDates()
        }
        console.log('packagesList',this.packages)
      });
  }
  cleanDate(date, component) {
    return moment(date).format('DD MMM YYYY') + ` ${component.pair ? component.details.to.departure.time : component.details.from.departure.time}`;
  }
  convertAmadeusDate(date){
    let dateOnly=moment(date).format('DD MMM YYYY');
    let time=date.split('T')[1].substring(0,5);
    return `${dateOnly} ${time}`;
  }
  getPackages() {

    this.componentService.getPackagesFilter(`associated_agency=${this.publicId}&status=PUBLISHED`).subscribe(
      (response: Array<any>) => {
        if (response) {
          let self=this;
          response.forEach((v, k) => {
            // if(v.status==='PUBLISHED'){
            this.getMultipleComponent(v)

            // }
            // v['img'] = `https://picsum.photos/900/500?random&t=${Math.random()}`;
            // console.log(v)
          })

        }
      });
  }
  deletePackage(packages) {
    packages.deleted = true;
    this.componentService.deletePackage(packages).subscribe(
        (response:any) => {
        // JSON.parse(response)
        if (response) {
          this.packages = [];
          this.getPackages();
        }
      });
  }
  // Visa process
  getCountries(input) {
    this.loader = true;
    this.searchResult = []
    this.visaService.autoSuggestionCountries(input).subscribe(
        (response:any) => {
        this.loader = false;
        // JSON.parse(response)
        if (response) {
          this.searchResult = response;
        }
      });
  }

  checkExpire(item):boolean{
    let fromDate = moment(new Date())
      let toDate = moment(item.packageData.tripDeadline.date)
      let toTime = item.packageData.tripDeadline.time;
      toTime = toTime.split(':')
      let checkDateTime = true;
      let today=new Date();
      if (toDate.isSame(moment(fromDate))) {
        if(toTime[0]<today.getHours()){
          checkDateTime=true;
        }else if(toTime[0]===today.getHours() && toTime[1]<today.getMinutes()){
          checkDateTime=true;
        }else{
          checkDateTime=false;
        }
      }
      if (toDate.isSameOrBefore(fromDate) && checkDateTime) {
        return true;
      }else{
        return false;
      }
  }



  nullForm:boolean=false;
  formData: FormData = new FormData()
  getPassportInfo() {
    let query = `holder=${this.visaProcess.passport}`,
      self = this;
      self.visaService.getPassportInfo(query).subscribe(passport => {
        if (passport) {
          let result = passport[0].data[this.visaProcess.visa];
          if (self.visaService.visa[result]) {
            this.requirements = self.visaService.visa[result];
            this.visaProcessStep = 9
          } else {
            this.requirements = 'visa required';
            this.agencyService.getFormInfo(this.publicId, `${this.visaProcess.passport}-${this.visaProcess.visa}`).subscribe((res: any) => {
              if(res.result.length==0){
                this.nullForm=true
                this.visaProcessStep = 3
              }else{
                this.nullForm=false
                this.visaProcessStep = 3
              }
              for (let item of res.result) {
                for (let sub of item.list) {
                  if (sub.name === `${this.visaProcess.passport}-${this.visaProcess.visa}`) {
                    this.formData.name = sub.name;
                    this.formData.form = sub.form;
                  }
                }
              }
              
            });
          }
        }
      });
  }

  goToMode(mode) {
    this.mode = mode;
  }


  login() {
    this.auth.login({ email: this.email, password: this.password }).subscribe(
      res => {
        this.visaProcessStep = 5;
      }
    );
  }
  signup() {
    let user: User = new User();
    user.email = this.email;
    user.password = this.password;
    user.mobileNo = this.mobileNo;
    user.associated_agency = this.publicId.toString();
    this.userService.register(user, '').subscribe(res => {
      this.login();
    });
  }
  goToLogin() {
    if (this.checkFormValid()) {
      if (this.auth.loggedIn) {
        this.visaProcessStep = 5;
      } else {
        this.visaProcessStep = 4;
      }
    } else {
      const notifyConfig = new NotifyConfig(
        Notify.Type.WARNING,
        Notify.Placement.TOP_CENTER,
        Notify.TEMPLATES.Template2,
        'The Form is Not Valid',
        ''
      );
      Notify.showNotify(notifyConfig);
    }

  }
  checkFormValid() {
    for (let item of this.formData.form.items) {
      if (item.type == 'Checkbox') {
        if (!(item.value.length >= 1)) {
          return false
        }
      } else if (item.type == 'Radio') {
        if (!(item.value)) {
          return false
        }
      } else if (item.type == 'Attachment') {
        if (!(item.value.length >= 1)) {
          return false
        }
      } else if (item.type == 'Input') {
        if (!(item.value)) {
          return false
        }
      } else if (item.type == 'DatePicker') {
        if (!(item.value)) {
        
          return false
        }
      }
    }
    return true;
  }
  inquery: InquiryModel = new InquiryModel();
  createInquery() {
    this.inquery.special_inst = JSON.stringify(this.formData);
    this.inquery.inquirer = Memory.getUserIdStorage();
    this.inquery.to = this.publicId.toString();
    this.inquery.status = 'PENDING';
    this.inquery.type = 'VISAPROCESS';
    this.inqueryService.createInquery(this.inquery).subscribe((res: any) => {
      this.router.navigateByUrl('panel/inqueries');
      // window.location.reload();
    })
  }


  onCheck(event) {
    if (event.target.checked) {
      this.user.policy = true;
    } else {
      this.user.policy = false;
    }
  }


  images1: Array<any> = [];

  uploadFinished(event, item) {
    // TODO

    if (!item.value) {
      item.value = []
    }
    console.log(event)
    // let newImage = JSON.parse(event.serverResponse.response._body).result.path;
    let newImage = JSON.parse(event.serverResponse.response._body).result.path;
    //     // newImageObj = {url: newImage}
    item.value.push(newImage);
    this.images1.push(newImage);
    // console.log(this.images);
    console.log(this.images1)
    // this.tripData[0].images = this.images;
  }
  onRemoved(event, item) {
    let toRemoveImage = JSON.parse(event.serverResponse.response._body).result.path,
      index = item.value.indexOf(toRemoveImage);

    item.value.splice(index, 1);
    this.images1.splice(index, 1)
    // this.tripData[0].images
  }
  changeCheckbox(event, item) {
    if (!item.value) {
      item.value = []
    }
    if (event.target.checked) {
      item.value.push(event.target.value);
    } else {
      item.value.splice(item.value.indexOf(event.target.value), 1);
    }
  }
  changeRadio(event, item) {
    item.value = event.target.value;
  }

}
export class Visa {
  firstName: string;
  lastName: string;
  origin: string;
  purpose: string;
  trip: Date;
  expiry: Date;
  policy: boolean;
  serial: string;

}
export class FormData {
  form: Form = new Form();
  name: string;
}
