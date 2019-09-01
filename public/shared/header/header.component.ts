import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from "../../../services/auth.service";
import {Memory} from "../../../base/memory";
import {InqueriesService} from "../../../services/inqueries.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() agency:any;
  count:any;
  loggedIn:boolean
  constructor(private router:Router,
              private inqueriesService:InqueriesService,
              private auth:AuthService) { }

  ngOnInit() {
    this.loggedIn=this.auth.loggedIn;
    if(this.auth.loggedIn){
      this.inqueriesService.getInqueiesByFilter(`to=${Memory.getAgencyId()}&inquirer=${Memory.getUserIdStorage()}&count=1`).subscribe((res:any)=>{
        this.count=res;
      })
    }
  }

  navigateTo(route){
    this.router.navigateByUrl(route)
  }

  goToDash(){
    if(this.auth.loggedIn){
      this.router.navigateByUrl('/panel/inqueries')
    }
  }

}
