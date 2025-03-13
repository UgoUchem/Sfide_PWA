import {
  Component,
  inject,
  OnInit,
  signal, WritableSignal
} from '@angular/core';
import { ChallengeService } from '../services/challenge.service';
import { Challenge } from '../models/challenge.model';
import { Router, RouterModule } from '@angular/router';
import AdminComponent from "../../login/components/admin.component";

@Component({
  selector: 'app-challenge-list',
  imports: [RouterModule, AdminComponent],
  template: `
    <button (click)="refreshChallenges()">Refresh</button>
    <div class="challenge-list">
      <!-- Add this button -->
      @for (challenge of challenges(); track challenge.id) {
      <div class="challenge-card">
        <h2>{{ challenge.name }}</h2>
        <p>{{ challenge.description }}</p>
        <h3>Regole:</h3>
        <ul>
          @for (rule of challenge.rules; track rule) {
          <li>{{ rule }}</li>
          }
        </ul>
        <p><strong>Difficoltà:</strong> {{ challenge.difficulty }}</p>
        <p><strong>Bonus:</strong> {{ challenge.bonus }}</p>
        <p>
          <strong>Azioni richieste:</strong>
          {{ challenge.actionsRequired.join(', ') }}
        </p>
        <p>
          <strong>Violazioni massime:</strong> {{ challenge.maxViolations }}
        </p>
      </div>
      }
    </div>

    @if(username === 'admin'){
      <app-admin></app-admin>
    }
  `,
  styles: `
    /* src/styles.css */
.challenge-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
  padding: 16px;
}

.challenge-card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  background-color: #f9f9f9;
}

@media (max-width: 600px) {
  .challenge-list {
    grid-template-columns: 1fr;
  }
}
  `,
})
export default class ChallengeListComponent implements OnInit {
  private challengeService: ChallengeService = inject(ChallengeService);
  private router: Router = inject(Router); // Inject Router
  protected readonly challenges: WritableSignal<Challenge[]> = signal([]);
  protected readonly username: string | null = localStorage.getItem('username');


  

  ngOnInit() {
    console.log("Stored username:", localStorage.getItem('username'));
    if (!this.username) {
      // Redirect to login page if no user is logged in
      console.warn("No username found. Redirecting to login...");
      this.router.navigate(['/login']);
    } else {
      this.loadChallenges();
    }
    // Handle browser refresh
    window.addEventListener('beforeunload', this.handleRefresh);
  }

  loadChallenges(): void {
    if (this.username) {
      this.challengeService
        .getChallenges(this.username)
        .subscribe((data) => {
          console.log("Loaded challenges:", data); //Check the challenges loaded
          this.challenges.set(data) // Update the signal with the filtered ones
        }  
      );
    }
  }

  ngOnDestroy() {
    window.removeEventListener('beforeunload', this.handleRefresh);
  }

  refreshChallenges(): void {
    this.challengeService.refreshChallenges();
    this.loadChallenges(); // Reload the challenges
  }

  handleRefresh = (event: BeforeUnloadEvent) => {
    localStorage.removeItem('challenges'); // Clear cache on refresh
    console.log("Browser refresh detected. Cache cleared.");
  };
}
