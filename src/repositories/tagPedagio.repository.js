const supabase = require('../config/supabase');

class TagPedagioRepository {
  async findAll(filters = {}, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from('tags_pedagio')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (filters.status) query = query.eq('status', filters.status);
    if (filters.operadora) query = query.ilike('operadora', `%${filters.operadora}%`);
    if (filters.codigo_tag) query = query.ilike('codigo_tag', `%${filters.codigo_tag}%`);

    const { data, count, error } = await query;

    if (error) throw error;

    return {
      tags: data || [],
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    };
  }

  async findById(id) {
    const { data, error } = await supabase
      .from('tags_pedagio')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data;
  }

  async findByCodigoTag(codigo_tag) {
    const { data, error } = await supabase
      .from('tags_pedagio')
      .select('*')
      .eq('codigo_tag', codigo_tag)
      .single();

    if (error) return null;
    return data;
  }

  async create(data) {
    const { data: created, error } = await supabase
      .from('tags_pedagio')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return created;
  }

  async update(id, data) {
    const { data: updated, error } = await supabase
      .from('tags_pedagio')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return updated;
  }

  async delete(id) {
    const { error } = await supabase
      .from('tags_pedagio')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
}

module.exports = new TagPedagioRepository();
