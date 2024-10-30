import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

@Component({
  selector: 'app-confirm',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './confirm.component.html',
  styleUrl: './confirm.component.css',
})
export class ConfirmComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      todoName: string;
      confirmDelete: () => void;
    },
    private dialogRef: MatDialogRef<ConfirmComponent>
  ) {}
  confirm() {
    this.data.confirmDelete();
    this.dialogRef.close();
  }
}
