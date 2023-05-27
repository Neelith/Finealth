import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageTitleBarComponent } from 'src/app/page-title-bar/page-title-bar.component';
import { Category } from 'src/app/entities/model/Category';
import { Observable, Subscription } from 'rxjs';
import { CategoryRepositoryService } from '../../../indexedDb/repositories/category-repository/category-repository.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormControlDescriptor } from 'src/app/entities/dto/FormControlDescriptor';
import { IconService } from 'src/app/services/icon/icon.service';
import { CuFormComponent } from 'src/app/generic/cu-form/cu-form.component';
import { MatDialog } from '@angular/material/dialog';
import { DDialogComponent } from 'src/app/generic/d-dialog/d-dialog.component';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { IconSelectOption } from 'src/app/entities/dto/IconSelectOption';
import { TableColumnDescriptor } from 'src/app/entities/dto/TableColumnDescriptor';
import { RTableComponent } from 'src/app/generic/r-table/r-table.component';

@Component({
  selector: 'app-categories-page',
  standalone: true,
  providers: [CategoryRepositoryService, IconService, NotificationService],
  templateUrl: './categories-page.component.html',
  styleUrls: ['./categories-page.component.scss'],
  imports: [
    CommonModule,
    RTableComponent,
    PageTitleBarComponent,
    CuFormComponent,
  ],
})
export class CategoriesPageComponent implements OnInit, OnDestroy {
  pageTitle: string = 'Categorie';
  categories$!: Observable<Category[]>;
  addFormControlDescriptors: FormControlDescriptor[] = [];
  addFormEnabled: boolean = false;
  editFormControlDescriptors: FormControlDescriptor[] = [];
  editFormEnabled: boolean = false;
  displayedColumns: TableColumnDescriptor[] = [
    { field: 'iconUrl', header: 'Icon', type: 'icon' },
    { field: 'name', header: 'Nome', type: 'text' },
    { field: 'actions', header: 'Azioni', type: 'actions' },
  ];

  private subscription: Subscription = new Subscription();

  constructor(
    private categoryRepository: CategoryRepositoryService,
    private iconService: IconService,
    private dialog: MatDialog,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.categories$ = this.categoryRepository.getAll();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  showAddCategoryForm() {
    this.addFormControlDescriptors = [
      {
        formControlName: 'name',
        formControl: new FormControl('', [
          Validators.required,
          Validators.maxLength(100),
        ]),
        hidden: false,
        label: 'Nome',
        type: 'Text',
      },
      {
        formControlName: 'iconUrl',
        formControl: new FormControl('', [Validators.required]),
        hidden: false,
        label: 'Icona',
        type: 'IconSelect',
        iconSelectOptions: this.getIconSelectOptions(
          this.iconService.getIconUrls()
        ),
      },
    ];

    this.addFormEnabled = true;
    this.editFormEnabled = false;
  }

  addCategory(form: FormGroup) {
    this.addFormEnabled = false;

    if (form.valid) {
      let category: Category = new Category();
      category.name = form.value.name;
      category.iconUrl = form.value.iconUrl;

      this.subscription.add(
        this.categoryRepository.add(category).subscribe({
          next: () => {
            this.notificationService.notifySuccess(
              'Categoria aggiunta con successo!'
            );
            this.categories$ = this.categoryRepository.getAll();
          },
          error: () => {
            this.notificationService.notifyFailure('Qualcosa è andato storto!');
          },
        })
      );
    }
  }

  showEditCategoryForm(category: Category) {
    this.editFormControlDescriptors = [
      {
        formControlName: 'categoryId',
        formControl: new FormControl({
          value: category.categoryId,
          disabled: true,
        }),
        hidden: true,
        label: 'Categoria',
        type: 'Text',
      },
      {
        formControlName: 'name',
        formControl: new FormControl(category.name, [
          Validators.required,
          Validators.maxLength(100),
        ]),
        hidden: false,
        label: 'Nome',
        type: 'Text',
      },
      {
        formControlName: 'iconUrl',
        formControl: new FormControl(category.iconUrl, [Validators.required]),
        hidden: false,
        label: 'Icona',
        type: 'IconSelect',
        iconSelectOptions: this.getIconSelectOptions(
          this.iconService.getIconUrls()
        ),
      },
    ];

    this.addFormEnabled = false;
    this.editFormEnabled = true;
  }

  editCategory(form: FormGroup) {
    this.editFormEnabled = false;

    if (form.valid) {
      let category: Category = {
        categoryId: form.value.categoryId,
        name: form.value.name,
        iconUrl: form.value.iconUrl,
      };
      this.subscription.add(
        this.categoryRepository.edit(category).subscribe({
          next: () => {
            this.notificationService.notifySuccess(
              'Categoria modificata con successo!'
            );
            this.categories$ = this.categoryRepository.getAll();
          },
          error: () => {
            this.notificationService.notifyFailure('Qualcosa è andato storto!');
          },
        })
      );
    }
  }

  deleteCategory(category: Category) {
    this.subscription.add(
      this.dialog
        .open(DDialogComponent)
        .afterClosed()
        .subscribe((result) => {
          if (result === true) {
            this.subscription.add(
              this.categoryRepository.delete(category.categoryId).subscribe({
                next: () => {
                  this.notificationService.notifySuccess(
                    'Categoria eliminata con successo!'
                  );

                  this.categories$ = this.categoryRepository.getAll();
                },
                error: () => {
                  this.notificationService.notifyFailure(
                    'Qualcosa è andato storto.'
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
  }

  showTable() {
    return !this.editFormEnabled && !this.addFormEnabled;
  }

  private getIconSelectOptions(iconUrls: string[]): IconSelectOption<string>[] {
    let keyValues = [] as IconSelectOption<string>[];
    for (const iconUrl of iconUrls) {
      keyValues.push({
        label: this.getIconLabel(iconUrl),
        src: iconUrl,
        value: iconUrl,
      });
    }

    return keyValues;
  }

  private getIconLabel(iconUrl: string): string {
    const lastSlashIndex = iconUrl.lastIndexOf('/');
    const lastDotIndex = iconUrl.lastIndexOf('.');
    let iconLabel = iconUrl.slice(lastSlashIndex + 1, lastDotIndex);

    // Replace all '-' and '_' characters with a whitespace
    iconLabel = iconLabel.replace(/[-_]/g, ' ');

    // Remove the word 'icon' from the label
    iconLabel = iconLabel.replace(/icons8/g, '');
    iconLabel = iconLabel.replace(/icon/g, '');
    iconLabel = iconLabel.replace(/64/g, '');

    return iconLabel;
  }
}
