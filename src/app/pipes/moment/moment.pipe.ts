import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({name: 'moment'})
export class MomentPipe implements PipeTransform {
  transform(value: string | number, format: string): string {
    return moment(value).format('MMMM Do YYYY, h:mma');
  }
}
