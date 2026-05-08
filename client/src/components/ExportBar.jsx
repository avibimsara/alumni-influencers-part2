import { useRef, useState } from 'react';
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useFilters } from '../context/FilterContext.jsx';

const ExportBar = ({ data, filename = 'export', chartRef = null }) => {
  const { filters, setFilter, clearFilters } = useFilters();
  const [presetName, setPresetName]           = useState('');
  const [showPresets, setShowPresets]         = useState(false);
  const anchorRef                             = useRef(null);

  // ── Get saved presets from localStorage ──────────────────────
  const getSavedPresets = () => {
    try {
      return JSON.parse(localStorage.getItem('filterPresets') || '{}');
    } catch {
      return {};
    }
  };
  const [presets, setPresets] = useState(getSavedPresets);

  // ── CSV Export ────────────────────────────────────────────────
  const handleCsvExport = () => {
    if (!data || data.length === 0) return alert('No data to export');

    const csv  = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);

    // Programmatically click hidden anchor
    const a    = anchorRef.current;
    a.href     = url;
    a.download = `${filename}.csv`;
    a.click();

    URL.revokeObjectURL(url); // clean up
  };

  // ── PDF Export ────────────────────────────────────────────────
  const handlePdfExport = () => {
    if (!data || data.length === 0) return alert('No data to export');

    const doc = new jsPDF();

    // Title
    doc.setFontSize(16);
    doc.setTextColor(79, 70, 229); // indigo
    doc.text('Alumni Platform Report', 14, 18);

    // Subtitle — current date
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 25);

    // Active filters summary
    const activeFilters = Object.entries(filters)
      .filter(([_, v]) => v !== '')
      .map(([k, v]) => `${k}: ${v}`)
      .join('  |  ');

    if (activeFilters) {
      doc.text(`Filters: ${activeFilters}`, 14, 31);
    }

    // Table — use first item's keys as headers
    const keys    = Object.keys(data[0]);
    const headers = keys.map(k => k.replace(/_/g, ' ').toUpperCase());
    const rows    = data.map(row => keys.map(k => row[k] ?? '—'));

    autoTable(doc, {
      head:       [headers],
      body:       rows,
      startY:     activeFilters ? 36 : 30,
      styles:     { fontSize: 8 },
      headStyles: { fillColor: [79, 70, 229] }, // indigo header
      alternateRowStyles: { fillColor: [245, 245, 255] }
    });

    doc.save(`${filename}.pdf`);
  };

  // ── Chart image download ───────────────────────────────────────
  const handleChartDownload = () => {
    if (!chartRef?.current) return alert('No chart reference provided');

    const svg       = chartRef.current.querySelector('svg');
    if (!svg) return alert('No chart found');

    const serialiser = new XMLSerializer();
    const svgStr     = serialiser.serializeToString(svg);
    const blob       = new Blob([svgStr], { type: 'image/svg+xml' });
    const url        = URL.createObjectURL(blob);

    const a    = anchorRef.current;
    a.href     = url;
    a.download = `${filename}-chart.svg`;
    a.click();

    URL.revokeObjectURL(url);
  };

  // ── Save filter preset ────────────────────────────────────────
  const handleSavePreset = () => {
    if (!presetName.trim()) return alert('Enter a preset name');

    const hasActiveFilter = Object.values(filters).some(v => v !== '');
    if (!hasActiveFilter) return alert('No active filters to save');

    const updated = { ...presets, [presetName.trim()]: { ...filters } };
    localStorage.setItem('filterPresets', JSON.stringify(updated));
    setPresets(updated);
    setPresetName('');
  };

  // ── Load filter preset ────────────────────────────────────────
  const handleLoadPreset = (name) => {
    const preset = presets[name];
    if (!preset) return;
    Object.entries(preset).forEach(([key, value]) => setFilter(key, value));
    setShowPresets(false);
  };

  // ── Delete preset ─────────────────────────────────────────────
  const handleDeletePreset = (name) => {
    const updated = { ...presets };
    delete updated[name];
    localStorage.setItem('filterPresets', JSON.stringify(updated));
    setPresets(updated);
  };

  const presetNames    = Object.keys(presets);
  const hasActiveFilter = Object.values(filters).some(v => v !== '');

  return (
    <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 mb-6">
      <div className="flex flex-wrap items-center gap-3">

        {/* ── Export buttons ── */}
        <span className="text-xs font-semibold text-gray-500 uppercase">Export</span>

        <button
          onClick={handleCsvExport}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-green-50 text-green-700 border border-green-200 rounded hover:bg-green-100 transition-colors"
        >
          📄 CSV
        </button>

        <button
          onClick={handlePdfExport}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-red-50 text-red-700 border border-red-200 rounded hover:bg-red-100 transition-colors"
        >
          📋 PDF
        </button>

        {chartRef && (
          <button
            onClick={handleChartDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded hover:bg-blue-100 transition-colors"
          >
            🖼 Chart SVG
          </button>
        )}

        <div className="h-4 w-px bg-gray-200 mx-1" />

        {/* ── Filter presets ── */}
        <span className="text-xs font-semibold text-gray-500 uppercase">Presets</span>

        {/* Save preset */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Preset name"
            value={presetName}
            onChange={e => setPresetName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSavePreset()}
            className="border border-gray-300 rounded px-2 py-1.5 text-xs w-28 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleSavePreset}
            disabled={!hasActiveFilter}
            className="px-3 py-1.5 text-xs bg-indigo-50 text-indigo-700 border border-indigo-200 rounded hover:bg-indigo-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Save
          </button>
        </div>

        {/* Load preset dropdown */}
        {presetNames.length > 0 && (
          <div className="relative">
            <button
              onClick={() => setShowPresets(p => !p)}
              className="flex items-center gap-1 px-3 py-1.5 text-xs border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              Load preset ▾
            </button>

            {showPresets && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-48">
                {presetNames.map(name => (
                  <div
                    key={name}
                    className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 group"
                  >
                    <button
                      onClick={() => handleLoadPreset(name)}
                      className="text-xs text-gray-700 flex-1 text-left"
                    >
                      {name}
                      <span className="text-gray-400 ml-2 text-xs">
                        {Object.entries(presets[name])
                          .filter(([_, v]) => v)
                          .map(([k, v]) => `${k}: ${v}`)
                          .join(', ')}
                      </span>
                    </button>
                    <button
                      onClick={() => handleDeletePreset(name)}
                      className="text-red-400 hover:text-red-600 ml-2 opacity-0 group-hover:opacity-100 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Hidden anchor for downloads */}
      <a ref={anchorRef} className="hidden" />
    </div>
  );
};

export default ExportBar;