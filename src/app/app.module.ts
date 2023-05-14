import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from "./navbar/navbar.component";
import { NotificationService } from './services/notification/notification.service';
import { MaterialModule } from './material/material.module';
import { NgxIndexedDBModule } from 'ngx-indexed-db';
import { indexedDbConfig } from './indexedDb/indexedDbConfig';

@NgModule({
    declarations: [
        AppComponent
    ],
    providers: [NotificationService],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        MaterialModule,
        BrowserAnimationsModule,
        NavbarComponent,
        NgxIndexedDBModule.forRoot(indexedDbConfig)
    ]
})
export class AppModule { }
