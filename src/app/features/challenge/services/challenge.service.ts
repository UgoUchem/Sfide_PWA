import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, from, Observable, of, tap, timeout } from 'rxjs';
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
  /**
   * Retrieves challenges for a specific user.
   * If the data is cached in localStorage, it uses that.
   * Otherwise, it fetches from the API or falls back to local challenges.json.
   */
  getChallenges(userName: string): Observable<Challenge[]> {
    const cachedChallenges: string | null = localStorage.getItem('challenges');
    const normalizedUserName = userName.trim().toLowerCase();

    if (cachedChallenges) {
      const allChallenges = JSON.parse(cachedChallenges);

      const userChallenges = allChallenges.filter((challenge: Challenge) => {
        console.log("Checking user assignment:", userName, "vs", challenge.assignedTo);
        // return challenge.assignedTo.includes(userName) || challenge.assignedTo.includes("Everyone");
        return(
          challenge.assignedTo.some((name) => name.trim().toLowerCase() === normalizedUserName) || 
          challenge.assignedTo.includes("Everyone")

        )
        
      });
      
      console.log('Cached Challenges:', allChallenges);
      console.log('Filtered Challenges for', userName, ':', userChallenges);

      return of(userChallenges); // Load cached data instantly
    }

    return this.http.get<Challenge[]>(this.apiUrl).pipe(
      timeout(2000),
      catchError(() => {
        console.warn('Server not available, loading local challenges.json');
        localStorage.setItem('challenges', JSON.stringify(challengesData)); // Cache the challenges

        const filteredChallenges = challengesData.filter((challenge: Challenge) =>
          challenge.assignedTo.some((name) => name.trim().toLowerCase() === normalizedUserName) || 
          challenge.assignedTo.includes("Everyone")
        );
  
        console.log("Loaded Local Challenges:", challengesData);
        console.log("Filtered Challenges for", userName, ":", filteredChallenges);
        return of(filteredChallenges);
      }),
      tap((challenges) => {
        console.log('Server Response:', challenges); // Log the server response to see if the format is correct
      })
    );
  }

  /**
   * Adds a single challenge.
   */
  addChallenge(challenge: Challenge): Observable<Challenge> {
    return this.http.post<Challenge>(this.apiUrl, challenge);
  }

  /**
   * Adds multiple challenges at once.
   */
  addChallenges(Challenge: Challenge[]): Observable<Challenge[]> {
    return this.http.post<Challenge[]>(this.apiUrl, Challenge);
  }

  /**
   * Deletes a challenge by its ID.
   */
  deleteChallenge(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Clears the cache and reloads challenges.
   */
  refreshChallenges(): void {
    localStorage.removeItem('challenges');
    console.log("Cache cleared. Reloading challenges...");
  }
}
