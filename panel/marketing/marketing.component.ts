import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Memory } from '../../base/memory';
import { AgenciesService } from '../../services/agencies.service';
import { SocialService } from '../../services/social.service';
import { Router } from '@angular/router';
import { animate, style, transition, trigger } from "@angular/animations";
import { AppSettings } from '../../../app/app.setting'
import request from 'request'
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
declare var FB: any;
@Component({
  selector: 'app-marketing',
  templateUrl: './marketing.component.html',
  styleUrls: ['./marketing.component.scss'],
  animations: [
    trigger('dialog', [
      transition('void => *', [
        style({ transform: 'scale3d(.3, .3, .3)' }),
        animate(100),
      ]),
      transition('* => void', [
        animate(100, style({ transform: 'scale3d(.0, .0, .0)' })),
      ]),
    ]),
  ],
})
export class MarketingComponent implements OnInit {
  public Editor = ClassicEditor;
  ckconfig = {
    // include any other configuration you want
    extraPlugins: [ this.TheUploadAdapterPlugin ]
  };
  @ViewChild('socialBox') el: ElementRef;
  AppSettings = AppSettings;
  agencyDetails: any;
  // facebookAccounts: Array<any> = []
  facebookAccount: any
  twitterAccount: any
  telegramAccount: any
  pages: Array<any> = [];
  message: string
  memory = Memory;
  fbPost: boolean = false;
  ttPost: boolean = false;
  telPost: boolean = false;
  linkdinPost: boolean = false;
  fbPostData: Array<any>;
  ttPostData: Array<any>;
  telPostData: Array<any>;
  linkdinPostData: Array<any>;
  postScrollIndex = 0;
  allSocial;
  FB: any;
  disableFb: boolean = false;
  company: String;
  edittor:String = '';
  constructor(private agencyService: AgenciesService,
    private router: Router,
    private socialService: SocialService) { }
  json = JSON;

