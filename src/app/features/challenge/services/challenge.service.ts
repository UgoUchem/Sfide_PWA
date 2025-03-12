import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Challenge } from '../models/challenge.model';
import { StorageService } from './storage-service.service';

@Injectable({
  providedIn: 'root',
})
export class ChallengeService {
  private challenges: WritableSignal<Challenge[]> = signal<Challenge[]>([]);
  private storageService:StorageService = inject(StorageService);
  constructor() {
    this.initializeChallenges();
  }

  // Initialize with default challenges
  private async initializeChallenges() {
    const savedChallenges = await this.storageService.getChallenges();
    if (savedChallenges.length > 0) {
      this.challenges.set(savedChallenges);
    } else {
      const initialChallenges: Challenge[] = [
        // Default challenges...
      ];
      this.challenges.set(initialChallenges);
      initialChallenges.forEach((challenge) =>
        this.storageService.saveChallenge(challenge)
      );
    }
  }

  getChallenges(){
    return this.challenges();
  }

  // Update challenge progress
  updateChallengeProgress(id: string, progress: number) {
    this.challenges.update((challenges) =>
      challenges.map((challenge) =>
        challenge.id === id ? { ...challenge, progress } : challenge
      )
    );
  }
}
