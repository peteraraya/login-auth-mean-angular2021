import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { AuthResponse, Usuario } from '../interfaces/auth-Interface';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseURL: string = environment.baseUrl;
  private _usuario!: Usuario;

  get usuario() {
    return { ...this._usuario }
  }

  constructor(private http: HttpClient) { }


  register(name:string, email:string, password:string){
    const url = `${this.baseURL}/auth/new`;
    const body = { name, email, password };

    return this.http.post<AuthResponse>(url, body)
              .pipe(
                tap(({ ok,token }) => {
                  if ( ok ) {
                    // alamacenamos nuestro jwt
                    localStorage.setItem('token',  token! )
                  }
                }),
                map(resp => resp.ok),
                catchError(err => of(err.error.msg)) // atrapamos error
              )
  }


  login(email: string, password: string) {

    const url = `${this.baseURL}/auth`;
    const body = { email, password };

    return this.http.post<AuthResponse>(url, body)
      .pipe(
        tap(resp => {
          if (resp.ok) {
            // alamacenamos nuestro jwt
            localStorage.setItem('token', resp.token!)
          }
        }),
        map(resp => resp.ok),
        catchError(err => of(err.error.msg)) // atrapamos error
      )
  }

  validarToken(): Observable<boolean> {

    const url = `${this.baseURL}/auth/renew`;
    const headers = new HttpHeaders()
      .set('x-token', localStorage.getItem('token') || '');

    return this.http.get<AuthResponse>(url, { headers: headers })
      .pipe(
        map(resp => {
          // Mantengo persistente la información del usuario
          localStorage.setItem('token', resp.token!)
          this._usuario = {
            name: resp.name!,
            uid: resp.uid!,
            email: resp.email!
          }
          return resp.ok
        }),
        // atrapamos el error
        catchError(err => of(false))
      )
  }


  logout() {
    localStorage.clear();
  }

}





/**
 * Para hacer peticiones http necesitamos HttpClient
 * para transformar un booleano en un obs utilizamos of
 */