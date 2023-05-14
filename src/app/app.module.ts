import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from "./navbar/navbar.component";
import { PageTitleBarComponent } from './page-title-bar/page-title-bar.component';
import { NotificationService } from './services/notification/notification.service';
import { MaterialModule } from './material/material.module';
import { TableComponent } from './generic/table/table.component';

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
        NavbarComponent
    ]
})
export class AppModule { }
