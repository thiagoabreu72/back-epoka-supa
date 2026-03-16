const supabase = require('../config/supabase');

class PerfilRepository {
  async findAll() {
    const { data, error } = await supabase
      .from('perfis')
      .select('*')
      .order('nome', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async findById(id) {
    const { data, error } = await supabase
      .from('perfis')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data;
  }

  async findByNome(nome) {
    const { data, error } = await supabase
      .from('perfis')
      .select('*')
      .eq('nome', nome)
      .single();

    if (error) return null;
    return data;
  }

  async create(data) {
    const { data: created, error } = await supabase
      .from('perfis')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return created;
  }

  async update(id, data) {
    const { data: updated, error } = await supabase
      .from('perfis')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return updated;
  }

  async delete(id) {
    const { error } = await supabase
      .from('perfis')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
}

module.exports = new PerfilRepository();
