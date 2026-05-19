import api from './apis';

export async function autenticarUsuario(usuario, senha, tipoUsuario) {
  const { data } = await api.get('/usuarios');
  const usuarios = data.dados || [];

  return usuarios.find((item) => {
    const mesmoUsuario = item.nome_usuario === usuario;
    const mesmaSenha = item.senha_usuario === senha;
    const mesmoTipo = tipoUsuario ? item.id_tipo_usuario === tipoUsuario : true;

    return mesmoUsuario && mesmaSenha && mesmoTipo;
  });
}
