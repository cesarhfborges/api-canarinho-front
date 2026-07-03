import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TooltipModule } from 'primeng/tooltip';

@Component({
    selector: 'app-condition-builder-modal',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ButtonModule,
        SelectModule,
        InputTextModule,
        InputNumberModule,
        ToggleSwitchModule,
        TooltipModule
    ],
    templateUrl: './condition-builder-modal.component.html'
})
export class ConditionBuilderModalComponent implements OnInit {
    private fb = inject(FormBuilder);
    public config = inject(DynamicDialogConfig);
    public ref = inject(DynamicDialogRef);

    conditionForm!: FormGroup;
    availableBaseFields: any[] = [];
    fakerMethods: any[] = [];

    ngOnInit(): void {
        const val = this.config.data?.value;
        this.availableBaseFields = this.config.data?.availableBaseFields || [];
        this.fakerMethods = this.config.data?.fakerMethods || [];

        this.conditionForm = this.fb.group({
            dependsOn: [val?.dependsOn ?? '', Validators.required],
            conditions: this.fb.array<FormGroup>([]),
            defaultResultType: [val?.defaultResultType ?? 'String', Validators.required],
            defaultResultValue: [val?.defaultResultValue ?? '']
        });

        if (val?.conditions && Array.isArray(val.conditions)) {
            val.conditions.forEach((c: any) => {
                this.conditionsFormArray.push(this.fb.group({
                    operator: [c.operator ?? '==', Validators.required],
                    compareValue: [c.compareValue ?? '', Validators.required],
                    resultType: [c.resultType ?? 'String', Validators.required],
                    resultValue: [c.resultValue ?? '']
                }));
            });
        }
    }

    get conditionsFormArray(): FormArray {
        return this.conditionForm.get('conditions') as FormArray;
    }

    addCondition(): void {
        this.conditionsFormArray.push(this.fb.group({
            operator: ['==', Validators.required],
            compareValue: ['', Validators.required],
            resultType: ['String', Validators.required],
            resultValue: ['']
        }));
    }

    removeCondition(index: number): void {
        this.conditionsFormArray.removeAt(index);
    }

    saveConditions(): void {
        if (this.conditionForm.invalid) {
            this.conditionForm.markAllAsTouched();
            return;
        }

        this.ref.close(this.conditionForm.value);
    }
    
    close(): void {
        this.ref.close();
    }
}
