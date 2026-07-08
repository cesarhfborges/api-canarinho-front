import { SelectItemGroup } from 'primeng/api';

export default [
    {
        label: 'Pessoa',
        items: [
            { label: 'Nome', value: '[person.firstName]' },
            { label: 'Sobrenome', value: '[person.lastName]' },
            { label: 'Nome Completo', value: '[person.fullName]' },
            { label: 'Prefixo', value: '[person.prefix]' },
            { label: 'Sufixo', value: '[person.suffix]' },
            { label: 'Gênero', value: '[person.gender]' },
            { label: 'Data Nascimento', value: '[person.birthdate_date]' }
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
            { label: 'Logradouro', value: '[location.place]' },
            { label: 'Número casa', value: '[location.number]' },
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
            { label: 'Email - Empresa', value: '[company.companyEmail]' }
        ]
    },
    {
        label: 'Financeiro',
        items: [
            { label: 'Banco', value: '[finance.bank]' },
            { label: 'Numero da agencia', value: '[finance.agency]' },
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
        label: 'Data e Hora',
        items: [
            // Apenas Data
            { label: 'Data Anterior a hoje [yyyy-MM-dd]', value: '[date.date_before]' },
            { label: 'Data Atual (Hoje) [yyyy-MM-dd]', value: '[date.date_now]' },
            { label: 'Data Posterior a hoje [yyyy-MM-dd]', value: '[date.date_after]' },

            // Apenas Hora
            { label: 'Hora Anterior a agora [HH:mm:ss]', value: '[date.time_before]' },
            { label: 'Hora Atual (Agora) [HH:mm:ss]', value: '[date.time_now]' },
            { label: 'Hora Posterior a agora [HH:mm:ss]', value: '[date.time_after]' },

            // Data e Hora
            { label: 'Data e Hora Anterior a agora [yyyy-MM-ddTHH:mm:ss]', value: '[date.datetime_before]' },
            { label: 'Data e Hora Atual (Agora) [yyyy-MM-ddTHH:mm:ss]', value: '[date.datetime_now]' },
            { label: 'Data e Hora Posterior a agora [yyyy-MM-ddTHH:mm:ss]', value: '[date.datetime_after]' }
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
            { label: 'HEX', value: '[color.hex]' },
            { label: 'RGB', value: '[color.rgb]' }
        ]
    },
    {
        label: 'Números',
        items: [
            { label: 'Número Inteiro', value: '[number.int]' },
            { label: 'Número Decimal', value: '[number.float]' }
        ]
    },
    {
        label: 'Vars',
        items: [
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
            { label: 'Modelo', value: '[vehicle.model]' },
            { label: 'Fabricante', value: '[vehicle.manufacturer]' },
            { label: 'Placa', value: '[vehicle.plate]' }
        ]
    },
    {
        label: 'Brasil',
        items: [
            { label: 'Celular', value: '[brasil.celular]' },
            { label: 'Telefone', value: '[brasil.telefone]' },
            { label: 'Insc. Estadual', value: '[brasil.ie]' },
            { label: 'PIS', value: '[brasil.pis]' },
            { label: 'RG', value: '[brasil.rg]' },
            { label: 'CNH', value: '[brasil.cnh]' },
            { label: 'CPF', value: '[brasil.cpf]' },
            { label: 'CNPJ', value: '[brasil.cnpj]' }
        ]
    },
    {
        label: 'Cartão de credito',
        items: [
            { label: 'Master Card', value: '[credit_card.master_card]' },
            { label: 'Visa', value: '[credit_card.visa]' },
            { label: 'American express', value: '[credit_card.amex]' },
            { label: 'Diners club', value: '[credit_card.diners_club]' },
            { label: 'Hiper card', value: '[credit_card.hiper_card]' }
        ]
    }
] as SelectItemGroup[];
