import {Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';

@Component({
  selector: 'app-timline',
  templateUrl: './timline.component.html',
  styleUrls: ['./timline.component.scss']
})
export class TimlineComponent implements OnInit {
  actIndex = 0;
  @Input('inpt')items;
  @Input('active') set active(value:number) {
      this.actIndex = value;
      this.scrollToPst(this.actIndex);
  }
  // @Input('active')actIndex;
  @Output()someEvent = new EventEmitter<any>();
  @ViewChild('scrollBox') el:ElementRef;

  constructor() { }

  ngOnInit() {
    // this.scrollToPst(this.actIndex);
  }

  sendIndex(i){

    this.someEvent.next(i);
  }
  scrollToPst(i){
    if (this.el.nativeElement.children.length >0){
      // let objH = this.el.nativeElement.children[i].offsetLeft;
      // console.log(objH)
      // // this.el.nativeElement.scrollLeft = objH ;
      this.el.nativeElement.children[i].scrollIntoView()
    }
    console.log('---------------',this.el)

    //this.el.nativeElement.children[i].offsetLeft = 0;
    //this.el.nativeElement.offsetLeft = 0;
  }
  scrollLeft(){
    this.el.nativeElement.scrollLeft -= 220
  }
  scrollRight(){
    this.el.nativeElement.scrollLeft += 220
  }
}
