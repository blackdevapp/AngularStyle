import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PersonalInformation} from "../../../shared/models/onBoarding.model";
import {ValidationModel} from "../../../base/validationModel";
import {Validation} from "../../../base/validation";
import {NotifyConfig} from "../../../base/notify/notify-config";
import {Notify} from "../../../base/notify/notify";
import * as moment from 'moment';

@Component({
  selector: 'app-personal-information',
  templateUrl: './personal-information.component.html',
  styleUrls: ['./personal-information.component.scss']
})
export class PersonalInformationComponent implements OnInit {
  @Output() goBack: EventEmitter<any> = new EventEmitter();
  @Input() info:PersonalInformation;
  infoValidationIntial:Array<any>;
  showPass:boolean=true;
  showPass1:boolean=true;
  infoValidation:ValidationModel;
  constructor() {
    this.infoValidationIntial=[
      // {field:'email',toBe:['ce-46']},
      {field:'name',toBe:['cs-46']},
      {field:'lastName',toBe:['cs-46']},
      {field:'title',toBe:['cs-46']},
      {field:'address',toBe:['cs-200']},
      {field:'city',toBe:['cs-46']},
      {field:'state',toBe:['cs-46']},
      // {field:'age',toBe:['cn-4']},
      {field:'gender',toBe:['cs-7']},
      {field:'officialTelephone',toBe:['cs-46']},
      // {field:'mobileNo',toBe:['cs-12']},
      {field:'password',toBe:['csPass-16','compareS-equal-confirmPassword']},
      {field:'confirmPassword',toBe:['csPass-16','compareS-equal-password']},

    ];
    this.infoValidation=Validation.intialObject(this.infoValidationIntial);
  }

  maxDate:Date=new Date(2000,11,11);
  ngOnInit() {
    // this.infoValidation.fields.email.originalValue=this.info.email;
    this.infoValidation.fields.title.originalValue=this.info.title;
    // this.infoValidation.fields.mobileNo.originalValue=this.info.mobileNo;
    this.infoValidation.fields.name.originalValue=this.info.name;
    this.infoValidation.fields.lastName.originalValue=this.info.lastName;
    this.infoValidation.fields.address.originalValue=this.info.address;
    this.infoValidation.fields.city.originalValue=this.info.city;
    this.infoValidation.fields.state.originalValue=this.info.state;
    // this.infoValidation.fields.age.originalValue=this.info.age;
    this.infoValidation.fields.gender.originalValue=this.info.gender;
    this.infoValidation.fields.officialTelephone.originalValue=this.info.officialTelephone;
    this.infoValidation.fields.password.originalValue=this.info.password;
    this.infoValidation.fields.confirmPassword.originalValue=this.info.confirmPassword;
  }

  goBackToDash(){
    this.infoValidation=Validation.checkObject(this.infoValidation);
    this.info.isValid=this.infoValidation.isValid?2:1;
    this.goBack.emit('A')
  }

  submit(){
    this.infoValidation=Validation.checkObject(this.infoValidation);
    this.info.isValid=this.infoValidation.isValid?2:1;
    if(this.info.isValid&&this.checkBirthDate(this.info.birthDate)){
      this.goBack.emit('A')
    }else{
      const notifyConfig = new NotifyConfig(
        Notify.Type.WARNING,
        Notify.Placement.TOP_CENTER,
        Notify.TEMPLATES.Template2,
        'The Form is Not Valid',
        ''
      );
      Notify.showNotify(notifyConfig);
      window.scrollTo(0,0)
    }

  }
  checkBirthDate(date){
    let checkDate=moment(this.maxDate);
    return checkDate.isSameOrAfter(moment(date),'year') && checkDate.isSameOrAfter(moment(date),'month') && checkDate.isSameOrAfter(moment(date),'day')
  }


  getValidationClass(field){
    return this.infoValidation.fields[field].isValid?'':'has-error';
  }
}
