import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {PackageDataService} from './package-data.service';
import {take,map} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Injectable()
export class PackageResolverService implements Resolve<any>{

  constructor(
    protected router: Router,
    protected packageDataService: PackageDataService) {
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.getCurrentPackage();
  }

  retResolved(res):any{
    return res;
  }
  private getCurrentPackage() {
    return this.packageDataService.getPackage
      .pipe(take(1), map((res: any) => {
          return this.retResolved(res);
        }
      ));
  }
}
