import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CashMovement } from 'src/app/entities/model/Cash-Movement';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Observable, map } from 'rxjs';
import { FormControlDescriptor } from 'src/app/entities/dto/FormControlDescriptor';
import { DDialogComponent } from 'src/app/generic/d-dialog/d-dialog.component';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { CashMovementRepositoryService } from '../../services/cash-movement-repository/cash-movement-repository.service';
import { CuFormComponent } from 'src/app/generic/cu-form/cu-form.component';
import { PageTitleBarComponent } from 'src/app/page-title-bar/page-title-bar.component';
import { CategoryMapperService } from '../../services/category-mapper/category-mapper.service';
import { RTableComponent } from 'src/app/generic/r-table/r-table.component';
import { TableColumnDescriptor } from 'src/app/entities/dto/TableColumnDescriptor';

@Component({
  selector: 'app-cash-movements-page',
  standalone: true,
  imports: [
    CommonModule,
    PageTitleBarComponent,
    CuFormComponent,
    RTableComponent,
  ],
  providers: [
    CashMovementRepositoryService,
    NotificationService,
    CategoryMapperService,
  ],
  templateUrl: './cash-movements-page.component.html',
  styleUrls: ['./cash-movements-page.component.scss'],
})
export class CashMovementsPageComponent {
  pageTitle: string = 'Movimenti';
  movements$: Observable<CashMovement[]>;
  addFormControlDescriptors: FormControlDescriptor[] = [];
  addFormEnabled: boolean = false;
  editFormControlDescriptors: FormControlDescriptor[] = [];
  editFormEnabled: boolean = false;
  displayedColumns: TableColumnDescriptor[] = [
    { field: 'iconUrl', header: 'Icon', type: 'icon' },
    { field: 'date', header: 'Data', type: 'date' },
    { field: 'description', header: 'Descrizione', type: 'text' },
    { field: 'amount', header: 'Ammontare', type: 'currency' },
    { field: 'actions', header: 'Azioni', type: 'actions' },
  ];

  constructor(
    private movementsRepository: CashMovementRepositoryService,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private categoryMapper: CategoryMapperService
  ) {
    this.movements$ = this.loadCashMovements();
  }

  private loadCashMovements(): Observable<CashMovement[]> {
    return this.movementsRepository.getAll().pipe(
      map((movements) => {
        this.categoryMapper.mapCashMovementIconUrls(movements);
        return movements;
      })
    );
  }

  async showAddMovementForm() {
    this.addFormControlDescriptors = [
      {
        formControlName: 'description',
        formControl: new FormControl('', [Validators.maxLength(100)]),
        hidden: false,
        label: 'Descrizione',
        type: 'Text',
      },
      {
        formControlName: 'date',
        formControl: new FormControl('', [Validators.required]),
        hidden: false,
        label: 'Data',
        type: 'Date',
      },
      {
        formControlName: 'amount',
        formControl: new FormControl('', [Validators.required]),
        hidden: false,
        label: 'Ammontare',
        type: 'Text',
      },
      {
        formControlName: 'categoryId',
        formControl: new FormControl('', [Validators.required]),
        hidden: false,
        label: 'Categoria',
        type: 'IconSelect',
        iconSelectOptions:
          await this.categoryMapper.getIconSelectOptionsFromCategories(),
      },
    ];

    this.addFormEnabled = true;
  }

  async addMovement(form: FormGroup) {
    this.addFormEnabled = false;

    if (form.valid) {
      let movement: CashMovement = new CashMovement();
      movement.amount = form.value.amount;
      movement.categoryId = form.value.categoryId;
      movement.date = form.value.date;
      movement.description = form.value.description;

      this.movementsRepository.add(movement).subscribe();
      this.notificationService.notifySuccess(
        'Movimento aggiunto con successo!'
      );
    }

    this.movements$ = this.loadCashMovements();
  }

  async showEditMovementForm(movement: CashMovement) {
    this.editFormControlDescriptors = [
      {
        formControlName: 'cashMovementId',
        formControl: new FormControl(movement.cashMovementId, [
          Validators.required,
          Validators.maxLength(100),
        ]),
        hidden: true,
        label: 'Movimento',
        type: 'Text',
      },
      {
        formControlName: 'description',
        formControl: new FormControl(movement.description, [
          Validators.maxLength(100),
        ]),
        hidden: false,
        label: 'Descrizione',
        type: 'Text',
      },
      {
        formControlName: 'date',
        formControl: new FormControl(movement.date, [Validators.required]),
        hidden: false,
        label: 'Data',
        type: 'Date',
      },
      {
        formControlName: 'amount',
        formControl: new FormControl(movement.amount, [Validators.required]),
        hidden: false,
        label: 'Ammontare',
        type: 'Text',
      },
      {
        formControlName: 'categoryId',
        formControl: new FormControl(movement.categoryId, [
          Validators.required,
        ]),
        hidden: false,
        label: 'Categoria',
        type: 'IconSelect',
        iconSelectOptions:
          await this.categoryMapper.getIconSelectOptionsFromCategories(),
      },
    ];

    this.editFormEnabled = true;
  }

  async editMovement(form: FormGroup) {
    this.editFormEnabled = false;

    if (form.valid) {
      let movement: CashMovement = {
        cashMovementId: form.value.cashMovementId,
        categoryId: form.value.categoryId,
        amount: form.value.amount,
        description: form.value.description,
        date: form.value.date,
      };
      this.movementsRepository.edit(movement).subscribe();
      this.notificationService.notifySuccess(
        'Movimento modificato con successo!'
      );
    }

    this.movements$ = this.loadCashMovements();
  }

  deleteMovement(movement: CashMovement) {
    this.dialog
      .open(DDialogComponent)
      .afterClosed()
      .subscribe((result) => {
        if (result === true) {
          this.movementsRepository.delete(movement.cashMovementId).subscribe();
          this.movements$ = this.loadCashMovements();
          this.notificationService.notifySuccess(
            'Movimento eliminato con successo!'
          );
        }
      });
  }

  onCancelEditForm() {
    this.editFormEnabled = false;
  }

  onCancelAddForm() {
    this.addFormEnabled = false;
  }

  showTable() {
    return !this.editFormEnabled && !this.addFormEnabled;
  }
}
