import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AgencyInformation, PersonalInformation} from "../../../shared/models/onBoarding.model";
import {ValidationModel} from "../../../base/validationModel";
import {Validation} from "../../../base/validation";
import {NotifyConfig} from "../../../base/notify/notify-config";
import {Notify} from "../../../base/notify/notify";
import {UploadService} from "../../../services/upload.service";
import {Memory} from "../../../base/memory";
import index from "@angular/cli/lib/cli";
declare let $:any;
@Component({
  selector: 'app-agency-information',
  templateUrl: './agency-information.component.html',
  styleUrls: ['./agency-information.component.scss']
})
export class AgencyInformationComponent implements OnInit {
  @Output() goBack: EventEmitter<any> = new EventEmitter();
  @Input() agencyInfo:AgencyInformation;
  agencyInfoValidationIntial:Array<any>;
  agencyInfoValidation:ValidationModel;
  listValid:boolean=true;
  popUpMap: boolean = false;

  constructor(private uploadService:UploadService) {
    this.agencyInfoValidationIntial=[
      {field:'companyName',toBe:['cs-46']},
      {field:'city',toBe:['cs-46']},
      {field:'website',toBe:['cs-46']},
      {field:'officialRepresentative',toBe:['cs-46']},
    ];
    this.agencyInfoValidation=Validation.intialObject(this.agencyInfoValidationIntial);
  }


  ngOnInit() {
    this.agencyInfoValidation.fields.companyName.originalValue=this.agencyInfo.companyName;
    this.agencyInfoValidation.fields.city.originalValue=this.agencyInfo.city;
    this.agencyInfoValidation.fields.officialRepresentative.originalValue=this.agencyInfo.officialRepresentative;
    this.agencyInfoValidation.fields.website.originalValue=this.agencyInfo.website;
  }

  goBackToDash(){
    this.checkList();
    this.agencyInfoValidation=Validation.checkObject(this.agencyInfoValidation);
    this.agencyInfo.isValid=(this.agencyInfoValidation.isValid &&this.listValid)?2:1;

    this.goBack.emit('A')
  }

  indexTracker(index: number, value: any) {
    return index;
  }
  dupAlternativeRepresentative:any=[];
  dupTelephone:any=[];
  dupMobile:any=[];
  dupFax:any=[];
  dupEmail:any=[];
  dupOfficialAddress:any=[];
  submit(){
    this.checkList();
    this.repititionData=false;
    this.dupAlternativeRepresentative=this.checkDuplicateInObject(this.agencyInfo.alternativeRepresentative);
    this.dupTelephone=this.checkDuplicateInObject(this.agencyInfo.telephone);
    this.dupMobile=this.checkDuplicateInObject(this.agencyInfo.mobile);
    this.dupFax=this.checkDuplicateInObject(this.agencyInfo.fax);
    this.dupEmail=this.checkDuplicateInObject(this.agencyInfo.email);
    this.dupOfficialAddress=this.checkDuplicateInObject(this.agencyInfo.officialAddress);
    this.agencyInfoValidation=Validation.checkObject(this.agencyInfoValidation);
    this.agencyInfo.isValid=(this.agencyInfoValidation.isValid&& this.listValid)?2:1;
    if(this.agencyInfo.isValid==2 &&!this.repititionData){
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
  checkList(){
    let self=this;
    this.agencyInfo.telephone.forEach(function (item,index) {
      if(index!==0){
        if(item.length==0){
          self.agencyInfo.telephone.splice(index,1);
        }
      }else{
        if(item.length==0){
          self.listValid=false;
        }else{
          self.listValid=true;

        }
      }
    });
    this.agencyInfo.mobile.forEach(function (item,index) {
      if(index!==0){
        if(item.length==0){
          self.agencyInfo.mobile.splice(index,1);
        }
      }else{
        if(item.length==0){
          self.listValid=false;
        }else{
          self.listValid=true;

        }
      }
    })
    this.agencyInfo.email.forEach(function (item,index) {
      if(index!==0){
        if(item.length==0){
          self.agencyInfo.email.splice(index,1);
        }
      }else{
        if(item.length==0){
          self.listValid=false;
        }else{
          self.listValid=true;

        }
      }
    })
    this.agencyInfo.fax.forEach(function (item,index) {
      if(index!==0){
        if(item.length==0){
          self.agencyInfo.fax.splice(index,1);
        }
      }else{
        if(item.length==0){
          self.listValid=false;
        }else{
          self.listValid=true;

        }
      }
    })
    this.agencyInfo.officialAddress.forEach(function (item,index) {
      if(index!==0){
        if(item.length==0){
          self.agencyInfo.officialAddress.splice(index,1);
        }
      }else{
        if(item.length==0){
          self.listValid=false;
        }else{
          self.listValid=true;

        }
      }
    })
    this.agencyInfo.alternativeRepresentative.forEach(function (item,index) {
      if(index!==0){
        if(item.length==0){
          self.agencyInfo.alternativeRepresentative.splice(index,1);
        }
      }else{
        if(item.length==0){
          self.listValid=false;
        }else{
          self.listValid=true;

        }
      }
    })

  }

  fileChangeListener($event) {
    let image =new Image();
    const file = $event.target.files[0];
    const myReader: FileReader = new FileReader();
    const that = this;
    myReader.onloadend = function (loadEvent: any) {
      image.src = loadEvent.target.result;
      that.agencyInfo.logo=image.src
    };
    myReader.readAsDataURL(file);
    this.uploadService.upload(file,'5c15efb47b741fff2044ec26').subscribe((res:any)=>{
      if(res.isSuccessful){
        this.agencyInfo.logo=res.result.path;
      }
    })
  }
  openMap() {
    this.popUpMap = true;
    $('#map2').modal()
  }


  getValidationClass(field){
    return this.agencyInfoValidation.fields[field].isValid?'':'has-error';
  }
  remove(array,i){
    array.splice(i,1)
  }
  repititionData:boolean=false;
  // checkDuplicateInObject(inputArray,value) {
  //   if(value){
  //     var i=0;
  //     var indexArray=[];
  //     inputArray.map(function(item,index) {
  //       if(item==value){
  //         i++;
  //         indexArray.push(index);
  //       }
  //     });
  //     if(i>1){
  //       this.repititionData=true;
  //       return {
  //         dup:true,
  //         indexArray:indexArray
  //       };
  //     }else{
  //       return {
  //         dup:false
  //       };
  //     }
  //   }
  // }
  checkDuplicateInObject(inputArray) {
    var indexes=[];
    var count;
    let self=this;
    inputArray.forEach(function(item,index) {
      count=0;
      inputArray.forEach(function(sub,i) {
        if((item===sub)&&(i>index)){
          count=count+1;
          console.log(count,i);
          if(count>=1){
            self.repititionData=true;
            indexes.push(i)
          }
        }
      })
    });
    return indexes;
  }
  checkDuplicateInObjectTest(propertyName, inputArray) {
    var seenDuplicate = false,
      testObject = {};

    inputArray.map(function(item) {
      var itemPropertyName = item[propertyName];
      if (itemPropertyName in testObject) {
        testObject[itemPropertyName].duplicate = true;
        item.duplicate = true;
        seenDuplicate = true;
      }
      else {
        testObject[itemPropertyName] = item;
        delete item.duplicate;
      }
    });

    return seenDuplicate;
  }

}
