import api from './apis';

const CHAVE_SESSAO = 'transporte-publico-sessao';
const EVENTO_SESSAO = 'transporte-publico-sessao-alterada';
const VERSAO_SESSAO = 3;

export const TIPO_USUARIO_ADMIN = 1;
export const TIPO_USUARIO_MOTORISTA = 2;

export async function autenticarUsuario(usuario, senha, tipoUsuario) {
  const { data } = await api.post('/auth/login', {
    usuario,
    senha,
    tipoUsuario,
  });

  return data.dados;
}

function avisarAlteracaoSessao() {
  window.dispatchEvent(new Event(EVENTO_SESSAO));
}

export function criarSessao(dadosAutenticacao) {
  const usuario = dadosAutenticacao?.usuario;
  const token = dadosAutenticacao?.token;
  const tipoUsuario = Number(usuario.id_tipo_usuario);
  const idMotorista = Number(usuario.id_motorista);

  if (!token) {
    throw new Error('Token de autenticação ausente.');
  }

  if (
    tipoUsuario !== TIPO_USUARIO_ADMIN &&
    tipoUsuario !== TIPO_USUARIO_MOTORISTA
  ) {
    throw new Error('Tipo de usuário inválido.');
  }

  if (
    tipoUsuario === TIPO_USUARIO_MOTORISTA &&
    (!Number.isInteger(idMotorista) || idMotorista <= 0)
  ) {
    throw new Error('Usuário motorista sem cadastro vinculado.');
  }

  const idMotoristaDaSessao =
    tipoUsuario === TIPO_USUARIO_MOTORISTA ? idMotorista : null;

  const sessao = {
    versao: VERSAO_SESSAO,
    idUsuario: usuario.id_usuario,
    idMotorista: idMotoristaDaSessao,
    nomeUsuario: usuario.nome_usuario,
    tipoUsuario,
    token,
  };

  localStorage.setItem(CHAVE_SESSAO, JSON.stringify(sessao));
  avisarAlteracaoSessao();
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
      !sessao?.tipoUsuario ||
      !sessao?.token
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
  avisarAlteracaoSessao();
}

export function possuiSessaoDoTipo(tipoUsuario) {
  return obterSessao()?.tipoUsuario === Number(tipoUsuario);
}

export async function validarSessao(tipoUsuario) {
  const sessao = obterSessao();

  if (!sessao) {
    return { valida: false, motivo: 'nao-autenticado' };
  }

  try {
    const { data } = await api.get('/auth/validar', {
      params: { tipoUsuario },
    });
    const usuarioValidado = data.dados;
    const correspondeAoToken =
      Number(usuarioValidado?.idUsuario) === Number(sessao.idUsuario) &&
      Number(usuarioValidado?.tipoUsuario) === Number(sessao.tipoUsuario);

    if (!correspondeAoToken) {
      encerrarSessao();
      return { valida: false, motivo: 'nao-autenticado' };
    }

    return { valida: true, sessao };
  } catch (error) {
    if (error.response?.status === 403) {
      return { valida: false, motivo: 'acesso-negado' };
    }

    encerrarSessao();
    return { valida: false, motivo: 'nao-autenticado' };
  }
}

export { CHAVE_SESSAO, EVENTO_SESSAO };
