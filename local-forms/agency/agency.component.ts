import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AgenciesService} from "../../services/agencies.service";
import {NotifyConfig} from "../../base/notify/notify-config";
import {Notify} from "../../base/notify/notify";

@Component({
  selector: 'app-agency',
  templateUrl: './agency.component.html',
  styleUrls: ['./agency.component.scss']
})
export class AgencyComponent implements OnInit {
  @Input() agency:AgencyImplement=new AgencyImplement();
  @Output() register:EventEmitter<any> = new EventEmitter();
  @Input() loading:boolean;
  constructor(private agencyService:AgenciesService) { }

  ngOnInit() {
    this.agency=new AgencyImplement();
  }
  submit(){
    this.loading=true;
    this.agencyService.registerAgency(this.agency).subscribe((res:any)=>{
      this.loading=false;
      if(res.referralCode){
        this.agency.code=res.referralCode;
        this.register.emit(this.agency);
        const notifyConfig = new NotifyConfig(
          Notify.Type.SUCCESS,
          Notify.Placement.TOP_CENTER,
          Notify.TEMPLATES.Template2,
          'Agency successfully registered. Agency\'s referral code is:  '+res.referralCode,
          ''
        );
        Notify.showNotify(notifyConfig);
      }else if(!res.referralCode){
        const notifyConfig = new NotifyConfig(
          Notify.Type.DANGER,
          Notify.Placement.TOP_CENTER,
          Notify.TEMPLATES.Template2,
          'Some Error has been happened',
          ''
        );
        Notify.showNotify(notifyConfig);
      }else if(res.message){
        this.loading = false;
        const notifyConfig = new NotifyConfig(
            Notify.Type.DANGER,
            Notify.Placement.BOTTOM_CENTER,
            Notify.TEMPLATES.Template2,
            res.message,
            ''
        );
        Notify.showNotify(notifyConfig);
      }else{
        this.loading = false;
        const notifyConfig = new NotifyConfig(
            Notify.Type.DANGER,
            Notify.Placement.BOTTOM_CENTER,
            Notify.TEMPLATES.Template2,
            'Invalid data!',
            ''
        );
        Notify.showNotify(notifyConfig);
      }
    },err=>{
      this.loading=false;
      if(err.error && err.error.message=='Duplicate key error'){
        const notifyConfig = new NotifyConfig(
          Notify.Type.DANGER,
          Notify.Placement.TOP_CENTER,
          Notify.TEMPLATES.Template2,
          'Email Already Exist',
          ''
        );
        Notify.showNotify(notifyConfig);
      }else{
        const notifyConfig = new NotifyConfig(
          Notify.Type.DANGER,
          Notify.Placement.TOP_CENTER,
          Notify.TEMPLATES.Template2,
          'Some Error has been happened',
          ''
        );
        Notify.showNotify(notifyConfig);
      }

    })
  }
  selectAll(event){
    if(event.target.checked){
      this.agency.permissions.dashboard=true;
      this.agency.permissions.itinerary=true;
      this.agency.permissions.inquries=true;
      this.agency.permissions.accounting=true;
      this.agency.permissions.marketing=true;
      this.agency.permissions.smartVisa=true;
      this.agency.permissions.agencyConfig=true;
      this.agency.permissions.agencyEmployees=true;
    }else {
      this.agency.permissions.dashboard=false;
      this.agency.permissions.itinerary=false;
      this.agency.permissions.inquries=false;
      this.agency.permissions.accounting=false;
      this.agency.permissions.marketing=false;
      this.agency.permissions.smartVisa=false;
      this.agency.permissions.agencyConfig=false;
      this.agency.permissions.agencyEmployees=false;
    }
  }

}
export class AgencyImplement {
  email:string;
  mobileNo:string;
  permissions: Permission=new Permission();
  role:string='admin';
  code:string
}
export class Permission {
    dashboard:boolean=false;
    itinerary:boolean=false;
    inquries:boolean=false;
    accounting:boolean=false;
    marketing:boolean=false;
    smartVisa:boolean=false;
    agencyConfig:boolean=false;
    agencyEmployees:boolean=false;

}
