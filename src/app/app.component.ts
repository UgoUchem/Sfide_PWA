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
    <div class="app-container">
      <!-- Router outlet for loading routed components like LoginComponent -->
      <router-outlet></router-outlet>
      
    </div>
    <!-- <app-challenge-list></app-challenge-list> -->
  `,
  styles: [],
})
export class AppComponent {
  title = 'Sfide PWA';
}
