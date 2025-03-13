import {
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterModule],
  template: `
    <div class="login-container">
      <div class="header">
        <h2>Welcome!</h2>
        <p>Log in and get started</p>
      </div>

      <form [formGroup]="loginForm" (ngSubmit)="login()">
        <div class="input-container">
          <label>Name:</label>
          <input
            type="text"
            formControlName="name"
            (input)="capitalizeFirstLetter()"
          />
        </div>
        <div class="submit-container">
          <button type="submit" [disabled]="loginForm.invalid">Login</button>
        </div>
      </form>
      @if(loginError()){
      <p class="error-message">Invalid Name</p>
      }
    </div>
  `,
  styles: `
  /* Anime-Inspired Login Page */
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap'); /* Retro gaming/anime font */

body {
  background: url('https://i.imgur.com/k5e6mAF.gif') no-repeat center center fixed;
  background-size: cover;
  font-family: 'Poppins', sans-serif;
  animation: fadeIn 2s ease-in-out;
}

.login-container {
  width: 420px;
  margin: 100px auto;
  padding: 50px;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 15px;
  text-align: center;
  color: white;
  box-shadow: 0 0 15px rgba(255, 0, 150, 0.8);
  animation: neonGlow 1.5s infinite alternate;
}

@keyframes neonGlow {
  from {
    box-shadow: 0 0 10px rgba(255, 0, 150, 0.5);
  }
  to {
    box-shadow: 0 0 25px rgba(255, 0, 150, 0.9);
  }
}

.header h2 {
  font-size: 28px;
  font-family: 'Press Start 2P', cursive;
  color: #ff4d6d;
  text-shadow: 3px 3px 0px #000;
  animation: titleBounce 1.2s infinite alternate;
}

@keyframes titleBounce {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-5px);
  }
}

input {
  padding: 12px;
  margin-top: 10px;
  width: 100%;
  border-radius: 8px;
  border: 2px solid #ff4d6d;
  background-color: #000;
  color: #fff;
  font-size: 16px;
  box-shadow: 0 0 10px rgba(255, 77, 109, 0.5);
  text-align: center;
}

input:focus {
  outline: none;
  border-color: #00d9ff;
  box-shadow: 0 0 15px rgba(0, 217, 255, 0.9);
}

.submit-container button {
  padding: 15px;
  background: linear-gradient(90deg, #ff4d6d, #ff007f);
  color: white;
  font-size: 18px;
  border-radius: 8px;
  width: 100%;
  cursor: pointer;
  transition: 0.3s;
  border: none;
  font-family: 'Press Start 2P', cursive;
  text-shadow: 2px 2px 4px black;
}

.submit-container button:hover {
  background: linear-gradient(90deg, #ff007f, #ff4d6d);
  transform: scale(1.1);
  box-shadow: 0 0 15px rgba(255, 0, 150, 0.9);
}

.error-message {
  color: #ff0000;
  font-size: 14px;
  margin-top: 10px;
  font-weight: bold;
  animation: shake 0.3s infinite alternate;
}

@keyframes shake {
  from {
    transform: translateX(-5px);
  }
  to {
    transform: translateX(5px);
  }
}



  
  `,
})
export default class LoginComponent implements OnInit {
  protected fb: FormBuilder = inject(FormBuilder);
  router: Router = inject(Router);
  private loginService: LoginService = inject(LoginService);

  loginError: WritableSignal<boolean> = signal(false);

  loginForm: FormGroup = this.fb.group({});
  // Initialize the form in ngOnInit lifecycle hook
  ngOnInit() {
    this.loginForm = this.fb.group({
      name: ['', Validators.required], // Add validation to the name field
    });

    // transform first letter to uppercase automatically when typing
    this.loginForm.get('name')?.valueChanges.subscribe((value) => {
      if (value) {
        value = value.toLowerCase();
        value = value.charAt(0).toUpperCase() + value.slice(1);
        this.loginForm.patchValue({ name: value }, { emitEvent: false });
      }
    });
  }

  // Handle the form submission
  login() {
    if (this.loginForm.valid) {
      const name = this.loginForm.value.name;
      const user = this.loginService.findUser(name);
      // Handle the login logic (e.g., store the name in localStorage)
      if (user) {
        this.loginService.setLoggedInUser(user);
        this.router.navigate(['/challenges']).then((success) => {
          if (success) {
            console.log('Navigation success!');
          } else {
            console.log('Navigation failed!');
          }
        });
      } else {
        this.loginError.set(true);
      }
      // Redirect or perform additional actions as needed
      console.log(`Logged in as: ${name}`);
    }
  }

  capitalizeFirstLetter() {
    let value = this.loginForm.get('name')?.value;
    if (value) {
      value = value.toLowerCase(); // Convert everything to lowercase first
      value = value.charAt(0).toUpperCase() + value.slice(1); // Capitalize first letter
      this.loginForm.patchValue({ name: value }, { emitEvent: false });
    }
  }
}
