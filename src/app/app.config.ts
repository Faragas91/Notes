import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), 
    importProvidersFrom(provideFirebaseApp(() => initializeApp({"projectId":"notes-888ea","appId":"1:135122385963:web:70a0c20ae1f7b146fafe6e","storageBucket":"notes-888ea.firebasestorage.app","apiKey":"AIzaSyDWSnpneCAVKQfR_R79AecJ5fnn7rqlNL8","authDomain":"notes-888ea.firebaseapp.com","messagingSenderId":"135122385963"}))), 
    importProvidersFrom(provideFirestore(() => getFirestore()))]
};
