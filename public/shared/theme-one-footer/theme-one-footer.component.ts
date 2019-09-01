import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AgenciesService} from "../../../services/agencies.service";

@Component({
  selector: 'app-theme-one-footer',
  templateUrl: './theme-one-footer.component.html',
  styleUrls: ['./theme-one-footer.component.scss']
})
export class ThemeOneFooterComponent implements OnInit {
  @Input() agency;
  @Input() headerItem;
  agencyId:string;

  constructor(private router:Router,
              private activeRoute: ActivatedRoute,
              private agencyService: AgenciesService,) { }

  ngOnInit() {
    this.activeRoute.params.subscribe(params=>{
      if(params['id']){
        this.agencyId=params['id']
        this.agencyService.getByReferalCode(this.agencyId).subscribe((res: any) => {
          if (res.result) {
            this.agency = res.result;
            console.log('agency',res.result)
          }
        })
      }
    });
  }

  goToVisa() {
    this.router.navigateByUrl('/public/1/' + this.agencyId + '/visa')
  }

  goToContact() {
    this.router.navigateByUrl('/public/1/' + this.agencyId + '/contact')
  }

  goToHome() {
    this.router.navigateByUrl('/public/1/' + this.agencyId)
  }
}
