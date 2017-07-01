import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'dewidow'})
export class DewidowPipe implements PipeTransform {
  transform(value: string): string {
    let pos = value && value.lastIndexOf(' ') || -1;
    return pos > 0
      ? `${value.substring(0, pos)}&nbsp;${value.substring(pos + 1)}`
      : value;
  }
}
