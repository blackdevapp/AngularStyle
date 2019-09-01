import {Component, Input, OnInit,ViewChild } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ComponentService} from "../../services/component.service";
import {PackageService} from "../../services/package.service";
import {AgenciesService} from "../../services/agencies.service";
import {Memory} from "../../base/memory";
import {CustomModel} from "../../shared/models/custom.model";
import {AuthService} from "../../services/auth.service";
import {NotifyConfig} from "../../base/notify/notify-config";
import {Notify} from "../../base/notify/notify";
import {InquiryModel} from "../../shared/models/inquiry.model";
import {InqueriesService} from "../../services/inqueries.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatStepper} from "@angular/material";

declare var moment;

@Component({
  selector: 'app-theme-one',
  templateUrl: './theme-one.component.html',
  styleUrls: ['./theme-one.component.scss']
})
export class ThemeOneComponent implements OnInit {
  images = [1, 2].map(() => `https://picsum.photos/900/500?random&t=${Math.random()}`);
  images2 = [1, 2, 3, 4, 5, 6, 7, 8].map(() => `https://picsum.photos/900/500?random&t=${Math.random()}`);
  images3 = [1].map(() => `https://picsum.photos/900/500?random&t=${Math.random()}`);
  slides = [];
  slides2 = [];
  slides3 = [];
  today = new Date();
  date: any = moment(new Date()).format('DD MMM');
  slideConfig = {
    "slidesToShow": 1,
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
  mainSlideConfig2 = {
    "slidesToShow": 4,
    "slidesToScroll": 4,
    "dots": false,
    "infinite": true,
    // "autoplay": true,
    "autoplaySpeed": 2500
  };
  agencyId: string;
  agency: any;
  packages: Array<any> = [];
  lightPackages: Array<any> = [];
  packagesFeature: Array<any> = [];
  bestSellerPackage: Array<any> = [];
  allPackage: Array<any> = [];
  items: Array<any> = []
  item: any;
  trip: CustomModel = new CustomModel();
  mode = '';
  loginMode='';
  // firstStep: boolean = true;
  secondStep: boolean = false;
  thirdStep: boolean = false;
  result:Boolean;
  result2:Boolean;
  email:string;
  password:string;
  confirmPassword:string;
  publicId:string;
  tourId:string;
  inquery:InquiryModel=new InquiryModel();
  package:any;
  departure:Date;
  firstStep: FormGroup;
  @Input() tripData: Array<any> = [];
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  isOptional = false;
  memory=Memory;
  @ViewChild('stepper') stepper;

  changeStep(index: number) {
    this.stepper.selectedIndex = 0;
  }
  constructor(private activeRoute: ActivatedRoute,
              private auth: AuthService,
              private router:Router,
              private componentService: ComponentService,
              private packageService: PackageService,
              private inqueryService:InqueriesService,
              private agencyService: AgenciesService,
              private _formBuilder: FormBuilder,
              private fbStepper: FormBuilder) {
    this.firstStep= fbStepper.group({
      adult: new FormControl(null, [Validators.required]),
      child: new FormControl(null, [Validators.required]),
      infant: new FormControl(null, [Validators.required]),
    })
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


  ngOnInit() {
    this.mode = 'firstStep';
    this.loginMode='A'
    this.activeRoute.params.subscribe(params => {
      if (params['agencyId']) {
        this.agencyId = params['agencyId']
        this.getPackage()
        this.agencyService.getByReferalCode(this.agencyId).subscribe((res: any) => {
          if (res.result) {
            this.agency = res.result;
          }
        })
        this.componentService.getTopPackage(this.agencyId).subscribe((res: any) => {
          if (res.isSuccessful) {
            res.results.forEach((v, k) => {
              this.getMultipleComponent1(v)
            })
            // this.bestSellerPackage=res.results;
          }
        });
      }
      if(params['token']){
        if(this.auth.loginWithToken(params['token'])){
          if(this.auth.loggedIn){
            this.loginMode='B';
          }
        }
      }else{
        if(this.auth.loggedIn){
          this.loginMode='B';
        }
      }
    });



    // this.date =; moment(this.date).format('DD MMM')
    console.log(this.date);
    let all = this;
    this.images.forEach(function (v, k) {
      all.slides.push({
        img: v
      })
    })

    let all2 = this;
    this.images2.forEach(function (v, k) {
      all2.slides2.push({
        img: v
      })
    })

    let all3 = this;
    this.images3.forEach(function (v, k) {
      all3.slides3.push({
        img: v
      })
    })
    this.trip.adultCount=1;
    this.trip.childCount=0;
    this.trip.infantCount=0;

    this.firstFormGroup = this._formBuilder.group({
      // firstCtrl: ['', Validators.required],
      adult: ['', Validators.required],
      child: ['', Validators.required],
      infant: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ''
    });
  }

  checkSoloPrice() {
    return this.item.componentsData.reduce((a, b) => +a + +b.soloPrice, 0);
  }

  checkSoloChildPrice() {
    return this.item.componentsData.reduce((a, b) => +a + +b.soloPriceChild, 0);
  }
  login() {
    console.log(this.email,this.password)
    this.auth.login({email:this.email,password:this.password}).subscribe(
      res => {
        this.stepper.next();
        // this.goToMode('thirdStep');
      }
    );
  }

  backToPre(){
    if(Memory.getUserIdStorage()){
      this.stepper.previous();
      this.loginMode='B';
    }
  }
  logout(){
    this.auth.logout1();
    this.loginMode='A';
  }
  signup() {

    // this.loginMode='B'
    this.router.navigate(['/auth/signup'],{queryParams:{returnUrl:`public/${this.publicId}/landingTour/${this.tourId}/booking`}})
    // let user:User=new User();
    // user.email=this.email;
    // user.password=this.password;
    // user.mobileNo=this.mobileNo;
    // user.associated_agency=this.publicId;
    // this.user.register(user).subscribe(res => {
    //   this.login();
    // });
  }

  goToMode(mode) {
    this.activeRoute.params.subscribe(params => {
      if (params['token']) {
        if (this.auth.loginWithToken(params['token'])) {
          if (this.auth.loggedIn) {
            this.loginMode = 'B';
          }
        }
      } else {
        if (this.auth.loggedIn) {
          this.loginMode = 'B';
        }
      }
    });
    this.mode = mode;
  }


  getPackage() {
    this.componentService.getPackagesFilter(`associated_agency=${this.agencyId}&status=PUBLISHED&hasExternal=false`).subscribe((res: any) => {
      if (res.length > 0) {
        let self = this;
        res.forEach((v) => {
          self.getMultipleComponent(v)
        })
      }
    })
  }

  getMultipleComponent(data) {
    let tmpPackage = {
      packageData: data
    };
    // &&!this.checkExpire(tmpPackage)
    if (!tmpPackage.packageData.isFeatured)
      this.packages.push(tmpPackage);
    if (tmpPackage.packageData.isFeatured) {
      this.packagesFeature.push(tmpPackage);
    }
    this.lightPackages = this.packages.slice(0, 4)
  }

  getMultipleComponent1(data) {
    this.componentService.getMultipleComponent(data).subscribe(
      (response: any) => {
        if (response) {
          let tmpPackage = {
            packageData: data,
            componentsData: response
          };
          this.bestSellerPackage.push(tmpPackage);
          console.log('trip',this.bestSellerPackage)
        }
      });
  }

  getMultipleComponent2(data) {
    this.componentService.getMultipleComponent(data).subscribe(
      (response: any) => {
        if (response) {
          let tmpPackage = {
            packageData: data,
            componentsData: response
          };
          this.allPackage.push(tmpPackage);
        }
      });
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
    console.log('beforeChange', this.packages);
  }

  details(id) {
    this.stepper.selectedIndex = 0;

    this.trip=new CustomModel();
    this.trip.adultCount=1;
    this.trip.childCount=0;
    this.trip.infantCount =0;
    this.firstStep= this.fbStepper.group({
      adult: new FormControl(null, [Validators.required]),
      child: new FormControl(null, [Validators.required]),
      infant: new FormControl(null, [Validators.required]),
    })
    this.componentService.getOneTopPackage(id).subscribe((res: any) => {
      if (res) {
        let self = this;
        res.forEach((v) => {
          self.getMultipleComponent2(v);
        });
        this.componentService.getMultipleComponent(res[0]).subscribe(
          (response: any) => {
            if (response) {
              let tmpPackage = {
                packageData: res[0],
                componentsData: response
              };
              this.item=tmpPackage;
              console.log('item booking',this.item)

            }
          });
        // this.item = res[0];
        // this.getMultipleComponent2(this.item);
      }
    })
    $('#booking').modal('toggle');
  }

  formatDate(date){
    return moment(date).format('YYYY/MM/DD')
  }
  step2(mode) {
    this.secondStep = false;
    if (this.secondStep || this.result) {
      this.mode = mode;
    }
  }

  goToMode2(mode) {
    if (this.trip.childCount===0){
      return
    }
    this.secondStep = true;
    if (this.secondStep) {
      this.mode = mode;
      this.result= this.secondStep;
      console.log('trip',this.trip)
    }
  }

  step3(mode){
    this.thirdStep= false;
    if(this.thirdStep || (this.result && this.result2)){
      this.mode=mode;
    }
  }

  goToMode3(mode){
    this.thirdStep= true;
    if (this.thirdStep) {
      this.mode = mode;
      this.result2= this.thirdStep;
    }
  }
  loading:boolean=false;
  sendInquery(){
    let obj = {
      packageId: this.item.packageData._id,
      userId: Memory.getUserIdStorage(),
      agencyId: Memory.getAgencyId(),
      adultCount: this.trip.adultCount ? this.trip.adultCount : 0,
      childCount: this.trip.childCount? this.trip.childCount: 0,
      infantCount: this.trip.infantCount ? this.trip.infantCount : 0,
      redirectRoute:'public/1/'+Memory.getAgencyId()
    };
    this.loading=true;
    console.log('this.item.packageData._id',this.item.packageData._id)
    this.packageService.checkValidForBook(obj).subscribe((res:any)=>{
      if(res.isSuccessful){
        this.inquery.special_inst="Booking from user";
        this.inquery.inquirer=Memory.getUserIdStorage();
        this.inquery.request=this.item._id;
        this.inquery.to=this.agencyId;
        this.inquery.status='PENDING';
        this.item.bought+=1;
        this.inqueryService.createInquery(this.inquery).subscribe((res:any)=>{
          this.loading=false;
          window.location.href=res.result;
          $('#booking').modal('hide');
          // this.router.navigateByUrl('panel/inqueries');
          // this.componentService.editPackage(this.item).subscribe((res:any)=>{
          //
          // })
          // window.location.reload();
        })
      }else{
        this.loading=false;
        const notifyConfig = new NotifyConfig(
          Notify.Type.SUCCESS,
          Notify.Placement.BOTTOM_CENTER,
          Notify.TEMPLATES.Template2,
          'Trip was fulled.',
          ''
        );
        Notify.showNotify(notifyConfig);
      }
    })



  }

}
