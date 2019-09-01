import {Component, OnInit} from '@angular/core';
import {AccountingService} from '../../services/accounting.service';
import {Memory} from '../../base/memory';
import {PackageService} from '../../services/package.service';
import {ComponentService} from '../../services/component.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Print} from "../../base/print";
import {AuthService} from "../../services/auth.service";
import 'rxjs/Rx' ;

@Component({
  selector: 'app-accounting',
  templateUrl: './accounting.component.html',
  styleUrls: ['./accounting.component.scss']
})
export class AccountingComponent implements OnInit {
  tableItems: Array<any> = [];
  package: any;
  math=Math;
  mode: string = 'accounting';//manual
  typeOfFilter = [
    {
      displayName: "Description",
      name: "meta.packageName",
      icon: "airplanemode_active",
      type: "string",
      value: '',
      active: true
    },
    {
      displayName: "DateRange",
      name: "datetime",
      icon: "hotel",
      type: "dateRange",
      valueFrom: new Date(),
      valueTo: new Date(),
      active: true
    }
  ];
  page: number = 1;
  limit: number = 10;
  dropData = [
    {
      operatorName: 'addInvoice',
      displayName: 'Invoice',
      icon: 'list',
      description: 'Add Manual Invoice'
    }
  ];
  packageId: string;
  packageName: string;
  price: string;
  manualData = {
    packageId: '',
    packageName: '',
    price: ''
  };
  memory = Memory;
  preloading: boolean = true;
  constructor(private accSrv: AccountingService,
              private router: Router,
              private route: ActivatedRoute,
              private auth: AuthService,
              private packageSrv: ComponentService) {
  }

  ngOnInit() {
    let self2 =this;
    setTimeout(function () {
      self2.preloading=false
    },1500)
    Memory.setLoading(true)
    this.route.queryParams.subscribe(params => {
      if (params['id']) {
        this.mode = 'manual';
        this.manualData.packageId = params['id'];
        this.manualData.packageName = params['name'];
        this.manualData.price = params['price'];
      }
    });
    this.getTransactions()
  }

  getTransactions() {
    this.accSrv.getFilteredTransactions(`meta.agency=${Memory.getAgencyId()}`, this.page, this.limit).subscribe((res: any) => {
      if (res.isSuccessful) {
        Memory.setLoading(false);
        let i = 0;
        for (let item of res.transactions) {
          item.datetime=item.datetime.substring(0, 16).replace('T', ' ');
          item.shared=item.meta.shared?item.meta.shared:0;
          item.invoiceNo=item.meta.invoicNo?item.meta.invoicNo:0;
          item.shared=item.shared+` ${Memory.getActiveCurrency() ? Memory.getActiveCurrency() : 'PHP'}`;
          item.credit=item.credit+` ${Memory.getActiveCurrency() ? Memory.getActiveCurrency() : 'PHP'}`;

          this.packageSrv.getPackagesFilter(`_id=${item.book}`).subscribe((res1: any) => {
            console.log(res1);
            if(res1.length>0){
              item.package = res1[0];
              item.packageName = res1[0].name?res1[0].name:'package name';
              i++;
              if (i == res.transactions.length) {
                this.tableItems = this.tableItems.concat(res.transactions);
                if(this.page===1){
                  this.totalDebit=res.totalCredit;
                  this.totalCredit=res.totalDebit;
                }
              }
            }else{
              i++;
              if (i == res.transactions.length) {
                this.tableItems = this.tableItems.concat(res.transactions);
                if(this.page===1){
                  this.totalDebit=res.totalCredit;
                  this.totalCredit=res.totalDebit;
                }
              }
            }
          })
        }

      } else {
        Memory.setLoading(false)
      }
    }, err => {
      Memory.setLoading(false)
    })
  }

  goToFactor(event) {
    this.router.navigate(['print-template/invoice'], {
      queryParams: {
        id: event.id,
        agencyId: event.agencyId,
        client: event.client,
        packageId: event.package
      }
    })
  }

  totalDebit: number = 0;
  totalCredit: number = 0;

  calculateTotal() {
    console.log(this.tableItems)
    this.totalCredit = 0;
    this.totalDebit = 0
    for (let item of this.tableItems) {
      this.totalDebit += item.credit;
      this.totalCredit += item.meta.shared ? item.meta.shared : 0
    }
  }

