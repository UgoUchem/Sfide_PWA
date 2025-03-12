import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, from, Observable, of, timeout } from 'rxjs';
import { Challenge } from '../models/challenge.model';
import challengesData from '../../../data/challenges.json';
@Injectable({
  providedIn: 'root',
})
export class ChallengeService {
  private apiUrl = 'http://localhost:3000/challenges';

  private challenges: WritableSignal<Challenge[]> =
    signal<Challenge[]>(challengesData);
  private readonly http: HttpClient = inject(HttpClient);

  getChallenges(): Observable<Challenge[]> {
    const cachedChallenges:string|null = localStorage.getItem('challenges');

    if (cachedChallenges) {
      return of(JSON.parse(cachedChallenges)); // Load cached data instantly
    }
    return this.http.get<Challenge[]>(this.apiUrl).pipe(
      timeout(2000),
      catchError(() => {
        console.warn('Server not available, loading local challenges.json');
        localStorage.setItem('challenges', JSON.stringify(this.challenges()));
        return of(this.challenges());
      })
    );
  }

  addChallenge(challenge: Challenge): Observable<Challenge> {
    return this.http.post<Challenge>(this.apiUrl, challenge);
  }
  addChallenges(Challenge: Challenge[]): Observable<Challenge[]> {
    return this.http.post<Challenge[]>(this.apiUrl, Challenge);
  }

  deleteChallenge(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
