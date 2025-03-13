import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule,RouterModule],
  template: `
  CIOAPSDIMADO
    <div class="login-container">
      <h2>Login</h2>
      <form [formGroup]="loginForm" (ngSubmit)="login()">
        <label>Name:</label>
        <input type="text" formControlName="name" (input)="capitalizeFirstLetter()"/>
        <button type="submit" [disabled]="loginForm.invalid">Login</button>
      </form>
      @if(loginError()){
        <p class="error">Invalid Credentials</p>
      }
    </div>
  `,
  styles: `
  .login-container {
        max-width: 400px;
        margin: 0 auto;
        padding: 20px;
        border: 1px solid #ccc;
        border-radius: 8px;
        text-align: center;
      }
      input {
        padding: 8px;
        margin: 10px;
        width: 100%;
        box-sizing: border-box;
      }
      button {
        padding: 10px 15px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 5px;
        cursor:pointer;
      }
      .error{
        color:red;
      }
  `,
})
export default class LoginComponent implements OnInit {
  
  protected fb: FormBuilder = inject(FormBuilder);
  router:Router = inject(Router);
  private loginService:LoginService = inject(LoginService);

  loginError:WritableSignal<boolean> = signal(false);
  
  loginForm: FormGroup = this.fb.group({});
  // Initialize the form in ngOnInit lifecycle hook
  ngOnInit() {
    this.loginForm = this.fb.group({
      name: ['', Validators.required], // Add validation to the name field
    });

    // transform first letter to uppercase automatically when typing
    this.loginForm.get('name')?.valueChanges.subscribe((value)=>{
      if(value){
        value = value.toLowerCase();
        value = value.charAt(0).toUpperCase() + value.slice(1);
        this.loginForm.patchValue({name:value}, {emitEvent:false});
      }
    })
  }
  
  // Handle the form submission
  login() {
    if (this.loginForm.valid) {
      const name = this.loginForm.value.name;
      const user = this.loginService.findUser(name);
      // Handle the login logic (e.g., store the name in localStorage)
      if(user){
        this.loginService.setLoggedInUser(user);
        this.router.navigate(['/challenges']).then(success=>{
          if(success){
            console.log("Navigation success!");
          }else{
            console.log("Navigation failed!");
          }
        });
      }else{
        this.loginError();
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