  dropClicked(event) {
    if (event.operatorName == 'addInvoice') {
      this.mode == 'accounting' ? this.router.navigateByUrl('/panel/packages') : this.mode = 'accounting'
      if (this.mode == 'accounting') {
        this.getTransactions()
      }
    }
  }

  addTransactions(event) {
    if (event) {
      this.mode = 'accounting';
      Memory.setLoading(true);
      this.getTransactions();

    }
  }

  query: Array<any> = [];
  downLoadFile(data: any, type: string) {
    var blob = new Blob([data], { type: type});
    var url = window.URL.createObjectURL(blob);
    var pwa = window.open(url);
    if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
      alert( 'Please disable your Pop-up blocker and try again.');
    }
  }
  search(event) {
    this.tableItems=[];
    this.query = event.query;
    this.query.push({name: 'accounts', type: 'string', value: 'Income'});
    this.query.push({name: 'meta.agency', type: 'string', value: Memory.getAgencyId()});
    Memory.setLoading(true);
    this.accSrv.getFilterTransactions(this.query).subscribe((res: any) => {
      this.accSrv.getFilterTransactionsPdf().subscribe((file:any)=>{
        this.downLoadFile(file, "application/pdf")
      })
      Memory.setLoading(false);
      let i = 0;
      for (let item of res) {
        item.datetime=item.datetime.substring(0, 16).replace('T', ' ');
        item.shared=item.meta.shared?item.meta.shared:0;
        item.invoiceNo=item.meta.invoicNo?item.meta.invoicNo:0;
        // item.shared=item.shared+` ${Memory.getActiveCurrency() ? Memory.getActiveCurrency() : 'PHP'}`;
        // item.credit=item.credit+` ${Memory.getActiveCurrency() ? Memory.getActiveCurrency() : 'PHP'}`;

        this.packageSrv.getPackagesFilter(`_id=${item.book}`).subscribe((res1: any) => {
          if(res1.length>0){
            item.package = res1[0];
            item.packageName = res1[0].name?res1[0].name:'package name';
            i++;
            if (i == res.length) {
              this.tableItems = this.tableItems.concat(res);
              this.calculateTotal()

            }
          }else{
            i++;
            if (i == res.length) {
              this.tableItems = this.tableItems.concat(res);
              this.calculateTotal()

            }
          }
        })
      }
    })
  }


  print() {
    const printContent = document.getElementById('printTable');
    const WindowPrt = window.open('', '', '');
    WindowPrt.document.write(printContent.outerHTML);
    WindowPrt.print();
  }

  print1() {
    Print.PDF('sss', document.querySelector('#printTable'), 1)
    // const filename  = this.package.packageData.name+'.pdf';

    // html2canvas(document.querySelector('#printTable'),
    // {scale: 2}).then(canvas => {
    // 	let pdf = new jsPDF('p', 'mm', 'a4');
    // 	pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 211, 298);
    // 	pdf.save(filename);
    // });
  }

  getMultipleComponent(data) {
    this.packageSrv.getMultipleComponent(data).subscribe(
        (response:any) => {
        Memory.setLoading(false);
        if (response) {
          $('#myModal').modal();
          let tmpPackage = {
            packageData: data,
            componentsData: response
          };
          this.package = tmpPackage;


        }
      });
  }
  onScroll() {
    Memory.setLoading(true);
    this.page += 1;
    this.getTransactions();
  }

  config = {
    actions: {
      edit: false,
      delete: false,
      preview:true,
      pagination: true,
      select: false,
      action:true
    },
    // style:{
    //   'border-left':
    // },
    columns: [
      {
        type: 'string',
        title: 'Invoice No.',
        field: 'invoiceNo',

      }, {
        type: 'string',
        title: 'Description',
        field: 'packageName',
      },{
        type: 'string',
        title: 'last update',
        field: 'datetime',
      },{
        type: 'string',
        title: 'Debit',
        field: 'credit',
        style:{'color':'green','font-weight': 'bold'}
      },{
        type: 'string',
        title: 'Credit',
        field: 'shared',
        style:{'color':'red','font-weight': 'bold'}
      }
    ]
  };


}


