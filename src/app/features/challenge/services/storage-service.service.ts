import { Injectable } from '@angular/core';
import { openDB } from 'idb';
import { Challenge } from '../models/challenge.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private dbName = 'challengeDB';
  private storeName = 'challenges';

  async initializeDB(){
    return openDB(this.dbName, 1, {
      upgrade(db){
        if(!db.objectStoreNames.contains('challenges')){
          db.createObjectStore('challenges', {keyPath: 'id'});
        }
      },
    });
  }

  async saveChallenge(challenge: Challenge) {
    const db = await this.initializeDB();
    return db.put(this.storeName, challenge);
  }

  async getChallenges() {
    const db = await this.initializeDB();
    return db.getAll(this.storeName);
  }
}
