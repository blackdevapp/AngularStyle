import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AgenciesService} from "../../../services/agencies.service";
import {ContactService} from "../../../services/contact.service";
import {Contact} from "../../../shared/models/contact.model";
import {NotifyConfig} from "../../../base/notify/notify-config";
import {Notify} from "../../../base/notify/notify";

@Component({
  selector: 'app-theme-one-contact',
  templateUrl: './theme-one-contact.component.html',
  styleUrls: ['./theme-one-contact.component.scss']
})
export class ThemeOneContactComponent implements OnInit {
  agencyId:string;
  agency:any;
  contact : Contact= new Contact();


  constructor(private activeRoute: ActivatedRoute,
              private agencyService: AgenciesService,
              private router: Router,
              private contactService: ContactService) { }

  ngOnInit() {
    this.activeRoute.params.subscribe(params=> {
      if (params['agencyId']) {
        this.agencyId = params['agencyId'];
        // this.getPackage()
        this.agencyService.getByReferalCode(this.agencyId).subscribe((res: any) => {
          console.log(res)
          if (res.result) {
            this.agency = res.result;
          }
        })
      }
    })
  }

  headerItem={
    home:{
      title:"Home",
      description:"",
      link:""
    },visa:{
      title:"visa process",
      description:"",
      link:""
    },offers:{
      title:"special offers",
      description:"",
      link:""
    },contact:{
      title:"contact",
      description:"",
      link:""
    }
  };

  send(){
    this.contactService.addComment(this.contact,this.agencyId).subscribe((res: any) =>{
      if(res.isSuccessful) {
        console.log('res',res)
        const notifyConfig = new NotifyConfig(
          Notify.Type.SUCCESS,
          Notify.Placement.BOTTOM_CENTER,
          Notify.TEMPLATES.Template2,
          'Your comment has been registered',
          ''
        );
        Notify.showNotify(notifyConfig);
      }
    })
  }

  goToHome() {
    this.router.navigateByUrl('/public/1/' + this.agencyId)
  }

  panel() {
    this.router.navigateByUrl('login')
  }
}
