import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AgencyInformation, TaxIdentification} from "../../../shared/models/onBoarding.model";
import {ValidationModel} from "../../../base/validationModel";
import {Validation} from "../../../base/validation";
import {NotifyConfig} from "../../../base/notify/notify-config";
import {Notify} from "../../../base/notify/notify";

@Component({
  selector: 'app-tax-identification',
  templateUrl: './tax-identification.component.html',
  styleUrls: ['./tax-identification.component.scss']
})
export class TaxIdentificationComponent implements OnInit {

  @Output() goBack: EventEmitter<any> = new EventEmitter();
  @Input() tax:TaxIdentification;
  taxValidationIntial:Array<any>;
  taxValidation:ValidationModel;
  repititionData:boolean=false;
  bankList:Array<string>=[
    'BPI Family Savings Bank',
    'Philippine Savings Bank',
    'RCBC Savings Bank',
    'China Bank Savings',
    'Philippine Business Bank',
    'CitySavings Bank',
    'PNB Savings Bank',
    'Sterling Bank of Asia',
    'Bank of Makati',
    'UCPB Savings Bank',
    'First Consolidated Bank',
    'Maximum Savings Bank, Inc',
    'HSBC Savings Bank Philippines Inc',
    'BPI Direct BanKo, Inc',
    'Producers Savings Bank Corporation',
    'Philippine Resources Savings Banking Corporation ',
    'Overseas Filipino Bank ',
    'Equicom Savings Bank ',
    'Wealth Development Bank Corporation',
    'Malayan Savings Bank',
    '1st Valley Bank, Inc.',
    'Luzon Development Bank',
    'CARD SME Bank, Inc.',
    'Citystate Savings Bank',
    'Bangko Kabayan',
    'Pen Bank, Inc.',
    'Yuanta Savings Bank Philippines, Inc.',
    'AllBank, Inc.',
    'Legazpi Savings Bank',
    'Enterprise Bank, Inc',
    'Queen City Development Bank',
    'Century Savings Bank Corporation',
    'Bank One Savings and Trust Corporation',
    'Dumaguete City Development Bank, Inc.',
    'Merchants Savings and Loan Association, Inc.',
    'Hiyas Banking Corporation',
    'Isla Bank',
    'Sun Savings Bank, Inc.',
    'University Savings Bank',
    'Village Bank, Inc.',
    'NorthPoint Development Bank, Inc.',
    'Farmers Savings and Loan Bank, Inc.',
    'Pampanga Development Bank',
    'Cordillera Savings Bank, Inc.',
    'Bataan Development Bank',
    'Business and Consumers Bank',
    'Inter-Asia Development Bank',
    'Life Savings Bank, Inc.',
    'Metro Cebu Public Savings Bank',
    'Bataan Savings and Loan Bank',
    'Pacific Ace Savings Bank, Inc.',
    'Lemery Savings and Loan Bank, Inc.',
    'Maritime Savings Bank Corporation',
    'Philippine Star Development Bank, Inc.',
    'Malasiqui Progressive SLB, Inc.',
    'Quezon Coconut Bank, Inc.',
  ]
  lineResult:Array<string>=[];
  constructor() {
    this.taxValidationIntial=[
      {field:'taxIdentificationNo',toBe:['cs-46']},
      {field:'bankAccounts',toBe:['list-type_40-accountNo_20']},
    ];
    this.taxValidation=Validation.intialObject(this.taxValidationIntial);
  }

  ngOnInit() {
    this.taxValidation.fields.taxIdentificationNo.originalValue=this.tax.taxIdentificationNo;
    this.taxValidation.fields.bankAccounts.originalValue=this.tax.bankAccounts;
  }

  getBank(input,item){
    item.type='';
    this.lineResult = this.bankList.filter((item) => item.toLowerCase().indexOf(input.toLowerCase())>-1);
  }
  goBackToDash(){
    this.repititionData=false;
    this.dupAccountNo=this.checkDuplicateInObject(this.tax.bankAccounts);
    this.taxValidation.fields.bankAccounts.originalValue=this.tax.bankAccounts;
    this.taxValidation=Validation.checkObject(this.taxValidation);
    this.tax.isValid=(this.taxValidation.isValid&& !this.repititionData)?2:1;
    this.goBack.emit('A')
  }

  indexTracker(index: number, value: any) {
    return index;
  }
  dupAccountNo:any=[];

  submit(){
    this.repititionData=false;
    this.dupAccountNo=this.checkDuplicateInObject(this.tax.bankAccounts);
    this.taxValidation.fields.bankAccounts.originalValue=this.tax.bankAccounts;
    this.taxValidation=Validation.checkObject(this.taxValidation);
    this.tax.isValid=(this.taxValidation.isValid&& !this.repititionData)?2:1;
    if(this.tax.isValid && !this.repititionData){
      this.goBack.emit('A')
    }else{
      console.log(this.taxValidation);
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

  checkDuplicateInObject(inputArray) {
    var indexes=[];
    var count;
    let self=this;
    inputArray.forEach(function(item,index) {
      count=0;
      inputArray.forEach(function(sub,i) {
        if((item.accountNo===sub.accountNo)&&(i>index)){
          count=count+1;
          if(count>=1){
            self.repititionData=true;
            indexes.push(i)
          }
        }
      })
    });
    return indexes;
  }

  getValidationClass(field){
    return this.taxValidation.fields[field].isValid?'':'has-error';
  }

  remove(array,i){
    array.splice(i,1)
  }

}
