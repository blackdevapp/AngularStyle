import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable()
export class PackageDataService {

  constructor() { }
  private package = new BehaviorSubject<any>(null);


  getPackage = this.package.asObservable();

  setPackage(packageOne) {
    // console.log(packageOne)
    this.package.next(packageOne)
  }
}
