import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {UserService} from "../../services/user.service";
import {User} from "../../shared/models/user.model";
import {isNullOrUndefined} from "util";
import {ComponentService} from "../../services/component.service";
import {DateManagerService} from "../../services/date-manager.service";
import {PackageDataService} from "../../services/dataService/package-data.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AgenciesService} from "../../services/agencies.service";
import {InqueriesService} from "../../services/inqueries.service";
import {InquiryModel} from "../../shared/models/inquiry.model";
import {Memory} from "../../base/memory";
import {Validation} from "../../base/validation";
import {PackageService} from "../../services/package.service";
import { Notify } from '../../base/notify/notify';
import { NotifyConfig } from '../../base/notify/notify-config';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit {
  mode:string='A';

  email:string;
  password:string;
  confirmPassword:string;
  mobileNo:string;


  inquery:InquiryModel=new InquiryModel();

  slides = [];
  images = [1, 2, 3, 4].map(() => `https://picsum.photos/900/500?random&t=${Math.random()}`);
  packages: Array<any> = [];
  tourId:string;
  package:any;
  publicId:string;
  agency:any;
  constructor(private auth: AuthService,
              private componentService:ComponentService,
              private dateManagerService:DateManagerService,
              private packageDataService:PackageDataService,
              private packageService:PackageService,
              private inqueryService:InqueriesService,
              private activeRoute:ActivatedRoute,
              private router:Router,
              private dateService:DateManagerService,
              private agencyService:AgenciesService,
              private user: UserService,) { }

  ngOnInit() {

    this.activeRoute.params.subscribe(params=>{
      if(params['tourId']){
        this.tourId=params['tourId'];
        if (params['id']) {
          this.publicId = params['id'];
          this.getPackages()
          this.agencyService.getByReferalCode(this.publicId).subscribe((res:any)=>{
            if(res.result){
              this.agency=res.result;
            }
          })
        }
      }
      if(params['token']){
        if(this.auth.loginWithToken(params['token'])){
          if(this.auth.loggedIn){
            this.mode='C';
          }
        }
      }else{
        if(this.auth.loggedIn){
          this.mode='C';
        }
      }

    })
    let self=this;
    this.images.forEach(function(v,k){
      self.slides.push({
        img: v
      })
    })
  }

  goBack(){
    this.packageDataService.setPackage(this.package);
    this.router.navigateByUrl(`public/${this.publicId}/landingTour/${this.tourId}`)
  }

  goToMode(mode){
    this.mode=mode;
  }


  login() {
    this.auth.login({email:this.email,password:this.password}).subscribe(
      res => {
        this.goToMode('C');
      }
    );
  }
  signup() {
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


  getPackages(){
    this.componentService.getPackagesFilter(`associated_agency=${this.publicId}&status=PUBLISHED`).subscribe(
        (response:any) => {
        if (response) {
          response.forEach((v,k) =>{
            this.getMultipleComponent(v)
          })

        }
      });
  }
  duration:any;
  getMultipleComponent(data){
    this.componentService.getMultipleComponent(data).subscribe(
      (response:any) => {
        if (response) {
          if(data._id==this.tourId){
            let recursive = [];

          for (let item of response) {
              if (item.details.roundTrip) {
                let newComp = Object.assign({}, item);
                // newComp.details.from = item.details.to;
                newComp.pair = newComp._id;
                newComp.bulkPrice = 0;
                recursive.push(newComp);
              }
          }
          for (let item of recursive) {
            response.push(item);
          }
            for(let item of data.externalResources){
              response.push(item);
            }
            let tmpPackage = {
              packageData : data,
              componentsData: response
            };
            this.package=tmpPackage;

            this.duration=this.dateService.rangeOfTrip(tmpPackage.componentsData.reverse()).split('and');
            // this.dateService.rangeOfTrip(tmpPackage.componentsData);
            this.images = this.package.packageData.images;
            this.slides = this.package.packageData.images;
          }
        }
      });
  }
  logout(){
    this.auth.logout1();
    this.mode='A';
  }
  packagePrice(p){
    return this.packageService.priceCalculator(p);
  }
  loading:boolean=false;
  sendInquery(){
    this.loading=true;
    this.packageService.checkValidForBook(this.package.packageData._id).subscribe((res:any)=>{
      if(res.isSuccessful){
        this.inquery.special_inst="Booking from user";
        this.inquery.inquirer=Memory.getUserIdStorage();
        this.inquery.request=this.package.packageData._id;
        this.inquery.to=this.publicId;
        this.inquery.status='PENDING';
        this.package.packageData.bought+=1;
        this.inqueryService.createInquery(this.inquery).subscribe((res:any)=>{
          this.loading=false;
          this.router.navigateByUrl('panel/inqueries');
          this.componentService.editPackage(this.package.packageData).subscribe((res:any)=>{
    
          })
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
  httpParams=new HttpParams();
  emailPass:string
  forgetPass(){
    this.httpParams=new HttpParams();
    this.httpParams=this.httpParams.append('returnUrl','public/${this.publicId}/landingTour/${this.tourId}/booking')
    this.auth.forgetPass(this.emailPass,this.httpParams).subscribe((res:any)=>{
      if(res.isSuccessful){
        const notifyConfig = new NotifyConfig(
          Notify.Type.SUCCESS,
          Notify.Placement.BOTTOM_CENTER,
          Notify.TEMPLATES.Template2,
          'Email For Change Pass Has been sent to your email address.',
          ''
        );
        Notify.showNotify(notifyConfig);
      }
    })
  }

}
