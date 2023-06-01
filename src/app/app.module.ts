import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from "./navbar/navbar.component";
import { MaterialModule } from './material/material.module';
import { NgxIndexedDBModule } from 'ngx-indexed-db';
import { indexedDbConfig } from './indexedDb/indexedDbConfig';
import { ServiceWorkerModule } from '@angular/service-worker';
import { NgxEchartsModule } from 'ngx-echarts';

@NgModule({
    declarations: [
        AppComponent
    ],
    providers: [],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        MaterialModule,
        BrowserAnimationsModule,
        NavbarComponent,
        NgxIndexedDBModule.forRoot(indexedDbConfig),
        ServiceWorkerModule.register('ngsw-worker.js', {
          enabled: !isDevMode(),
          // Register the ServiceWorker as soon as the application is stable
          // or after 30 seconds (whichever comes first).
          registrationStrategy: 'registerWhenStable:30000'
        }),
        NgxEchartsModule.forRoot({
          echarts: () => import('echarts'),
        }),
    ]
})
export class AppModule { }
