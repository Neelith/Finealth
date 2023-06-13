import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { CashMovement } from 'src/app/entities/model/Cash-Movement';
import { RepositoryService } from 'src/app/services/repository/repository.service';

@Injectable({
  providedIn: 'root',
})
export class CashMovementRepositoryService extends RepositoryService<CashMovement> {
  constructor(dbService: NgxIndexedDBService) {
    super('CashMovements', dbService);
  }
}
