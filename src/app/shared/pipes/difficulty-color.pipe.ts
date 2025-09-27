import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'difficultyColor',
  standalone: true
})
export class DifficultyColorPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
