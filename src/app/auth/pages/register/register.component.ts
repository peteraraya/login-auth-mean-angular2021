import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent {

  miFormulario: FormGroup = this.fb.group({
    name    : ['test1', [Validators.required ]],
    email   : ['test1@test.com', [Validators.required, Validators.email]],
    password: ['123456', [Validators.required, Validators.minLength(6)]],
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) { }

  register(){
    // console.log(this.miFormulario.value);
    
    // Obtengo parametros de mi formulario
    const { name, email, password } = this.miFormulario.value;

    this.authService.register(name,email,password)
        .subscribe( ok =>{
          if (ok === true ) {
            Swal.fire('Felicidades', 'Usuario '+name+' registrado correctamente', 'success');
            this.router.navigate(['/dashboard']);
          }else{
            Swal.fire('Error', ok, 'error');
          }
        });


    this.router.navigateByUrl('/dashboard');
  }
}
