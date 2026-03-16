const ordemTransporteRepository = require("../repositories/ordemTransporte.repository");
const situacaoRepository = require("../repositories/situacao.repository");
const loggerMiddleware = require("../middlewares/logger.middleware");

class OrdemTransporteService {
  async getAll(filters, pagination, usuarioLogado) {
    return await ordemTransporteRepository.findAll(
      filters,
      pagination,
      usuarioLogado,
    );
  }

  async getById(id, usuarioLogado) {
    const ordem = await ordemTransporteRepository.findById(id, usuarioLogado);

    if (!ordem) {
      throw new Error(
        "Ordem de transporte não encontrada ou sem permissão de acesso",
      );
    }

    return ordem;
  }

  async create(dados, usuarioLogado) {
    // Se for Embarcador, automaticamente atribui como embarcador da ordem
    if (usuarioLogado.perfilNome === "Embarcador") {
      dados.embarcador_id = usuarioLogado.id;
    }

    // Validar situação
    const situacao = await situacaoRepository.findById(dados.situacao_id);
    if (!situacao) {
      throw new Error("Situação não encontrada");
    }

    const ordem = await ordemTransporteRepository.create(dados);

    // Log de criação
    await loggerMiddleware.logAlteracao(
      "ordens_transporte",
      ordem.id,
      usuarioLogado.id,
      "CREATE",
      null,
      ordem,
    );

    return ordem;
  }

  async update(id, dados, usuarioLogado) {
    const ordem = await ordemTransporteRepository.findById(id, usuarioLogado);

    if (!ordem) {
      throw new Error(
        "Ordem de transporte não encontrada ou sem permissão de acesso",
      );
    }

    const dadosAnteriores = ordem.toJSON();

    // Validar permissões de edição baseado no perfil
    if (usuarioLogado.perfilNome === "Embarcador") {
      // Embarcador só pode editar se a situação permitir
      if (!ordem.situacao.permite_edicao_embarcador) {
        throw new Error("Não é possível editar ordem nesta situação");
      }

      // Embarcador não pode alterar embarcador_id
      if (dados.embarcador_id && dados.embarcador_id !== ordem.embarcador_id) {
        throw new Error("Você não pode alterar o embarcador da ordem");
      }
    }

    if (usuarioLogado.perfilNome === "Manifestador") {
      // Manifestador pode alterar apenas campos operacionais
      const camposPermitidos = [
        "situacao_id",
        "placa",
        "telefone_motorista",
        "frete_motorista",
        "tag_pedagio_id",
        "observacoes",
        "rota",
        "manifestador_id",
        "data_carregamento",
      ];

      const camposEnviados = Object.keys(dados);
      const camposNaoPermitidos = camposEnviados.filter(
        (campo) => !camposPermitidos.includes(campo),
      );

      if (camposNaoPermitidos.length > 0) {
        throw new Error(
          `Manifestador não pode alterar os campos: ${camposNaoPermitidos.join(
            ", ",
          )}`,
        );
      }

      // Atribuir manifestador automaticamente se não estiver definido
      if (!ordem.manifestador_id) {
        dados.manifestador_id = usuarioLogado.id;
      }
    }

    // Validar nova situação se estiver sendo alterada
    if (dados.situacao_id && dados.situacao_id !== ordem.situacao_id) {
      const novaSituacao = await situacaoRepository.findById(dados.situacao_id);
      if (!novaSituacao) {
        throw new Error("Situação não encontrada");
      }

      // Validar fluxo de situação
      if (
        novaSituacao.ordem_fluxo < ordem.situacao.ordem_fluxo &&
        !ordem.situacao.eh_final
      ) {
        throw new Error("Não é possível retroceder para uma situação anterior");
      }
    }

    const ordemAtualizada = await ordemTransporteRepository.update(id, dados);

    // Log de atualização
    await loggerMiddleware.logAlteracao(
      "ordens_transporte",
      id,
      usuarioLogado.id,
      "UPDATE",
      dadosAnteriores,
      ordemAtualizada.toJSON(),
    );

    return ordemAtualizada;
  }

  async delete(id, usuarioLogado) {
    const ordem = await ordemTransporteRepository.findById(id, usuarioLogado);

    if (!ordem) {
      throw new Error(
        "Ordem de transporte não encontrada ou sem permissão de acesso",
      );
    }

    // Apenas Admin pode excluir
    console.log(usuarioLogado);
    if (usuarioLogado.perfil.nome !== "Admin") {
      throw new Error("Apenas administradores podem excluir ordens");
    }

    const dadosAnteriores = ordem;

    await ordemTransporteRepository.delete(id);

    // Log de exclusão
    await loggerMiddleware.logAlteracao(
      "ordens_transporte",
      id,
      usuarioLogado.id,
      "DELETE",
      dadosAnteriores,
      null,
    );

    return true;
  }
}

module.exports = new OrdemTransporteService();
