import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import useAnalytics from '../hooks/useAnalytics.js';
import {
  BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer
} from 'recharts';


// ── Stat card ──────────────────────────────────────────────────
const StatCard = ({ label, value, icon, color }) => (
  <div className={`bg-white rounded-lg border border-gray-200 p-5 shadow-sm`}>
    <div className="flex items-center justify-between mb-3">
      <span className="text-sm text-gray-500">{label}</span>
      <span className={`text-2xl`}>{icon}</span>
    </div>
    <p className={`text-3xl font-bold ${color}`}>
      {value ?? '—'}
    </p>
  </div>
);

// ── Mini chart card ────────────────────────────────────────────
const MiniChartCard = ({ title, onClick, children }) => (
  <div
    onClick={onClick}
    className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
  >
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
      <span className="text-xs text-indigo-600 hover:underline">View full →</span>
    </div>
    {children}
  </div>
);

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

// ── Dashboard ──────────────────────────────────────────────────
const Dashboard = () => {
  const { user }   = useAuth();
  const navigate   = useNavigate();

  const { data: summary, loading: summaryLoading } =
    useAnalytics('/analytics/summary');

  const { data: byField, loading: fieldLoading } =
    useAnalytics('/analytics/alumni-by-field');

  const { data: byYear, loading: yearLoading } =
    useAnalytics('/analytics/alumni-by-year');

  const { data: employers, loading: employersLoading } =
    useAnalytics('/analytics/top-employers');

  // ── Derived stats ──────────────────────────────────────────
  const distinctProgrammes = byField?.length ?? '—';

  const topSector = byField?.length
    ? byField.reduce((a, b) => a.count > b.count ? a : b)?.field ?? '—'
    : '—';

  const topEmployer = employers?.length
    ? employers[0]?.company ?? '—'
    : '—';

  return (
    <div>
      {/* ── Header ── */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-500 text-sm mt-1">Welcome back, {user?.email}</p>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 gap-3 mb-6 md:gap-4 md:mb-8 lg:grid-cols-4">
        <StatCard
          label="Total Alumni"
          value={summaryLoading ? '...' : summary?.total_alumni}
          icon="🎓"
          color="text-indigo-600"
        />
        <StatCard
          label="Programmes"
          value={fieldLoading ? '...' : distinctProgrammes}
          icon="📚"
          color="text-purple-600"
        />
        <StatCard
          label="Top Employer"
          value={employersLoading ? '...' : topEmployer}
          icon="🏢"
          color="text-pink-600"
        />
        <StatCard
          label="Top Sector"
          value={fieldLoading ? '...' : topSector}
          icon="📊"
          color="text-amber-600"
        />
      </div>

      {/* ── Mini charts ── */}
      <div className="grid grid-cols-1 gap-4 md:gap-6 md:grid-cols-3">

        {/* Alumni by field pie */}
        <MiniChartCard
          title="Alumni by Field"
          onClick={() => navigate('/dashboard/trends')}
        >
          {fieldLoading ? (
            <p className="text-gray-400 text-sm text-center py-4">Loading...</p>
          ) : (
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={byField}
                  dataKey="count"
                  nameKey="field"
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                >
                  {byField?.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v, n) => [v, n]} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </MiniChartCard>

        {/* Alumni by year line */}
        <MiniChartCard
          title="Graduates per Year"
          onClick={() => navigate('/dashboard/trends')}
        >
          {yearLoading ? (
            <p className="text-gray-400 text-sm text-center py-4">Loading...</p>
          ) : (
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={byYear}>
                <XAxis dataKey="year" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </MiniChartCard>

        {/* Top employers bar */}
        <MiniChartCard
          title="Top Employers"
          onClick={() => navigate('/dashboard/trends')}
        >
          {employersLoading ? (
            <p className="text-gray-400 text-sm text-center py-4">Loading...</p>
          ) : (
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={employers?.slice(0, 5)} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis
                  type="category"
                  dataKey="company"
                  tick={{ fontSize: 9 }}
                  width={70}
                />
                <Tooltip />
                <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </MiniChartCard>

      </div>
    </div>
  );
};
export default Dashboard;