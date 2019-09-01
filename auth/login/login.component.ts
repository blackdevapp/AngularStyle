import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, NavigationEnd, NavigationStart, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';
import { Result } from '@zxing/library';
import { NotifyConfig } from "../../base/notify/notify-config";
import { Notify } from "../../base/notify/notify";
import {PackageService} from "../../services/package.service";
import {Memory} from "../../base/memory";
import {AppSettings} from "../../app.setting";
import { ContentLoaderModule } from '@netbasal/ngx-content-loader';

declare var Math;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  appSetting=AppSettings;
  @ViewChild('scanner')
  scanner: ZXingScannerComponent;
  mode: string = 'C';//forget
  hasCameras = false;
  hasPermission: boolean;
  qrResultString: string;
  emailPass: string;

  availableDevices: MediaDeviceInfo[];
  selectedDevice: MediaDeviceInfo;
  useQr: boolean = false;
  qrLoading: boolean = false;

  loginForm: FormGroup;
  showPass: boolean = true;
  email = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(100)
  ]);
  password = new FormControl('', [
    Validators.required,
    Validators.minLength(6)
  ]);
  math = Math;
  bgImg;
  loading:boolean=false;
  preloading:boolean=true;
  images = [1, 2, 3, 4].map(() => `https://picsum.photos/900/500?random&t=${Math.floor(Math.random() * 10) + 1}`);

  constructor(private auth: AuthService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private packageService:PackageService,
    private router: Router) { }

  ngOnInit() {
    let self =this;
    setTimeout(function () {
      self.preloading=false
    },1500)
    Memory.clearCompanyName();
    let currencyList:any={};
    this.packageService.exchangePrice('PHP','USD').subscribe((res:any)=>{
      currencyList['PHP_USD']=res['PHP_USD'];
      currencyList['USD_PHP']=1/res['PHP_USD'];
      this.packageService.exchangePrice('EUR','USD').subscribe((res:any)=>{
        currencyList['EUR_USD']=res['EUR_USD'];
        currencyList['USD_EUR']=1/res['EUR_USD'];
        this.packageService.exchangePrice('EUR','PHP').subscribe((res:any)=>{
          currencyList['EUR_PHP']=res['EUR_PHP'];
          currencyList['PHP_EUR']=1/res['EUR_PHP'];
          Memory.setCurrency(JSON.stringify(currencyList));
        });
      });
    });
    this.route.queryParams.subscribe((params: any) => {
      if (params['token']) {
        if (this.auth.loginWithToken(params['token']) && params['mode']) {
          this.router.navigate(['/panel/profile'], { queryParams: { mode: params['mode'] } });

        } else if (this.auth.loginWithToken(params['token'])) {
          this.router.navigate(['/panel/profile']);
        }
      } else {
        if (this.auth.isValidToken()) {

          //   this.router.navigateByUrl('/dashboard', { skipLocationChange: true });
          if (this.auth.getRole() === 'user') {
            this.router.navigate(['/panel/inqueries']);
          } else if (this.auth.getRole() === 'superadmin') {
            this.router.navigate(['/panel/admin']);
          } else if (this.auth.getRole() === 'van-driver'||this.auth.getRole() === 'tour-guide'||this.auth.getRole() === 'company') {
            this.router.navigate(['/panel/profile']);
          } else {
            this.router.navigate(['/panel/dashboard']);
          }

        }
      }
    })

    this.loginForm = this.formBuilder.group({
      email: this.email,
      password: this.password
    });
    this.bgImg = this.images[0]
    console.log(this.bgImg)


    // QR
    this.scanner.camerasFound.subscribe((devices: MediaDeviceInfo[]) => {
      this.hasCameras = true;

      console.log('Devices: ', devices);
      this.availableDevices = devices;

      // selects the devices's back camera by default
      // for (const device of devices) {
      //     if (/back|rear|environment/gi.test(device.label)) {
      //         this.scanner.changeDevice(device);
      //         this.selectedDevice = device;
      //         break;
      //     }
      // }
    });

    this.scanner.camerasNotFound.subscribe((devices: MediaDeviceInfo[]) => {
      console.error('An error has occurred when trying to enumerate your video-stream-enabled devices.');
    });

    this.scanner.permissionResponse.subscribe((answer: boolean) => {
      this.hasPermission = answer;
    });
  }

  setClassEmail() {
    return { 'has-danger': !this.email.pristine && !this.email.valid };
  }

  setClassPassword() {
    return { 'has-danger': !this.password.pristine && !this.password.valid };
  }

  loginWithCypher() {
    this.loading=true
    this.auth.loginQrCode(this.qrResultString).subscribe(
      res => {
        this.loading=false
        if (res === 'superadmin') {
          this.router.navigate(['/panel/admin']);
        } else {
          this.router.navigate(['/panel/profile']);
        }
        // window.location.href = "/profile"
        // this.auth.setFirstLogin();
        this.qrLoading = false;
      },
      error => {
        this.loading=false

        if (error.status == 403) {
          const notifyConfig = new NotifyConfig(
            Notify.Type.DANGER,
            Notify.Placement.BOTTOM_CENTER,
            Notify.TEMPLATES.Template2,
            'Invalid username or password!',
            ''
          );
          Notify.showNotify(notifyConfig);
        }
      });
  }
  login() {
    let self=this;
    setTimeout(function () {
      self.loading=false;

    },3000)
    this.loading=true;
    this.auth.login(this.loginForm.value).subscribe(
      res => {
        this.loading=false;
        if (res === 'superadmin') {
          this.router.navigate(['/panel/admin']);
        } else {

          this.router.navigate(['/panel/profile']);
        }
        // window.location.href = "/profile"
        // this.auth.setFirstLogin();
        this.qrLoading = false;
      },
      error => {
        this.loading=false;
        if (error.status == 403) {
          const notifyConfig = new NotifyConfig(
            Notify.Type.DANGER,
            Notify.Placement.BOTTOM_CENTER,
            Notify.TEMPLATES.Template2,
            'Invalid username or password!',
            ''
          );
          Notify.showNotify(notifyConfig);
        }
      });

  }
  handleQrCodeResult(resultString: string) {
    console.log('Result: ', resultString);
    this.qrResultString = resultString;
    // let tmpData = JSON.parse(this.qrResultString);
    this.qrLoading = true;
    // this.loginForm = this.formBuilder.group({
    // email: tmpData.username,
    // password: tmpData.password.toString()
    // });
    this.loginWithCypher();
  }

  onDeviceSelectChange(selectedValue: string) {
    console.log('Selection changed: ', selectedValue);
    // this.selectedDevice = this.scanner.getDeviceById(selectedValue);
  }
  goToSignup() {
    this.router.navigate(['/signup']);

  }
  forgetPass() {
    this.loading=true;
    this.auth.forgetPass(this.emailPass).subscribe((res: any) => {
      this.loading=false;

      if (res.isSuccessful) {
        const notifyConfig = new NotifyConfig(
          Notify.Type.SUCCESS,
          Notify.Placement.BOTTOM_CENTER,
          Notify.TEMPLATES.Template2,
          'Password has been sent to your email address.',
          ''
        );
        Notify.showNotify(notifyConfig);
      }
    },err=>{
      this.loading=false;

      if (err.status == 403) {
        const notifyConfig = new NotifyConfig(
          Notify.Type.DANGER,
          Notify.Placement.BOTTOM_CENTER,
          Notify.TEMPLATES.Template2,
          'Invalid Email Address!',
          ''
        );
        Notify.showNotify(notifyConfig);
      }
    })
  }
  facebook() {
    this.router.navigate(['/public/social'], { queryParams: { type: 'facebook', modeFB: 'register' } })
  }
  twitter() {
    this.router.navigate(['/public/social'], { queryParams: { type: 'twitter', modeTT: 'register' } })
  }
  google() {
    this.router.navigate(['/public/social'], { queryParams: { type: 'google'} })
  }

}
