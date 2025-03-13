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

  // getChallenges(userName: string): Observable<Challenge[]> {
  //   const cachedChallenges: string | null = localStorage.getItem('challenges');

  //   if (cachedChallenges) {
  //     const allChallenges = JSON.parse(cachedChallenges);
  //     const userChallenges = allChallenges.filter((challenge: Challenge) =>
  //       // challenge.assignedTo.includes(userName)
  //       challenge.assignedTo.some(
  //         (name) => name.trim().toLowerCase() === userName.trim().toLowerCase()
  //       )
  //     );
  //     return of(userChallenges); // Load cached data instantly
  //   }
  //   // return this.http.get<Challenge[]>(this.apiUrl).pipe(
  //   //   timeout(2000),
  //   //   catchError(() => {
  //   //     console.warn('Server not available, loading local challenges.json');
  //   //     localStorage.setItem('challenges', JSON.stringify(this.challenges()));
  //   //     return of(this.challenges());
  //   //   })
  //   // );
  //   return this.http.get<Challenge[]>(this.apiUrl).pipe(
  //     timeout(2000),
  //     catchError(() => {
  //       console.warn('Server not available, loading local challenges.json');
  //       localStorage.setItem('challenges', JSON.stringify(challengesData)); // Cache the challenges
  //       return of(
  //         challengesData.filter((challenge: Challenge) =>
  //           challenge.assignedTo.some(
  //             (name) =>
  //               name.trim().toLowerCase() === userName.trim().toLowerCase()
  //           )
  //         )
  //       );
  //     })
  //   );
  // }

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
        // return challenge.assignedTo.includes(userName) || challenge.assignedTo.includes("everyone");
        challenge.assignedTo.some((name) => name.trim().toLowerCase() === normalizedUserName) || 
        challenge.assignedTo.includes("everyone")
        
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
          challenge.assignedTo.includes(userName) || challenge.assignedTo.includes("everyone")
        );
  
        console.log("Loaded Local Challenges:", challengesData);
        console.log("Filtered Challenges for", userName, ":", filteredChallenges);
        return of(filteredChallenges);
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
