const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' });

const doc = {
  info: {
    title: 'TMS API - Sistema de Controle de Ordens de Transporte',
    version: '1.0.0',
    description: 'API REST para gerenciamento de ordens de transporte com autenticação JWT e controle de acesso baseado em perfis.',
    contact: {
      name: 'Suporte TMS',
      email: 'suporte@tms.com'
    }
  },
  host: 'localhost:3000',
  basePath: '/api/v1',
  schemes: ['http', 'https'],
  consumes: ['application/json'],
  produces: ['application/json'],
  tags: [
    { name: 'Auth', description: 'Autenticação e autorização' },
    { name: 'Usuários', description: 'Gerenciamento de usuários' },
    { name: 'Perfis', description: 'Gerenciamento de perfis' },
    { name: 'Ordens', description: 'Ordens de transporte' },
    { name: 'Tags de Pedágio', description: 'Tags de pedágio' },
    { name: 'Situações', description: 'Situações das ordens' },
    { name: 'Tipos de Carga', description: 'Tipos de carga' },
    { name: 'Dashboard', description: 'Dados agregados para dashboards' }
  ],
  securityDefinitions: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'Informe o token JWT no formato: Bearer {token}'
    }
  },
  definitions: {
    Usuario: {
      id: 1,
      nome: 'João Silva',
      email: 'joao@exemplo.com',
      telefone: '11999999999',
      perfil_id: 2,
      ativo: true
    },
    Login: {
      email: 'usuario@exemplo.com',
      senha: 'senha123'
    },
    OrdemTransporte: {
      id: 1,
      situacao_id: 1,
      lote: 'LOTE2025001',
      produto: 'Grãos de Soja',
      tipo_carga_id: 1,
      embarcador_id: 1,
      origem: 'Campinas - SP',
      destino: 'Santos - SP',
      cliente_pagador: 'Empresa ABC',
      placa: 'ABC1234',
      valor_frete: 5000.00,
      data_carregamento: '2025-11-25T08:00:00Z'
    },
    Success: {
      success: true,
      message: 'Operação realizada com sucesso',
      data: {}
    },
    Error: {
      success: false,
      message: 'Erro na operação',
      errors: []
    }
  }
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./src/routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log('✓ Documentação Swagger gerada com sucesso!');
});
