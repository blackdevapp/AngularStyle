import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UserService} from "../../services/user.service";
import {NotifyConfig} from "../../base/notify/notify-config";
import {Notify} from "../../base/notify/notify";
import {Memory} from "../../base/memory";
import {AccountingService} from "../../services/accounting.service";

@Component({
  selector: 'app-manual-transaction',
  templateUrl: './manual-transaction.component.html',
  styleUrls: ['./manual-transaction.component.scss']
})
export class ManualTransactionComponent implements OnInit {
  price:number;
  email:string;
  user:any;
  @Input() data:any;
  memory=Memory;
  @Output() add: EventEmitter<any> = new EventEmitter();

  constructor(private userService:UserService,
              private transactionService:AccountingService) { }

  ngOnInit() {
  }


  getRegisteredUser(user){
    if(user){
      this.user = user;
      $('#myModal').modal('toggle')
    }else{
      $('#myModal').modal('toggle')
    }
  }
  goToRegister(){
    $('#myModal').modal()
  }
  goToUserInfo(){
    $('#userDetail').modal()
  }



  checkEmail(){
    this.userService.checkUserExist(this.email).subscribe((res:any)=>{
      if(res.isSuccessful){
        this.user=res.user;
      }else{
        const notifyConfig = new NotifyConfig(
          Notify.Type.WARNING,
          Notify.Placement.TOP_CENTER,
          Notify.TEMPLATES.Template2,
          'user with this email does not exist',
          ''
        );
        Notify.showNotify(notifyConfig);
      }
    })
  }
  submit(){
    var transaction={
      packageId:this.data.packageId,
      userId:this.user._id,
      agencyId:Memory.getAgencyId()
    }
    this.transactionService.insertTransaction(transaction).subscribe((res:any)=>{
      if(res.isSuccessful){
        this.add.emit(true);
        console.log(res);
      }else{
        this.add.emit(false);
      }
    })
  }

}
