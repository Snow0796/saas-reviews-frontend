import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import GraficoSentimentos from '../components/GraficoSentimentos';
import GraficoTemas from '../components/GraficoTemas';
import GraficoEvolucao from '../components/GraficoEvolucao';

export default function Dashboard() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const [ciclos, setCiclos] = useState([]);
  const [cicloAtivo, setCicloAtivo] = useState(null);
  const [metricas, setMetricas] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      const respCiclos = await api.get('/cycles');
      const listaCiclos = respCiclos.data.ciclos;
      setCiclos(listaCiclos);

      if (listaCiclos.length > 0) {
        const ativo = listaCiclos[listaCiclos.length - 1];
        setCicloAtivo(ativo);
        const respMetricas = await api.get(`/cycles/${ativo.id}/metricas`);
        setMetricas(respMetricas.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCarregando(false);
    }
  }

  if (carregando) return <div style={styles.loading}>Carregando...</div>;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.logo}>Auris</h1>
        <div style={styles.headerRight}>
          <button onClick={() => navigate('/feedbacks')} style={styles.botaoNav}>Feedbacks</button>
          <button onClick={() => navigate('/relatorio')} style={styles.botaoNav}>Relatório</button>
          <span style={styles.email}>{usuario?.email}</span>
          <button onClick={logout} style={styles.botaoLogout}>Sair</button>
        </div>
      </div>

      {/* Conteúdo */}
      <div style={styles.conteudo}>
        <h2 style={styles.titulo}>Dashboard</h2>
        {cicloAtivo && <p style={styles.subtitulo}>Ciclo ativo: {cicloAtivo.nome}</p>}

        {metricas && metricas.total > 0 ? (
          <>
            {/* Cards */}
            <div style={styles.cards}>
              <Card titulo="Total de Feedbacks" valor={metricas.total} cor="#c9a84c" />
              <Card titulo="Score de Sentimento" valor={`${metricas.sentimento_score}%`} cor="#4caf8a" />
              <Card titulo="Alto Risco" valor={metricas.riscos.alto} cor="#ff4444" />
              <Card titulo="Temas Identificados" valor={metricas.temas.length} cor="#6b8aff" />
            </div>

            {/* Gráficos */}
            <div style={styles.graficos}>
              <GraficoSentimentos sentimentos={metricas.sentimentos} />
              <GraficoTemas temas={metricas.temas} />
            </div>

            <div style={{ marginTop: '24px' }}>
              <GraficoEvolucao evolucao={metricas.evolucao_diaria} />
            </div>

            {/* Alertas de risco */}
            {metricas.alto_risco.length > 0 && (
              <div style={styles.alertas}>
                <h3 style={styles.alertasTitulo}>⚠️ Feedbacks de Alto Risco</h3>
                {metricas.alto_risco.map((f) => (
                  <div key={f.id} style={styles.alertaItem}>
                    <p style={styles.alertaTexto}>{f.texto}</p>
                    <div style={styles.alertaTags}>
                      <span style={styles.tag}>{f.tema}</span>
                      <span style={styles.tag}>{f.fonte}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div style={styles.vazio}>
            <p style={styles.vazioTexto}>Nenhum feedback ainda neste ciclo.</p>
            <p style={styles.vazioSub}>Compartilhe o formulário público com seus clientes para começar.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Card({ titulo, valor, cor }) {
  return (
    <div style={styles.card}>
      <p style={styles.cardTitulo}>{titulo}</p>
      <p style={{ ...styles.cardValor, color: cor }}>{valor}</p>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#0a0a0f' },
  loading: { color: '#fff', padding: '40px', textAlign: 'center' },
  header: { backgroundColor: '#13131a', borderBottom: '1px solid #2a2a3a', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  logo: { color: '#c9a84c', fontSize: '24px', fontWeight: '700', margin: 0, letterSpacing: '2px' },
  headerRight: { display: 'flex', alignItems: 'center', gap: '16px' },
  email: { color: '#6b6b8a', fontSize: '14px' },
  botaoLogout: { backgroundColor: 'transparent', border: '1px solid #2a2a3a', borderRadius: '8px', padding: '8px 16px', color: '#a0a0c0', cursor: 'pointer', fontSize: '14px' },
  conteudo: { padding: '32px' },
  titulo: { color: '#ffffff', fontSize: '24px', fontWeight: '700', margin: '0 0 8px 0' },
  subtitulo: { color: '#6b6b8a', fontSize: '14px', margin: '0 0 32px 0' },
  cards: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' },
  card: { backgroundColor: '#13131a', border: '1px solid #2a2a3a', borderRadius: '12px', padding: '24px' },
  cardTitulo: { color: '#6b6b8a', fontSize: '13px', margin: '0 0 8px 0', textTransform: 'uppercase', letterSpacing: '1px' },
  cardValor: { fontSize: '32px', fontWeight: '700', margin: 0 },
  graficos: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' },
  alertas: { marginTop: '24px', backgroundColor: '#1a1010', border: '1px solid #3a1a1a', borderRadius: '12px', padding: '24px' },
  alertasTitulo: { color: '#ff4444', fontSize: '16px', fontWeight: '600', margin: '0 0 16px 0' },
  alertaItem: { backgroundColor: '#13131a', border: '1px solid #2a2a3a', borderRadius: '8px', padding: '16px', marginBottom: '12px' },
  alertaTexto: { color: '#ffffff', fontSize: '14px', margin: '0 0 8px 0' },
  alertaTags: { display: 'flex', gap: '8px' },
  tag: { backgroundColor: '#2a2a3a', color: '#a0a0c0', fontSize: '12px', padding: '4px 10px', borderRadius: '20px' },
  vazio: { backgroundColor: '#13131a', border: '1px solid #2a2a3a', borderRadius: '12px', padding: '48px', textAlign: 'center', marginTop: '32px' },
  vazioTexto: { color: '#a0a0c0', fontSize: '18px', margin: '0 0 8px 0' },
  vazioSub: { color: '#6b6b8a', fontSize: '14px', margin: 0 },
  botaoNav: { backgroundColor: 'transparent', border: '1px solid #2a2a3a', borderRadius: '8px', padding: '8px 16px', color: '#c9a84c', cursor: 'pointer', fontSize: '14px' },
};