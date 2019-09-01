import { Component, OnInit } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ComponentService} from '../../services/component.service';
import {DateManagerService} from '../../services/date-manager.service';
import {PackageService} from '../../services/package.service';
import {PackageDataService} from '../../services/dataService/package-data.service';
import {ActivatedRoute, Router} from '@angular/router';
import {isNullOrUndefined} from "util";
import * as moment from 'moment';
import {AgenciesService} from "../../services/agencies.service";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-landing-tour',
  templateUrl: './landing-tour.component.html',
  styleUrls: ['./landing-tour.component.scss']
})
export class LandingTourComponent implements OnInit {
  slides = [];
  images = [1, 2, 3, 4].map(() => `https://picsum.photos/900/500?random&t=${Math.random()}`);
  packages: Array<any> = [];
  tourId:string;
  package:any;
  publicId:string;
  agency:any;
  bookingDisable:boolean=true;
  showPerson:boolean=false;
  constructor(private componentService:ComponentService,
              private dateManagerService:DateManagerService,
              private packageDataService:PackageDataService,
              private activeRoute:ActivatedRoute,
              private router:Router,
              private auth:AuthService,
              private agencyService:AgenciesService,
              private packageService:PackageService) {

  }
  slideConfig = {
    "slidesToShow": 3,
    "slidesToScroll": 1,
    "dots": true,
    "infinite": true,
    // "autoplay": true,
    "autoplaySpeed": 2500
  };

  slickInit(e) {
    // console.log('slick initialized');
  }

  breakpoint(e) {
    // console.log('breakpoint');
  }

  afterChange(e) {
    // console.log('afterChange');
  }

  beforeChange(e) {
    // console.log('beforeChange');
  }

  cleanDate(date){
    return moment(date).format('DD MMM YYYY');
  }
  role:string
  ngOnInit() {
    if(this.auth.loggedIn){
      this.role=this.auth.getRole()
    }
    this.activeRoute.params.subscribe(params=>{
      if(params['tourId']){
        this.tourId=params['tourId'];
        this.activeRoute.data.subscribe((data: { routeData: any }) => {
          if (!isNullOrUndefined(data.routeData)) {
            this.package=data.routeData
          }else{
            if (params['id']) {
              this.publicId = params['id'];
              this.agencyService.getByReferalCode(this.publicId).subscribe((res:any)=>{
                if(res.result){
                  this.agency=res.result;
                }
              })
            }
            this.getPackages()
          }
        });
      }
      if (params['id']) {
        this.publicId = params['id'];
        this.agencyService.getByReferalCode(this.publicId).subscribe((res:any)=>{
          if(res.result){
            this.agency=res.result;
          }
        })
      }
    })

    let self=this;
    this.images.forEach(function(v,k){
      self.slides.push({
        img: v
      })
    })
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

  goToProfile() {
    this.router.navigateByUrl('/public/profile')
  }
  getPackages(){
    this.componentService.getPackagesFilter(`associated_agency=${this.publicId}&status=PUBLISHED`).subscribe(
        (response:any) => {
        if (response) {
          response.forEach((v,k) =>{
            v['img'] = `https://picsum.photos/900/500?random&t=${Math.random()}`;
            this.getMultipleComponent(v)
          })

        }
      });
  }
  getMultipleComponent(data){
    this.componentService.getMultipleComponent(data).subscribe(
      (response:any) => {
        if (response) {
          if(data._id==this.tourId){
            var valid:boolean=true;
            let recursive = [];

            for(let item of response){
              if(new Date(item.updatedDate).getTime()> new Date(data.updatedDate).getTime()){
                valid=false;
              }else{
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
              packageData : data,
              componentsData: response
            };

            this.package=tmpPackage;
            this.bookingDisable=!this.checkExpire(this.package)
            
            this.images = this.package.packageData.images;
            this.slides = this.package.packageData.images;
          }
        }
      });
  }
}
