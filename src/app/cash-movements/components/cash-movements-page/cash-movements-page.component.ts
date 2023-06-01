import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CashMovement } from 'src/app/entities/model/Cash-Movement';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subscription, firstValueFrom, map } from 'rxjs';
import { FormControlDescriptor } from 'src/app/entities/dto/FormControlDescriptor';
import { DDialogComponent } from 'src/app/generic/d-dialog/d-dialog.component';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { CashMovementRepositoryService } from '../../../indexedDb/repositories/cash-movement-repository/cash-movement-repository.service';
import { CuFormComponent } from 'src/app/generic/cu-form/cu-form.component';
import { PageTitleBarComponent } from 'src/app/page-title-bar/page-title-bar.component';
import { RTableComponent } from 'src/app/generic/r-table/r-table.component';
import { TableColumnDescriptor } from 'src/app/entities/dto/TableColumnDescriptor';
import { CashMovementView } from 'src/app/entities/views/Cash-Movement-View';
import { CategoryRepositoryService } from 'src/app/indexedDb/repositories/category-repository/category-repository.service';
import { Category } from 'src/app/entities/model/Category';
import { IconSelectOption } from 'src/app/entities/dto/IconSelectOption';
import { GenericViewComponent } from 'src/app/generic/generic-view/generic-view.component';
import { DetailViewDescriptor } from 'src/app/entities/dto/DetailViewDescriptor';
import { CashMovementType } from 'src/app/entities/enums/CashMovementType';
import {
  BreakpointObserver,
  BreakpointState,
  Breakpoints,
} from '@angular/cdk/layout';

@Component({
  selector: 'app-cash-movements-page',
  standalone: true,
  imports: [
    CommonModule,
    PageTitleBarComponent,
    CuFormComponent,
    RTableComponent,
    GenericViewComponent,
  ],
  providers: [CashMovementRepositoryService, NotificationService],
  templateUrl: './cash-movements-page.component.html',
  styleUrls: ['./cash-movements-page.component.scss'],
})
export class CashMovementsPageComponent implements OnInit, OnDestroy {
  pageTitle: string = 'Movimenti';
  movements$!: Observable<CashMovementView[]>;
  addFormControlDescriptors: FormControlDescriptor[] = [];
  addFormEnabled: boolean = false;
  editFormControlDescriptors: FormControlDescriptor[] = [];
  editFormEnabled: boolean = false;
  displayedColumns: TableColumnDescriptor[] = [
    { field: 'iconUrl', header: 'Icon', type: 'icon' },
    { field: 'amount', header: 'Ammontare', type: 'currency' },
    { field: 'actions', header: 'Azioni', type: 'actions' },
  ];
  detailsViewEnabled: boolean = false;
  detailsViewDescriptors: DetailViewDescriptor[] = [];

  private categories: Category[] = [];
  private subscription: Subscription = new Subscription();

  constructor(
    private movementsRepository: CashMovementRepositoryService,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private categoryRepository: CategoryRepositoryService,
    private breakpointObserver: BreakpointObserver
  ) {
    this.subscription.add(
      this.breakpointObserver
        .observe([
          Breakpoints.XSmall,
          Breakpoints.Small,
          Breakpoints.Medium,
          Breakpoints.Large,
          Breakpoints.XLarge,
        ])
        .subscribe((result: BreakpointState) => {
          if (result.breakpoints[Breakpoints.Small]) {
            const dateField: TableColumnDescriptor = {
              field: 'date',
              header: 'Data',
              type: 'date',
            };
            this.displayedColumns.splice(1, 0, dateField);
          }

          if (result.breakpoints[Breakpoints.Medium]) {
            const dateField: TableColumnDescriptor = {
              field: 'date',
              header: 'Data',
              type: 'date',
            };
            this.displayedColumns.splice(1, 0, dateField);

            const categoryNameField: TableColumnDescriptor = {
              field: 'categoryName',
              header: 'Categoria',
              type: 'text',
            };
            this.displayedColumns.splice(1, 0, categoryNameField);
          }

          if (
            result.breakpoints[Breakpoints.Large] ||
            result.breakpoints[Breakpoints.XLarge]
          ) {
            const descriptionField: TableColumnDescriptor = {
              field: 'description',
              header: 'Descrizione',
              type: 'text',
            };
            this.displayedColumns.splice(1, 0, descriptionField);

            const dateField: TableColumnDescriptor = {
              field: 'date',
              header: 'Data',
              type: 'date',
            };
            this.displayedColumns.splice(1, 0, dateField);

            const categoryNameField: TableColumnDescriptor = {
              field: 'categoryName',
              header: 'Categoria',
              type: 'text',
            };
            this.displayedColumns.splice(1, 0, categoryNameField);
          }
        })
    );
  }

