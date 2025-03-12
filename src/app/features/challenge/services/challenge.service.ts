import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Challenge } from '../models/challenge.model';
@Injectable({
  providedIn: 'root',
})
export class ChallengeService {
  private apiUrl = 'http://localhost:3000/challenges';

  private readonly http:HttpClient = inject(HttpClient);

  getChallenges():Observable<Challenge[]>{
    return this.http.get<Challenge[]>(this.apiUrl);
  }

  addChallenge(challenge:Challenge):Observable<Challenge>{
    return this.http.post<Challenge>(this.apiUrl,challenge);
  }
  addChallenges(Challenge:Challenge[]):Observable<Challenge[]>{
    return this.http.post<Challenge[]>(this.apiUrl,Challenge);
  }

  deleteChallenge(id:string):Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
  }
}