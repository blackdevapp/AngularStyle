import {Component, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import {Router, NavigationEnd, NavigationStart, ActivatedRoute} from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import {ReCaptchaComponent} from 'angular2-recaptcha';
import {User} from "../../shared/models/user.model";
import {AgenciesService} from "../../services/agencies.service";
import {Memory} from "../../base/memory";
import {NotifyConfig} from "../../base/notify/notify-config";
import {Notify} from "../../base/notify/notify";
// import { ToastComponent } from '../shared/toast/toast.component';

@Component({
  selector: 'app-singup',
  templateUrl: './singup.component.html',
  styleUrls: ['./singup.component.scss']
})
export class SingupComponent implements OnInit {
  notRobot;
  mode:string='C';
  referralCode:string;
  @ViewChild(ReCaptchaComponent) captcha: ReCaptchaComponent;

  singupForm: FormGroup;
  username = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(100)
  ]);
  email = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(100)
  ]);
  password = new FormControl('', [
    Validators.required,
    Validators.minLength(6)
  ]);
  // confirmpassword = new FormControl('', [
  //   Validators.required,
  //   Validators.minLength(6)
  // ]);
  // mobileNo = new FormControl('', [
  //   Validators.required,
  //   Validators.minLength(11),
  //   Validators.maxLength(11),
  // ]);
  returnUrl:string;
  loading:boolean=false;
  constructor(private auth: AuthService,
              private user: UserService,
              private agenciesService:AgenciesService,
              private formBuilder: FormBuilder,
              private route:ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    Memory.clearOnBoard()
    if (this.auth.isValidToken()) {
      if(this.auth.getRole()==='user'){
        this.router.navigate(['/panel/inqueries']);
      }else{
        this.router.navigate(['/panel/dashboard']);
      }
    }else{
      this.route.queryParams.subscribe(params=>{
        if(params['returnUrl']){
          this.returnUrl=params['returnUrl'];
        }
        if(params['refferalCode']){
          this.referralCode=params['refferalCode'];
          this.goToOnBoarding();
        }
      })
    }
    this.singupForm = this.formBuilder.group({
      username: this.username,
      email: this.email,
      password: this.password
      // confirmpassword: this.confirmpassword,
      // mobileNo: this.mobileNo
    });
  }
  handleCorrectCaptcha(event){
    this.notRobot = event
  }

  setClassUserName() {
    return { 'has-danger': !this.username.pristine && !this.username.valid };
  }

  setClassEmail() {
    return { 'has-danger': !this.email.pristine && !this.email.valid };
  }

  setClassPassword() {
    return { 'has-danger': !this.password.pristine && !this.password.valid };
  }

  // setClassConfirmPassword() {
  //   return { 'has-danger': !this.confirmpassword.pristine && !this.password.valid };
  // }

  goToOnBoarding(){
    this.loading=true;
    this.agenciesService.getByReferalCode(this.referralCode).subscribe((res:any)=>{
      if(res.result){
        this.loading=false;
        if(res.result.onboarded===false){
          Memory.setAgencyId(this.referralCode);
          Memory.setUserId(res.result.admin);
          Memory.setAgencyReferralId(res.result._id);
          this.router.navigate(['/onboarding'])
        }else{
          const notifyConfig = new NotifyConfig(
            Notify.Type.WARNING,
            Notify.Placement.TOP_CENTER,
            Notify.TEMPLATES.Template2,
            'Onboarding completed! ',
            ''
          );
          Notify.showNotify(notifyConfig);
          this.router.navigate(['/login'])
        }

      }else{
        this.loading=false;
        const notifyConfig = new NotifyConfig(
          Notify.Type.WARNING,
          Notify.Placement.TOP_CENTER,
          Notify.TEMPLATES.Template2,
          'referral code is not valid',
          ''
        );
        Notify.showNotify(notifyConfig);
      }
    })
  }

  singup() {
    this.loading=true;
    this.user.register(this.singupForm.value,this.returnUrl).subscribe((res:any) => {
      this.loading=false;
      if(res.isSuccessful){
        if(res.message==='User already Exist'){
          const notifyConfig = new NotifyConfig(
            Notify.Type.WARNING,
            Notify.Placement.TOP_CENTER,
            Notify.TEMPLATES.Template2,
            'User already Exist',
            ''
          );
          Notify.showNotify(notifyConfig);
        }else{
          this.router.navigate(['/login']);
          const notifyConfig = new NotifyConfig(
            Notify.Type.WARNING,
            Notify.Placement.TOP_CENTER,
            Notify.TEMPLATES.Template2,
            'Your registration is now on process. Please check your email to complete the process! ',
            ''
          );
          notifyConfig.settings.delay=1000000;
          notifyConfig.settings.allow_dismiss=true;
          Notify.showNotify(notifyConfig);
        }
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
      const notifyConfig = new NotifyConfig(
        Notify.Type.WARNING,
        Notify.Placement.TOP_CENTER,
        Notify.TEMPLATES.Template2,
        'Some Error has been happened',
        ''
      );
      Notify.showNotify(notifyConfig);
    });
  }
  goToLogin(){
    this.router.navigate(['/login']);
  }
  facebook(){
    this.router.navigate(['/public/social'],{queryParams:{type:'facebook',modeFB:'register'}})
  }
}
