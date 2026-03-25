import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const CORES_SENTIMENTO = {
  positivo: '#4caf8a',
  neutro: '#c9a84c',
  negativo: '#ff4444',
};

const CORES_RISCO = {
  baixo: '#4caf8a',
  medio: '#c9a84c',
  alto: '#ff4444',
};

export default function Feedbacks() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filtro, setFiltro] = useState('todos');
  const [carregando, setCarregando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    carregarFeedbacks();
  }, []);

  async function carregarFeedbacks() {
    try {
      const resp = await api.get('/feedbacks');
      setFeedbacks(resp.data.feedbacks);
    } catch (err) {
      console.error(err);
    } finally {
      setCarregando(false);
    }
  }

  const feedbacksFiltrados = filtro === 'todos'
    ? feedbacks
    : feedbacks.filter((f) => f.sentimento === filtro);

  if (carregando) return <div style={styles.loading}>Carregando...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.logo}>Auris</h1>
        <button onClick={() => navigate('/dashboard')} style={styles.botaoVoltar}>← Dashboard</button>
      </div>

      <div style={styles.conteudo}>
        <h2 style={styles.titulo}>Feedbacks</h2>
        <p style={styles.subtitulo}>{feedbacks.length} feedbacks coletados</p>

        {/* Filtros */}
        <div style={styles.filtros}>
          {['todos', 'positivo', 'neutro', 'negativo'].map((f) => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              style={{ ...styles.filtroBotao, ...(filtro === f ? styles.filtroAtivo : {}) }}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Lista */}
        <div style={styles.lista}>
          {feedbacksFiltrados.length === 0 ? (
            <p style={styles.vazio}>Nenhum feedback encontrado.</p>
          ) : (
            feedbacksFiltrados.map((f) => (
              <div key={f.id} style={styles.item}>
                <p style={styles.texto}>{f.texto}</p>
                <div style={styles.tags}>
                  <span style={{ ...styles.tag, color: CORES_SENTIMENTO[f.sentimento], borderColor: CORES_SENTIMENTO[f.sentimento] }}>
                    {f.sentimento}
                  </span>
                  <span style={styles.tagNeutro}>{f.tema}</span>
                  <span style={{ ...styles.tag, color: CORES_RISCO[f.risco], borderColor: CORES_RISCO[f.risco] }}>
                    risco {f.risco}
                  </span>
                  <span style={styles.tagNeutro}>{f.fonte}</span>
                  <span style={styles.data}>{new Date(f.criado_em).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#0a0a0f' },
  loading: { color: '#fff', padding: '40px', textAlign: 'center' },
  header: { backgroundColor: '#13131a', borderBottom: '1px solid #2a2a3a', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  logo: { color: '#c9a84c', fontSize: '24px', fontWeight: '700', margin: 0, letterSpacing: '2px' },
  botaoVoltar: { backgroundColor: 'transparent', border: '1px solid #2a2a3a', borderRadius: '8px', padding: '8px 16px', color: '#a0a0c0', cursor: 'pointer', fontSize: '14px' },
  conteudo: { padding: '32px' },
  titulo: { color: '#ffffff', fontSize: '24px', fontWeight: '700', margin: '0 0 8px 0' },
  subtitulo: { color: '#6b6b8a', fontSize: '14px', margin: '0 0 24px 0' },
  filtros: { display: 'flex', gap: '8px', marginBottom: '24px' },
  filtroBotao: { backgroundColor: '#13131a', border: '1px solid #2a2a3a', borderRadius: '8px', padding: '8px 16px', color: '#a0a0c0', cursor: 'pointer', fontSize: '14px' },
  filtroAtivo: { backgroundColor: '#c9a84c', color: '#0a0a0f', borderColor: '#c9a84c', fontWeight: '700' },
  lista: { display: 'flex', flexDirection: 'column', gap: '12px' },
  item: { backgroundColor: '#13131a', border: '1px solid #2a2a3a', borderRadius: '12px', padding: '20px' },
  texto: { color: '#ffffff', fontSize: '15px', margin: '0 0 12px 0', lineHeight: '1.5' },
  tags: { display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' },
  tag: { fontSize: '12px', padding: '4px 10px', borderRadius: '20px', border: '1px solid', backgroundColor: 'transparent' },
  tagNeutro: { fontSize: '12px', padding: '4px 10px', borderRadius: '20px', backgroundColor: '#2a2a3a', color: '#a0a0c0' },
  data: { color: '#6b6b8a', fontSize: '12px', marginLeft: 'auto' },
  vazio: { color: '#6b6b8a', textAlign: 'center', padding: '40px' },
};