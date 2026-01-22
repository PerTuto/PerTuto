import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'clay-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      class="relative flex items-center justify-center font-bold font-mono tracking-wider uppercase text-white overflow-hidden transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group active:scale-95"
      [class]="'h-12 px-8 rounded-full ' + customClass()"
      [ngClass]="variantClasses()"
      [disabled]="disabled()"
      (click)="onClick.emit($event)"
    >
      @if (loading()) {
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      }
      <span class="relative z-10 flex items-center gap-2 group-hover:translate-x-1 transition-transform">
        <ng-content></ng-content>
      </span>
      
      <!-- Hover Glow -->
      <div class="absolute inset-0 bg-white/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </button>
  `
})
export class ClayButtonComponent {
  variant = input<'primary' | 'secondary' | 'accent' | 'danger'>('primary');
  customClass = input<string>('');
  disabled = input<boolean>(false);
  loading = input<boolean>(false);
  onClick = output<MouseEvent>();

  variantClasses() {
    switch (this.variant()) {
      case 'primary': return 'bg-[#7C3AED] hover:bg-[#6D28D9] shadow-[0_0_20px_rgba(124,58,237,0.4)] hover:shadow-[0_0_30px_rgba(124,58,237,0.6)] border border-[#8B5CF6]';
      case 'secondary': return 'bg-transparent border border-white/20 hover:bg-white/10 text-white shadow-none';
      case 'accent': return 'bg-[#DB2777] hover:bg-[#BE185D] shadow-[0_0_20px_rgba(219,39,119,0.4)]';
      case 'danger': return 'bg-red-600 hover:bg-red-700';
      default: return 'bg-[#7C3AED]';
    }
  }
}