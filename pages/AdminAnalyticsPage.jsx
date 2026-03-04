import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

// ─── Reusable SVG Chart Components ───────────────────────────────────────────

const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#3b82f6', '#ec4899', '#8b5cf6', '#14b8a6'];

// Donut chart using SVG stroke-dasharray
const DonutChart = ({ data, size = 160 }) => {
    const total = data.reduce((s, d) => s + d.value, 0);
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    let offset = 0;

    if (total === 0) return (
        <div className="flex items-center justify-center" style={{ width: size, height: size }}>
            <span className="text-gray-400 text-sm">No data</span>
        </div>
    );

    const slices = data.map((d, i) => {
        const pct = d.value / total;
        const dashLen = pct * circumference;
        const slice = { ...d, dashLen, dashOffset: -offset, color: COLORS[i % COLORS.length] };
        offset += dashLen;
        return slice;
    });

    return (
        <svg width={size} height={size} viewBox="-60 -60 120 120">
            {slices.map((s, i) => (
                <circle
                    key={i}
                    r={radius}
                    cx={0}
                    cy={0}
                    fill="none"
                    stroke={s.color}
                    strokeWidth={22}
                    strokeDasharray={`${s.dashLen} ${circumference - s.dashLen}`}
                    strokeDashoffset={s.dashOffset}
                    style={{ transition: 'stroke-dasharray 0.5s ease' }}
                />
            ))}
            <text x={0} y={6} textAnchor="middle" fontSize={14} fontWeight="bold" fill="#374151">
                {total}
            </text>
        </svg>
    );
};

// Horizontal / vertical bar chart
const BarChart = ({ data, color = '#6366f1', horizontal = false }) => {
    const max = Math.max(...data.map(d => d.value), 1);
    if (horizontal) {
        return (
            <div className="space-y-3">
                {data.map((d, i) => (
                    <div key={i}>
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                            <span className="truncate max-w-[200px]">{d.label}</span>
                            <span className="font-semibold ml-2">{d.value}</span>
                        </div>
                        <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full transition-all duration-700"
                                style={{ width: `${(d.value / max) * 100}%`, background: COLORS[i % COLORS.length] }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        );
    }
    return (
        <div className="flex items-end gap-2 h-36 px-2">
            {data.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-xs font-semibold text-gray-600">{d.value}</span>
                    <div
                        className="w-full rounded-t-md transition-all duration-700"
                        style={{ height: `${(d.value / max) * 112}px`, background: color }}
                    />
                    <span className="text-[10px] text-gray-500 text-center leading-tight">{d.label}</span>
                </div>
            ))}
        </div>
    );
};

// Legend pills
const Legend = ({ data }) => (
    <div className="flex flex-wrap gap-2 mt-3">
        {data.map((d, i) => (
            <span key={i} className="flex items-center gap-1 text-xs text-gray-600">
                <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: COLORS[i % COLORS.length] }} />
                {d.label || d._id} <span className="font-semibold text-gray-800">({d.value ?? d.count})</span>
            </span>
        ))}
    </div>
);

