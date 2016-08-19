// App
import { AppState } from "./app.state";
import { HTTP_PROVIDERS } from '@angular/http';
export * from './app.component';

// Application wide providers
export const APP_PROVIDERS = [
  AppState,
  HTTP_PROVIDERS
];
