const Joi = require('joi');

module.exports = {
  login: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Email inválido',
      'any.required': 'Email é obrigatório'
    }),
    senha: Joi.string().min(6).required().messages({
      'string.min': 'Senha deve ter no mínimo 6 caracteres',
      'any.required': 'Senha é obrigatória'
    })
  }),

  register: Joi.object({
    nome: Joi.string().min(3).max(100).required(),
    email: Joi.string().email().required(),
    senha: Joi.string().min(6).required(),
    telefone: Joi.string().allow('', null),
    endereco_rua: Joi.string().allow('', null),
    endereco_numero: Joi.string().allow('', null),
    endereco_cidade: Joi.string().allow('', null),
    endereco_estado: Joi.string().length(2).allow('', null),
    endereco_cep: Joi.string().allow('', null),
    perfil_id: Joi.number().integer().positive().required(),
    empresa_id: Joi.string().allow('', null)
  })
};
