import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CashMovement } from 'src/app/entities/model/Cash-Movement';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { FormControlDescriptor } from 'src/app/entities/dto/FormControlDescriptor';
import { DDialogComponent } from 'src/app/generic/d-dialog/d-dialog.component';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { CashMovementRepositoryService } from '../../services/cash-movement-repository/cash-movement-repository.service';
import { CuFormComponent } from 'src/app/generic/cu-form/cu-form.component';
import { TableComponent } from 'src/app/generic/table/table.component';
import { PageTitleBarComponent } from 'src/app/page-title-bar/page-title-bar.component';

@Component({
  selector: 'app-cash-movements-page',
  standalone: true,
  imports: [
    CommonModule,
    TableComponent,
    PageTitleBarComponent,
    CuFormComponent,
  ],
  providers: [CashMovementRepositoryService, NotificationService],
  templateUrl: './cash-movements-page.component.html',
  styleUrls: ['./cash-movements-page.component.scss'],
})
export class CashMovementsPageComponent {
  pageTitle: string = 'Movimenti';
  movements$: Observable<CashMovement[]> = this.movementsRepository.getAll();
  displayedColumns: string[] = ['date', 'description', 'amount', 'actions'];
  addFormControlDescriptors: FormControlDescriptor[] = [];
  addFormEnabled: boolean = false;
  editFormControlDescriptors: FormControlDescriptor[] = [];
  editFormEnabled: boolean = false;

  constructor(
    private movementsRepository: CashMovementRepositoryService,
    private dialog: MatDialog,
    private notificationService: NotificationService
  ) {}

  showAddMovementForm() {
    this.addFormControlDescriptors = [
      {
        formControlName: 'description',
        formControl: new FormControl('', [Validators.maxLength(100)]),
        hidden: false,
        label: 'Descrizione',
      },
      {
        formControlName: 'date',
        formControl: new FormControl('', [Validators.required]),
        hidden: false,
        label: 'Data',
      },
      {
        formControlName: 'amount',
        formControl: new FormControl('', [Validators.required]),
        hidden: false,
        label: 'Ammontare',
      },
      {
        formControlName: 'categoryId',
        formControl: new FormControl('', [Validators.required]),
        hidden: false,
        label: 'Categoria',
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
    } else {
      this.notificationService.notifyFailure('Qualcosa è andato storto!');
    }

    this.movements$ = this.movementsRepository.getAll();
  }

  showEditMovementForm(movement: CashMovement) {
    this.editFormControlDescriptors = [
      {
        formControlName: 'cashMovementId',
        formControl: new FormControl(movement.cashMovementId, [Validators.required, Validators.maxLength(100)]),
        hidden: true,
        label: 'Movimento',
      },
      {
        formControlName: 'description',
        formControl: new FormControl(movement.description, [Validators.maxLength(100)]),
        hidden: false,
        label: 'Descrizione',
      },
      {
        formControlName: 'date',
        formControl: new FormControl(movement.date, [Validators.required]),
        hidden: false,
        label: 'Data',
      },
      {
        formControlName: 'amount',
        formControl: new FormControl(movement.amount, [Validators.required]),
        hidden: false,
        label: 'Ammontare',
      },
      {
        formControlName: 'categoryId',
        formControl: new FormControl(movement.categoryId, [Validators.required]),
        hidden: false,
        label: 'Categoria',
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
        date: form.value.date
      };
      this.movementsRepository.edit(movement).subscribe();
      this.notificationService.notifySuccess(
        'Movimento modificato con successo!'
      );
    } else {
      this.notificationService.notifyFailure('Qualcosa è andato storto!');
    }

    this.movements$ = this.movementsRepository.getAll();
  }

  deleteMovement(movement: CashMovement) {
    this.dialog
      .open(DDialogComponent)
      .afterClosed()
      .subscribe((result) => {
        if (result === true) {
          this.movementsRepository.delete(movement.cashMovementId).subscribe();
          this.movements$ = this.movementsRepository.getAll();
          this.notificationService.notifySuccess(
            'Movimento eliminato con successo!'
          );
        } else {
          this.notificationService.notifyFailure('Operazione annullata.');
        }
      });
  }

  onCancelEditForm() {
    this.editFormEnabled = false;
    this.notificationService.notifyFailure('Operazione annullata.');
  }

  onCancelAddForm() {
    this.addFormEnabled = false;
    this.notificationService.notifyFailure('Operazione annullata.');
  }

  showTable() {
    return !this.editFormEnabled && !this.addFormEnabled;
  }
}
