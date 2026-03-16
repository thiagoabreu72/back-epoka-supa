const Joi = require('joi');

module.exports = {
  create: Joi.object({
    nome: Joi.string().min(3).max(100).required(),
    email: Joi.string().email().required(),
    senha: Joi.string().min(6).required(),
    telefone: Joi.string().allow('', null),
    endereco_rua: Joi.string().allow('', null),
    endereco_numero: Joi.string().allow('', null),
    endereco_cidade: Joi.string().allow('', null),
    endereco_estado: Joi.string().length(2).uppercase().allow('', null),
    endereco_cep: Joi.string().pattern(/^\d{5}-?\d{3}$/).allow('', null),
    perfil_id: Joi.number().integer().positive().required(),
    empresa_id: Joi.string().allow('', null),
    ativo: Joi.boolean().default(true)
  }),

  update: Joi.object({
    nome: Joi.string().min(3).max(100),
    email: Joi.string().email(),
    senha: Joi.string().min(6),
    telefone: Joi.string().allow('', null),
    endereco_rua: Joi.string().allow('', null),
    endereco_numero: Joi.string().allow('', null),
    endereco_cidade: Joi.string().allow('', null),
    endereco_estado: Joi.string().length(2).uppercase().allow('', null),
    endereco_cep: Joi.string().pattern(/^\d{5}-?\d{3}$/).allow('', null),
    perfil_id: Joi.number().integer().positive(),
    empresa_id: Joi.string().allow('', null),
    ativo: Joi.boolean()
  }).min(1)
};
