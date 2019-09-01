import { Component, OnInit } from '@angular/core';
import { ComponentService } from '../../services/component.service';
import { ActivatedRoute } from '@angular/router';
import { AgenciesService } from '../../services/agencies.service';
import { Print } from '../../base/print';
import { Memory } from '../../base/memory';
import * as html2canvas from "html2canvas"
import * as jsPDF from 'jspdf'
import { User } from '../../shared/models/user.model';
import { UserService } from '../../services/user.service';
import { PackageService } from '../../services/package.service';
import * as moment from 'moment';

declare let $:any
@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {
  agency:any;
  transactions:Array<any>=[];
  memory=Memory;
  package:any;
  user:User=new User();
  userCreator:User=new User();
  today=moment(new Date()).format('DD/MM/YYYY')
  constructor(private componentService:ComponentService,
    private agencyService:AgenciesService,
    private userService:UserService,
    private packageService:PackageService,
    private route:ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params=>{
      if(params['agencyId']){
        this.agencyService.getByReferalCode(params['agencyId']).subscribe((res:any)=>{
          this.agency=res.result;
        })
      }if(params['id']){
        this.agencyService.getTransactionById(params['id']).subscribe((res:any)=>{
          if(res.isSuccessful){
            this.transactions=res.transactions;
          }
        })
      }
      if(params['client']){
        this.userService.getUserById(params['client']).subscribe((res:any)=>{
          console.log('user',res)
          this.user=res;
        })
      }
      if(params['packageId']){
        this.packageService.getFilteredPackage(`_id=${params['packageId']}`).subscribe((res:any)=>{
          console.log('package',res)
          this.package=res;
          this.userService.getUserById(this.package.creator).subscribe((res:any)=>{
            this.userCreator=res;
          })

        })
      }
    })
    let self=this
    // setTimeout(function(){
    //   self.print()
    // },6000)
  }
  print(){
    // var data = document.getElementById('contentToConvert');  
    // html2canvas(data).then(canvas => {  
    //   // Few necessary setting options  
    //   var imgWidth = 208;   
    //   var pageHeight = 295;    
    //   var imgHeight = canvas.height * imgWidth / canvas.width;  
    //   var heightLeft = imgHeight;  
  
    //   const contentDataURL = canvas.toDataURL('image/png')  
    //   // let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF  
    //   var position = 0;  
    //   pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)  
    //   pdf.save('MYPdf.pdf'); // Generated PDF   
    // });  
    Print.PDF(this.agency.company_name,document.querySelector('#printTemplate'),5)
  }
}
