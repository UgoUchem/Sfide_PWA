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
        <h2 class="challenge-title">{{ challenge.name }}</h2>
        <p class="challenge-description">{{ challenge.description }}</p>
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

/* Layout della lista delle sfide */
.challenge-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  padding: 16px;
  transition: all 0.3s ease;
}

.challenge-card {
  background-color:rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  border: 1px solid #ddd;
  padding: 20px;
  box-shadow: 0 2px 10px rgb(240, 26, 26);
  transition: all 0.3s ease;
  cursor: pointer;
}

.challenge-card:hover {
  transform: translateY(-5px);
  // transform: scale(1.05);
  box-shadow: 0 4px 15px rgb(7, 247, 167);
}

.challenge-card h2 {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 10px;
}

.challenge-card p {
  font-size: 1rem;
  color: #666;
  line-height: 1.6;
}

.challenge-card h3 {
  font-size: 1.2rem;
  color: #444;
  margin-top: 20px;
}

.challenge-card ul {
  list-style-type: disc;
  padding-left: 20px;
  font-size: 1rem;
  color: #555;
}

.challenge-card li {
  margin: 5px 0;
}

.challenge-card strong {
  color: #333;
}

@media (max-width: 768px) {
  .challenge-list {
    grid-template-columns: 1fr;
    padding: 10px;
  }
}

@media (max-width: 600px) {
  .challenge-card {
    padding: 15px;
  }

  .challenge-card h2 {
    font-size: 1.6rem;
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
