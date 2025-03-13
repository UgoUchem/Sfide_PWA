import { Component } from '@angular/core';
import LoginComponent from "./features/login/components/login.component";
import { RouterOutlet } from '@angular/router';

type Item = {
  id: number;
  name: string;
};
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    <h1>Welcome to {{ title }}!</h1>
    <router-outlet></router-outlet>
    <!-- <app-challenge-list></app-challenge-list> -->
  `,
  styles: [],
})
export class AppComponent {
  title = 'Sfide PWA';
}
