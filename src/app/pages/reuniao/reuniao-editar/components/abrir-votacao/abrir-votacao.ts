import { Component, inject, input, OnInit } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Button } from 'primeng/button';
import { InputOtpModule } from 'primeng/inputotp';
import { faker } from '@faker-js/faker';
import { JsonPipe } from '@angular/common';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { distinctUntilChanged, lastValueFrom } from 'rxjs';
import { InputText } from 'primeng/inputtext';
import { InputMaskDirective } from 'primeng/inputmask';
import { VotacaoService } from '@/app/core/services/votacao-service';

@Component({
    selector: 'app-abrir-votacao',
    imports: [Button, ReactiveFormsModule, InputOtpModule, JsonPipe, ToggleSwitch, InputText, InputMaskDirective],
    templateUrl: './abrir-votacao.html',
    styleUrl: './abrir-votacao.scss'
})
export class AbrirVotacao implements OnInit {
    readonly reuniaoId = input.required<number>();
    readonly pautaId = input.required<number>();

    public form: FormGroup;

    private readonly fb = inject(NonNullableFormBuilder);
    private readonly dialogRef = inject(DynamicDialogRef);
    private readonly dialogConfig = inject(DynamicDialogConfig);
    private readonly votacaoService = inject(VotacaoService);

    constructor() {
        this.form = this.fb.group({
            // tempo: [addMinutes(startOfDay(new Date()), 5), [Validators.required]],
            tempo: [
                '00:05:00',
                [Validators.required, Validators.pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)]
            ],
            exigeCodigoVoto: [false, [Validators.required]]
        });
    }

    ngOnInit(): void {
        this.form
            .get('exigeCodigoVoto')
            ?.valueChanges.pipe(distinctUntilChanged())
            .subscribe({
                next: (value: boolean) => {
                    if (value) {
                        const c = new FormControl('', [Validators.required]);
                        this.form.addControl('codigoVoto', c);
                    } else {
                        this.form.removeControl('codigoVoto');
                    }
                }
            });
    }

    close(): void {
        this.dialogRef.close();
    }

    gerarCodigoAleatorio(): void {
        // const rand = faker.string.alphanumeric(6);
        const rand = faker.string.numeric({ length: 6, allowLeadingZeros: true });
        this.form.get('codigoVoto')?.patchValue(rand.toUpperCase());
    }

    protected async onSubmit(): Promise<void> {
        try {
            this.form.markAllAsTouched();
            this.form.markAllAsDirty();
            if (this.form.invalid) {
                return;
            }

            const res = await lastValueFrom(
                this.votacaoService.abrirVotacao(this.reuniaoId(), this.pautaId(), this.form.value)
            );

            // if (this.dialogConfig?.data?.pauta?.id) {
            //     res = await lastValueFrom(
            //         this.pautaService.update(this.reuniaoId(), this.dialogConfig.data.pauta.id, this.form.value)
            //     );
            // } else {
            //     res = await lastValueFrom(this.pautaService.create(this.reuniaoId(), this.form.value));
            // }
            //
            this.dialogRef.close(res);
        } catch (e) {
            console.error(e);
        }
    }
}
