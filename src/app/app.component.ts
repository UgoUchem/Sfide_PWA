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
    <app-challenge-list></app-challenge-list>
  `,
  styles: [],
})
export class AppComponent {
  title = 'Sfide PWA';
}
