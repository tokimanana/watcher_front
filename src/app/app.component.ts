import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { ThemeService } from './services/theme.service';
import { ThemeShowcaseComponent } from './components/theme-showcase/theme-showcase.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatCardModule, ThemeShowcaseComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'watcher_front';

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    // Theme service will automatically initialize
  }
}