  async ngOnInit() {
    this.categories = await firstValueFrom(this.categoryRepository.getAll());
    this.movements$ = this.loadCashMovements();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  showMovementDetails(movement: CashMovementView) {
    this.detailsViewDescriptors = [
      {
        hidden: false,
        label: 'Ammontare',
        value: movement.amount,
        type: 'Currency',
      },
      {
        hidden: false,
        label: 'Categoria',
        value: movement.categoryName,
        type: 'Text',
      },
      {
        hidden: false,
        label: 'Tipologia',
        value: movement.cashMovementTypeName,
        type: 'Text',
      },
      { hidden: false, label: 'Data', value: movement.date, type: 'Date' },
      {
        hidden: false,
        label: 'Descrizione',
        value: movement.description,
        type: 'Text',
      },
    ];

    this.addFormEnabled = false;
    this.editFormEnabled = false;
    this.detailsViewEnabled = true;
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
        formControl: new FormControl(new Date(), [Validators.required]),
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
      {
        formControlName: 'cashMovementTypeName',
        formControl: new FormControl(
          CashMovementType[CashMovementType.COMFORT],
          [Validators.required]
        ),
        hidden: false,
        label: 'Tipologia',
        type: 'Select',
        selectOptions: Object.values(CashMovementType).filter(
          (value) => typeof value === 'string'
        ) as string[],
      },
    ];

    this.addFormEnabled = true;
    this.editFormEnabled = false;
    this.detailsViewEnabled = false;
  }

  addMovement(form: FormGroup) {
    this.addFormEnabled = false;

    if (form.valid) {
      let movement: CashMovement = new CashMovement();
      movement.amount = form.value.amount;
      movement.categoryId = form.value.categoryId;
      movement.date = form.value.date;
      movement.description = form.value.description;
      movement.cashMovementTypeId =
        CashMovementType[
          form.value.cashMovementTypeName as keyof typeof CashMovementType
        ];

      this.subscription.add(
        this.movementsRepository.add(movement).subscribe({
          next: () => {
            this.notificationService.notifySuccess(
              'Movimento aggiunto con successo!'
            );

            this.movements$ = this.loadCashMovements();
          },
          error: () => {
            this.notificationService.notifyFailure('Qualcosa è andato storto!');
          },
        })
      );
    }
  }

  showEditMovementForm(movement: CashMovementView) {
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
      {
        formControlName: 'cashMovementTypeName',
        formControl: new FormControl(movement.cashMovementTypeName, [
          Validators.required,
        ]),
        hidden: false,
        label: 'Tipologia',
        type: 'Select',
        selectOptions: Object.values(CashMovementType).filter(
          (value) => typeof value === 'string'
        ) as string[],
      },
    ];

    this.addFormEnabled = false;
    this.editFormEnabled = true;
    this.detailsViewEnabled = false;
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
        cashMovementTypeId:
          CashMovementType[
            form.value.cashMovementTypeName as keyof typeof CashMovementType
          ],
      };

      this.subscription.add(
        this.movementsRepository.edit(movement).subscribe({
          next: () => {
            this.notificationService.notifySuccess(
              'Movimento modificato con successo!'
            );

            this.movements$ = this.loadCashMovements();
          },
          error: () => {
            this.notificationService.notifyFailure('Qualcosa è andato storto!');
          },
        })
      );
    }
  }

  deleteMovement(movement: CashMovementView) {
    this.subscription.add(
      this.dialog
        .open(DDialogComponent)
        .afterClosed()
        .subscribe((result) => {
          if (result === true) {
            this.subscription.add(
              this.movementsRepository
                .delete(movement.cashMovementId)
                .subscribe({
                  next: () => {
                    this.notificationService.notifySuccess(
                      'Movimento eliminato con successo!'
                    );

                    this.movements$ = this.loadCashMovements();
                  },
                  error: () => {
                    this.notificationService.notifyFailure(
                      'Qualcosa è andato storto!'
                    );
                  },
                })
            );
          }
        })
    );
  }

  onCancelForm() {
    this.editFormEnabled = false;
    this.addFormEnabled = false;
    this.detailsViewEnabled = false;
  }

  showTable() {
    return (
      !this.editFormEnabled && !this.addFormEnabled && !this.detailsViewEnabled
    );
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
            cashMovementTypeName: CashMovementType[movement.cashMovementTypeId],
          });
        }

        return views.sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
      })
    );
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
