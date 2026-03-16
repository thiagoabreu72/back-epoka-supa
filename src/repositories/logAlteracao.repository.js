const supabase = require('../config/supabase');

class LogAlteracaoRepository {
  async findAll(filters = {}, pagination = {}) {
    const { page = 1, limit = 50 } = pagination;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from('logs_alteracoes')
      .select('*, usuario:usuarios(id, nome, email)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (filters.tabela) query = query.eq('tabela', filters.tabela);
    if (filters.registro_id) query = query.eq('registro_id', filters.registro_id);
    if (filters.usuario_id) query = query.eq('usuario_id', filters.usuario_id);
    if (filters.acao) query = query.eq('acao', filters.acao);
    if (filters.data_inicio) query = query.gte('created_at', filters.data_inicio);
    if (filters.data_fim) query = query.lte('created_at', filters.data_fim);

    const { data, count, error } = await query;

    if (error) throw error;

    return {
      logs: data || [],
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    };
  }

  async findByTabelaAndRegistro(tabela, registro_id) {
    const { data, error } = await supabase
      .from('logs_alteracoes')
      .select('*, usuario:usuarios(id, nome, email)')
      .eq('tabela', tabela)
      .eq('registro_id', registro_id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async create(data) {
    const { data: created, error } = await supabase
      .from('logs_alteracoes')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return created;
  }
}

module.exports = new LogAlteracaoRepository();
