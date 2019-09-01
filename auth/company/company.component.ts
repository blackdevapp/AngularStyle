import {Component, OnInit} from '@angular/core';
import {UserService} from "../../services/user.service";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {NotifyConfig} from "../../base/notify/notify-config";
import {Notify} from "../../base/notify/notify";
import {Memory} from "../../base/memory";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Pattern} from "../../base/pattern";

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {
  notRobot: any;
  company: Company = new Company();
  loading: boolean = false;
  mode = '';
  activeItem: boolean = false;
  activeItem2: boolean = false;
  activeItem3: boolean = false;
  registerForm: FormGroup;

  constructor(
    private userService: UserService,
    private auth: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.registerForm = fb.group({
      companyName: new FormControl(null, [Validators.required, Validators.minLength(5)]),
      representative: new FormControl(null, [Validators.required, Validators.minLength(3)]),
      email: new FormControl(null, [Validators.required, Validators.pattern(Pattern.email)]),
      number: new FormControl(null, [Validators.required, Validators.pattern(Pattern.phone), Validators.maxLength(11)])
    })
  }

  ngOnInit() {
    if (this.auth.loggedIn) {
      this.router.navigateByUrl('/panel/profile')
    } else {
      this.mode = 'B'
    }
  }

  show() {
    var x = document.getElementById("myDIV");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  }

  hide() {
    var x = document.getElementById("myDIV");
    if (x.style.display === "block") {
      x.style.display = "none";
    }
  }

  goToItem1() {
    this.activeItem = true;
    this.activeItem2 = false;
    this.activeItem3 = false;
  }

  goToItem2() {
    this.activeItem2 = true;
    this.activeItem = false;
    this.activeItem3 = false;

  }


  goToItem3() {
    this.activeItem3 = true;
    this.activeItem = false;
    this.activeItem2 = false;
  }

  registerCompany() {
    this.loading = true;
    Memory.setCompanyName(this.company.companyName);
    this.userService.registerCompany(this.company).subscribe((res: any) => {
      if (res.isSuccessful) {
        if (res.agency) {
          Memory.setActiveCurrency(res.agency.config.currency);

          const doneRegistration = new NotifyConfig(
            Notify.Type.SUCCESS,
            Notify.Placement.BOTTOM_CENTER,
            Notify.TEMPLATES.Template2,
            'Please check your email to complete registration',
            ''
          );

          Notify.showNotify(doneRegistration);
          this.loading = false;
        }
        if (res.isSuccessfulList) {
          Memory.setCompanyList(res.result)
        }
        if (this.auth.loginWithToken(res.token)) {
          this.loading = false;

          this.router.navigateByUrl('/panel/packages');
        }
      } else if(res.message){
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
    }, err => {
      this.loading = false;
      const notifyConfig = new NotifyConfig(
        Notify.Type.DANGER,
        Notify.Placement.BOTTOM_CENTER,
        Notify.TEMPLATES.Template2,
        'Invalid data!',
        ''
      );
      Notify.showNotify(notifyConfig);
    })
  }

  handleCorrectCaptcha(event) {
    this.notRobot = event
  }

}

export class Company {
  email: string;
  mobile: string;
  companyName: string;
  dtiNumber: string;
  representative: string;
}
