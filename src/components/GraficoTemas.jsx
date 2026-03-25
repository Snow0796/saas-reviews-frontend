import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function GraficoTemas({ temas }) {
  if (!temas || temas.length === 0) return null;

  return (
    <div style={styles.container}>
      <h3 style={styles.titulo}>Temas mais citados</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={temas} layout="vertical" margin={{ left: 20 }}>
          <XAxis type="number" stroke="#6b6b8a" tick={{ fill: '#6b6b8a', fontSize: 12 }} />
          <YAxis type="category" dataKey="tema" stroke="#6b6b8a" tick={{ fill: '#a0a0c0', fontSize: 13 }} width={100} />
          <Tooltip
            contentStyle={{ backgroundColor: '#13131a', border: '1px solid #2a2a3a', borderRadius: '8px', color: '#fff' }}
            formatter={(value) => [`${value} feedbacks`, 'Quantidade']}
          />
          <Bar dataKey="quantidade" radius={[0, 6, 6, 0]}>
            {temas.map((_, index) => (
              <Cell key={index} fill={index === 0 ? '#c9a84c' : '#2a3a5a'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

const styles = {
  container: { backgroundColor: '#13131a', border: '1px solid #2a2a3a', borderRadius: '12px', padding: '24px' },
  titulo: { color: '#a0a0c0', fontSize: '16px', fontWeight: '600', margin: '0 0 16px 0' },
};