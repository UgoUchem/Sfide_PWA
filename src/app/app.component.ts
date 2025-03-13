import {
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
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
      <!-- Custom update notification -->
       @if(updateAvailable()){
         <div class="update-notification">
           A new version is available. <button (click)="activateUpdate()">Update Now</button>
         </div>
       }
    </div>
    <!-- <app-challenge-list></app-challenge-list> -->
  `,
  styles: [`
      .update-notification {
      position: fixed;
      bottom: 10px;
      right: 10px;
      background-color: #1976d2;
      color: white;
      padding: 10px;
      border-radius: 5px;
    }
    `],
})
export class AppComponent implements OnInit {
  title = 'Sfide PWA';
  protected readonly swUpdate: SwUpdate = inject(SwUpdate);
  protected readonly updateAvailable: WritableSignal<boolean> = signal(false);
  ngOnInit(): void {
    if (this.swUpdate.isEnabled) {
      // Listen for version update events
      this.swUpdate.versionUpdates.subscribe((event) => {
        // Check for the 'VERSION_READY' event which indicates a new version is available
        if (event.type === 'VERSION_READY') {
          console.log('New version available:', event);
          this.updateAvailable.set(true);
        }
      });
    }
  }

  activateUpdate(): void {
    // Activate the update and reload the page
    this.swUpdate.activateUpdate().then(() => document.location.reload());
  }
}
