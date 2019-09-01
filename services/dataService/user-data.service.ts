import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {User} from "../../shared/models/user.model";

@Injectable()
export class UserDataService {

  constructor() { }
  private user = new BehaviorSubject<User>(null);


  getUser = this.user.asObservable();

  setUser(userOne) {
    // console.log(userOne)
    this.user.next(userOne)
  }
}
