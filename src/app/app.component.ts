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
           <!-- A new version is available. <button (click)="activateUpdate()">Update Now</button> -->
           <p>A new version is available! 🎉</p>
           <p>{{changelog}}</p>
           <button (click)="activateUpdate()">Install Now</button>
           <button (click)="dismissUpdate()">Maybe Later</button>
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
      box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    }

    button {
      margin-right: 10px;
      padding: 5px 10px;
      border: none;
      cursor: pointer;
      border-radius: 5px;
    }
    button:first-of-type { background: #4caf50; color: white; }
    button:last-of-type { background: #f44336; color: white; }
    `],
})
export class AppComponent implements OnInit {
  title = 'Sfide PWA';
  protected readonly swUpdate: SwUpdate = inject(SwUpdate);
  protected readonly updateAvailable: WritableSignal<boolean> = signal(false);
  changelog :string = ''; // Text to display in the UI (changelog)

  // ngOnInit(): void {
  //   if (this.swUpdate.isEnabled) {
  //     // Listen for version update events
  //     this.swUpdate.versionUpdates.subscribe((event) => {
  //       // Check for the 'VERSION_READY' event which indicates a new version is available
  //       if (event.type === 'VERSION_READY') {
  //         console.log('New version available:', event);
  //         this.updateAvailable.set(true);
  //       }
  //     });
  //   }
  // }

  // activateUpdate(): void {
  //   // Activate the update and reload the page
  //   this.swUpdate.activateUpdate().then(() => document.location.reload());
  // }

  ngOnInit(): void {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates.subscribe((event) => {
        if (event.type === 'VERSION_READY') {
          this.showUpdateNotification();
        }
      });
    }
  }

  // showUpdateNotification(): void {
  //   // Use browser notification API
  //   if ('Notification' in window && Notification.permission === 'granted') {
  //     new Notification('🚀 New Update Available!', {
  //       body: 'Click to install the latest version.',
  //       icon: '/assets/icons/icon-192x192.png',
  //     }).onclick = () => this.activateUpdate();
  //   } else if (Notification.permission === 'default') {
  //     // Request permission if not granted
  //     Notification.requestPermission().then((permission) => {
  //       if (permission === 'granted') {
  //         this.showUpdateNotification();
  //       }
  //     });
  //   }

  //   // Show UI notification as a fallback
  //   this.updateAvailable.set(true);
  // }


  showUpdateNotification(): void {
    // Fetch changelog from the JSON file
    fetch('assets/changelog.json')
      .then((response) => response.json())
      .then((data) => {
        // Find the latest version info
        const latestVersion = data.changelog[-1]; // Assuming the latest version is the first item
        this.changelog = `
          Version: ${latestVersion.version} (${latestVersion.date})
          Changes:
          ${latestVersion.changes.join('\n')}
        `;
      })
      .catch(() => {
        this.changelog = 'No changelog available at the moment.';
      });

    // Show browser notification as well if possible
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('🚀 New Update Available!', {
        body: 'Click to install the latest version.',
        icon: '/icons/anya-icon.png',
      }).onclick = () => this.activateUpdate();
    }

    // Show UI notification as a fallback
    this.updateAvailable.set(true);
  }

  activateUpdate(): void {
    this.swUpdate.activateUpdate().then(() => document.location.reload());
  }

  dismissUpdate(): void {
    this.updateAvailable.set(false);
  }

}
