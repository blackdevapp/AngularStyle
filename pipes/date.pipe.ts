import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'njDate'
})
export class DatePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return 1222;
  }

}
