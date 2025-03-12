import { Component, signal, WritableSignal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChallengeListComponent } from "./features/challenge/components/challenge-list.component";

type Item = {
  id: number;
  name: string;
};
@Component({
  selector: 'app-root',
  imports: [ChallengeListComponent],
  template: `
    <h1>Welcome to {{ title }}!</h1>

    <button (click)="toggleShow()">Toggle UPDate Message</button>

    @if (showMessage()) {
      <p>Welcome! This is a Progressive Web App built with Angular 19.</p>
    }

    <ul>
      @for(item of items(); track item.id){
      <li>{{ item.name }}</li>
      }
    </ul>
    <app-challenge-list></app-challenge-list>
  `,
  styles: [],
})
export class AppComponent {
  title = 'Sfide PWA';

  protected readonly items: WritableSignal<Item[]> = signal([
    { id: 1, name: 'Apple' },
    { id: 2, name: 'Banana' },
    { id: 3, name: 'Cherry' },
  ]);

  protected readonly showMessage:WritableSignal<boolean> = signal(false);

  toggleShow(){
    this.showMessage.set(!this.showMessage());
  }
}
