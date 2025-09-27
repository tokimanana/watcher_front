import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './star-rating.component.html',
  styleUrl: './star-rating.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StarRatingComponent {
  rating = input<number>(0);
  readOnly = input<boolean>(false);
  small = input<boolean>(false);

  stars = input<number[]>([1, 2, 3, 4, 5]);

  // Make Math available in the template
  protected Math = Math;
  protected Number = Number;
}
