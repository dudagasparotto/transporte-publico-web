import api from './apis';

const CHAVE_SESSAO = 'transporte-publico-sessao';

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

export function criarSessao(usuario) {
  const sessao = {
    idUsuario: usuario.id_usuario,
    idMotorista: usuario.id_motorista ?? null,
    nomeUsuario: usuario.nome_usuario,
    tipoUsuario: Number(usuario.id_tipo_usuario),
  };

  localStorage.setItem(CHAVE_SESSAO, JSON.stringify(sessao));
  return sessao;
}

export function obterSessao() {
  const sessaoSalva = localStorage.getItem(CHAVE_SESSAO);

  if (!sessaoSalva) return null;

  try {
    const sessao = JSON.parse(sessaoSalva);

    if (!sessao?.idUsuario || !sessao?.tipoUsuario) {
      encerrarSessao();
      return null;
    }

    return sessao;
  } catch {
    encerrarSessao();
    return null;
  }
}

export function encerrarSessao() {
  localStorage.removeItem(CHAVE_SESSAO);
}

export function possuiSessaoDoTipo(tipoUsuario) {
  return obterSessao()?.tipoUsuario === Number(tipoUsuario);
}
