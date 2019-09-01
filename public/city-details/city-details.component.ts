import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {AgenciesService} from "../../services/agencies.service";
import {ComponentService} from "../../services/component.service";

@Component({
  selector: 'app-city-details',
  templateUrl: './city-details.component.html',
  styleUrls: ['./city-details.component.scss']
})
export class CityDetailsComponent implements OnInit {
cityId: string;
package:any;
agency:any;
bestSellerPackage:Array<any>=[];
  agencyId:string;
  constructor(private activeRoute: ActivatedRoute,
              private componentService: ComponentService,
              private agencyService: AgenciesService) { }

  ngOnInit() {
    this.activeRoute.params.subscribe(params =>{
      if(params['agencyId']){
        this.cityId= params['agencyId'];
        this.componentService.getOneTopPackage(this.cityId).subscribe((res: any) => {
          if (res) {
            this.package = res[0];
          }
        })

        this.componentService.getTopPackage(this.agencyId).subscribe((res : any) =>{
          if (res.isSuccessful){
            console.log('top',res)
            res.results.forEach((v, k) => {
              this.getMultipleComponent1(v)
            })
            // this.bestSellerPackage=res.results;
          }
        });
      }
    })
  }

  getMultipleComponent1(data) {
    this.componentService.getMultipleComponent(data).subscribe(
      (response: any) => {
        if (response) {
          let tmpPackage = {
            packageData: data,
            componentsData: response
          };
          this.bestSellerPackage.push(tmpPackage);
          console.log(this.bestSellerPackage);
        }
      });
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
}
