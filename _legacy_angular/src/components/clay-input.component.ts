import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'clay-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="flex flex-col gap-2 w-full group">
      @if (label()) {
        <label [for]="id()" class="ml-2 text-xs font-mono font-bold text-gray-400 uppercase tracking-widest group-focus-within:text-[#7C3AED] transition-colors">{{ label() }}</label>
      }
      
      <div class="relative">
        @if (type() === 'textarea') {
           <textarea
            [id]="id()"
            [formControl]="control()"
            [placeholder]="placeholder()"
            rows="4"
            class="w-full px-6 py-4 bg-black/30 border border-white/10 text-white placeholder-white/20 rounded-2xl transition-all duration-300 resize-none focus:outline-none focus:border-[#7C3AED] focus:bg-black/50 focus:shadow-[0_0_15px_rgba(124,58,237,0.1)]"
          ></textarea>
        } @else {
          <input
            [type]="type()"
            [id]="id()"
            [formControl]="control()"
            [placeholder]="placeholder()"
            class="w-full h-14 px-6 bg-black/30 border border-white/10 text-white placeholder-white/20 rounded-2xl transition-all duration-300 focus:outline-none focus:border-[#7C3AED] focus:bg-black/50 focus:shadow-[0_0_15px_rgba(124,58,237,0.1)]"
          />
        }
      </div>
      
      @if (control().invalid && (control().dirty || control().touched)) {
        <span class="ml-2 text-xs font-mono text-red-400">
          {{ errorMessage() }}
        </span>
      }
    </div>
  `
})
export class ClayInputComponent {
  id = input.required<string>();
  label = input<string>('');
  placeholder = input<string>('');
  type = input<string>('text');
  control = input.required<FormControl>();
  errorMessage = input<string>('REQUIRED FIELD');
}