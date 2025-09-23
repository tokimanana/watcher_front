# Theme System Guide

## Overview

This project implements a comprehensive, maintainable theme system following modern CSS and Angular best practices. The theme supports both light and dark modes, uses CSS custom properties for dynamic theming, and provides a complete set of utility classes and components.

## Architecture

### File Structure
```
src/styles/
├── _variables.scss    # CSS custom properties and SCSS variables
├── _mixins.scss      # Reusable SCSS mixins
├── _base.scss        # Base styles and resets
├── _components.scss  # Component-specific styles
├── _utilities.scss   # Utility classes
└── styles.scss       # Main entry point
```

### Key Features

1. **CSS Custom Properties**: Dynamic theming with CSS variables
2. **Dark/Light Theme Support**: Automatic system preference detection
3. **Utility Classes**: Comprehensive utility system for rapid development
4. **Component Mixins**: Reusable mixins for consistent styling
5. **Accessibility**: Focus states, proper contrast ratios, ARIA support
6. **Responsive Design**: Mobile-first approach with responsive utilities
7. **Angular Material Integration**: Seamless integration with Material Design

## Color System

### Primary Colors
- `--color-primary`: #8B4513 (Saddle Brown)
- `--color-primary-dark`: #654321 (Dark Brown)
- `--color-primary-light`: #A0522D (Sienna)

### Secondary Colors
- `--color-secondary`: #CD853F (Peru)
- `--color-secondary-dark`: #B8860B (Dark Goldenrod)
- `--color-secondary-light`: #DAA520 (Goldenrod)

### Status Colors
- `--color-success`: #8FBC8F (Dark Sea Green)
- `--color-warning`: #D2691E (Chocolate)
- `--color-error`: #CD5C5C (Indian Red)
- `--color-info`: #708090 (Slate Gray)

## Usage Examples

### Buttons
```html
<!-- Primary button -->
<button mat-raised-button color="primary">Primary Action</button>

<!-- Secondary button -->
<button mat-raised-button color="accent">Secondary Action</button>

<!-- Outlined button -->
<button mat-outlined-button color="primary">Outlined</button>
```

### Cards
```html
<mat-card class="interactive">
  <mat-card-header>
    <mat-card-title>Card Title</mat-card-title>
    <mat-card-subtitle>Card Subtitle</mat-card-subtitle>
  </mat-card-header>
  <mat-card-content>
    <p>Card content goes here</p>
  </mat-card-content>
  <mat-card-actions>
    <button mat-button color="primary">Action</button>
  </mat-card-actions>
</mat-card>
```

### Badges
```html
<!-- Difficulty badges -->
<span class="difficulty-badge beginner">Beginner</span>
<span class="difficulty-badge intermediate">Intermediate</span>
<span class="difficulty-badge advanced">Advanced</span>
<span class="difficulty-badge expert">Expert</span>

<!-- Platform badges -->
<span class="platform-badge udemy">Udemy</span>
<span class="platform-badge youtube">YouTube</span>
<span class="platform-badge coursera">Coursera</span>

<!-- Status badges -->
<span class="badge badge-success">Success</span>
<span class="badge badge-warning">Warning</span>
```

### Utility Classes
```html
<!-- Spacing -->
<div class="p-lg mb-md">Content with padding and margin</div>

<!-- Colors -->
<h2 class="text-primary">Primary colored heading</h2>
<div class="bg-surface rounded-lg shadow-md">Surface background</div>

<!-- Layout -->
<div class="flex justify-between items-center gap-md">
  <span>Left content</span>
  <span>Right content</span>
</div>

<!-- Grid -->
<div class="grid grid-cols-3 gap-lg">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

## Theme Service

### Basic Usage
```typescript
import { ThemeService } from './services/theme.service';

constructor(private themeService: ThemeService) {}

// Toggle theme
toggleTheme() {
  this.themeService.toggleTheme();
}

// Set specific theme
setDarkTheme() {
  this.themeService.setTheme('dark');
}

