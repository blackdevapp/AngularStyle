import { Component, OnInit,Input,EventEmitter,Output } from '@angular/core';
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  @Input() partialTable: Boolean = false;
	@Input() data;
	@Input() config:any;
	@Input() loading:boolean;
	@Input() titles:Array<string>;

	@Output() toEdit: EventEmitter<any> = new EventEmitter();
	@Output() scroll: EventEmitter<any> = new EventEmitter();
	@Output() toDelete: EventEmitter<any> = new EventEmitter();
	@Output() dropdown: EventEmitter<any> = new EventEmitter();
	@Output() image: EventEmitter<any> = new EventEmitter();
	@Output() button: EventEmitter<any> = new EventEmitter();
	hasData: boolean = false;
  constructor(private auth:AuthService) { }
  search:string;
  isUser:boolean;
  ngOnInit() {
    this.isUser=this.auth.getRole()==='user';
  }
  imageClicked(id){
    this.image.emit(id)
  }
  buttonClicked(row){
    this.button.emit(row)
  }
  getSelectedCount(){
    let count=0;
    this.data.forEach(function (item) {
      if(item.selected==true)
        count+=1;
    });
    return count;
  }
  goEdit(item){
  	this.toEdit.emit(item);
  }
  goDelete(item,i){
    console.log('omad')
    let data={
      value:item,
      index:i
    };
  	this.toDelete.emit(data);
  }
  changeStatus(row,field,data){
    row[field]=data;
    this.dropdown.emit(row)
  }
  onScroll(){
    this.scroll.emit()
  }

}




//
//
// then(function(result){
//   cartItems = [];
//   cartItems = cartItems.concat(result);
//   cartItems.forEach(function (item) {
//     console.log(item)
//     var cartItem=item;
//     cartItem.cart_count=cartItem.cart_count?cartItem.cart_count:1
//     cartItem.count=cartItem.count?cartItem.count:1
//     var sum_count = cartItem.count + cartItem.cart_count;
//     var cart_item_setter = {"cart_count": sum_count};
//     if (!isNaN(amount)) {
//       cart_item_setter["amount"] = cartItem.amount;
//     }
//     CartItem.updateOne(_.assign({"_id": cartItem._id}, user_finder), {"$set": cart_item_setter}, (err) => {
//       if (err) {
//         reject(err);
//       }
//       var m_cartItem = JSON.parse(JSON.stringify(cartItem));
//       m_cartItem["cart_count"] = cart_count;
//     })
//   })
// });
