import { SelectItemGroup } from 'primeng/api';

export default [
    {
        label: 'Pessoa',
        items: [
            { label: 'Nome', value: '[person.firstName]' },
            { label: 'Sobrenome', value: '[person.lastName]' },
            { label: 'Nome Completo', value: '[person.fullName]' },
            { label: 'Nome do Meio', value: '[person.middleName]' },
            { label: 'Prefixo', value: '[person.prefix]' },
            { label: 'Sufixo', value: '[person.suffix]' },
            { label: 'Gênero', value: '[person.gender]' }
        ]
    },
    {
        label: 'Internet',
        items: [
            { label: 'Email', value: '[internet.email]' },
            { label: 'Usuário', value: '[internet.username]' },
            { label: 'Senha', value: '[internet.password]' },
            { label: 'URL', value: '[internet.url]' },
            { label: 'Domínio', value: '[internet.domainName]' },
            { label: 'IPv4', value: '[internet.ipv4]' },
            { label: 'IPv6', value: '[internet.ipv6]' }
        ]
    },
    {
        label: 'Endereço',
        items: [
            { label: 'Cidade', value: '[location.city]' },
            { label: 'Estado', value: '[location.state]' },
            { label: 'País', value: '[location.country]' },
            { label: 'CEP', value: '[location.zipCode]' },
            { label: 'Latitude', value: '[location.latitude]' },
            { label: 'Longitude', value: '[location.longitude]' }
        ]
    },
    {
        label: 'Empresa',
        items: [
            { label: 'Empresa', value: '[company.name]' },
            { label: 'Departamento', value: '[company.department]' },
            { label: 'Buzz Phrase', value: '[company.buzzPhrase]' }
        ]
    },
    {
        label: 'Financeiro',
        items: [
            { label: 'Número da Conta', value: '[finance.accountNumber]' },
            { label: 'Valor', value: '[finance.amount]' },
            { label: 'Código da Moeda', value: '[finance.currencyCode]' }
        ]
    },
    {
        label: 'Texto',
        items: [
            { label: 'Palavra', value: '[word.word]' },
            { label: 'Palavras', value: '[word.words]' },
            { label: 'Frase', value: '[word.sentence]' },
            { label: 'Parágrafo', value: '[word.paragraph]' }
        ]
    },
    {
        label: 'Datas',
        items: [
            { label: 'Data Passada', value: '[date.past]' },
            { label: 'Data Futura', value: '[date.future]' },
            { label: 'Data Recente', value: '[date.recent]' },
            { label: 'Nascimento', value: '[date.birthdate]' }
        ]
    },
    {
        label: 'Identificadores',
        items: [
            { label: 'UUID', value: '[string.uuid]' },
            { label: 'Mongo ObjectId', value: '[database.mongodbObjectId]' }
        ]
    },
    {
        label: 'Cores',
        items: [
            { label: 'Cor', value: '[color.human]' },
            { label: 'HEX', value: '[color.rgb]' },
            { label: 'RGB', value: '[color.rgb]' }
        ]
    },
    {
        label: 'Números',
        items: [
            { label: 'Inteiro', value: '[number.int]' },
            { label: 'Decimal', value: '[number.float]' },
            { label: 'Booleano', value: '[datatype.boolean]' }
        ]
    },
    {
        label: 'Mídia',
        items: [
            { label: 'Avatar', value: '[image.avatar]' },
            { label: 'Imagem', value: '[image.url]' }
        ]
    },
    {
        label: 'Veículos',
        items: [
            { label: 'Veículo', value: '[vehicle.vehicle]' },
            { label: 'Modelo', value: '[vehicle.model]' },
            { label: 'Fabricante', value: '[vehicle.manufacturer]' }
        ]
    }
] as SelectItemGroup[];
