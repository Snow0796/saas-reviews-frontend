import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Relatorio() {
  const [ciclos, setCiclos] = useState([]);
  const [cicloSelecionado, setCicloSelecionado] = useState('');
  const [relatorio, setRelatorio] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [gerando, setGerando] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    carregarCiclos();
  }, []);

  async function carregarCiclos() {
    try {
      const resp = await api.get('/cycles');
      setCiclos(resp.data.ciclos);
      if (resp.data.ciclos.length > 0) {
        setCicloSelecionado(resp.data.ciclos[resp.data.ciclos.length - 1].id);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function buscarRelatorio(cicloId) {
    setCarregando(true);
    setRelatorio('');
    try {
      const resp = await api.get(`/cycles/${cicloId}/relatorio`);
      setRelatorio(resp.data.relatorio.conteudo);
    } catch (err) {
      setRelatorio('');
    } finally {
      setCarregando(false);
    }
  }

  async function gerarRelatorio() {
    setGerando(true);
    try {
      const resp = await api.post(`/cycles/${cicloSelecionado}/relatorio`);
      setRelatorio(resp.data.relatorio);
    } catch (err) {
      alert('Erro ao gerar relatório. Verifique se há feedbacks neste ciclo.');
    } finally {
      setGerando(false);
    }
  }

  function handleCicloChange(e) {
    setCicloSelecionado(e.target.value);
    buscarRelatorio(e.target.value);
  }

  useEffect(() => {
    if (cicloSelecionado) buscarRelatorio(cicloSelecionado);
  }, []);

  // Formata o texto markdown simples
  function formatarTexto(texto) {
    return texto.split('\n').map((linha, i) => {
      if (linha.startsWith('**') && linha.endsWith('**')) {
        return <h3 key={i} style={styles.secaoTitulo}>{linha.replace(/\*\*/g, '')}</h3>;
      }
      if (linha.startsWith('- ') || linha.startsWith('* ')) {
        return <li key={i} style={styles.item}>{linha.substring(2).replace(/\*\*(.*?)\*\*/g, '$1')}</li>;
      }
      if (linha.match(/^\d+\./)) {
        return <li key={i} style={styles.itemNum}>{linha.replace(/\*\*(.*?)\*\*/g, '$1')}</li>;
      }
      if (linha.trim() === '') return <br key={i} />;
      return <p key={i} style={styles.paragrafo}>{linha.replace(/\*\*(.*?)\*\*/g, '$1')}</p>;
    });
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.logo}>Auris</h1>
        <button onClick={() => navigate('/dashboard')} style={styles.botaoVoltar}>← Dashboard</button>
      </div>

      <div style={styles.conteudo}>
        <h2 style={styles.titulo}>Relatório Estratégico</h2>

        {/* Seletor de ciclo */}
        <div style={styles.controles}>
          <select value={cicloSelecionado} onChange={handleCicloChange} style={styles.select}>
            {ciclos.map((c) => (
              <option key={c.id} value={c.id}>{c.nome}</option>
            ))}
          </select>
          <button onClick={gerarRelatorio} disabled={gerando} style={styles.botaoGerar}>
            {gerando ? 'Gerando...' : '✨ Gerar novo relatório'}
          </button>
        </div>

        {/* Relatório */}
        {carregando ? (
          <div style={styles.loading}>Carregando relatório...</div>
        ) : relatorio ? (
          <div style={styles.relatorio}>
            {formatarTexto(relatorio)}
          </div>
        ) : (
          <div style={styles.vazio}>
            <p style={styles.vazioTexto}>Nenhum relatório gerado ainda.</p>
            <p style={styles.vazioSub}>Clique em "Gerar novo relatório" para criar o primeiro.</p>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#0a0a0f' },
  header: { backgroundColor: '#13131a', borderBottom: '1px solid #2a2a3a', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  logo: { color: '#c9a84c', fontSize: '24px', fontWeight: '700', margin: 0, letterSpacing: '2px' },
  botaoVoltar: { backgroundColor: 'transparent', border: '1px solid #2a2a3a', borderRadius: '8px', padding: '8px 16px', color: '#a0a0c0', cursor: 'pointer', fontSize: '14px' },
  conteudo: { padding: '32px', maxWidth: '860px' },
  titulo: { color: '#ffffff', fontSize: '24px', fontWeight: '700', margin: '0 0 24px 0' },
  controles: { display: 'flex', gap: '16px', marginBottom: '32px', alignItems: 'center' },
  select: { backgroundColor: '#13131a', border: '1px solid #2a2a3a', borderRadius: '8px', padding: '10px 16px', color: '#ffffff', fontSize: '14px', cursor: 'pointer' },
  botaoGerar: { backgroundColor: '#c9a84c', color: '#0a0a0f', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' },
  loading: { color: '#6b6b8a', padding: '40px', textAlign: 'center' },
  relatorio: { backgroundColor: '#13131a', border: '1px solid #2a2a3a', borderRadius: '12px', padding: '32px' },
  secaoTitulo: { color: '#c9a84c', fontSize: '16px', fontWeight: '700', margin: '24px 0 12px 0', textTransform: 'uppercase', letterSpacing: '1px' },
  paragrafo: { color: '#c0c0d8', fontSize: '15px', lineHeight: '1.7', margin: '8px 0' },
  item: { color: '#c0c0d8', fontSize: '15px', lineHeight: '1.7', margin: '6px 0 6px 20px' },
  itemNum: { color: '#c0c0d8', fontSize: '15px', lineHeight: '1.7', margin: '6px 0 6px 20px' },
  vazio: { backgroundColor: '#13131a', border: '1px solid #2a2a3a', borderRadius: '12px', padding: '48px', textAlign: 'center' },
  vazioTexto: { color: '#a0a0c0', fontSize: '18px', margin: '0 0 8px 0' },
  vazioSub: { color: '#6b6b8a', fontSize: '14px', margin: 0 },
};