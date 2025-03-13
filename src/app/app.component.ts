import { Component, inject, OnInit } from '@angular/core';
import LoginComponent from "./features/login/components/login.component";
import { RouterOutlet } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';

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
  styles: [
    `
      
    `
  ],
})
export class AppComponent implements OnInit{
  title = 'Sfide PWA';
  protected readonly swUpdate:SwUpdate = inject(SwUpdate);

  ngOnInit(): void {
    // Verifica gli aggiornamenti quando l'app è avviata
    this.swUpdate.checkForUpdate().then(()=>{
      console.log('Controllo aggiornamenti completato');
      if(confirm('A new version is available. Do you want to update?')){
        window.location.reload();
      }
    })
  }

}
