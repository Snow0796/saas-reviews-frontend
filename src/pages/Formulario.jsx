import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

export default function Formulario() {
  const { tenantId } = useParams();
  const [negocio, setNegocio] = useState(null);
  const [texto, setTexto] = useState('');
  const [avaliacao, setAvaliacao] = useState(0);
  const [enviado, setEnviado] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    carregarNegocio();
  }, []);

  async function carregarNegocio() {
    try {
      const resp = await api.get(`/formulario/${tenantId}`);
      setNegocio(resp.data);
    } catch (err) {
      setErro('Formulário não encontrado.');
    } finally {
      setCarregando(false);
    }
  }

  async function handleEnviar() {
    if (!texto.trim()) return;
    setEnviando(true);
    try {
      await api.post(`/formulario/${tenantId}`, {
        texto,
        fonte: 'formulario',
        avaliacao,
      });
      setEnviado(true);
    } catch (err) {
      setErro('Erro ao enviar. Tente novamente.');
    } finally {
      setEnviando(false);
    }
  }

  if (carregando) return <div style={styles.loading}>Carregando...</div>;
  if (erro) return <div style={styles.erro}>{erro}</div>;

  if (enviado) return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.sucesso}>
          <p style={styles.sucessoIcone}>✓</p>
          <h2 style={styles.sucessoTitulo}>Obrigado!</h2>
          <p style={styles.sucessoTexto}>Sua avaliação foi enviada com sucesso. Sua opinião é muito importante para nós!</p>
        </div>
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.logo}>Auris</h1>
        <h2 style={styles.titulo}>Como foi sua experiência?</h2>
        {negocio && <p style={styles.negocio}>{negocio.negocio}</p>}

        {/* Estrelas */}
        <div style={styles.estrelas}>
          {[1, 2, 3, 4, 5].map((n) => (
            <span
              key={n}
              onClick={() => setAvaliacao(n)}
              style={{ ...styles.estrela, color: n <= avaliacao ? '#c9a84c' : '#2a2a3a' }}
            >
              ★
            </span>
          ))}
        </div>

        {/* Texto */}
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Conte como foi sua experiência. O que você mais gostou? O que podemos melhorar?"
          style={styles.textarea}
          rows={5}
        />

        <button
          onClick={handleEnviar}
          disabled={enviando || !texto.trim()}
          style={{ ...styles.botao, opacity: !texto.trim() ? 0.5 : 1 }}
        >
          {enviando ? 'Enviando...' : 'Enviar avaliação'}
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' },
  card: { backgroundColor: '#13131a', border: '1px solid #2a2a3a', borderRadius: '16px', padding: '48px', width: '100%', maxWidth: '500px' },
  loading: { color: '#fff', padding: '40px', textAlign: 'center' },
  erro: { color: '#ff4444', padding: '40px', textAlign: 'center' },
  logo: { color: '#c9a84c', fontSize: '24px', fontWeight: '700', textAlign: 'center', margin: '0 0 24px 0', letterSpacing: '2px' },
  titulo: { color: '#ffffff', fontSize: '22px', fontWeight: '700', textAlign: 'center', margin: '0 0 8px 0' },
  negocio: { color: '#6b6b8a', fontSize: '14px', textAlign: 'center', margin: '0 0 32px 0' },
  estrelas: { display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '24px' },
  estrela: { fontSize: '40px', cursor: 'pointer', transition: 'color 0.2s' },
  textarea: { width: '100%', backgroundColor: '#1e1e2e', border: '1px solid #2a2a3a', borderRadius: '8px', padding: '16px', color: '#ffffff', fontSize: '15px', resize: 'vertical', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' },
  botao: { width: '100%', backgroundColor: '#c9a84c', color: '#0a0a0f', border: 'none', borderRadius: '8px', padding: '14px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', marginTop: '16px' },
  sucesso: { textAlign: 'center', padding: '20px' },
  sucessoIcone: { fontSize: '64px', color: '#4caf8a', margin: '0 0 16px 0' },
  sucessoTitulo: { color: '#ffffff', fontSize: '24px', fontWeight: '700', margin: '0 0 12px 0' },
  sucessoTexto: { color: '#6b6b8a', fontSize: '15px', lineHeight: '1.6', margin: 0 },
};