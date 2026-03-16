const supabase = require('../config/supabase');

const ORDEM_SELECT = `
  *,
  situacao:situacoes(id, nome, cor),
  tipo_carga:tipos_carga(id, descricao),
  embarcador:usuarios!ordens_transporte_embarcador_id_fkey(id, nome, email),
  manifestador:usuarios!ordens_transporte_manifestador_id_fkey(id, nome, email),
  tag_pedagio:tags_pedagio(id, codigo_tag, operadora)
`.trim();

class OrdemTransporteRepository {
  async findAll(filters = {}, pagination = {}, usuarioLogado) {
    const { page = 1, limit = 10 } = pagination;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from('ordens_transporte')
      .select(ORDEM_SELECT, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    // Filtros de visibilidade por perfil
    if (usuarioLogado.perfilNome === 'Embarcador') {
      query = query.eq('embarcador_id', usuarioLogado.id);
    } else if (usuarioLogado.perfilNome === 'Manifestador') {
      query = query.or(`manifestador_id.eq.${usuarioLogado.id},manifestador_id.is.null`);
    }

    if (filters.situacao_id) query = query.eq('situacao_id', filters.situacao_id);
    if (filters.embarcador_id) query = query.eq('embarcador_id', filters.embarcador_id);
    if (filters.manifestador_id) query = query.eq('manifestador_id', filters.manifestador_id);
    if (filters.tipo_carga_id) query = query.eq('tipo_carga_id', filters.tipo_carga_id);
    if (filters.placa) query = query.ilike('placa', `%${filters.placa}%`);
    if (filters.origem) query = query.ilike('origem', `%${filters.origem}%`);
    if (filters.destino) query = query.ilike('destino', `%${filters.destino}%`);
    if (filters.cliente_pagador) query = query.ilike('cliente_pagador', `%${filters.cliente_pagador}%`);
    if (filters.lote) query = query.ilike('lote', `%${filters.lote}%`);
    if (filters.produto) query = query.ilike('produto', `%${filters.produto}%`);
    if (filters.data_inicio) query = query.gte('data_carregamento', filters.data_inicio);
    if (filters.data_fim) query = query.lte('data_carregamento', filters.data_fim);

    const { data, count, error } = await query;

    if (error) throw error;

    return {
      ordens: data || [],
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    };
  }

  async findById(id, usuarioLogado) {
    let query = supabase
      .from('ordens_transporte')
      .select(ORDEM_SELECT)
      .eq('id', id);

    if (usuarioLogado.perfilNome === 'Embarcador') {
      query = query.eq('embarcador_id', usuarioLogado.id);
    } else if (usuarioLogado.perfilNome === 'Manifestador') {
      query = query.or(`manifestador_id.eq.${usuarioLogado.id},manifestador_id.is.null`);
    }

    const { data, error } = await query.single();

    if (error) return null;
    return data;
  }

  async create(data) {
    const { data: created, error } = await supabase
      .from('ordens_transporte')
      .insert(data)
      .select(ORDEM_SELECT)
      .single();

    if (error) throw error;
    return created;
  }

  async update(id, data) {
    const { data: updated, error } = await supabase
      .from('ordens_transporte')
      .update(data)
      .eq('id', id)
      .select(ORDEM_SELECT)
      .single();

    if (error) throw error;
    return updated;
  }

  async delete(id) {
    const { error } = await supabase
      .from('ordens_transporte')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }

  async getOrdensDetalhadasPorEmbarcador(dataInicio, dataFim, usuarioLogado) {
    let query = supabase
      .from('ordens_transporte')
      .select('embarcador_id, situacao:situacoes(nome), embarcador:usuarios!ordens_transporte_embarcador_id_fkey(nome)');

    if (dataInicio && dataFim) {
      query = query.gte('data_carregamento', dataInicio).lte('data_carregamento', dataFim);
    }
    if (usuarioLogado.perfilNome === 'Embarcador') {
      query = query.eq('embarcador_id', usuarioLogado.id);
    }

    const { data, error } = await query;
    if (error) throw error;

    return this._agruparPorUsuarioESituacao(data || [], 'embarcador');
  }

  async getOrdensDetalhadasPorManifestador(dataInicio, dataFim, usuarioLogado) {
    let query = supabase
      .from('ordens_transporte')
      .select('manifestador_id, situacao:situacoes(nome), manifestador:usuarios!ordens_transporte_manifestador_id_fkey(nome)')
      .not('manifestador_id', 'is', null);

    if (dataInicio && dataFim) {
      query = query.gte('data_carregamento', dataInicio).lte('data_carregamento', dataFim);
    }
    if (usuarioLogado.perfilNome === 'Manifestador') {
      query = query.eq('manifestador_id', usuarioLogado.id);
    }

    const { data, error } = await query;
    if (error) throw error;

    return this._agruparPorUsuarioESituacao(data || [], 'manifestador');
  }

  _agruparPorUsuarioESituacao(dados, campoUsuario) {
    const mapa = {};

    dados.forEach(item => {
      const nomeUsuario = item[campoUsuario]?.nome || 'Não informado';
      const situacao = item.situacao?.nome || 'Indefinida';

      if (!mapa[nomeUsuario]) {
        mapa[nomeUsuario] = { [campoUsuario]: nomeUsuario, total: 0 };
      }

      mapa[nomeUsuario][situacao] = (mapa[nomeUsuario][situacao] || 0) + 1;
      mapa[nomeUsuario].total += 1;
    });

    return Object.values(mapa);
  }
}

module.exports = new OrdemTransporteRepository();
