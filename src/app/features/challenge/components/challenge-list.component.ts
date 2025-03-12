import { Component, inject, signal, Signal, WritableSignal } from '@angular/core';
import { ChallengeService } from '../services/challenge.service';
import { Challenge } from '../models/challenge.model';

@Component({
  selector: 'app-challenge-list',
  imports: [],
  template: `
    <div class="challenge-list">
      @for (challenge of challenges(); track challenge.id) {
        <div class="challenge-card">
          <h2>{{ challenge.title }}</h2>
          <p>{{ challenge.description }}</p>
          <ul>
            @for (rule of challenge.rules; track rule) {
              <li>{{ rule }}</li>
            }
          </ul>
          <p><strong>Difficoltà:</strong> {{ challenge.difficulty }}</p>
          @if (challenge.bonus) {
            <p><strong>Bonus:</strong> {{ challenge.bonus }}</p>
          }
          <button (click)="startChallenge(challenge.id)">Inizia Sfida</button>
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
  `
})
export class ChallengeListComponent {
  private challengeService:ChallengeService = inject(ChallengeService);

  protected readonly challenges:WritableSignal<Challenge[]> = signal(this.challengeService.getChallenges());

  startChallenge(id:string){
    //Logic to start the challenge
    console.log(`started challenge with ID: ${id}`);
  }

}
