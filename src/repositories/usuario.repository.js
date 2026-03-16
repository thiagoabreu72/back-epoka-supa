const supabase = require("../config/supabase");

class UsuarioRepository {
  // async findAll(filters = {}, pagination = {}) {
  //   const { page = 1, limit = 10 } = pagination;
  //   const from = (page - 1) * limit;
  //   const to = from + limit - 1;

  //   let query = supabase
  //     .from('usuarios')
  //     .select('*, perfil:perfis(id, nome, permissoes)', { count: 'exact' })
  //     .order('created_at', { ascending: false })
  //     .range(from, to);

  //   if (filters.ativo !== undefined) query = query.eq('ativo', filters.ativo);
  //   if (filters.perfil_id) query = query.eq('perfil_id', filters.perfil_id);
  //   if (filters.search) {
  //     query = query.or(`nome.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
  //   }

  //   const { data, count, error } = await query;

  //   if (error) throw error;

  //   // Remover senha_hash do retorno
  //   const usuarios = (data || []).map(({ senha_hash, ...u }) => u);

  //   return {
  //     usuarios,
  //     total: count,
  //     totalPages: Math.ceil(count / limit),
  //     currentPage: page
  //   };
  // }

  async findAll(filters = {}) {
    let query = supabase
      .from("usuarios")
      .select("*, perfil:perfis(id, nome, permissoes)") // Removido o { count: 'exact' }
      .order("created_at", { ascending: false });
    // Removido o .range(from, to)

    if (filters.ativo !== undefined) query = query.eq("ativo", filters.ativo);
    if (filters.perfil_id) query = query.eq("perfil_id", filters.perfil_id);
    if (filters.search) {
      query = query.or(
        `nome.ilike.%${filters.search}%,email.ilike.%${filters.search}%`,
      );
    }

    const { data, error } = await query; // Removido o 'count' da desestruturação

    if (error) throw error;

    // Remover senha_hash do retorno
    const usuarios = (data || []).map(({ senha_hash, ...u }) => u);

    return {
      usuarios,
      total: usuarios.length, // Agora total é simplesmente o length do array
      // Removidos totalPages e currentPage
    };
  }

  async findById(id) {
    const { data, error } = await supabase
      .from("usuarios")
      .select("*, perfil:perfis(id, nome, permissoes)")
      .eq("id", id)
      .single();

    if (error) return null;
    if (!data) return null;

    const { senha_hash, ...usuario } = data;
    return usuario;
  }

  async findAllPublico() {
    const { data, error } = await supabase
      .from("usuarios")
      .select(
        `
      *,
      perfil:perfis (
        id,
        nome,
        permissoes
      )
    `,
      )
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Remover senha_hash do retorno por segurança
    const usuarios = (data || []).map(({ senha_hash, ...usuario }) => ({
      ...usuario,
      // Garantir que perfil existe
      perfil: usuario.perfil || null,
    }));

    return {
      usuarios,
      total: usuarios.length,
    };
  }

  async findByEmail(email) {
    // maybeSingle() retorna null sem lancar erro quando nao encontra o registro
    const { data, error } = await supabase
      .from("usuarios")
      .select("*, perfil:perfis(id, nome, permissoes)")
      .eq("email", email)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async create(data) {
    const { data: created, error } = await supabase
      .from("usuarios")
      .insert(data)
      .select("*, perfil:perfis(id, nome, permissoes)")
      .single();

    if (error) throw error;

    const { senha_hash, ...usuario } = created;
    return usuario;
  }

  async update(id, data) {
    const { data: updated, error } = await supabase
      .from("usuarios")
      .update(data)
      .eq("id", id)
      .select("*, perfil:perfis(id, nome, permissoes)")
      .single();

    if (error) throw error;
    if (!updated) return null;

    const { senha_hash, ...usuario } = updated;
    return usuario;
  }

  async delete(id) {
    const { error } = await supabase.from("usuarios").delete().eq("id", id);

    if (error) throw error;
    return true;
  }

  async inactivate(id) {
    return await this.update(id, { ativo: false });
  }
}

module.exports = new UsuarioRepository();
