import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'platformIcon',
  standalone: true,
})
export class PlatformIconPipe implements PipeTransform {
  transform(platform: string): string {
    const platformIcons: { [key: string]: string } = {
      udemy: '/assets/images/platforms/udemy.png',
      coursera: '/assets/images/platforms/coursera.png',
      youtube: '/assets/images/platforms/youtube.png',
      freecodecamp: '/assets/images/platforms/freecodecamp.png',
    };

    return (
      platformIcons[platform.toLowerCase()] ||
      '/assets/images/platforms/default.png'
    );
  }
}
