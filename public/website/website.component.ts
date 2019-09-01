import { Pattern } from './../../base/pattern';
import { FormGroup, FormBuilder,FormControl, Validators } from '@angular/forms';
import { Component, OnInit,ViewChild } from '@angular/core';
import { EmailService} from '../../services/email.service';
import { InquiryModel } from '../../shared/models/inquiry.model';
import { ReCaptchaComponent } from 'angular2-recaptcha';
import {Router} from '@angular/router';
import {UserService} from "../../services/user.service";
import {NotifyConfig} from "../../base/notify/notify-config";
import {Notify} from "../../base/notify/notify";
declare var $: any;
@Component({
  selector: 'app-website',
  templateUrl: './website.component.html',
  styleUrls: ['./website.component.scss']
})
export class WebsiteComponent implements OnInit {
  pricing:boolean=false;
  @ViewChild('slickModal') slickModal;
  email:string;
	notRobot;
	sendingEmail: boolean = false;
  form: InquiryModel = new InquiryModel();
  addForm: FormGroup;
  pattern: Pattern;
  mainSlideConfig = {
    "slidesToShow": 1,
    "slidesToScroll": 1,
    "dots": false,
    "infinite": true,
    "autoplay": false,
    "autoplaySpeed": 2500
  };
  explains = [
    {
      icon: "../../../../assets/img/4.png",
      description: "PROFESSIONAL CLOUD BASED TRIP BUILDER",
      img: [
        {
          url: "",
          address: "../../../../assets/img/explain/tripbuilder/1.jpg"
        },
        {
          url: "",
          address: "../../../../assets/img/explain/tripbuilder/2.jpg"
        },
        {
          url: "",
          address: "../../../../assets/img/explain/tripbuilder/3.jpg"
        }
      ]
    },
    {
      icon: "../../../../assets/img/5.png",
      description: "WEBSITE AND SOCIAL MEDIA AUTO PUBLISH",
      img: [
        {
          url: "",
          address: "../../../../assets/img/explain/social/1.jpg"
        },
        {
          url: "",
          address: "../../../../assets/img/explain/social/2.jpg"
        },
        {
          url: "",
          address: "../../../../assets/img/explain/social/3.jpg"
        }
      ]
    },
    {
      icon: "../../../../assets/img/2.png",
      description: "EMPLOYEE AND SALES FRIENDLY",
      img: [
        {
          url: "",
          address: "../../../../assets/img/explain/employee/1.jpg"
        },
        {
          url: "",
          address: "../../../../assets/img/explain/employee/2.jpg"
        },
        {
          url: "",
          address: "../../../../assets/img/explain/employee/3.jpg"
        }
      ]
    },
    {
      icon: "../../../../assets/img/1.png",
      description: "SHARE YOUR TRIPS WITH OTHER TRAVEL AGENCIES",
      img: [
        {
          url: "",
          address: "../../../../assets/img/explain/share/1.jpg"
        },
        {
          url: "",
          address: "../../../../assets/img/explain/share/2.jpg"
        },
        {
          url: "",
          address: "../../../../assets/img/explain/share/3.jpg"
        }
      ]
    },
    {
      icon: "../../../../assets/img/3.png",
      description: "AUTOMATE TOUR DATE AND TIME VALIDATOR",
      img: [
        {
          url: "",
          address: "../../../../assets/img/explain/validation/1.jpg"
        },
        {
          url: "",
          address: "../../../../assets/img/explain/validation/2.jpg"
        },
        {
          url: "",
          address: "../../../../assets/img/explain/validation/3.jpg"
        }
      ]
    },
    {
      icon: "../../../../assets/img/4.png",
      description: "SMART VISA PROCESS",
      img: [
        {
          url: "",
          address: "../../../../assets/img/explain/visa/1.jpg"
        },
        {
          url: "",
          address: "../../../../assets/img/explain/visa/2.jpg"
        },
        {
          url: "",
          address: "../../../../assets/img/explain/visa/3.jpg"
        }
      ]
    },


  ]
  constructor(private emailService:EmailService, private fbSubscribe: FormBuilder) {
    this.addForm= fbSubscribe.group({
      name: new FormControl(null, [Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$')])
    })
   }

  @ViewChild(ReCaptchaComponent) captcha: ReCaptchaComponent;

  ngOnInit() {
    // $(document).load(()=>{
    //   $('.slick-slider').slick('unslick');
    //   $('.carousel').slick();  
    // })
  }
  handleCorrectCaptcha(event){
  	this.notRobot = event
  }

  fb(){
    window.open('https://fb.com/nextjourney.co','_blank')
  }
  submitInquiry(form){
  	if(this.notRobot){
  		this.sendingEmail = true;
	    this.emailService.inquiryEmail(this.form).subscribe(
        (response:any) => {
	          if (response) {
	            console.log(response)
	            this.sendingEmail = false;
	            this.captcha.reset();
	          }
	      });
  	}else{
      this.showNotification('top','center',"warning","no captcha yet!")

    }
  }


  showNotification(from, align, t, message){
    const type = ['','info','success','warning','danger'];

    const color = Math.floor((Math.random() * 4) + 1);

    $.notify({
      icon: "notifications",
      message: message

    },{
      type: t[color],
      timer: 4000,
      placement: {
        from: from,
        align: align
      }
    });
  }

  submitNewsletter(){
    let newsletter={
      email:this.email
    };
    this.emailService.addNews(newsletter).subscribe((res:any)=>{
      if(res.isSuccessful){
        const notifyConfig = new NotifyConfig(
          Notify.Type.SUCCESS,
          Notify.Placement.BOTTOM_CENTER,
          Notify.TEMPLATES.Template2,
          'you has been added to our newsletter',
          ''
        );
        Notify.showNotify(notifyConfig);
        this.email='';
      }else{
        const notifyConfig = new NotifyConfig(
          Notify.Type.WARNING,
          Notify.Placement.BOTTOM_CENTER,
          Notify.TEMPLATES.Template2,
          'you are in our newsletter',
          ''
        );
        Notify.showNotify(notifyConfig);
      }
    },err=>{
      if(err.status==400){
        const notifyConfig = new NotifyConfig(
          Notify.Type.DANGER,
          Notify.Placement.BOTTOM_CENTER,
          Notify.TEMPLATES.Template2,
          'you are in our newsletter',
          ''
        );
        Notify.showNotify(notifyConfig);
      }
    })
  }


  // open(){
  //   var x = document.getElementById("myDIV");
  //   if (x.style.display === "none") {
  //     x.style.display = "block";
  //   } else {
  //     x.style.display = "none";
  //   }
  // }
}
