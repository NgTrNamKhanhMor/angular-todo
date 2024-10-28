import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm',
  standalone: true,
  imports: [],
  templateUrl: './confirm.component.html',
  styleUrl: './confirm.component.css',
})
export class ConfirmComponent {
  activeModal = inject(NgbActiveModal);

  @Input() todoName: string = '';
  @Output() confirmDelete = new EventEmitter<void>();
  @Output() cancelDelete = new EventEmitter<void>();

  confirm() {
    this.confirmDelete.emit();
    this.activeModal.close()
  }

  cancel() {
    this.cancelDelete.emit();
    this.activeModal.close();
  }
}
