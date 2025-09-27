import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'platformIcon',
  standalone: true,
})
export class PlatformIconPipe implements PipeTransform {
  transform(platform: string): string {
    const platformIcons: { [key: string]: string } = {
      udemy: '/images/platforms/udemy.png',
      coursera: '/images/platforms/coursera.png',
      youtube: '/images/platforms/youtube.png',
      freecodecamp: '/images/platforms/freecodecamp.png',
    };

    return (
      platformIcons[platform.toLowerCase()] ||
      '/images/platforms/default.png'
    );
  }
}
