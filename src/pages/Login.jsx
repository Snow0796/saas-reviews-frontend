import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setErro('');
    setCarregando(true);
    try {
      await login(email, senha);
      navigate('/dashboard');
    } catch (err) {
      setErro('Email ou senha incorretos');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.titulo}>Auris</h1>
        <p style={styles.subtitulo}>Inteligência de reviews para o seu negócio</p>

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.campo}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              placeholder="seu@email.com"
              required
            />
          </div>

          <div style={styles.campo}>
            <label style={styles.label}>Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              style={styles.input}
              placeholder="••••••••"
              required
            />
          </div>

          {erro && <p style={styles.erro}>{erro}</p>}

          <button type="submit" style={styles.botao} disabled={carregando}>
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0a0a0f',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#13131a',
    border: '1px solid #2a2a3a',
    borderRadius: '16px',
    padding: '48px',
    width: '100%',
    maxWidth: '420px',
  },
  titulo: {
    color: '#c9a84c',
    fontSize: '32px',
    fontWeight: '700',
    textAlign: 'center',
    margin: '0 0 8px 0',
    letterSpacing: '2px',
  },
  subtitulo: {
    color: '#6b6b8a',
    fontSize: '14px',
    textAlign: 'center',
    margin: '0 0 40px 0',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  campo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    color: '#a0a0c0',
    fontSize: '14px',
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#1e1e2e',
    border: '1px solid #2a2a3a',
    borderRadius: '8px',
    padding: '12px 16px',
    color: '#ffffff',
    fontSize: '15px',
    outline: 'none',
  },
  erro: {
    color: '#ff4444',
    fontSize: '14px',
    textAlign: 'center',
    margin: '0',
  },
  botao: {
    backgroundColor: '#c9a84c',
    color: '#0a0a0f',
    border: 'none',
    borderRadius: '8px',
    padding: '14px',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: '8px',
  },
};