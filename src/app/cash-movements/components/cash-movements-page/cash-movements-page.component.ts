import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CashMovement } from 'src/app/entities/model/Cash-Movement';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Observable, firstValueFrom, map } from 'rxjs';
import { FormControlDescriptor } from 'src/app/entities/dto/FormControlDescriptor';
import { DDialogComponent } from 'src/app/generic/d-dialog/d-dialog.component';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { CashMovementRepositoryService } from '../../services/cash-movement-repository/cash-movement-repository.service';
import { CuFormComponent } from 'src/app/generic/cu-form/cu-form.component';
import { PageTitleBarComponent } from 'src/app/page-title-bar/page-title-bar.component';
import { RTableComponent } from 'src/app/generic/r-table/r-table.component';
import { TableColumnDescriptor } from 'src/app/entities/dto/TableColumnDescriptor';
import { CashMovementView } from 'src/app/entities/views/Cash-Movement-View';
import { CategoryRepositoryService } from 'src/app/categories/services/category-repository/category-repository.service';
import { Category } from 'src/app/entities/model/Category';
import { IconSelectOption } from 'src/app/entities/dto/IconSelectOption';

@Component({
  selector: 'app-cash-movements-page',
  standalone: true,
  imports: [
    CommonModule,
    PageTitleBarComponent,
    CuFormComponent,
    RTableComponent,
  ],
  providers: [CashMovementRepositoryService, NotificationService],
  templateUrl: './cash-movements-page.component.html',
  styleUrls: ['./cash-movements-page.component.scss'],
})
export class CashMovementsPageComponent implements OnInit {
  pageTitle: string = 'Movimenti';
  movements$!: Observable<CashMovementView[]>;
  addFormControlDescriptors: FormControlDescriptor[] = [];
  addFormEnabled: boolean = false;
  editFormControlDescriptors: FormControlDescriptor[] = [];
  editFormEnabled: boolean = false;
  displayedColumns: TableColumnDescriptor[] = [
    { field: 'iconUrl', header: 'Icon', type: 'icon' },
    { field: 'categoryName', header: 'Categoria', type: 'text' },
    { field: 'date', header: 'Data', type: 'date' },
    { field: 'description', header: 'Descrizione', type: 'text' },
    { field: 'amount', header: 'Ammontare', type: 'currency' },
    { field: 'actions', header: 'Azioni', type: 'actions' },
  ];
  private categories: Category[] = [];

  constructor(
    private movementsRepository: CashMovementRepositoryService,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private categoryRepository: CategoryRepositoryService
  ) {}

  async ngOnInit() {
    this.categories = await firstValueFrom(this.categoryRepository.getAll());
    this.movements$ = this.loadCashMovements();
  }

  private loadCashMovements(): Observable<CashMovementView[]> {
    return this.movementsRepository.getAll().pipe(
      map((movements) => {
        let views: CashMovementView[] = [];

        for (const movement of movements) {
          const category = this.getCategoryById(movement.categoryId);

          views.push({
            cashMovementId: movement.cashMovementId,
            description: movement.description,
            date: movement.date,
            amount: movement.amount,
            categoryId: movement.categoryId,
            categoryName: category ? category.name : '',
            iconUrl: category ? category.iconUrl : '',
          });
        }

        return views;
      })
    );
  }

  showAddMovementForm() {
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
        iconSelectOptions: this.getIconSelectOptionsFromCategories(
          this.categories
        ),
      },
    ];

    this.addFormEnabled = true;
  }

  addMovement(form: FormGroup) {
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

  showEditMovementForm(movement: CashMovement) {
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
        iconSelectOptions: this.getIconSelectOptionsFromCategories(
          this.categories
        ),
      },
    ];

    this.editFormEnabled = true;
  }

  editMovement(form: FormGroup) {
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

  deleteMovement(movement: CashMovementView) {
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

  private getCategoryById(categoryId: number) {
    return this.categories.find(
      (category) => category.categoryId === categoryId
    );
  }

  private getIconSelectOptionsFromCategories(
    categories: Category[]
  ): IconSelectOption<number>[] {
    let iconSelectOptions = [] as IconSelectOption<number>[];
    for (const category of categories) {
      iconSelectOptions.push({
        label: category.name,
        src: category.iconUrl,
        value: category.categoryId,
      });
    }

    return iconSelectOptions;
  }
}
