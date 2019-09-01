import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AgencyInformation, SocialMedia} from "../../../shared/models/onBoarding.model";
import {ValidationModel} from "../../../base/validationModel";
import {Validation} from "../../../base/validation";
import {NotifyConfig} from "../../../base/notify/notify-config";
import {Notify} from "../../../base/notify/notify";
import {Memory} from "../../../base/memory";
import { Router } from '@angular/router';
import { AgenciesService } from '../../../services/agencies.service';
import { SocialService } from '../../../services/social.service';

@Component({
  selector: 'app-social-media',
  templateUrl: './social-media.component.html',
  styleUrls: ['./social-media.component.scss']
})
export class SocialMediaComponent implements OnInit {
  agencyDetails:any;
  pages:Array<any>=[];

  constructor(private agencyService:AgenciesService,
    private router:Router,
    private socialService:SocialService) { }

  ngOnInit() {
    this.getAllMembers(Memory.getAgencyId())
  }


  getAllMembers(associated_agency){
    this.agencyService.getByReferalCode(associated_agency).subscribe((res:any)=>{
      if(res.result){
        this.agencyDetails = res.result;
      }
    })
  }
  revoke(type){
    if(type==='facebook'){
      delete this.agencyDetails.social_media.facebook.token;
    }else if(type==='linkedin'){
      delete this.agencyDetails.social_media.linkedin;
    }else if(type==='flickr'){
      delete this.agencyDetails.social_media.flickr;
    }else if(type==='pinterest'){
      delete this.agencyDetails.social_media.pinterest;
    }else if(type==='twitter'){
      delete this.agencyDetails.social_media.twitter;
    }else if(type==='telegram'){

    }
    this.agencyService.editAgencies(this.agencyDetails).subscribe((res:any)=>{
      console.log(res);
    })
  }

  editAccessPage(){
    this.agencyService.editAgencies(this.agencyDetails).subscribe((res:any)=>{
      console.log(res);
    })
  }
  accessTT(){
    this.router.navigate(['/public/social'],{queryParams:{type:'twitter',mode:'onBoard'}})
    // window.location.href = `${window.location.origin}/api/auth/twitter?agency_id=${Memory.getAgencyId()}`;
  }
  accessIN(){
    this.router.navigate(['/public/social'],{queryParams:{type:'linkedin',mode:'onBoard'}})

    // window.location.href = `${window.location.origin}/api/auth/linkedin?agency_id=${Memory.getAgencyId()}`;
  }
  accessPT(){
    this.router.navigate(['/public/social'],{queryParams:{type:'pinterest',mode:'onBoard'}})

    // window.location.href = `${window.location.origin}/api/auth/pinterest?agency_id=${Memory.getAgencyId()}`;
  }
  accessFL(){
    this.router.navigate(['/public/social'],{queryParams:{type:'flickr',mode:'onBoard'}})

    // window.location.href = `${window.location.origin}/api/auth/flickr?agency_id=${Memory.getAgencyId()}`;
  }
  accessFB(){
    this.router.navigate(['/public/social'],{queryParams:{type:'facebook',mode:'onBoard'}})

    // window.location.href = `${window.location.origin}/api/auth/facebook?agency_id=${Memory.getAgencyId()}`;
  }
  accessTelegram(){
    $('#telegram').modal('toggle')
  }
  loading:boolean=false;
  error:boolean=false;
  accessFBPage(token){
    this.pages=[];
    this.loading=true;
    let self=this;
    setTimeout(function(){
      if(self.loading==true){
        self.loading=false;
        self.error=true;
      }
    },15000)
    $('#fbPages').modal()
    this.socialService.getFacebooksPage(token).subscribe((res:any)=>{
      this.pages=res.pages;
      this.loading=false;
    },err=>{

    })
  }
  onCheck(event){
    if(event.target.checked){
      if(this.agencyDetails.social_media.facebook.pages){
        this.agencyDetails.social_media.facebook.pages.push(event.target.value)
      }else{
        this.agencyDetails.social_media.facebook.pages=[];
        this.agencyDetails.social_media.facebook.pages.push(event.target.value)
      }
    }else{
      this.agencyDetails.social_media.facebook.pages.splice(this.agencyDetails.social_media.facebook.pages.indexOf(event.target.value)-1,1)
    }
  }

  @Output() goBack: EventEmitter<any> = new EventEmitter();
  @Input() media:SocialMedia;
  

  goBackToDash(){

    this.goBack.emit('A')
  }



  submit(){
      this.goBack.emit('A')
  }


}
