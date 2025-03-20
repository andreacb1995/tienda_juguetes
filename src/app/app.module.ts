import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';

@NgModule({
  // ... otros imports y declarations
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  // ... bootstrap
})
export class AppModule { } 