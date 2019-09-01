import {Component, OnInit, Output, EventEmitter, Input} from '@angular/core';
import { User } from '../../shared/models/user.model';
import { UserService} from './../../services/user.service';
import {UserDataService} from '../../services/dataService/user-data.service';
import {NotifyConfig} from "../../base/notify/notify-config";
import {Notify} from "../../base/notify/notify";
import {ValidationModel} from "../../base/validationModel";
import {Validation} from "../../base/validation";
import * as moment from 'moment';
import {Memory} from "../../base/memory";

declare var $: any;

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
	@Output() newUser: EventEmitter<any> = new EventEmitter();
	@Input() associated_agency:string;
	@Input() mode:string;
	@Input() local:boolean=false;
	user: User;
  userValidation:ValidationModel;
  userValidationIntial:Array<any>;
  update:boolean=false;
  birthDate:Date;
  maxDate:Date=new Date(2000,11,11);
  constructor(private userService: UserService,
              private userDataService:UserDataService) {
    this.userValidationIntial=[
      {field:'firstName',toBe:['cs-26']},
      {field:'lastName',toBe:['cs-10']},
      {field:'email',toBe:['ce-46']},
      {field:'address',toBe:['cs-46']},
      {field:'state',toBe:['cs-46']},
      {field:'city',toBe:['cs-46']},
      {field:'mobileNo',toBe:['cn-12']}
    ];
    this.userValidation=Validation.intialObject(this.userValidationIntial);
  }

  ngOnInit() {
    this.userDataService.getUser.subscribe(res=>{
      if(res!==null){
        this.user=res;
        this.userValidation.fields.firstName.originalValue=this.user.firstName;
        this.userValidation.fields.lastName.originalValue=this.user.lastName;
        this.userValidation.fields.email.originalValue=this.user.email;
        this.userValidation.fields.address.originalValue=this.user.address;
        this.userValidation.fields.state.originalValue=this.user.state;
        this.userValidation.fields.city.originalValue=this.user.city;
        this.userValidation.fields.mobileNo.originalValue=this.user.mobileNo;
        this.update=true;
      }else{
        this.update=false;
        this.user={
          birthDate:'',
          firstName: '',
          lastName: '',
          address: '',
          password:'123456',
          state: '',
          city: '',
          email: '',
          age: 0,
          markup:0,
          role:'agent',
          mobileNo: '',
          title: 'Mr.',
          purposeOfVisit: 'tourist',
          deleted:false,
          associated_agency: Memory.getAgencyId()
        }
      }
    });
  }

  getValidationClass(field){
    return this.userValidation.fields[field].isValid?'':'has-error';
  }
  checkBirthDate(date){
    let checkDate=moment(this.maxDate);
    return checkDate.isSameOrAfter(moment(date),'year') && checkDate.isSameOrAfter(moment(date),'month') && checkDate.isSameOrAfter(moment(date),'day')
  }
  addUser(){
    console.log(this.user);
    this.user.birthDate=new Date(this.user.birthDate);
    if(this.user.role=='company'&&this.user.markup<=100){
      if(this.checkBirthDate(this.user.birthDate)){
        this.user.age=new Date().getFullYear()-this.user.birthDate.getFullYear();
        this.userValidation=Validation.checkObject(this.userValidation);
        if(this.userValidation.isValid){
          if(this.local){
            this.newUser.emit(this.user);
            this.userDataService.setUser(null);
          }
          else{
            if(this.update){
              this.userService.editUser(this.user).subscribe((res:any)=>{
                if(res){
                  res=JSON.parse(res);
                  res.update=true;
                  const notifyConfig = new NotifyConfig(
                    Notify.Type.SUCCESS,
                    Notify.Placement.TOP_CENTER,
                    Notify.TEMPLATES.Template2,
                    'User Updated successfully',
                    ''
                  );
                  Notify.showNotify(notifyConfig);
                  this.newUser.emit(res);
                }
              })
            }else{
              if(this.associated_agency){
                this.userService.addEmployee(this.user,this.associated_agency).subscribe(
                  (response:any) => {
                    if (response.isSuccessful) {
                      if(response.message=='User already Exist'&&!response.agency_id&&response.role!=='admin'){
                        if (window.confirm('Your chosen email address is already a user of NextJourney. Do you want to make him your desired employee?')) {
                          this.user._id=response.id;
                          this.userService.editUser(this.user).subscribe((res:any)=>{
                            this.newUser.emit(this.user)
                          })
                        }
                      }else if(response.message=='User already Exist'&&response.agency_id&&response.role=='admin'){
                        const notifyConfig = new NotifyConfig(
                          Notify.Type.DANGER,
                          Notify.Placement.TOP_CENTER,
                          Notify.TEMPLATES.Template2,
                          'You can not add this user in your agency',
                          ''
                        );
                        Notify.showNotify(notifyConfig);

                      }else{
                        const notifyConfig = new NotifyConfig(
                          Notify.Type.SUCCESS,
                          Notify.Placement.TOP_CENTER,
                          Notify.TEMPLATES.Template2,
                          'User added successfully',
                          ''
                        );
                        this.user._id=response.id;

                        Notify.showNotify(notifyConfig);
                        this.newUser.emit(this.user);
                      }

                    }else{
                      const notifyConfig = new NotifyConfig(
                        Notify.Type.DANGER,
                        Notify.Placement.TOP_CENTER,
                        Notify.TEMPLATES.Template2,
                        'There is a problem',
                        ''
                      );
                      Notify.showNotify(notifyConfig);
                      this.newUser.emit(false)
                    }

                  });
              }else{
                console.log(this.user);
                this.userService.addUser(this.user).subscribe(
                  (response:any) => {
                    if (response) {
                      const notifyConfig = new NotifyConfig(
                        Notify.Type.SUCCESS,
                        Notify.Placement.TOP_CENTER,
                        Notify.TEMPLATES.Template2,
                        'User added successfully',
                        ''
                      );
                      Notify.showNotify(notifyConfig);
                      this.newUser.emit(response);
                    }

                  });
              }
            }

          }
        }else{
          const notifyConfig = new NotifyConfig(
            Notify.Type.WARNING,
            Notify.Placement.TOP_CENTER,
            Notify.TEMPLATES.Template2,
            'The Form is Not Valid',
            ''
          );
          Notify.showNotify(notifyConfig);
        }
      }else{
        const notifyConfig = new NotifyConfig(
          Notify.Type.WARNING,
          Notify.Placement.TOP_CENTER,
          Notify.TEMPLATES.Template2,
          'The BirthDate is Not Valid',
          ''
        );
        Notify.showNotify(notifyConfig);
      }
    }else if(this.user.role!=='company'){
      if(this.checkBirthDate(this.user.birthDate)){
        this.user.age=new Date().getFullYear()-this.user.birthDate.getFullYear();
        this.userValidation=Validation.checkObject(this.userValidation);
        if(this.userValidation.isValid){
          if(this.local){
            this.newUser.emit(this.user);
            this.userDataService.setUser(null);
          }
          else{
            if(this.update){
              this.userService.editUser(this.user).subscribe((res:any)=>{
                if(res){
                  res=JSON.parse(res);
                  res.update=true;
                  const notifyConfig = new NotifyConfig(
                    Notify.Type.SUCCESS,
                    Notify.Placement.TOP_CENTER,
                    Notify.TEMPLATES.Template2,
                    'User Updated successfully',
                    ''
                  );
                  Notify.showNotify(notifyConfig);
                  this.newUser.emit(res);
                }
              })
            }else{
              if(this.associated_agency){
                this.userService.addEmployee(this.user,this.associated_agency).subscribe(
                  (response:any) => {
                    if (response.isSuccessful) {
                      if(response.message=='User already Exist'&&!response.agency_id&&response.role!=='admin'){
                        if (window.confirm('Your chosen email address is already a user of NextJourney. Do you want to make him your desired employee?')) {
                          this.user._id=response.id;
                          this.userService.editUser(this.user).subscribe((res:any)=>{
                            this.newUser.emit(this.user)
                          })
                        }
                      }else if(response.message=='User already Exist'&&response.agency_id&&response.role=='admin'){
                        const notifyConfig = new NotifyConfig(
                          Notify.Type.DANGER,
                          Notify.Placement.TOP_CENTER,
                          Notify.TEMPLATES.Template2,
                          'You can not add this user in your agency',
                          ''
                        );
                        Notify.showNotify(notifyConfig);

                      }else{
                        const notifyConfig = new NotifyConfig(
                          Notify.Type.SUCCESS,
                          Notify.Placement.TOP_CENTER,
                          Notify.TEMPLATES.Template2,
                          'User added successfully',
                          ''
                        );
                        this.user._id=response.id;

                        Notify.showNotify(notifyConfig);
                        this.newUser.emit(this.user);
                      }

                    }else{
                      const notifyConfig = new NotifyConfig(
                        Notify.Type.DANGER,
                        Notify.Placement.TOP_CENTER,
                        Notify.TEMPLATES.Template2,
                        'There is a problem',
                        ''
                      );
                      Notify.showNotify(notifyConfig);
                      this.newUser.emit(false)
                    }

                  });
              }else{
                console.log(this.user);
                this.userService.addUser(this.user).subscribe(
                  (response:any) => {
                    if (response) {
                      const notifyConfig = new NotifyConfig(
                        Notify.Type.SUCCESS,
                        Notify.Placement.TOP_CENTER,
                        Notify.TEMPLATES.Template2,
                        'User added successfully',
                        ''
                      );

                      Notify.showNotify(notifyConfig);
                      this.newUser.emit(response);
                    }

                  });
              }
            }

          }
        }else{
          const notifyConfig = new NotifyConfig(
            Notify.Type.WARNING,
            Notify.Placement.TOP_CENTER,
            Notify.TEMPLATES.Template2,
            'The Form is Not Valid',
            ''
          );
          Notify.showNotify(notifyConfig);
        }
      }else{
        const notifyConfig = new NotifyConfig(
          Notify.Type.WARNING,
          Notify.Placement.TOP_CENTER,
          Notify.TEMPLATES.Template2,
          'The BirthDate is Not Valid',
          ''
        );
        Notify.showNotify(notifyConfig);
      }
    }else{
      const notifyConfig = new NotifyConfig(
        Notify.Type.WARNING,
        Notify.Placement.TOP_CENTER,
        Notify.TEMPLATES.Template2,
        'Markup is not valid',
        ''
      );
      Notify.showNotify(notifyConfig);
    }
  }

}