// Stat card
const ChartCard = ({ title, children, className = '' }) => (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-5 ${className}`}>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">{title}</h3>
        {children}
    </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

const AdminAnalyticsPage = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const token = sessionStorage.getItem('token');
                const res = await fetch('/api/admin/analytics', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const json = await res.json();
                if (!res.ok) throw new Error(json.message || 'Failed to load analytics');
                setData(json);
            } catch (err) {
                toast.error(err.message || 'Error loading analytics');
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent" />
                    <p className="text-gray-500 text-sm">Loading analytics…</p>
                </div>
            </div>
        );
    }

    if (!data) return null;

    const { categoryBreakdown, stockDistribution, priceDistribution, roleBreakdown, registrationTrend, topRated } = data;

    // Normalise categoryBreakdown for Legend / DonutChart
    const categoryData = categoryBreakdown.map(c => ({ label: c._id, value: c.count }));

    // Summary KPIs
    const totalProducts = categoryData.reduce((s, c) => s + c.value, 0);
    const totalUsers = roleBreakdown.reduce((s, r) => s + r.value, 0);
    const totalInStock = stockDistribution.find(s => s.label === 'In Stock')?.value ?? 0;
    const totalOutOfStock = stockDistribution.find(s => s.label === 'Out of Stock')?.value ?? 0;

    const kpis = [
        { label: 'Total Products', value: totalProducts, bg: 'from-indigo-500 to-indigo-600', icon: '📦' },
        { label: 'Total Users', value: totalUsers, bg: 'from-emerald-500 to-emerald-600', icon: '👥' },
        { label: 'In Stock', value: totalInStock, bg: 'from-blue-500 to-blue-600', icon: '✅' },
        { label: 'Out of Stock', value: totalOutOfStock, bg: 'from-rose-500 to-rose-600', icon: '⚠️' },
    ];

    return (
        <div>
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Analytics</h1>
                <p className="text-gray-500 text-sm mt-1">Real-time insights from your store data</p>
            </div>

            {/* KPI cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {kpis.map((k) => (
                    <div key={k.label} className={`bg-gradient-to-br ${k.bg} text-white rounded-2xl p-5 shadow`}>
                        <div className="text-2xl mb-2">{k.icon}</div>
                        <p className="text-3xl font-bold">{k.value}</p>
                        <p className="text-sm opacity-90 mt-1">{k.label}</p>
                    </div>
                ))}
            </div>

            {/* Charts grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

                {/* 1. Product Categories Donut */}
                <ChartCard title="Products by Category">
                    <div className="flex items-center gap-4">
                        <DonutChart data={categoryData} size={140} />
                        <Legend data={categoryData} />
                    </div>
                </ChartCard>

                {/* 2. Stock Distribution Bar */}
                <ChartCard title="Stock Distribution">
                    <BarChart
                        data={stockDistribution}
                        color="#10b981"
                    />
                </ChartCard>

                {/* 3. Price Range Bar */}
                <ChartCard title="Price Range Distribution">
                    <BarChart
                        data={priceDistribution}
                        color="#6366f1"
                    />
                </ChartCard>

                {/* 4. User Role Donut */}
                <ChartCard title="Users by Role">
                    <div className="flex items-center gap-4">
                        <DonutChart data={roleBreakdown} size={140} />
                        <Legend data={roleBreakdown} />
                    </div>
                </ChartCard>

                {/* 5. Monthly Registrations */}
                <ChartCard title="New Users — Last 6 Months">
                    <BarChart
                        data={registrationTrend}
                        color="#f59e0b"
                    />
                </ChartCard>

                {/* 6. Top Rated Products */}
                <ChartCard title="Top 5 Rated Products">
                    {topRated.length === 0 ? (
                        <p className="text-gray-400 text-sm text-center py-8">No products yet</p>
                    ) : (
                        <BarChart
                            data={topRated.map(p => ({ label: p.name.slice(0, 18) + (p.name.length > 18 ? '…' : ''), value: Number(p.rating.toFixed(1)) }))}
                            horizontal={true}
                        />
                    )}
                </ChartCard>

            </div>

            {/* Category detail table */}
            <ChartCard title="Category Breakdown (Detail)" className="mt-5">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left py-2 text-gray-500 font-medium">Category</th>
                                <th className="text-right py-2 text-gray-500 font-medium">Products</th>
                                <th className="text-right py-2 text-gray-500 font-medium">Share</th>
                                <th className="py-2 px-4"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {categoryData.map((c, i) => (
                                <tr key={c.label} className="border-b border-gray-50">
                                    <td className="py-2 flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                                        <span className="font-medium text-gray-700 capitalize">{c.label}</span>
                                    </td>
                                    <td className="py-2 text-right font-semibold text-gray-800">{c.value}</td>
                                    <td className="py-2 text-right text-gray-500">
                                        {totalProducts > 0 ? ((c.value / totalProducts) * 100).toFixed(1) : 0}%
                                    </td>
                                    <td className="py-2 px-4 w-32">
                                        <div className="h-2 bg-gray-100 rounded-full">
                                            <div
                                                className="h-full rounded-full"
                                                style={{ width: `${(c.value / totalProducts) * 100}%`, background: COLORS[i % COLORS.length] }}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </ChartCard>
        </div>
    );
};

export default AdminAnalyticsPage;
