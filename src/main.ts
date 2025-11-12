import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { importProvidersFrom } from '@angular/core';
import { environment } from './environments/firebase';

bootstrapApplication(App, {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),
    importProvidersFrom(
      provideFirebaseApp(() => initializeApp(environment)),
      provideFirestore(() => getFirestore()),
      provideAuth(() => getAuth())
    )
  ]
}
    )
  .catch((err) => console.error(err));
