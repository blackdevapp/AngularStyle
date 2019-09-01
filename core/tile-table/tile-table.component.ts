import {Component, Input, OnInit, OnChanges, Output, EventEmitter} from '@angular/core';
import { Memory } from '../../base/memory';
import * as html2canvas from "html2canvas"
import * as jsPDF from 'jspdf'
import { ComponentService } from '../../services/component.service';
import { Print } from '../../base/print';
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-tile-table',
  templateUrl: './tile-table.component.html',
  styleUrls: ['./tile-table.component.scss']
})
export class TileTableComponent implements OnInit {
  @Input() data;
  @Input() config:any;
  @Input() loading:boolean;
  @Input() items:Array<any>=[];
	@Output() factor: EventEmitter<any> = new EventEmitter();



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
  memory=Memory;
  ngOnInit() {
    console.log(this.items);
  }

  getStatus(item){
    if(!item.meta.shared){
      item.meta.shared=0
    }
    if(item.credit-item.meta.shared>0){
      return '2px solid green'
    }
    if(item.credit-item.meta.shared==0){
      return '2px solid yellow'
    }
    if(item.credit-item.meta.shared<0){
      return '2px solid red'
    }
  }

  goToPrint(item){
    this.factor.emit({
      id:item._id,
      agencyId:item.meta.agency,
      client:item.meta.client,
      package:item.meta.package
    })
  }
  imageClicked(id){
    console.log(1,id)
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
