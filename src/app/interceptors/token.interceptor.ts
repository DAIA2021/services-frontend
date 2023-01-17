import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(
    private authService :AuthService
  ) {}
  // request representa a requisição que interceptada
  // next vai dar continuidade a requisição

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    /*recuperar a requisição e ver se há um token para ser enviado
    se o token existir ele adicionara o token a requisição e ela contunuara 
    se não, ele não adicionara o token e a requisição continuará sem o token
    */ 
    const token = this.authService.recuperarToken()
    if (token) {
      const clone = request.clone({
        headers : request.headers.set('Authorization', `Bearer ${token}`)                
      })
      return next.handle(clone)

    }
    return next.handle(request);
  }
}
