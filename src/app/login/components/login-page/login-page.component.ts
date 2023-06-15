import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit{

  constructor(private httpClient : HttpClient) {
  }

  ngOnInit(){
    console.log('starting request');
    this.httpClient.get('/.auth/me').subscribe(response => console.log(response));
  }
}
