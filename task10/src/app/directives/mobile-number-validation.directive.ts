import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appMobileNumberValidation]',
  standalone: true
})
export class MobileNumberValidationDirective {

constructor(private ngControl: NgControl) { }

  @HostListener('input', ['$event'])
  onInputChange(event: any) {
    const input = event.target.value;
    const transformedInput = input.replace(/[^0-9+]/g, '');
    this.ngControl.control?.setValue(transformedInput);
    if (input !== transformedInput) {
      event.stopPropagation();
    }
  }
}
