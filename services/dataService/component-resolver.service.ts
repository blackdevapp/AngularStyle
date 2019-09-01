import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {take,map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {ComponentDataService} from './component-data.service';

@Injectable()
export class ComponentResolverService implements Resolve<any>{

  constructor(
    protected router: Router,
    protected dataService: ComponentDataService) {
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.getCurrentComponent();
  }

  retResolved(res):any{
    return res;
  }
  private getCurrentComponent() {
    return this.dataService.getComponent
      .pipe(take(1), map((res: any) => {
          return this.retResolved(res);
        }
      ));
  }
}
