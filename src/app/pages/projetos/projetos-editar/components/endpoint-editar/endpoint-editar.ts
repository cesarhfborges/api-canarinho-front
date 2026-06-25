import { Component, inject, OnInit, signal } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { FluidModule } from 'primeng/fluid';
import { SelectModule } from 'primeng/select';
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
import { TabsModule } from 'primeng/tabs';
import fakerMethods from '@/app/core/utils/faker-methods';
import { MessageService, SelectItemGroup } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { NgClass } from '@angular/common';
import { findInvalidControlsRecursive } from '@/app/core/utils/form-utils';
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
        TabsModule,
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

    readonly _objectTypes: string[] = [
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
    saving = signal<boolean>(false);
    private readonly fb = inject(FormBuilder);
    private dialogRef = inject(DynamicDialogRef);
    private dialogConfig = inject(DynamicDialogConfig);
    private readonly _endpointsService = inject(EndpointsService);
    private readonly messageService = inject(MessageService);

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

    objectTypes(index: number): string[] {
        if (index === 0) {
            return this._objectTypes;
        }
        return this._objectTypes.filter((v) => v !== 'Object.ID');
    }

    ngOnInit(): void {
        console.log(this.dialogConfig.data);
        if (this.dialogConfig.data?.resource) {
            const resource = this.dialogConfig.data.resource as Resource;

            this.form.patchValue(resource);

            resource?.resourceSchema?.forEach((schema) => {
                this.resourceSchemaFormArray.push(this.createGroupSchema(schema));
            });

            resource?.endpoints?.forEach((endpoint, index) => {
                this.endpointsFormArray.push(this.createGroupEndpoint(endpoint, index === 0));
            });
        } else {
            // Create mode: Add default ID schema
            this.resourceSchemaFormArray.push(
                this.createGroupSchema({
                    name: 'id',
                    type: 'Object.ID',
                    value: ''
                })
            );

            // Create mode: Add 5 default endpoints
            this.endpointsFormArray.push(
                this.createGroupEndpoint(
                    {
                        method: 'GET',
                        url: '/',
                        enabled: true,
                        paginate: false,
                        per_page_default: 10,
                        response: '$mockData'
                    },
                    true
                )
            );
            this.endpointsFormArray.push(
                this.createGroupEndpoint({
                    method: 'GET',
                    url: '/:id',
                    enabled: true,
                    response: '$mockData'
                })
            );
            this.endpointsFormArray.push(
                this.createGroupEndpoint({
                    method: 'POST',
                    url: '/',
                    enabled: true,
                    response: '$mockData'
                })
            );
            this.endpointsFormArray.push(
                this.createGroupEndpoint({
                    method: 'PUT',
                    url: '/:id',
                    enabled: true,
                    response: '$mockData'
                })
            );
            this.endpointsFormArray.push(
                this.createGroupEndpoint({
                    method: 'DELETE',
                    url: '/:id',
                    enabled: true,
                    response: '$mockData'
                })
            );
        }

        // Reactivity: Auto-update URLs when name changes
        this.form.get('name')?.valueChanges.subscribe((val) => {
            const safeName = val ? val : '';
            this.endpointsFormArray.controls.forEach((ctrl) => {
                const method = ctrl.get('method')?.value;
                const hasId = ctrl.get('url')?.value?.includes('/:id');
                if (method === 'GET' && hasId) {
                    ctrl.get('url')?.setValue(`/${safeName}/:id`);
                } else if (method === 'GET' || method === 'POST') {
                    ctrl.get('url')?.setValue(`/${safeName}`);
                } else if (method === 'PUT' || method === 'DELETE') {
                    ctrl.get('url')?.setValue(`/${safeName}/:id`);
                }
            });
        });
    }

    createGroupSchema(value?: Schema): FormGroup {
        const g = this.fb.group<any>({
            name: [value?.name ?? '', [Validators.required]],
            type: [value?.type ?? '', [Validators.required]],
            value: [value?.value ?? '', value?.type === 'Object.ID' ? [] : [Validators.required]]
        });
        g.get('type')?.valueChanges.subscribe({
            next: (type) => {
                g.get('value')?.reset();

                if (type === 'Object.ID') {
                    g.get('value')?.clearValidators();
                } else {
                    g.get('value')?.setValidators([Validators.required]);
                }

                if (type === 'Boolean') {
                    g.get('value')?.patchValue(false);
                }

                g.get('value')?.updateValueAndValidity();
            }
        });
        return g;
    }

    createGroupEndpoint(value?: Endpoint, first?: boolean): FormGroup {
        const group: FormGroup = this.fb.group({
            enabled: [value?.enabled ?? true],
            method: [value?.method ?? 'GET'],
            response: [value?.response ?? '$mockData'],
            url: [value?.url ?? '']
        });

        if (value?.paginate !== undefined || first) {
            group.addControl('paginate', this.fb.control(value?.paginate ?? false));
            group.addControl('per_page_default', this.fb.control(value?.per_page_default ?? 10));
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
            console.log('Invalid Controls:', findInvalidControlsRecursive(this.form));
            this.form.markAllAsTouched();
            this.messageService.add({
                severity: 'warn',
                summary: 'Atenção',
                detail: 'Por favor, preencha todos os campos obrigatórios corretamente.',
                life: 3000
            });
            return;
        }

        this.saving.set(true);

        const data = this.form.value;
        const resourceId = this.dialogConfig.data?.resource?.id;
        const projectId = this.dialogConfig.data?.projectId;

        if (resourceId) {
            this._endpointsService.atualizar(resourceId, data).subscribe({
                next: (res) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Endpoint atualizado com sucesso.',
                        life: 3000
                    });
                    this.saving.set(false);
                    this.dialogRef.close(res);
                },
                error: (err) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erro',
                        detail: 'Ocorreu um erro ao atualizar o endpoint.',
                        life: 3000
                    });
                    console.error(err);
                    this.saving.set(false);
                }
            });
        } else if (projectId) {
            this._endpointsService.criar(projectId, data).subscribe({
                next: (res) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Endpoint criado com sucesso.',
                        life: 3000
                    });
                    this.saving.set(false);
                    this.dialogRef.close(res);
                },
                error: (err) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erro',
                        detail: 'Ocorreu um erro ao criar o endpoint.',
                        life: 3000
                    });
                    console.error(err);
                    this.saving.set(false);
                }
            });
        } else {
            this.saving.set(false);
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
        const username = this.dialogConfig.data?.username || ':username';
        const projectSlug = this.dialogConfig.data?.projectSlug || ':project';
        const base = `${environment.apiUrl}/mock/${username}/${projectSlug}`;
        return base + (value?.startsWith('/') ? value : `/${value || ''}`);
    }
}
