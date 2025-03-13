import { computed, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private readonly usersList:WritableSignal<User[]>=signal([
    {id:1,username:"Chidimma"},
    {id:2,username:"Favour"},
    {id:3,username:"Beauty"},
    {id:4,username:"Precious"},
    {id:5,username:"Ivan"},
    {id:5,username:"admin"},
  ]);

  public userList:Signal<User[]> = computed(()=>this.usersList());

  // public findUser(username:string, password:string):User|undefined{
  //   return this.usersList().find(user=>user.username===username);
  // }
  public findUser(username:string):User|undefined{
    return this.usersList().find(user=>user.username===username);
  }

  public setLoggedInUser(user: User): void {
    localStorage.setItem('username', user.username);
    console.log("Username saved in localStorage:", localStorage.getItem('username'));
  }

  public getLoggedInUser(): string | null {
    return localStorage.getItem('username');
  }

  public logout(): void {
    localStorage.removeItem('username');
  }

}
