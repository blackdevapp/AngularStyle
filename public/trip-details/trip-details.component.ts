import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ComponentService} from "../../services/component.service";
import {AgenciesService} from "../../services/agencies.service";

@Component({
  selector: 'app-trip-details',
  templateUrl: './trip-details.component.html',
  styleUrls: ['./trip-details.component.scss']
})
export class TripDetailsComponent implements OnInit {
  packageId: string;
  packages: Array<any> = [];
  allPackage: Array<any> = [];
  item: any;
  agency: any;
  agencyId: string;
  constructor(private activeRoute: ActivatedRoute,
              private agencyService: AgenciesService,
              private componentService: ComponentService,) { }

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
    this.activeRoute.params.subscribe(params => {
      if (params['id']) {
        this.packageId = params['id'];
        this.componentService.getOneTopPackage(this.packageId).subscribe((res: any) => {
          if (res) {
            let self = this;
            res.forEach((v) => {
              self.getMultipleComponent2(v);
            });
            this.componentService.getMultipleComponent(res[0]).subscribe(
              (response: any) => {
                if (response) {
                  let tmpPackage = {
                    packageData: res[0],
                    componentsData: response
                  };
                  this.item=tmpPackage;
                  console.log('item',this.item)

                }
              });
          }
        })

      }
    })
  }

  getMultipleComponent2(data) {
    this.componentService.getMultipleComponent(data).subscribe(
      (response: any) => {
        if (response) {
          let tmpPackage = {
            packageData: data,
            componentsData: response
          };
          this.allPackage.push(tmpPackage);
        }
      });
  }

  headerItem = {
    home: {
      title: "Home",
      description: "",
      link: ""
    }, visa: {
      title: "visa process",
      description: "",
      link: ""
    }, offers: {
      title: "special offers",
      description: "",
      link: ""
    }, contact: {
      title: "contact",
      description: "",
      link: ""
    }
  };

}
