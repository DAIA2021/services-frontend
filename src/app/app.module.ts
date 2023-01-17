import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire/compat/'
import { environment } from 'src/environments/environment';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { NavbarComponent } from './components/navbar/navbar.component'
import { TokenInterceptor } from './interceptors/token.interceptor';

@NgModule({
  // componentes/ pipes e diretivas
  declarations: [
    AppComponent,
   
  ],
  imports: [
    // módulos
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireStorageModule
  ],
  // qualquer estrutura do angular que tiver o decorator Injectable 
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true //para que o token interceptor seja executado em todas as requisiçõe
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
