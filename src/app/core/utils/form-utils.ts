import { AbstractControl, FormArray, FormGroup } from '@angular/forms';

export function findInvalidControlsRecursive(formToInvestigate: FormGroup | FormArray): any {
    const invalidControls: any = {};
    const recursiveFunc = (form: FormGroup | FormArray | AbstractControl, currentPath: string) => {
        if (form instanceof FormGroup) {
            Object.keys(form.controls).forEach(field => {
                const control = form.get(field);
                const controlPath = currentPath ? `${currentPath}.${field}` : field;
                if (control?.invalid) {
                    invalidControls[controlPath] = control.errors;
                }
                if (control instanceof FormGroup || control instanceof FormArray) {
                    recursiveFunc(control, controlPath);
                }
            });
        } else if (form instanceof FormArray) {
            form.controls.forEach((control, index) => {
                const controlPath = `${currentPath}[${index}]`;
                if (control?.invalid) {
                    invalidControls[controlPath] = control.errors;
                }
                if (control instanceof FormGroup || control instanceof FormArray) {
                    recursiveFunc(control, controlPath);
                }
            });
        }
    };
    recursiveFunc(formToInvestigate, '');
    return invalidControls;
}
