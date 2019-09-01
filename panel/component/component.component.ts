import {Component, OnInit} from '@angular/core';
import {ComponentService} from '../../services/component.service';
import {isNullOrUndefined} from "util";
import {ActivatedRoute, Router} from '@angular/router';
import {Memory} from "../../base/memory";
import {ComponentDataService} from "../../services/dataService/component-data.service";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-component',
  templateUrl: './component.component.html',
  styleUrls: ['./component.component.scss']
})
export class ComponentComponent implements OnInit {
  tableItems: Array<any> = [];
  typeOfComponents: Array<any> = [];
  currentForm: string = "AIRPLANE";
  listMode: boolean = false;
  update: boolean = false;
  tableData;
  nodeData;
  componentName: string;
  airlines: Array<any> = [];
  dropData = [
    {
      operatorName: 'addAirfare',
      displayName: 'Airfare',
      icon: 'flight',
      description: 'Add Manual Airfare'
    },
    {
      operatorName: 'addHotel',
      displayName: 'Hotel',
      icon: 'hotel',
      description: 'Add Manual Airfare'
    },
    {
      operatorName: 'addItenerary',
      displayName: 'Itenerary',
      icon: 'list',
      description: 'Start new Itenerary'
    }
  ]

  constructor(private componentService: ComponentService,
              private dataService: ComponentDataService,
              private router: Router,
              private auth: AuthService,
              private activeRoute: ActivatedRoute) {
  }

  ngOnInit() {
    if (this.auth.getRole() === 'van-driver') {
      this.dropData = [
        {
          operatorName: 'addVan',
          displayName: 'Van-Driver',
          icon: 'add',
          description: 'Add Manual Car/van'
        },
        {
          operatorName: 'listVan',
          displayName: 'Van-list',
          icon: 'list',
          description: 'list of car van'
        }
      ];
    }
    this.typeOfComponents = [
      {
        displayName: "Airfare",
        name: "AIRPLANE",
        icon: "airplanemode_active"
      },
      {
        displayName: "Hotel/Room",
        name: "hotel-room",
        icon: "hotel"
      },
    ];
    this.activeRoute.data.subscribe((data: { routeData: any }) => {
      if (!isNullOrUndefined(data.routeData)) {
        this.update = true;
        this.currentForm = data.routeData.type == 'AIRFARE' ? 'AIRPLANE' : data.routeData.type;
        if(this.currentForm==='list-car-van'){
          this.getVanList()
        }
        this.nodeData = data.routeData;
        this.dataService.setComponent(null)
      } else {
        this.update = false;
      }
    });
    this.activeRoute.queryParams.subscribe(params => {
      if (params['mode']) {
        this.currentForm = params['mode'];
        if(this.currentForm==='list-car-van'){
          this.getVanList()
        }
        this.update = false;

      }
    });
    this.componentService.getAllAirlines().subscribe((res: any) => {
      if (res) {
        for (let item of res.result.AirlineInfo) {
          item.AlternativeBusinessName = item.AlternativeBusinessName.toLowerCase()
        }
        this.airlines = res.result.AirlineInfo;
      }
    })
  }

  getSelected(item: any) {
    this.currentForm = item.name == 'AIRFARE' ? 'AIRPLANE' : item.name;
    this.compnentsList(this.listMode);
  }

  fetchData(node: any) {
    this.currentForm = node.type == 'AIRFARE' ? 'AIRPLANE' : node.type;
    this.nodeData = node;
  }

  compnentsList(listMode: boolean) {
    if (listMode) {
      this.componentService.getFilteredComponent(`type=${this.currentForm}&associated_agency=${Memory.getAgencyId()}&deleted=false`).subscribe(
        (response:any) => {
          if (response) {
            this.tableData = {
              hasActions: true,
              titles: [
                'From',
                'To',
                'Airline',
                'Action'
              ],
              rows: []
            };
            response.forEach((v, k) => {
              if (v.details.from && v.details.to) {
                if (v.details.from.city && v.details.to.city && v.company) {
                  this.tableData.rows.push({
                    node: v,
                    fields: [
                      v.details.from.city,
                      v.details.to.city,
                      v.company,
                      'Edit'
                    ]
                  })
                }
              }

            })
          }

        });
    }
  }

  deleteElement(component) {
    console.log(component)
    if (window.confirm('Do you want to delete this inquiry?')) {
      component.value.deleted = true;
      this.componentService.editComponent(component.value).subscribe((res: any) => {
        console.log(this.tableData)
        this.tableData.rows.splice(component.index, 1)
      })
    }
  }
  getVanList(){
    this.componentService.getFilteredComponent(`type=van-driver&associated_agency=${Memory.getAgencyId()}&deleted=false&user=${Memory.getUserIdStorage()}`).subscribe(
      (response: any) => {
        if (response) {
          response.forEach((v, k) => {

            this.tableItems.push({
              from: v.details.from.city,
              to: v.details.to.city,
              carNumber: v.details.carNumber,
              carModel: v.details.carModel,
              quantity: v.details.quantity
            })
          });
        }


      })
  }

  dropClicked(event) {
    if (event.operatorName == 'addAirfare') {
      this.router.navigate(['/panel/component'], {queryParams: {mode: 'AIRPLANE'}})

    } else if (event.operatorName == 'addHotel') {
      this.router.navigate(['/panel/component'], {queryParams: {mode: 'hotel-room'}})

    } else if (event.operatorName == 'addVan') {
      this.router.navigate(['/panel/component'], {queryParams: {mode: 'car-van'}})

    } else if (event.operatorName == 'listVan') {
      this.router.navigate(['/panel/component'], {queryParams: {mode: 'list-car-van'}})
    } else {
      this.router.navigateByUrl('/panel/packages')
    }
  }



  config = {
    actions: {
      edit: true,
      delete: true,
      preview:false,
      pagination: true,
      select: false,
      action:true
    },
    columns: [
      {
        type: 'string',
        title: 'Car Model',
        field: 'carModel',

      }, {
        type: 'string',
        title: 'Car Number',
        field: 'carNumber',
      },{
        type: 'string',
        title: 'quantity',
        field: 'quantity',
      },{
        type: 'string',
        title: 'From',
        field: 'from',
      },{
        type: 'string',
        title: 'To',
        field: 'to',
      }
    ]
  };


}
