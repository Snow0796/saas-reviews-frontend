import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function GraficoEvolucao({ evolucao }) {
  if (!evolucao || evolucao.length === 0) return null;

  return (
    <div style={styles.container}>
      <h3 style={styles.titulo}>Evolução diária</h3>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={evolucao}>
          <XAxis dataKey="data" stroke="#6b6b8a" tick={{ fill: '#6b6b8a', fontSize: 12 }} />
          <YAxis stroke="#6b6b8a" tick={{ fill: '#6b6b8a', fontSize: 12 }} />
          <Tooltip contentStyle={{ backgroundColor: '#13131a', border: '1px solid #2a2a3a', borderRadius: '8px', color: '#fff' }} />
          <Legend wrapperStyle={{ color: '#a0a0c0' }} />
          <Line type="monotone" dataKey="positivo" stroke="#4caf8a" strokeWidth={2} dot={{ fill: '#4caf8a' }} name="Positivos" />
          <Line type="monotone" dataKey="neutro" stroke="#c9a84c" strokeWidth={2} dot={{ fill: '#c9a84c' }} name="Neutros" />
          <Line type="monotone" dataKey="negativo" stroke="#ff4444" strokeWidth={2} dot={{ fill: '#ff4444' }} name="Negativos" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

const styles = {
  container: { backgroundColor: '#13131a', border: '1px solid #2a2a3a', borderRadius: '12px', padding: '24px' },
  titulo: { color: '#a0a0c0', fontSize: '16px', fontWeight: '600', margin: '0 0 16px 0' },
};