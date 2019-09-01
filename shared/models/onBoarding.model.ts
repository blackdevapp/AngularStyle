import {User} from "./user.model";

export class OnBoardingModel {
  personalInformation:PersonalInformation=new PersonalInformation();
  agencyInformation:AgencyInformation=new AgencyInformation();
  socialMedia:SocialMedia=new SocialMedia();
  taxIdentification:TaxIdentification=new TaxIdentification();
  employees:Array<User>=[];
}

export class PersonalInformation {
  email:string;
  name:string;
  middleName:string;
  lastName:string;
  title:string; //Mr./Ms.
  address:string;
  city:string;
  state:string;
  gender:string;
  age:number;
  birthDate:Date;
  officialTelephone:string;
  mobileNo:string;
  _id:string;

  password:string;
  confirmPassword:string;

  isValid:number=0;
}
export class AgencyInformation {
  companyName:string;
  website:string;
  city:string;
  logo:string;
  officialRepresentative:string;
  alternativeRepresentative:string[]=[''];
  telephone:string[]=[''];
  mobile:string[]=[''];
  fax:string[]=[''];
  email:string[]=[''];
  officialAddress:string[]=[''];


  isValid:number=0;
}
export class SocialMedia {
  facebookLink:string;
  linkedinLink:string;
  twitterLink:string;
  telegramLink:string;
  pinterestLink:string;
  flickrLink:string;
  instagram:string;
  isValid:number=0;
}

export class TaxIdentification {
  taxIdentificationNo:string;
  bankAccounts:Array<BankAccount>=[{type:'',accountNo:''}];
  isValid:number=0;
}
export class BankAccount {
  type:string;
  accountNo:string;
}
