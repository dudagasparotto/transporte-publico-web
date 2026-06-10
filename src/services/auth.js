import api from './apis';

const CHAVE_SESSAO = 'transporte-publico-sessao';
const VERSAO_SESSAO = 2;

export const TIPO_USUARIO_ADMIN = 1;
export const TIPO_USUARIO_MOTORISTA = 2;

export async function autenticarUsuario(usuario, senha, tipoUsuario) {
  const { data } = await api.get('/usuarios');
  const usuarios = data.dados || [];

  return usuarios.find((item) => {
    const mesmoUsuario = item.nome_usuario === usuario;
    const mesmaSenha = item.senha_usuario === senha;
    const mesmoTipo = tipoUsuario
      ? Number(item.id_tipo_usuario) === Number(tipoUsuario)
      : true;

    return mesmoUsuario && mesmaSenha && mesmoTipo;
  });
}

export function criarSessao(usuario) {
  const tipoUsuario = Number(usuario.id_tipo_usuario);
  const idMotorista = Number(usuario.id_motorista);

  if (
    tipoUsuario !== TIPO_USUARIO_ADMIN &&
    tipoUsuario !== TIPO_USUARIO_MOTORISTA
  ) {
    throw new Error('Tipo de usuario invalido.');
  }

  if (
    tipoUsuario === TIPO_USUARIO_MOTORISTA &&
    (!Number.isInteger(idMotorista) || idMotorista <= 0)
  ) {
    throw new Error('Usuario motorista sem cadastro vinculado.');
  }

  const idMotoristaDaSessao =
    tipoUsuario === TIPO_USUARIO_MOTORISTA ? idMotorista : null;

  const sessao = {
    versao: VERSAO_SESSAO,
    idUsuario: usuario.id_usuario,
    idMotorista: idMotoristaDaSessao,
    nomeUsuario: usuario.nome_usuario,
    tipoUsuario,
  };

  localStorage.setItem(CHAVE_SESSAO, JSON.stringify(sessao));
  return sessao;
}

export function obterSessao() {
  const sessaoSalva = localStorage.getItem(CHAVE_SESSAO);

  if (!sessaoSalva) return null;

  try {
    const sessao = JSON.parse(sessaoSalva);

    if (
      sessao?.versao !== VERSAO_SESSAO ||
      !sessao?.idUsuario ||
      !sessao?.tipoUsuario
    ) {
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