// Check current theme
isDark() {
  return this.themeService.isDarkTheme();
}

// Listen to theme changes
ngOnInit() {
  this.themeService.theme$.subscribe(theme => {
    console.log('Current theme:', theme);
  });
}
```

### Theme Toggle Component
```html
<app-theme-toggle></app-theme-toggle>
```

## Customization

### Adding New Colors
1. Add CSS custom properties to `_variables.scss`:
```scss
:root {
  --color-custom: #FF6B6B;
  --color-custom-dark: #E55555;
}
```

2. Add utility classes to `_utilities.scss`:
```scss
.text-custom { color: var(--color-custom) !important; }
.bg-custom { background-color: var(--color-custom) !important; }
```

### Creating Custom Components
1. Add mixins to `_mixins.scss`:
```scss
@mixin custom-component {
  background: var(--color-surface);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  box-shadow: var(--shadow-md);
}
```

2. Use in `_components.scss`:
```scss
.custom-component {
  @include custom-component;
  
  &:hover {
    box-shadow: var(--shadow-lg);
  }
}
```

### Responsive Design
```scss
// Use provided mixins
@include mobile {
  .hide-on-mobile {
    display: none;
  }
}

@include tablet {
  .tablet-specific {
    font-size: 1.2rem;
  }
}

@include desktop {
  .desktop-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

## Best Practices

### 1. Use CSS Custom Properties
```scss
// Good
color: var(--color-primary);

// Avoid
color: #8B4513;
```

### 2. Use Utility Classes for Simple Styling
```html
<!-- Good -->
<div class="p-md mb-lg bg-surface rounded-lg">

<!-- Avoid creating custom CSS for simple layouts -->
```

### 3. Use Mixins for Reusable Components
```scss
// Good
.my-button {
  @include button-primary;
}

// Avoid duplicating styles
```

### 4. Follow Semantic Naming
```scss
// Good
--color-primary
--color-success
--spacing-md

// Avoid
--brown-color
--green-thing
--medium-space
```

### 5. Test Both Themes
Always test your components in both light and dark themes to ensure proper contrast and visibility.

## Migration from Old Theme

### Before
```scss
$claude-brown: #8B4513;
background: $claude-brown;
```

### After
```scss
background: var(--color-primary);
// or use utility class
<div class="bg-primary">
```

## Performance Considerations

1. **CSS Custom Properties**: Minimal performance impact, excellent browser support
2. **Utility Classes**: Reduces CSS bundle size by reusing classes
3. **Tree Shaking**: Unused utilities are automatically removed in production
4. **Critical CSS**: Base styles are loaded first for optimal rendering

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- IE11: Partial support (CSS custom properties require polyfill)

## Accessibility

The theme system includes:
- Proper focus states for keyboard navigation
- High contrast ratios for text readability
- ARIA labels for interactive elements
- Reduced motion support for animations
- Screen reader friendly markup

## Development Workflow

1. **Design Phase**: Use design tokens from `_variables.scss`
2. **Component Development**: Use mixins and utility classes
3. **Testing**: Test in both light and dark themes
4. **Review**: Ensure accessibility and performance standards
5. **Documentation**: Update this guide for new patterns

## Troubleshooting

### Common Issues

1. **Styles not applying**: Check import order in `styles.scss`
2. **Dark theme not working**: Ensure `data-theme="dark"` is set on html element
3. **Utility classes not working**: Check if class name is correct and imported
4. **Custom properties not updating**: Verify CSS custom property syntax

### Debug Tips

1. Use browser dev tools to inspect CSS custom properties
2. Check the computed styles tab for actual values
3. Verify theme service is properly injected and initialized
4. Test theme switching functionality

## Future Enhancements

- [ ] High contrast theme for accessibility
- [ ] Custom theme builder
- [ ] Theme presets (corporate, nature, etc.)
- [ ] CSS-in-JS integration
- [ ] Theme animation transitions
- [ ] RTL language support

---

For questions or contributions, please refer to the project documentation or create an issue in the repository.