import api from './apis';

const CHAVE_SESSAO = 'transporte-publico-sessao';
const EVENTO_SESSAO = 'transporte-publico-sessao-alterada';
const VERSAO_SESSAO = 3;

export const TIPO_USUARIO_ADMIN = 1;
export const TIPO_USUARIO_MOTORISTA = 2;

export async function autenticarUsuario(usuario, senha, tipoUsuario) {
  const { data } = await api.post('/auth/login', {
    usuario: usuario.trim(),
    senha,
    tipoUsuario: Number(tipoUsuario),
  });

  const dadosAutenticacao = data?.dados;
  const usuarioAutenticado = dadosAutenticacao?.usuario;
  const token = dadosAutenticacao?.token;

  if (
    !usuarioAutenticado ||
    !token ||
    Number(usuarioAutenticado.id_tipo_usuario) !== Number(tipoUsuario)
  ) {
    const erro = new Error('Este usuário não possui acesso a esta área.');
    erro.response = {
      status: 403,
      data: { mensagem: erro.message },
    };
    throw erro;
  }

  if (Number(tipoUsuario) === TIPO_USUARIO_MOTORISTA) {
    const idMotorista = Number(usuarioAutenticado.id_motorista);

    if (!Number.isInteger(idMotorista) || idMotorista <= 0) {
      const erro = new Error('Este usuário não possui um motorista vinculado.');
      erro.response = {
        status: 403,
        data: { mensagem: erro.message },
      };
      throw erro;
    }
  }

  return {
    usuario: usuarioAutenticado,
    token,
  };
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

  if (Number(sessao.tipoUsuario) !== Number(tipoUsuario)) {
    return { valida: false, motivo: 'acesso-negado' };
  }

  // A validade e as permissões do token também são conferidas pela API
  // ao acessar os endpoints protegidos.
  return { valida: true, sessao };
}

export { CHAVE_SESSAO, EVENTO_SESSAO };
