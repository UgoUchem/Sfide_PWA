import {
  Component,
  inject,
  OnInit,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { ChallengeService } from '../services/challenge.service';
import { Challenge } from '../models/challenge.model';

@Component({
  selector: 'app-challenge-list',
  imports: [],
  template: `
    <div class="challenge-list">
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
export class ChallengeListComponent implements OnInit{
  private challengeService: ChallengeService = inject(ChallengeService);

  protected readonly challenges: WritableSignal<Challenge[]> = signal([]);

  ngOnInit(){
    this.loadChallenges();
  }

  loadChallenges():void{
    this.challengeService.getChallenges().subscribe((data)=>this.challenges.set(data));
  }
}
