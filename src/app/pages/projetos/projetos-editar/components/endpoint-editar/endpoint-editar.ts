import { Component, inject, OnInit } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { FluidModule } from 'primeng/fluid';
import { SelectChangeEvent, SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { Schema } from '@/app/core/models/schema';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { EndpointsService } from '@/app/core/services/endpoints-service';
import { Resource } from '@/app/core/models/resource';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { Endpoint } from '@/app/core/models/endpoint';
import { TagModule } from 'primeng/tag';
import fakerMethods from '@/app/core/utils/faker-methods';
import { SelectItemGroup } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { NgClass } from '@angular/common';
import { Highlight } from 'ngx-highlightjs';
import { TooltipModule } from 'primeng/tooltip';
import { environment } from '@/environments/environment';

@Component({
    selector: 'app-endpoint-editar',
    imports: [
        FluidModule,
        InputTextModule,
        SelectModule,
        TextareaModule,
        FormsModule,
        ReactiveFormsModule,
        InputNumberModule,
        ToggleSwitchModule,
        TagModule,
        ButtonModule,
        Highlight,
        TooltipModule,
        NgClass
    ],
    templateUrl: './endpoint-editar.html',
    styleUrl: './endpoint-editar.scss'
})
export class EndpointEditar implements OnInit {
    form: FormGroup;

    readonly tooltip =
        'Esta configuração apenas ativa a paginação por padrão. Mesmo que desativada, ainda é possível paginar a resposta. No entanto, se estiver ativada, não será possível obter todos os dados da API de uma só vez.';

    readonly objectTypes: any = [
        'Object.ID',
        'Faker.js',
        'String',
        'Number',
        'Boolean',
        'Object',
        'Array',
        'Date',
        'Child Resource'
    ];

    readonly fakerMethods: SelectItemGroup[] = fakerMethods;

    private readonly fb = inject(FormBuilder);
    private dialogRef = inject(DynamicDialogRef);
    private dialogConfig = inject(DynamicDialogConfig);
    private readonly _endpointsService = inject(EndpointsService);

    constructor() {
        this.form = this.fb.group({
            name: [
                '',
                [
                    Validators.required,
                    Validators.pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
                    Validators.minLength(3),
                    Validators.maxLength(50)
                ]
            ],
            resourceSchema: this.fb.array<FormGroup>([]),
            endpoints: this.fb.array<FormGroup>([])
        });
    }

    get resourceSchemaFormArray(): FormArray {
        return this.form.get('resourceSchema') as FormArray;
    }

    get endpointsFormArray(): FormArray {
        return this.form.get('endpoints') as FormArray;
    }

    get respostaPaginada(): string {
        const data = {
            data: [
                {
                    nome: 'Hernani Rocha Sobrinho',
                    ativo: false,
                    email: 'serna.marcos@example.com',
                    cidade: 'Guerra do Norte',
                    id: 1
                },
                {
                    nome: 'Rafael Kléber Leon Jr.',
                    ativo: true,
                    email: 'dtoledo@example.com',
                    cidade: 'das Neves do Leste',
                    id: 2
                },
                {
                    nome: 'Dr. Marcelo Cervantes Jr.',
                    ativo: false,
                    email: 'gustavo.martines@example.org',
                    cidade: "Assunção d'Oeste",
                    id: 3
                }
            ],
            current_page: 1,
            last_page: 2,
            per_page: 10,
            total: 15
        };
        return JSON.stringify(data, null, 2);
    }

    get respostaSimples(): string {
        const data = [
            {
                nome: 'Hernani Rocha Sobrinho',
                ativo: false,
                email: 'serna.marcos@example.com',
                cidade: 'Guerra do Norte',
                id: 1
            },
            {
                nome: 'Rafael Kléber Leon Jr.',
                ativo: true,
                email: 'dtoledo@example.com',
                cidade: 'das Neves do Leste',
                id: 2
            },
            {
                nome: 'Dr. Marcelo Cervantes Jr.',
                ativo: false,
                email: 'gustavo.martines@example.org',
                cidade: "Assunção d'Oeste",
                id: 3
            }
        ];
        return JSON.stringify(data, null, 2);
    }

    ngOnInit(): void {
        console.log(this.dialogConfig.data);
        if (this.dialogConfig.data?.resource) {
            const resource = this.dialogConfig.data.resource as Resource;

            this.form.patchValue(resource);

            resource?.resourceSchema?.forEach((schema) => {
                this.resourceSchemaFormArray.push(this.createGroupSchema(schema));
            });

            resource?.endpoints?.forEach((endpoint) => {
                this.endpointsFormArray.push(this.createGroupEndpoint(endpoint));
            });
        }
    }

    createGroupSchema(value?: Schema): FormGroup {
        return this.fb.group({
            name: [value?.name ?? '', Validators.required],
            type: [value?.type ?? '', Validators.required],
            value: [value?.value ?? '']
        });
    }

    createGroupEndpoint(value?: Endpoint): FormGroup {
        const group = this.fb.group({});

        if ('enabled' in (value ?? {})) {
            group.addControl('enabled', this.fb.control(value!.enabled));
        }

        if ('method' in (value ?? {})) {
            group.addControl('method', this.fb.control(value!.method));
        }

        if ('paginate' in (value ?? {})) {
            group.addControl('paginate', this.fb.control(value!.paginate));
        }

        if ('per_page_default' in (value ?? {})) {
            group.addControl('per_page_default', this.fb.control(value!.per_page_default));
        }

        if ('response' in (value ?? {})) {
            group.addControl('response', this.fb.control(value!.response));
        }

        if ('url' in (value ?? {})) {
            group.addControl('url', this.fb.control(value!.url));
        }

        return group;
    }

    addSchema(): void {
        this.resourceSchemaFormArray.push(this.createGroupSchema());
    }

    removeSchema(index: number): void {
        this.resourceSchemaFormArray.removeAt(index);
    }

    close(): void {
        this.dialogRef.close();
    }

    salvar(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const data = this.form.value;
        const resourceId = this.dialogConfig.data?.resource?.id;
        const projectId = this.dialogConfig.data?.projectId;

        if (resourceId) {
            this._endpointsService.atualizar(resourceId, data).subscribe({
                next: (res) => this.dialogRef.close(res),
                error: (err) => console.error(err)
            });
        } else if (projectId) {
            this._endpointsService.criar(projectId, data).subscribe({
                next: (res) => this.dialogRef.close(res),
                error: (err) => console.error(err)
            });
        }
    }

    getMethodSeverity(method: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
        switch (method) {
            case 'GET':
                return 'success';
            case 'POST':
                return 'info';
            case 'PUT':
                return 'warn';
            case 'DELETE':
                return 'danger';
            default:
                return 'secondary';
        }
    }

    getEndpointURL(value: string): string {
        const base = `${environment.apiUrl}/admin/demo`;
        return base + value;
    }

    protected change($event: SelectChangeEvent, index: number): void {
        this.resourceSchemaFormArray.at(index)?.get('value')?.reset();
    }
}
