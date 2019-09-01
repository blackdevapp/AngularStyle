import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable()
export class ComponentDataService {

  constructor() { }
  private component = new BehaviorSubject<any>(null);


  getComponent = this.component.asObservable();

  setComponent(componentOne) {
    this.component.next(componentOne)
  }
}
