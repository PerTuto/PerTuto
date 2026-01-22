import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ClayCardComponent } from './components/clay-card.component';
import { ClayButtonComponent } from './components/clay-button.component';
import { ClayInputComponent } from './components/clay-input.component';
import { LeadService, Lead } from './services/lead.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    ClayCardComponent, 
    ClayButtonComponent, 
    ClayInputComponent
  ],
  templateUrl: './app.component.html'
})
export class AppComponent {
  private fb = inject(FormBuilder);
  private leadService = inject(LeadService);

  // UI State
  viewMode = signal<'student' | 'parent'>('student');
  mobileMenuOpen = signal(false);
  formStatus = signal<'idle' | 'success' | 'error'>('idle');

  // FAQ State (simple array with mutable open state for this demo)
  faqs = signal([
    { 
      question: 'What is included in the diagnostic trial?', 
      answer: 'A comprehensive assessment of current academic standing, a personalized roadmap identifying key growth areas, and a 30-minute active learning session.',
      open: false 
    },
    { 
      question: 'Do I need to pay anything upfront?', 
      answer: 'No. The initial strategy session and diagnostic are completely free. We want to ensure the perfect fit before any commitment.', 
      open: false 
    },
    { 
      question: 'How do the interactive decks work?', 
      answer: 'Unlike static PDFs, our learning decks are HTML-based. Students can manipulate graphs, solve code blocks, and drag-and-drop elements in real-time with their tutor.', 
      open: false 
    },
    { 
      question: 'What curriculums do you support?', 
      answer: 'We specialize in IB, A-Levels, AP, and IGCSE curriculums across Math, Sciences, English, and Computer Science.', 
      open: false 
    }
  ]);
  
  // Computed Data based on View Mode
  features = computed(() => {
    const isStudent = this.viewMode() === 'student';
    return [
      {
        title: isStudent ? '1:1 Mentorship' : 'Personalized 1:1',
        icon: isStudent ? '🔥' : '👨‍🏫',
        desc: isStudent 
          ? 'No cookie-cutter classes. We match your vibe with tutors who actually get it.'
          : 'Dedicated mentorship tailored to your child\'s unique learning style and pace.'
      },
      {
        title: isStudent ? 'Top 1% Tutors' : 'Expert Educators',
        icon: isStudent ? '💎' : '🎓',
        desc: isStudent 
          ? 'Verified academic weapons from Ivy League & Russell Group unis.'
          : ' vetted top-tier graduates from world-class universities like Oxford and Stanford.'
      },
      {
        title: isStudent ? 'Adaptive AI' : 'Adaptive Learning',
        icon: '🧠',
        desc: isStudent 
          ? 'Curriculum that evolves in real-time as you crush new concepts.'
          : 'Smart curriculum pathways that adjust difficulty based on real-time performance.'
      },
      {
        title: isStudent ? 'Live Dashboards' : 'Progress Tracking',
        icon: '📊',
        desc: isStudent 
          ? 'Track your XP and level up your grades with visual analytics.'
          : 'Transparent data dashboards to monitor improvement and milestone completion.'
      }
    ];
  });

  stats = computed(() => {
    const isStudent = this.viewMode() === 'student';
    return [
      { value: '98%', label: 'Success Rate' },
      { value: '2.5k+', label: 'Students' },
      { value: '4.9/5', label: isStudent ? 'Vibe Check' : 'Satisfaction' },
      { value: '24/7', label: 'Support' }
    ];
  });

  howItWorks = computed(() => {
    const isStudent = this.viewMode() === 'student';
    return [
      { 
        step: '01', 
        title: isStudent ? 'Send Signal' : 'Book Trial', 
        desc: isStudent ? 'Share your mission objectives and current loadout.' : 'Share your child\'s curriculum, grade level, and academic goals.',
        icon: '📡'
      },
      { 
        step: '02', 
        title: isStudent ? 'Diagnostic' : 'Assessment', 
        desc: isStudent ? 'We scan for knowledge gaps and build your upgrade path.' : 'We conduct a diagnostic session to map out a custom learning roadmap.',
        icon: '🔍'
      },
      { 
        step: '03', 
        title: isStudent ? 'Liftoff' : 'Start Learning', 
        desc: isStudent ? 'Sessions start. Grades go up. Simple as that.' : 'Personalized sessions begin with regular progress reports and feedback.',
        icon: '🚀'
      }
    ];
  });

  // Lead Gen Form
  leadForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    studentGrade: ['', Validators.required],
    subject: ['', Validators.required],
    goals: ['', Validators.required]
  });

  // Accessor for template loading state
  isSubmitting = this.leadService.isSubmitting;

  toggleMenu() {
    this.mobileMenuOpen.update(v => !v);
  }

  toggleFaq(index: number) {
    this.faqs.update(items => {
      const newItems = [...items];
      newItems[index].open = !newItems[index].open;
      return newItems;
    });
  }

  async onSubmit() {
    if (this.leadForm.valid) {
      try {
        const formData: Lead = this.leadForm.value;
        await this.leadService.submitLead(formData);
        
        this.formStatus.set('success');
        this.leadForm.reset();
        
        // Reset success message after 5 seconds
        setTimeout(() => this.formStatus.set('idle'), 5000);
      } catch (error) {
        this.formStatus.set('error');
      }
    } else {
      this.leadForm.markAllAsTouched();
    }
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      this.mobileMenuOpen.set(false);
    }
  }
}