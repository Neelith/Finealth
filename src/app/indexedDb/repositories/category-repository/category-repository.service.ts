import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Category } from 'src/app/entities/model/Category';
import { RepositoryService } from 'src/app/services/repository/repository.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryRepositoryService extends RepositoryService<Category> {

  constructor(dbService: NgxIndexedDBService) {
    super('Categories', dbService);
  }
}
