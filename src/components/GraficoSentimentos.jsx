import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CORES = {
  positivo: '#4caf8a',
  neutro: '#c9a84c',
  negativo: '#ff4444',
};

export default function GraficoSentimentos({ sentimentos }) {
  const dados = [
    { name: 'Positivos', value: sentimentos.positivo },
    { name: 'Neutros', value: sentimentos.neutro },
    { name: 'Negativos', value: sentimentos.negativo },
  ].filter((d) => d.value > 0);

  if (dados.length === 0) return null;

  return (
    <div style={styles.container}>
      <h3 style={styles.titulo}>Distribuição de Sentimentos</h3>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie data={dados} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
            {dados.map((entry) => (
              <Cell key={entry.name} fill={CORES[entry.name.toLowerCase().replace('s', '')] || '#6b8aff'} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ backgroundColor: '#13131a', border: '1px solid #2a2a3a', borderRadius: '8px', color: '#fff' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

const styles = {
  container: { backgroundColor: '#13131a', border: '1px solid #2a2a3a', borderRadius: '12px', padding: '24px' },
  titulo: { color: '#a0a0c0', fontSize: '16px', fontWeight: '600', margin: '0 0 16px 0' },
};