import { Component, inject, input, OnInit } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ICONES_SISTEMA } from '@/app/shared/icones-sistema';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { Select } from 'primeng/select';
import { Icone } from '@/app/shared/models/icone';
import { OpcaoVotoService } from '@/app/core/services/opcao-voto-service';
import { lastValueFrom } from 'rxjs';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TipoVoto } from '@/app/core/models/opcao-voto';

@Component({
    selector: 'app-opcoes-editar',
    imports: [Button, InputText, ReactiveFormsModule, Textarea, Select, RadioButtonModule],
    templateUrl: './opcoes-editar.html',
    styleUrl: './opcoes-editar.scss'
})
export class OpcoesEditar implements OnInit {
    public form: FormGroup;

    readonly reuniaoId = input.required<number>();
    readonly pautaId = input.required<number>();

    protected icones: Icone[] = ICONES_SISTEMA;
    protected tiposVoto: { label: string; value: TipoVoto }[] = [
        { label: 'Normal', value: TipoVoto.NORMAL },
        { label: 'Em branco', value: TipoVoto.EM_BRANCO },
        { label: 'Nulo', value: TipoVoto.NULO }
    ];

    private fb = inject(NonNullableFormBuilder);
    private dialogRef = inject(DynamicDialogRef);
    private dialogConfig = inject(DynamicDialogConfig);
    private readonly opcaoVotoService = inject(OpcaoVotoService);

    constructor() {
        this.form = this.fb.group({
            icone: [null, []],
            titulo: ['', [Validators.required]],
            descricao: ['', [Validators.required]],
            tipo: ['NORMAL', [Validators.required]]
        });
    }

    ngOnInit(): void {
        console.log('OpcoesEditar', this.dialogConfig.data);
        if (!!this.dialogConfig.data?.opcao) {
            this.form.patchValue(this.dialogConfig.data.opcao);
        }
    }

    close(): void {
        this.dialogRef.close();
    }

    async submit(): Promise<void> {
        try {
            console.log('submit', this.form.value);
            this.form.markAllAsTouched();
            this.form.markAllAsDirty();
            if (this.form.invalid) {
                return;
            }

            let res = undefined;

            if (this.dialogConfig.data?.opcao?.id) {
                res = await lastValueFrom(
                    this.opcaoVotoService.update(
                        this.reuniaoId(),
                        this.pautaId(),
                        this.dialogConfig.data.opcao.id,
                        this.form.value
                    )
                );
            } else {
                res = await lastValueFrom(
                    this.opcaoVotoService.create(this.reuniaoId(), this.pautaId(), this.form.value)
                );
            }

            this.dialogRef.close(res);
        } catch (error) {
            console.log(error);
        }
    }
}