  TheUploadAdapterPlugin(editor) {
    console.log('TheUploadAdapterPlugin called');
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
      return new UploadAdapter(loader, '/image');
    };
  }
  ngOnInit() {


    this.initFbAccess()
    this.initSocialMedia()
    this.getAllMembers(Memory.getAgencyId())

  }



  initFbAccess() {
    (window as any).fbAsyncInit = function () {
      FB.init({
        appId: '1820096874767617',
        cookie: false,
        xfbml: false,
        version: 'v3.1',
        autoLogAppEvent: false
      });
      FB.AppEvents.logPageView();
    };

    (function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) { return; }
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }
  // add by masoud
  initSocialMedia() {


    this.socialService.getSocialMedia().subscribe((res: any) => {
      // if (!res && !res.facebook) {
      this.facebookAccount = res.facebook;
      this.twitterAccount = res.twitter
      this.telegramAccount = res.telegram

      // this.allSocial = Array.from(Object.keys(res), k=>[`${k}`, res[k]]);
      this.allSocial = Object.keys(res).map(i => ({name: i,data: res[i],active: true}))
      console.log('all socilas> ',this.allSocial)
      // console.log(res.twitter)
      // this.company =res.twitter.token        

      // }
      // else {
      //   this.facebookAccount = { pages: [] }
      // }
      // console.log(res.facebook)
      // console.log('this')

    }, err => {

    })
  }
  // add by masoud

  /****************** scroll  **********/
  // @HostListener("window:scroll", [])
  // onWindowScroll() {
  //   //we'll do some stuff here when the window is scrolled
  // }



  onScroll(ev) {
    // console.log(ev)
    let scrollT = ev.srcElement.scrollTop + 100;
    let objH = ev.srcElement.children[0].clientHeight;
    let index = Math.floor(scrollT / objH);
    this.postScrollIndex = index;
    console.log(index)

  }
  scrollToPst(i) {
    let objH = this.el.nativeElement.children[i].offsetTop;
    this.el.nativeElement.scrollTop = objH - 30;
  }
  // @HostListener('window:resize', ['$event'])
  // myfelesh() {
  //    let l = this.main.nativeElement.offsetLeft;
  //    console.log(this.main)
  //    this.felesh.nativeElement.style.left = `${200}px`;
  // }
  /**************************/

  getAllMembers(associated_agency) {
    Memory.setLoading(true)
    this.agencyService.getByReferalCode(associated_agency).subscribe((res: any) => {
      if (res.result) {
        Memory.setLoading(false)

        this.agencyDetails = res.result;
        console.log(this.agencyDetails)
      }
    })
  }
  revoke(type) {

    if (type === 'facebook') {
      delete this.agencyDetails.social_media.facebook.token;
    } else if (type === 'linkedin') {
      delete this.agencyDetails.social_media.linkedin;
    } else if (type === 'flickr') {
      delete this.agencyDetails.social_media.flickr;
    } else if (type === 'pinterest') {
      delete this.agencyDetails.social_media.pinterest;
    } else if (type === 'twitter') {
      delete this.agencyDetails.social_media.twitter;
    } else if (type === 'telegram') {
      delete this.agencyDetails.social_media.telegram;


    } else if (type === 'youtube') {
      delete this.agencyDetails.social_media.youtube;
    }
    this.agencyService.editAgencies(this.agencyDetails).subscribe((res: any) => {
      console.log(res);
    })
  }

  editAccessPage() {
    this.socialService.editFacebookPages(this.facebookAccount.pages).subscribe((res: any) => {
      console.log('edit pages done')
    })
    // this.agencyService.editAgencies(this.agencyDetails).subscribe((res: any) => {
    //   console.log(res);
    // })
  }
  accessTT() {

    // this.socialService.getTwitterAccess()
    // this.router.navigate(['/public/social'], { queryParams: { type: 'twitter' } })
    window.location.href = `${window.location.origin}/api/auth/twitter`;
  }
  accesLI() {

    // this.socialService.getTwitterAccess()
    // this.router.navigate(['/public/social'], { queryParams: { type: 'twitter' } })

  }
  accessIN() {
    window.location.href = `${window.location.origin}/api/auth/linkedin?agency_id=${Memory.getAgencyId()}`;
    // this.router.navigate(['/public/social'], { queryParams: { type: 'linkedin' } })

    // window.location.href = `${window.location.origin}/api/auth/linkedin?agency_id=${Memory.getAgencyId()}`;
  }
  accessPT() {
    this.router.navigate(['/public/social'], { queryParams: { type: 'pinterest' } })

    // window.location.href = `${window.location.origin}/api/auth/pinterest?agency_id=${Memory.getAgencyId()}`;
  }
  accessFL() {
    this.router.navigate(['/public/social'], { queryParams: { type: 'flickr' } })

    // window.location.href = `${window.location.origin}/api/auth/flickr?agency_id=${Memory.getAgencyId()}`;
  }
  setFacebooAcount(fb) {
    // this.facebookAccounts.push(fb)
    this.socialService.setFacebookAccount(fb).subscribe((res: any) => {
      console.log(res)
      // this.facebookAccount = fb
    })
  }

  accessFB() {


    FB.login((response) => {
      this.disableFb = true;
      if (response.authResponse) {
        const { accessToken, userID } = response.authResponse
        FB.api('/me/accounts', (account) => {

          // alert(JSON.stringify(account))
          let pages = account.data.map((account) => {
            return ({
              id: account.id,
              name: account.name,
              access_token: account.access_token,
              enable: false
            })
          })


          let fb = {
            token: accessToken,
            userID,
            pages
          }
          this.facebookAccount = fb
          this.setFacebooAcount(fb)
          // alert(`Login successfull userId : ${fb.userID}`)
          // alert(JSON.stringify(fb))

        })

      }
      else {
        console.log('User login failed');
        this.disableFb = false;
      }
    }, { scope: 'email,manage_pages,publish_pages,publish_to_groups', auth_type: 'reauthorize', display: 'popup' });
    // 'manage_pages', 'email', 'public_profile', 'publish_pages', 'publish_to_groups'

    // this.router.navigate(['/public/social'], { queryParams: { type: 'facebook' } })

    // window.location.href = `${window.location.origin}/api/auth/facebook?agency_id=${Memory.getAgencyId()}`;
  }

  setMessage(message) {
    this.message = message
  }
  sendMessageOnFacebookMessage(page) {
    // https://graph.facebook.com/447155729182750/feed?access_token=EAAZA3XlOtZAQEBAC219XUZAnEco30x2zjQLnZAFcwFpMD0QKG7jPZB8B3XUJOASxFlNqtuxnt3jwG2NLWR2nycY9oMyVnL8IQ8MMpUQSkfkTP4B4L2moPLM1B7llVZAuwFY1BPE5441TEg8seXYStk74e8J9txyWZCi92OESfRz3t4FMOTYLgRpZAlIc0lfKIhJ2VPVQdnbTlAZDZD&message=Hello Fans!

    // alert('send' + page.token)

    // request()

    FB.api(
      `/${page.id}/feed`,
      "POST",
      {
        "access_token": page.access_token,
        "message": 'Msg from api : ',
        "link": "https://www.google.com"
      },
      function (response) {
        alert(JSON.stringify(response))
        // if (response && !response.error) {
        //   /* handle the result */

        // }
      }
    );
  }
  logoutFacebookAccount() {
    this.disableFb = false;
    // var filtered = this.facebookAccounts.filter((item, index, arr) => {

    //   return item.userID != fb.userID

    // });

    // this.facebookAccounts = filtered
    FB.logout(function (response) {
      // alert('logout')

    });
    this.socialService.logoutFacebookAccount().subscribe((res: any) => {
      this.facebookAccount = { pages: [] }
    })

  }
  logoutTwitterAccount() {

    this.socialService.logoutTwitterAccount().subscribe((res: any) => {
      this.twitterAccount = {
        screen_name: '',
        secret: '',
        token: ''
      }
    })

  }
  logoutTelegramAccount() {

    this.socialService.logoutTelegramAccount().subscribe((response: any) => {
      this.telegramAccount = ''
    })

  }

  // pageEnable(fbUserId, pageId) {
  pageCheckBoxEvent(pageId) {
    // this.facebookAccounts.forEach((account) => {

    //   if (account.userID == fbUserId) {
    //     account.pages.forEach((page) => {
    //       if (page.id == pageId) {
    //         page.enable = !page.enable;
    //       }
    //     })

    //   }


    // })
    this.facebookAccount.pages.forEach(page => {
      if (page.id == pageId) {
        page.enable = !page.enable
      }
    })

  }
  accessYT() {
    // this.router.navigate(['/public/social'], { queryParams: { type: 'youtube' } })
    window.location.href = `${window.location.origin}/api/auth/youtube?agency_id=${Memory.getAgencyId()}`;

    // window.location.href = `${window.location.origin}/api/auth/facebook?agency_id=${Memory.getAgencyId()}`;
  }
  accessTelegram() {
    $('#telegram').modal('toggle')
  }

  receiveTelegramAccount($event) {
    this.telegramAccount = $event
  }
  loading: boolean = false;
  error: boolean = false;
  accessFBPage(token) {




    this.loading = false
    if (this.facebookAccount.pages.length != 0) {
      this.error = false
    } else {
      this.error = true
    }

    // this.pages = [];
    // this.loading = true;
    // let self = this;
    // setTimeout(function () {
    //   if (self.loading == true) {
    //     self.loading = false;
    //     self.error = true;
    //   }
    // }, 15000)

    $('#fbPages').modal()
    // this.socialService.getFacebooksPage(token).subscribe((res: any) => {
    //   this.pages = res.pages;
    //   this.loading = false;
    // }, err => {

    // })
  }
  onCheck(event, item) {
    if (event.target.checked) {
      if (this.agencyDetails.social_media.facebook.pages) {
        this.agencyDetails.social_media.facebook.pages.push(item)
      } else {
        this.agencyDetails.social_media.facebook.pages = [];
        this.agencyDetails.social_media.facebook.pages.push(item)
      }
    } else {
      this.agencyDetails.social_media.facebook.pages.splice(this.agencyDetails.social_media.facebook.pages.indexOf(event.target.value) - 1, 1)
    }
  }


  getFacebookPost() {
    this.socialService.getFbPosts().subscribe((res: any) => {

      this.fbPostData = res.result;
    })
  }
  reshareFacebookPost(post) {
    delete post._id;
    let obj = {
      chatId: this.agencyDetails.social_media.facebook,
      agencyId: Memory.getAgencyId(),
      data: post
    };
    this.socialService.postFacebook(obj).subscribe(
      response1 => {
        if (response1) {
          console.log(response1);
        }
      });

  }
  getTwitterPost() {
    this.socialService.getTTPosts().subscribe((res: any) => {
      console.log(res)
      this.ttPostData = res;
    })
  }
  reshareTwitterPost(post) {
    delete post._id;
    let obj1 = {
      oauth_token: this.agencyDetails.social_media.twitter.token,
      oauth_token_secret: this.agencyDetails.social_media.twitter.secret,
      agencyId: Memory.getAgencyId(),
      data: post
    }
    this.socialService.postTwitter(obj1).subscribe(
      (response: any) => {
        if (response) {
          console.log(response);
        }
      });
  }
  getTelegramPost() {
    this.telPost = true;
    this.socialService.getTelegramPosts().subscribe((res: any) => {
      console.log(res)

      this.telPostData = res;
    })
  }
  getLinkdinPost() {
    this.linkdinPost = true;
    this.socialService.getLinkedinPosts().subscribe((res: any) => {
      console.log(res)

      this.linkdinPostData = res;
    })
  }
  reshareLinkedinPost(post) {
    delete post._id;
    let obj1 = {
      oauth_token: this.agencyDetails.social_media.twitter.token,
      oauth_token_secret: this.agencyDetails.social_media.twitter.secret,
      agencyId: Memory.getAgencyId(),
      data: post
    }
    this.socialService.postTwitter(obj1).subscribe(
      (response: any) => {
        if (response) {
          console.log(response);
        }
      });
  }

}
export class UploadAdapter implements OnInit{
  loader;  // your adapter communicates to CKEditor through this
  url;
  constructor(loader, url) {
    this.loader = loader;   
    this.url = url;
    console.log('Upload Adapter Constructor', this.loader, this.url);
  }
  ngOnInit() {

  }
  upload() {
    return new Promise((resolve, reject) => {
      console.log('UploadAdapter upload called', this.loader, this.url);
      console.log('the file we got was', this.loader.file);
      resolve({ default: 'https://nj-dev.nextjourney.co/upload/87657656454' });
    });
  }

  abort() {
    console.log('UploadAdapter abort');
  }
}