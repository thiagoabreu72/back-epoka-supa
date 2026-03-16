const Joi = require('joi');

module.exports = {
  id: Joi.object({
    id: Joi.number().integer().positive().required()
  }),

  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sortBy: Joi.string().default('id'),
    sortOrder: Joi.string().valid('ASC', 'DESC').default('DESC')
  })
};
