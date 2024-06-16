import { Injectable } from '@angular/core';
import { ActiveToast, ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToasterService {

  constructor(private toastr: ToastrService) { }

  showSuccessToaster(message: string, title?: string): number {
    const toastRef = this.toastr.success(message, title, {
      progressBar: true,
      tapToDismiss: true,
      newestOnTop: true,
      onActivateTick: true
    });
    return toastRef.toastId;
  }

  showErrorToaster(message: string, title?: string): void {
    this.toastr.error(message, title, {
      progressBar: true,
      tapToDismiss: true,
      newestOnTop: true
    });
  }

  showWarningToaster(message: string, title?: string): void {
    this.toastr.warning(message, title, {
      progressBar: true,
      tapToDismiss: true,
      newestOnTop: true,
    });
  }

  showInfoToaster(message: string, title?: string): void {
    this.toastr.info(message, title, {
      progressBar: true,
      tapToDismiss: true,
      newestOnTop: true,
    })
  }

  clearAllToaster(): void {
    this.toastr.clear();
  }

  showDefaultToaster(message: string, title?: string): void{
    this.toastr.show(message, title, {
      tapToDismiss: true,
      newestOnTop: true,
    });
  }

  removeToaster(id: number): void {
    this.toastr.remove(id);
  }
}
