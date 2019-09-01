import {Component, OnInit, ViewChild} from '@angular/core';
import {AgenciesService} from "../../services/agencies.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ComponentService} from "../../services/component.service";
import {FormData} from "../public-one/public-one.component";
import {VisaService} from "../../services/visa.service";
import {NotifyConfig} from "../../base/notify/notify-config";
import {Notify} from "../../base/notify/notify";
import {AuthService} from "../../services/auth.service";
import {User} from "../../shared/models/user.model";
import {UserService} from "../../services/user.service";
import {Visa} from "../public-one/public-one.component";
import {InquiryModel} from "../../shared/models/inquiry.model";
import {Memory} from "../../base/memory";
import {InqueriesService} from "../../services/inqueries.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatStepper} from "@angular/material";
import {PackageService} from "../../services/package.service";
import {AppSettings} from "../../app.setting";

declare var moment;

@Component({
  selector: 'app-visa-process',
  templateUrl: './visa-process.component.html',
  styleUrls: ['./visa-process.component.scss']
})
export class VisaProcessComponent implements OnInit {
  mode: string = 'A';
  visaProcessStep: any = 1;
  agency: any;
  publicId: number;
  cardsData;
  moment = moment;
  packages: Array<any> = [];
  departure: Date = new Date();
  arrival: Date = new Date();
  requirements: String = '';
  loader: boolean = false;
  searchResult;
  email: string;
  password: string;
  confirmPassword: string;
  mobileNo: string;
  user: Visa = new Visa();

  countryName:string;
  visaProcess = {
    passport: 'PHP',
    visa: '',
    passportName: '',
    visaName: '',
  };
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  lastStep: boolean = true;
  @ViewChild('stepper') stepper;
  isEditable = false;
  appSetting=AppSettings;

  constructor(private agencyService: AgenciesService,
              private componentService: ComponentService,
              private visaService: VisaService,
              private userService: UserService,
              private inqueryService: InqueriesService,
              private auth: AuthService,
              private router: Router,
              private packageService: PackageService,
              private route: ActivatedRoute,
              private _formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['agencyId']) {
        this.publicId = params['agencyId'];
        this.agencyService.getByReferalCode(this.publicId).subscribe((res: any) => {
          console.log('agency', res)
          if (res.result) {
            this.agency = res.result;
          }
        })
      }
    });
    this.getComponent();
    this.getPackages();

    this.firstFormGroup = this._formBuilder.group({
      passportOrigin: ['', Validators.required],
      country: ['', Validators.required],
    });
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

  getPackages() {
    this.componentService.getPackagesFilter(`associated_agency=${this.publicId}&status=PUBLISHED`).subscribe(
      (response: Array<any>) => {
        if (response) {
          let self = this;
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
          let tmpPackage = {
            packageData: data,
            componentsData: response
          };

          if (valid && !this.checkExpire(tmpPackage))
            this.packages.push(tmpPackage);
          // this.dateManagerService.arrangeDates()
        }
        console.log('packagesList', this.packages)
      });
  }

  checkExpire(item): boolean {
    let fromDate = moment(new Date());
    let toDate = moment(item.packageData.tripDeadline.date);
    let toTime = item.packageData.tripDeadline.time;
    toTime = toTime.split(':');
    let checkDateTime = true;
    let today = new Date();
    if (toDate.isSame(moment(fromDate))) {
      if (toTime[0] < today.getHours()) {
        checkDateTime = true;
      } else if (toTime[0] === today.getHours() && toTime[1] < today.getMinutes()) {
        checkDateTime = true;
      } else {
        checkDateTime = false;
      }
    }
    if (toDate.isSameOrBefore(fromDate) && checkDateTime) {
      return true;
    } else {
      return false;
    }
  }

  nullForm: boolean = false;
  formData: FormData = new FormData()

  getPassportInfo() {
    let query = `holder=${this.visaProcess.passport}`,
      self = this;
    self.visaService.getPassportInfo(query).subscribe(passport => {
      if (passport) {
        let result = passport[0].data[this.visaProcess.visa];
        if (self.visaService.visa[result]) {
          this.requirements = self.visaService.visa[result];
          this.lastStep= false;
          this.visaProcessStep = 9;
          this.stepper.selectedIndex = 4;

        } else {
          this.requirements = 'visa required';
          this.agencyService.getFormInfo(this.publicId, `${this.visaProcess.passport}-${this.visaProcess.visa}`).subscribe((res: any) => {
            if (res.result.length == 0) {
              this.nullForm = true;
              this.stepper.next();

            } else {
              this.nullForm = false
              this.stepper.next();

              // this.visaProcessStep = 3
            }
            for (let item of res.result) {
              for (let sub of item.list) {
                if (sub.name === `${this.visaProcess.passport}-${this.visaProcess.visa}`) {
                  this.formData.name = sub.name;
                  this.formData.form = sub.form;
                  console.log('data',this.formData)
                }
              }
            }

          });
        }
      }
    });
  }

  // Visa process
  getCountries(input) {
    this.loader = true;
    this.searchResult = []
    this.visaService.autoSuggestionCountries(input).subscribe(
        (response:any) => {
        console.log('c',response)
        this.loader = false;
        // JSON.parse(response)
        if (response) {
          this.searchResult = response;
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

  goToLogin() {
    if (this.checkFormValid()) {
      if (this.auth.loggedIn) {
        this.stepper.selectedIndex = 4;
        // this.visaProcessStep = 5;
      } else {
        this.stepper.selectedIndex = 3;
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


  goToMode(mode) {
    this.mode = mode;
  }


  login() {
    this.auth.login({email: this.email, password: this.password}).subscribe(
      res => {
        // this.visaProcessStep = 5;
        this.stepper.next();

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

  onCheck(event) {
    if (event.target.checked) {
      this.user.policy = true;
    } else {
      this.user.policy = false;
    }
  }

  inquery: InquiryModel = new InquiryModel();

  createInquery() {
    let obj = {
      userId: Memory.getUserIdStorage(),
      agencyId: Memory.getAgencyId(),
      form:this.formData.name
    };
    this.packageService.payVisa(obj).subscribe((res:any)=> {
      if(res.isSuccessful){
        window.location.href=res.result;

        this.inquery.special_inst = JSON.stringify(this.formData);
        this.inquery.inquirer = Memory.getUserIdStorage();
        this.inquery.to = this.publicId.toString();
        this.inquery.status = 'PENDING';
        this.inquery.type = 'VISAPROCESS';
        this.inqueryService.createInquery(this.inquery).subscribe((res1: any) => {

          // window.location.reload();
        })

      }
    })

  }

  backToFirst(){
    this.stepper.selectedIndex = 0;
  }
  headerItem = {
    home: {
      title: "Home",
      description: "",
      link: ""
    }, visa: {
      title: "visa process",
      description: "",
      link: ""
    }, offers: {
      title: "special offers",
      description: "",
      link: ""
    }, contact: {
      title: "contact",
      description: "",
      link: ""
    }
  };

  remove(){
    this.visaProcess.passportName ='';
  }

  remove2(){
    this.visaProcess.visaName ='';
  }
}
