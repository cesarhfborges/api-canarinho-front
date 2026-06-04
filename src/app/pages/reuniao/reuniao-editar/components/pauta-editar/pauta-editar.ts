import { Component, inject, OnInit } from '@angular/core';
import { Button } from 'primeng/button';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputNumber } from 'primeng/inputnumber';
import { RadioButton } from 'primeng/radiobutton';

@Component({
    selector: 'app-pauta-editar',
    imports: [Button, ReactiveFormsModule, InputText, Textarea, InputNumber, RadioButton],
    templateUrl: './pauta-editar.html',
    styleUrl: './pauta-editar.scss'
})
export class PautaEditar implements OnInit {
    public form: FormGroup;

    protected readonly tipoVotos = [
        { label: 'Único', value: 'UNICO' },
        { label: 'Multiplo', value: 'MULTIPLO' }
    ];

    private fb = inject(NonNullableFormBuilder);
    private dialogRef = inject(DynamicDialogRef);
    private dialogConfig = inject(DynamicDialogConfig);

    constructor() {
        this.form = this.fb.group({
            titulo: ['', [Validators.required]],
            descricao: ['', [Validators.required]],
            tipoVoto: ['', [Validators.required]],
        });

        this.form.get('tipoVoto')?.valueChanges.subscribe({
            next: value => {
                if (value === 'UNICO') {
                    this.form.removeControl('limiteSelecoes');
                } else {
                    this.form.addControl('limiteSelecoes', new FormControl(0, [Validators.required]));
                }
            }
        })
    }

    ngOnInit(): void {
        console.log('PautaEditar', this.dialogConfig.data);
        if (!!this.dialogConfig.data.pauta) {
            this.form.patchValue(this.dialogConfig.data.pauta);
        }
    }

    close(): void {
        this.dialogRef.close();
    }
}
