import { Component, OnInit,Input } from '@angular/core';
import { ComponentService} from '../../services/component.service';
import { Package } from '../../shared/models/package.model';
// import { Component } from '../../shared/models/component.model';

@Component({
  selector: 'app-package-list',
  templateUrl: './package-list.component.html',
  styleUrls: ['./package-list.component.scss']
})
export class PackageListComponent implements OnInit {
  packageBuilder: Array<Package>;
  @Input() packages: Array<any>;
  @Input() cardsData:Array<any>;
  constructor(private componentService:ComponentService) { }

  ngOnInit() {
  }
  ngOnChanges(){
  	console.log('changed')
  }
  submitPackage(){
    this.componentService.addPackage(this.packageBuilder).subscribe(
        (response:any) => {
          if (response) {
            console.log(response)
            this.packages = [];
            // this.getPackages();
          }
      });
  }
}
