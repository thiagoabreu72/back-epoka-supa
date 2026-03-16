const ordemTransporteService = require("../services/ordemTransporte.service");
const responseUtil = require("../utils/response.util");

class OrdemTransporteController {
  async index(req, res, next) {
    try {
      const filters = {
        situacao_id: req.query.situacao_id,
        embarcador_id: req.query.embarcador_id,
        manifestador_id: req.query.manifestador_id,
        tipo_carga_id: req.query.tipo_carga_id,
        data_inicio: req.query.data_inicio,
        data_fim: req.query.data_fim,
        placa: req.query.placa,
        origem: req.query.origem,
        destino: req.query.destino,
        cliente_pagador: req.query.cliente_pagador,
        lote: req.query.lote,
        produto: req.query.produto,
      };

      console.log("FILTERS MONTADO:", filters);

      const pagination = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
      };

      const resultado = await ordemTransporteService.getAll(
        filters,
        pagination,
        req.usuario,
      );

      return responseUtil.success(res, resultado);
    } catch (error) {
      next(error);
    }
  }

  async show(req, res, next) {
    try {
      const ordem = await ordemTransporteService.getById(
        req.params.id,
        req.usuario,
      );

      return responseUtil.success(res, ordem);
    } catch (error) {
      next(error);
    }
  }

  async store(req, res, next) {
    try {
      const ordem = await ordemTransporteService.create(req.body, req.usuario);

      console.log(ordem);

      return responseUtil.created(
        res,
        ordem,
        "Ordem de transporte criada com sucesso",
      );
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      // Armazenar dados anteriores para o log
      const ordemAnterior = await ordemTransporteService.getById(
        req.params.id,
        req.usuario,
      );
      req.dadosAnteriores = ordemAnterior.toJSON();

      const ordem = await ordemTransporteService.update(
        req.params.id,
        req.body,
        req.usuario,
      );

      return responseUtil.success(
        res,
        ordem,
        "Ordem de transporte atualizada com sucesso",
      );
    } catch (error) {
      next(error);
    }
  }

  async destroy(req, res, next) {
    try {
      await ordemTransporteService.delete(req.params.id, req.usuario);

      return responseUtil.success(
        res,
        null,
        "Ordem de transporte excluída com sucesso",
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new OrdemTransporteController();
