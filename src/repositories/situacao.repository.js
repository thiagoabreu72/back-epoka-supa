const supabase = require('../config/supabase');

class SituacaoRepository {
  async findAll() {
    const { data, error } = await supabase
      .from('situacoes')
      .select('*')
      .order('ordem_fluxo', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async findById(id) {
    const { data, error } = await supabase
      .from('situacoes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data;
  }

  async create(data) {
    const { data: created, error } = await supabase
      .from('situacoes')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return created;
  }

  async update(id, data) {
    const { data: updated, error } = await supabase
      .from('situacoes')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return updated;
  }

  async delete(id) {
    // Verificar se está sendo usada em ordens de transporte
    const { count, error: countError } = await supabase
      .from('ordens_transporte')
      .select('id', { count: 'exact', head: true })
      .eq('situacao_id', id);

    if (countError) throw countError;
    if (count > 0) {
      throw new Error('Não é possível excluir situação vinculada a ordens de transporte');
    }

    const { error } = await supabase
      .from('situacoes')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
}

module.exports = new SituacaoRepository();
