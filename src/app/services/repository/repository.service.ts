import { Injectable } from '@angular/core';
import { NgxIndexedDBService, WithID } from 'ngx-indexed-db';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export abstract class RepositoryService<T> {

  constructor(private storeName: string, private dbService: NgxIndexedDBService) {}

  getAll(): Observable<T[]> {
    return this.dbService.getAll<T>(this.storeName);
  }

  add(entity: T): Observable<T & WithID> {
    return this.dbService.add<T>(this.storeName, entity);
  }

  edit(entity: T): Observable<T> {
    return this.dbService.update<T>(this.storeName, entity);
  }

  delete(id: IDBValidKey): Observable<T[]> {
    return this.dbService.delete<T>(this.storeName, id);
  }
}
