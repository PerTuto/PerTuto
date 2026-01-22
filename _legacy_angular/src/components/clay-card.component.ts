import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'clay-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="glass-panel relative overflow-hidden transition-all duration-300 group"
      [class]="'rounded-[32px] p-8 ' + customClass()"
    >
      <!-- Gradient Border Glow on Hover -->
      <div class="absolute inset-0 rounded-[32px] p-[1px] bg-gradient-to-br from-white/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
      
      <!-- Inner Sheen -->
      <div class="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"></div>
      
      <!-- Content -->
      <div class="relative z-10 h-full">
        <ng-content></ng-content>
      </div>
    </div>
  `
})
export class ClayCardComponent {
  customClass = input<string>('');
}