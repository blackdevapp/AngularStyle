import { Component, OnInit } from '@angular/core';
import { OnBoardingModel, PersonalInformation, SocialMedia } from "../../shared/models/onBoarding.model";
import { User } from "../../shared/models/user.model";
import { ActivatedRoute, Router } from "@angular/router";
import { AgenciesService } from "../../services/agencies.service";
import { UserService } from "../../services/user.service";
import { OnBoardingOrgModel } from "../../shared/models/onBoardingOrg.model";
import { Memory } from "../../base/memory";
import { NotifyConfig } from "../../base/notify/notify-config";
import { Notify } from "../../base/notify/notify";
import { AuthService } from "../../services/auth.service";
import { UserDataService } from "../../services/dataService/user-data.service";
import {Form} from "../../panel/form-builder/form-builder.component";
declare let $: any;
@Component({
  selector: 'app-on-boarding',
  templateUrl: './on-boarding.component.html',
  styleUrls: ['./on-boarding.component.scss']
})
export class OnBoardingComponent implements OnInit {
  mode: string = 'A';
  popUpMap: boolean = false
  dropData = [
    {
      operatorName: 'addEmployee',
      displayName: 'Add Employee',
      icon: 'add',
      description: 'Add Manual Employee'
    }
  ]
  user: OnBoardingModel = new OnBoardingModel();
  acceptPrivacy: boolean = false;
  userOrg: OnBoardingOrgModel = new OnBoardingOrgModel();
  constructor(private route: ActivatedRoute,
    private router: Router,
    private userDataService: UserDataService,
    private auth: AuthService,
    private agenciesService: AgenciesService,
    private userService: UserService) { }

  ngOnInit() {
    if (Memory.getUserId()) {
      let tempUser: User = new User();
      tempUser._id = Memory.getUserId();
      this.user.personalInformation._id = Memory.getUserId();
      this.userService.getUser(tempUser).subscribe((res: User) => {
        this.convertUser(res, this.user.personalInformation)
      })
    } else {
      if (Memory.getOnBoard()) {
        this.user = Memory.getOnBoard();
      } else {
        const notifyConfig = new NotifyConfig(
          Notify.Type.WARNING,
          Notify.Placement.TOP_CENTER,
          Notify.TEMPLATES.Template2,
          'you must enter referralCode again',
          ''
        );
        Notify.showNotify(notifyConfig);
        this.router.navigateByUrl('/signup')
      }

    }
    // this.route.queryParams.subscribe(params=>{
    //   if(params['referralCode']){
    //     this.agenciesService.getByReferalCode(params['referralCode']).subscribe((res:any)=>{
    //       if(res.result){
    //         let tempUser:User=new User();
    //         tempUser._id=res.result.admin;
    //         this.user.personalInformation._id=res.result.admin;
    //         this.userService.getUser(tempUser).subscribe((res:User)=>{
    //           this.convertUser(res,this.user.personalInformation)
    //         })
    //       }
    //     })
    //   }
    // })

  }
  goToMode(mode) {
    this.mode = mode;
    Memory.setOnBoard(this.user)
  }

  addNewEmployee() {
    this.userDataService.setUser(null);
    $('#addEmployee').modal()

  }
  dropClicked(event) {
    if (event.operatorName == 'addEmployee') {
      this.addNewEmployee();
    }
  }

  deleteEmployee(event) {
    let item: User = event.value;
    let index = event.index;
    this.user.employees.splice(index, 1);
  }

  changeStatus(item: User) {

  }

  editUser(item: User) {
    this.userDataService.setUser(item);
    $('#addEmployee').modal()
  }

  multipleDelete() {
    if (window.confirm('Are you sure delete this members?')) {
      let users = [];
      this.user.employees.forEach(function (item, index) {
        if (item.selected == true) {
          users.push(item.email);
        }
      });
      this.user.employees = this.user.employees.filter(function (value) {
        if (users.indexOf(value.email) === -1) {
          return value;
        }
      });
    }
  }

  getSelectedCount() {
    let count = 0;
    if (this.user.employees) {
      this.user.employees.forEach(function (item) {
        if (item.selected == true)
          count += 1;
      });
    }

    return count;
  }

  submit() {
    if (this.acceptPrivacy) {
      // this.userOrg.social_media=[];
      this.userOrg.alternative_representative = this.user.agencyInformation.alternativeRepresentative;
      this.userOrg.bancAccounts = this.user.taxIdentification.bankAccounts;
      this.userOrg.city = this.user.agencyInformation.city;
      this.userOrg.company_name = this.user.agencyInformation.companyName;
      this.userOrg.official_representative = this.user.agencyInformation.officialRepresentative;
      // this.userOrg.members=this.user.employees;
      // this.userOrg.social_media.push(this.user.socialMedia);
      this.userOrg.email_address = this.user.agencyInformation.email;
      this.userOrg.fax_number = this.user.agencyInformation.fax;
      this.userOrg.logo = this.user.agencyInformation.logo;
      this.userOrg.mobile_number = this.user.agencyInformation.mobile;
      this.userOrg.taxIdentificationNo = this.user.taxIdentification.taxIdentificationNo;
      this.userOrg.telephone_number = this.user.agencyInformation.telephone;
      this.userOrg._id = Memory.getAgencyReferralId()
      let currentUser: any = this.user.personalInformation;
      this.userOrg.onboarded = true;
      console.log(this.userOrg)
      this.agenciesService.editAgencies(this.userOrg).subscribe((res: any) => {
        this.userService.editUser(currentUser).subscribe((res1: any) => {
          this.auth.login({ email: this.user.personalInformation.email, password: this.user.personalInformation.password }).subscribe(
            res => {
              Memory.setMembers(this.user.employees);
              this.router.navigate(['/panel/dashboard']);
            }
          );
        })
      })
    } else {
      const notifyConfig = new NotifyConfig(
        Notify.Type.WARNING,
        Notify.Placement.TOP_CENTER,
        Notify.TEMPLATES.Template2,
        'Please accept Terms and Condition',
        ''
      );
      Notify.showNotify(notifyConfig);
    }

  }

  getRegisteredUser(user) {
    if (user) {
      let self = this;
      let exist: boolean = false;
      this.user.employees.forEach(function (item, index) {
        if (item.email === user.email) {
          self.user.employees[index] = user;
          exist = true;
        } else {
          exist = false;

        }
      });
      if (exist == false) {
        this.user.employees.push(user);
      }
      $('#addEmployee').modal('toggle')
    } else {
      $('#addEmployee').modal('toggle')
    }

  }
  goToTerms() {
    $('#tos').modal()

    // window.open("/tos", '_blank')
  }
  goToPP() {
    $('#pp').modal()

    // window.open("/privacy-policy", '_blank')
  }



  config = {
    Actions: {
      edit: true,
      delete: true,
      pagination: false,
      select: true
    },
    columns: [
      {
        type: 'string',
        title: 'email',
        field: 'email'
      }, {
        type: 'dropdown',
        title: 'hierarchy',
        field: 'role',
        data: ['agent', 'encoder']
      }
    ]
  };


  onCheck(event) {
    if (event.target.checked) {
      this.acceptPrivacy = true;
    } else {
      this.acceptPrivacy = false;
    }
  }
  convertUser(user: User, personal: PersonalInformation) {
    personal.email = user.email;
    personal.mobileNo = user.mobileNo;
    personal.title = user.title;
  }

}
