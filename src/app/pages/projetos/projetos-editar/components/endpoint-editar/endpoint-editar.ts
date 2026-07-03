import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { JsonPipe, NgClass } from '@angular/common';
import { fakerPT_BR as faker } from '@faker-js/faker';
import { CardModule } from 'primeng/card';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { DialogModule } from 'primeng/dialog';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { FluidModule } from 'primeng/fluid';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { FloatLabelModule } from 'primeng/floatlabel';
import { Schema } from '@/app/core/models/schema';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjetosService } from '@/app/core/services/projetos-service';
import { PerfilService } from '@/app/core/services/perfil-service';
import { lastValueFrom } from 'rxjs';
import { EndpointsService } from '@/app/core/services/endpoints-service';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { Endpoint } from '@/app/core/models/endpoint';
import { TagModule } from 'primeng/tag';
import { TabsModule } from 'primeng/tabs';
import fakerMethods from '@/app/core/utils/faker-methods';
import { MessageService, SelectItemGroup } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { Highlight } from 'ngx-highlightjs';
import { TooltipModule } from 'primeng/tooltip';
import { findInvalidControlsRecursive } from '@/app/core/utils/form-utils';
import { environment } from '@/environments/environment';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';

@Component({
    selector: 'app-endpoint-editar',
    imports: [
        CardModule,
        ClipboardModule,
        FluidModule,
        InputTextModule,
        InputGroupModule,
        InputGroupAddonModule,
        SelectModule,
        TextareaModule,
        FormsModule,
        ReactiveFormsModule,
        InputNumberModule,
        ToggleSwitchModule,
        TagModule,
        FloatLabelModule,
        TabsModule,
        ButtonModule,
        Highlight,
        TooltipModule,
        DialogModule,
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
        'Array',
        'Conditional'
        // 'Object',
        // 'Date',
        // 'Child Resource'
    ];

    readonly fakerMethods: SelectItemGroup[] = fakerMethods;
    saving = signal<boolean>(false);
    projectId: number | null = null;
    endpointId: number | string | null = null;
    username: string = ':username';
    projectSlug: string = ':project';
    formValue = signal<any>({});
    
    // Condition Dialog state
    showConditionDialog = signal<boolean>(false);
    currentConditionSchemaIndex = signal<number | null>(null);
    conditionForm: FormGroup;
    
    mockResponses = computed(() => {
        const value = this.formValue();
        const schemas = value.resourceSchema || [];
        const endpoints = value.endpoints || [];

        const item: any = {};
        for (const schema of schemas) {
            if (!schema.name) continue;

            const type = schema.type;
            const schemaValue = schema.value;

            switch (type) {
                case 'String':
                    item[schema.name] = schemaValue || 'exemplo';
                    break;
                case 'Number':
                    item[schema.name] = schemaValue ?? 0;
                    break;
                case 'Boolean':
                    item[schema.name] = schemaValue === 'true' || schemaValue === true;
                    break;
                case 'Object.ID':
                    item[schema.name] = 1;
                    break;
                case 'Conditional':
                    // Simplify mock evaluation for preview
                    if (schemaValue && schemaValue.dependsOn) {
                        const dependsOnVal = item[schemaValue.dependsOn];
                        let matched = false;
                        if (schemaValue.conditions) {
                            for (const cond of schemaValue.conditions) {
                                let isMatch = false;
                                switch (cond.operator) {
                                    case '==': isMatch = dependsOnVal == cond.compareValue; break;
                                    case '!=': isMatch = dependsOnVal != cond.compareValue; break;
                                    case '>': isMatch = dependsOnVal > cond.compareValue; break;
                                    case '<': isMatch = dependsOnVal < cond.compareValue; break;
                                    case '>=': isMatch = dependsOnVal >= cond.compareValue; break;
                                    case '<=': isMatch = dependsOnVal <= cond.compareValue; break;
                                    case 'contains': 
                                        isMatch = dependsOnVal && dependsOnVal.toString().includes(cond.compareValue); 
                                        break;
                                }
                                if (isMatch) {
                                    item[schema.name] = this.mockValueForType(cond.resultType, cond.resultValue);
                                    matched = true;
                                    break;
                                }
                            }
                        }
                        if (!matched) {
                            item[schema.name] = this.mockValueForType(schemaValue.defaultResultType, schemaValue.defaultResultValue);
                        }
                    } else {
                        item[schema.name] = null;
                    }
                    break;
                case 'Faker.js':
                    item[schema.name] = this.parseFakerTag(schemaValue);
                    break;
                default:
                    item[schema.name] = schemaValue || null;
            }
        }

        const responses: any = {};
        for (let i = 0; i < endpoints.length; i++) {
            const endpoint = endpoints[i];
            if (!endpoint.enabled) continue;

            let responseData: any;

            if (endpoint.method === 'GET') {
                if (endpoint.url?.includes('/:id')) {
                    responseData = { ...item, id: 1 };
                } else {
                    const list = [
                        { ...item, id: 1 },
                        { ...item, id: 2 },
                        { ...item, id: 3 }
                    ];

                    if (endpoint.paginate) {
                        const perPage = endpoint.per_page_default || 10;
                        responseData = {
                            data: list,
                            current_page: 1,
                            last_page: 5,
                            per_page: perPage,
                            total: perPage * 5
                        };
                    } else {
                        responseData = list;
                    }
                }
            } else if (endpoint.method === 'POST') {
                responseData = { ...item, id: 99 };
            } else if (endpoint.method === 'PUT') {
                responseData = { ...item, id: 1 };
            } else if (endpoint.method === 'DELETE') {
                responseData = { message: 'Resource deleted successfully.' };
            } else {
                responseData = { ...item };
            }

            responses[i] = JSON.stringify(responseData, null, 2);
        }

        return responses;
    });
    private readonly fb = inject(FormBuilder);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly _projetosService = inject(ProjetosService);
    private readonly _perfilService = inject(PerfilService);
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

        this.conditionForm = this.fb.group({
            dependsOn: ['', Validators.required],
            conditions: this.fb.array<FormGroup>([]),
            defaultResultType: ['String', Validators.required],
            defaultResultValue: ['']
        });
    }

    mockValueForType(type: string, val: any): any {
        switch (type) {
            case 'String': return val || 'exemplo';
            case 'Number': return val ?? 0;
            case 'Boolean': return val === 'true' || val === true;
            case 'Array': 
                if (val && typeof val === 'string') {
                    const arr = val.split(',').map((v: string) => v.trim()).filter((v: string) => v !== '');
                    return arr.length > 0 ? arr[Math.floor(Math.random() * arr.length)] : [];
                }
                return [];
            case 'Faker.js': return this.parseFakerTag(val);
            default: return val || null;
        }
    }

    get resourceSchemaFormArray(): FormArray {
        return this.form.get('resourceSchema') as FormArray;
    }

    get endpointsFormArray(): FormArray {
        return this.form.get('endpoints') as FormArray;
    }

    get conditionsFormArray(): FormArray {
        return this.conditionForm.get('conditions') as FormArray;
    }

    objectTypes(index: number): string[] {
        if (index === 0) {
            return this._objectTypes;
        }
        return this._objectTypes.filter((v) => v !== 'Object.ID');
    }

    async ngOnInit(): Promise<void> {
        this.projectId = Number(this.route.snapshot.paramMap.get('id'));
        const rawEndpointId = this.route.snapshot.paramMap.get('endpointId');
        this.endpointId = rawEndpointId === 'add' ? 'add' : Number(rawEndpointId);

        try {
            // Load user profile if missing
            if (!this._perfilService.userProfile()) {
                await lastValueFrom(this._perfilService.getPerfil());
            }
            this.username = this._perfilService.userProfile()?.username ?? ':username';

            // Load Project Details
            if (this.projectId) {
                const projectData = await lastValueFrom(this._projetosService.obter(this.projectId));
                this.projectSlug = projectData.slug ?? ':project';
            }

            if (this.endpointId !== 'add' && this.projectId) {
                // Fetch resource
                const resource = await lastValueFrom(
                    this._endpointsService.obter(this.projectId, this.endpointId as number)
                );
                this.form.patchValue(resource);

                resource?.resourceSchema?.forEach((schema) => {
                    this.resourceSchemaFormArray.push(this.createGroupSchema(schema));
                });

                resource?.endpoints?.forEach((endpoint, index) => {
                    this.endpointsFormArray.push(this.createGroupEndpoint(endpoint, index === 0));
                });
            } else {
                this.initializeDefaultForm();
            }
        } catch (err) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao carregar dados do endpoint.',
                life: 3000
            });
            console.error(err);
        }

        // Reactivity: Auto-update URLs when name changes
        this.form.valueChanges.subscribe((val) => {
            this.formValue.set(val);

            const safeName = val.name ? val.name : '';
            this.endpointsFormArray.controls.forEach((ctrl) => {
                const method = ctrl.get('method')?.value;
                const hasId = ctrl.get('url')?.value?.includes('/:id');
                if (method === 'GET' && hasId) {
                    ctrl.get('url')?.setValue(`/${safeName}/:id`, { emitEvent: false });
                } else if (method === 'GET' || method === 'POST') {
                    ctrl.get('url')?.setValue(`/${safeName}`, { emitEvent: false });
                } else if (method === 'PUT' || method === 'DELETE') {
                    ctrl.get('url')?.setValue(`/${safeName}/:id`, { emitEvent: false });
                }
            });
        });

        // Inicializa formValue
        this.formValue.set(this.form.value);
    }

    createGroupSchema(value?: Schema): FormGroup {
        let val = value?.value ?? '';
        if (value?.type === 'Conditional') {
            val = typeof val === 'string' && val ? JSON.parse(val) : val;
        }

        const g = this.fb.group<any>({
            name: [value?.name ?? '', [Validators.required]],
            type: [value?.type ?? '', [Validators.required]],
            value: [val, value?.type === 'Object.ID' ? [] : [Validators.required]]
        });
        g.get('type')?.valueChanges.subscribe({
            next: (type) => {
                g.get('value')?.reset();

                if (type === 'Object.ID') {
                    g.get('value')?.clearValidators();
                } else {
                    g.get('value')?.setValidators([Validators.required]);
                }

                switch (type) {
                    case 'Boolean':
                        g.get('value')?.patchValue(false);
                        break;
                    case 'Number':
                        g.get('value')?.patchValue(0);
                        break;
                    case 'String':
                        g.get('value')?.patchValue('');
                        break;
                    case 'Array':
                        g.get('value')?.patchValue('');
                        break;
                    case 'Conditional':
                        g.get('value')?.patchValue({
                            dependsOn: '',
                            conditions: [],
                            defaultResultType: 'String',
                            defaultResultValue: ''
                        });
                        break;
                    case 'Object':
                        g.get('value')?.patchValue('');
                        break;
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
        this.router.navigate(['/projetos', this.projectId]);
    }

    getAvailableBaseFields(currentIndex: number): any[] {
        const schemas = this.resourceSchemaFormArray.value;
        const available = [];
        for (let i = 0; i < currentIndex; i++) {
            if (schemas[i].name) {
                available.push({ label: schemas[i].name, value: schemas[i].name });
            }
        }
        return available;
    }

    openConditionDialog(index: number): void {
        this.currentConditionSchemaIndex.set(index);
        const schema = this.resourceSchemaFormArray.at(index);
        const val = schema.get('value')?.value;
        
        this.conditionForm.reset({
            dependsOn: val?.dependsOn ?? '',
            defaultResultType: val?.defaultResultType ?? 'String',
            defaultResultValue: val?.defaultResultValue ?? ''
        });

        this.conditionsFormArray.clear();
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
        
        this.showConditionDialog.set(true);
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

        const idx = this.currentConditionSchemaIndex();
        if (idx !== null) {
            const schema = this.resourceSchemaFormArray.at(idx);
            schema.get('value')?.setValue(this.conditionForm.value);
        }

        this.showConditionDialog.set(false);
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
        const resourceId = this.endpointId !== 'add' ? (this.endpointId as number) : null;
        const projectId = this.projectId;

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
                    // this.router.navigate(['/projetos', this.projectId]);
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
                    this.router.navigate(['/projetos', this.projectId]);
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
        const base = `${environment.apiUrl}/mock/${this.username}/${this.projectSlug}`;
        return base + (value?.startsWith('/') ? value : `/${value || ''}`);
    }

    protected onCopySuccess(value: string): void {
        this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: `${value} copiado com sucesso.`,
            life: 3000
        });
    }

    protected selectAll(element: any): void {
        console.log(element);
        element.select();
    }

    private parseFakerTag(tag: string): any {
        if (!tag) return '';

        switch (tag) {
            case '[person.firstName]':
                return faker.person.firstName();
            case '[person.lastName]':
                return faker.person.lastName();
            case '[person.fullName]':
                return faker.person.fullName();
            case '[person.prefix]':
                return faker.person.prefix();
            case '[person.suffix]':
                return faker.person.suffix();
            case '[person.gender]':
                return faker.person.sex();
            case '[person.birthdate_date]':
                return faker.date.birthdate().toISOString().split('T')[0];

            case '[internet.email]':
                return faker.internet.email();
            case '[internet.username]':
                return faker.internet.username();
            case '[internet.password]':
                return faker.internet.password();
            case '[internet.url]':
                return faker.internet.url();
            case '[internet.domainName]':
                return faker.internet.domainName();
            case '[internet.ipv4]':
                return faker.internet.ipv4();
            case '[internet.ipv6]':
                return faker.internet.ipv6();

            case '[location.city]':
                return faker.location.city();
            case '[location.state]':
                return faker.location.state();
            case '[location.country]':
                return faker.location.country();
            case '[location.zipCode]':
                return faker.location.zipCode();
            case '[location.latitude]':
                return faker.location.latitude();
            case '[location.longitude]':
                return faker.location.longitude();

            case '[company.name]':
                return faker.company.name();
            case '[company.department]':
                return faker.commerce.department();
            case '[company.companyEmail]':
                return faker.internet.email();

            case '[finance.bank]':
                return 'Banco do Brasil';
            case '[finance.agency]':
                return faker.finance.accountNumber(4);
            case '[finance.accountNumber]':
                return faker.finance.accountNumber(8);
            case '[finance.amount]':
                return faker.finance.amount();
            case '[finance.currencyCode]':
                return 'BRL';

            case '[word.word]':
                return faker.lorem.word();
            case '[word.words]':
                return faker.lorem.words(3);
            case '[word.sentence]':
                return faker.lorem.sentence();
            case '[word.paragraph]':
                return faker.lorem.paragraph();

            case '[date.date_before]':
                return faker.date.past().toISOString().split('T')[0];
            case '[date.date_now]':
                return new Date().toISOString().split('T')[0];
            case '[date.date_after]':
                return faker.date.future().toISOString().split('T')[0];
            case '[date.time_before]':
                return faker.date.past().toISOString().split('T')[1].split('.')[0];
            case '[date.time_now]':
                return new Date().toISOString().split('T')[1].split('.')[0];
            case '[date.time_after]':
                return faker.date.future().toISOString().split('T')[1].split('.')[0];
            case '[date.datetime_before]':
                return faker.date.past().toISOString().split('.')[0];
            case '[date.datetime_now]':
                return new Date().toISOString().split('.')[0];
            case '[date.datetime_after]':
                return faker.date.future().toISOString().split('.')[0];

            case '[string.uuid]':
                return faker.string.uuid();
            case '[database.mongodbObjectId]':
                return faker.database.mongodbObjectId();

            case '[color.human]':
                return faker.color.human();
            case '[color.hex]':
                return faker.color.rgb();
            case '[color.rgb]':
                return `rgb(${faker.number.int(255)}, ${faker.number.int(255)}, ${faker.number.int(255)})`;

            case '[number.int]':
                return faker.number.int(100);
            case '[number.float]':
                return faker.number.float({ min: 0, max: 100, fractionDigits: 2 });
            case '[datatype.boolean]':
                return faker.datatype.boolean();

            case '[image.avatar]':
                return faker.image.avatar();
            case '[image.url]':
                return faker.image.url();

            case '[vehicle.model]':
                return faker.vehicle.model();
            case '[vehicle.manufacturer]':
                return faker.vehicle.manufacturer();
            case '[vehicle.plate]':
                return faker.vehicle.vrm();

            case '[brasil.celular]':
                return faker.helpers.replaceSymbols('(##) 9####-####');
            case '[brasil.telefone]':
                return faker.helpers.replaceSymbols('(##) ####-####');
            case '[brasil.ie]':
                return faker.helpers.replaceSymbols('###.###.###.###');
            case '[brasil.pis]':
                return faker.helpers.replaceSymbols('###.#####.##-#');
            case '[brasil.rg]':
                return faker.helpers.replaceSymbols('##.###.###-#');
            case '[brasil.cnh]':
                return faker.helpers.replaceSymbols('###########');
            case '[brasil.cpf]':
                return faker.helpers.replaceSymbols('###.###.###-##');
            case '[brasil.cnpj]':
                return faker.helpers.replaceSymbols('##.###.###/####-##');

            case '[credit_card.master_card]':
                return faker.finance.creditCardNumber('mastercard');
            case '[credit_card.visa]':
                return faker.finance.creditCardNumber('visa');
            case '[credit_card.amex]':
                return faker.finance.creditCardNumber('american_express');
            case '[credit_card.diners_club]':
                return faker.finance.creditCardNumber('diners_club');
            case '[credit_card.hiper_card]':
                return faker.finance.creditCardNumber('discover');

            default:
                return tag;
        }
    }

    private initializeDefaultForm(): void {
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
}
