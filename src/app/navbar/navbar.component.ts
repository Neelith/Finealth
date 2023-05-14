import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  constructor(private router : Router) { }

  onAccountIconClick(){
    this.router.navigateByUrl("/login");
  }

  onHomeIconClick(){
    this.router.navigateByUrl("/");
  }

  onMovementsIconClick(){
    this.router.navigateByUrl("/movements");
  }

  onCategoriesIconClick(){
    this.router.navigateByUrl("/categories");
  }

}
