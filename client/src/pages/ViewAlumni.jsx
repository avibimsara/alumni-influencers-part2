import React, { useState } from "react";
import FilterBar from "../components/FilterBar.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import { useFilters } from "../context/FilterContext.jsx";
import useAnalytics from "../hooks/useAnalytics.js";
import ExportBar from "../components/ExportBar.jsx";

// ── Expanded row — full profile ────────────────────────────────
const AlumniDetail = ({ alumni }) => (
  <div className="bg-indigo-50 border-t border-indigo-100 px-6 py-4">
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
      {/* Certifications */}
      <div>
        <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">
          Certifications
        </h4>
        {alumni.certifications?.length ? (
          <ul className="space-y-1">
            {alumni.certifications.map((c, i) => (
              <li
                key={i}
                className="text-sm text-gray-700 flex items-start gap-1"
              >
                <span className="text-indigo-400 mt-0.5">•</span>
                <span>
                  {c.name}
                  {c.completion_date && (
                    <span className="text-gray-400 text-xs ml-1">
                      ({new Date(c.completion_date).getFullYear()})
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-400">None recorded</p>
        )}
      </div>

      {/* Employment history */}
      <div>
        <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">
          Employment History
        </h4>
        {alumni.employment?.length ? (
          <ul className="space-y-2">
            {alumni.employment.map((e, i) => (
              <li key={i} className="text-sm text-gray-700">
                <p className="font-medium">{e.job_title}</p>
                <p className="text-gray-500 text-xs">{e.company}</p>
                <p className="text-gray-400 text-xs">
                  {e.start_date?.slice(0, 7)} →{" "}
                  {e.end_date ? e.end_date.slice(0, 7) : "Present"}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-400">None recorded</p>
        )}
      </div>

      {/* Degrees */}
      <div>
        <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">
          Degrees
        </h4>
        {alumni.degrees?.length ? (
          <ul className="space-y-2">
            {alumni.degrees.map((d, i) => (
              <li key={i} className="text-sm text-gray-700">
                <p className="font-medium">
                  {d.degree_type} in {d.field_of_study}
                </p>
                <p className="text-gray-500 text-xs">
                  {d.institution} · {d.graduation_year}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-400">None recorded</p>
        )}
      </div>
    </div>
  </div>
);

// ── Main page ──────────────────────────────────────────────────
const PAGE_SIZES = [10, 25, 50];

const ViewAlumni = () => {
  const { filters } = useFilters();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [expandedId, setExpandedId] = useState(null);

  const { data, loading, error, retry } = useAnalytics("/alumni", {
    ...filters,
    page,
    limit: pageSize,
  });

  const alumni = data?.alumni || data || [];
  const total = data?.total || alumni.length;
  const totalPages = Math.ceil(total / pageSize);
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  const toggleExpand = (id) =>
    setExpandedId((prev) => (prev === id ? null : id));
  const handlePageSize = (size) => {
    setPageSize(size);
    setPage(1);
  };

  return (
    <div>
      <div className="mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">
          View Alumni
        </h2>
        <p className="text-xs md:text-sm text-gray-500 mt-1">
          Browse and search alumni profiles
        </p>
      </div>

      <FilterBar />
      
      {/* Export and presets bar */}
      <ExportBar
        data={alumni.map((a) => ({
          name: `${a.first_name} ${a.last_name}`,
          graduation_year: a.degrees?.[0]?.graduation_year ?? "",
          programme: a.field_of_study ?? a.degrees?.[0]?.field_of_study ?? "",
          job_title: a.employment?.[0]?.job_title ?? "",
          employer: a.employment?.[0]?.company ?? "",
          is_current: a.employment?.[0]?.is_current ? "Yes" : "No",
        }))}
        filename="alumni-list"
      />

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <LoadingSpinner message="Fetching alumni..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={retry} />
        ) : alumni.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">🎓</p>
            <p>No alumni match your filters</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {[
                      "Name",
                      "Grad Year",
                      "Programme",
                      "Job Title",
                      "Employer",
                      "Current",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {alumni.map((a) => (
                    // ← React.Fragment with key fixes the warning
                    <React.Fragment key={a.id}>
                      <tr
                        onClick={() => toggleExpand(a.id)}
                        className={`border-b border-gray-100 cursor-pointer transition-colors ${
                          expandedId === a.id
                            ? "bg-indigo-50"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <td className="py-3 px-4 font-medium text-gray-900">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs transition-transform ${
                                expandedId === a.id ? "rotate-90" : ""
                              }`}
                            >
                              ▶
                            </span>
                            {a.first_name} {a.last_name}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-500">
                          {a.degrees?.[0]?.graduation_year ?? "—"}
                        </td>
                        <td className="py-3 px-4 text-gray-500">
                          {a.field_of_study ??
                            a.degrees?.[0]?.field_of_study ??
                            "—"}
                        </td>
                        <td className="py-3 px-4 text-gray-500">
                          {a.employment?.[0]?.job_title ?? "—"}
                        </td>
                        <td className="py-3 px-4 text-gray-500">
                          {a.employment?.[0]?.company ?? "—"}
                        </td>
                        <td className="py-3 px-4">
                          {a.employment?.[0]?.is_current ? (
                            <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs">
                              Current
                            </span>
                          ) : (
                            <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full text-xs">
                              Past
                            </span>
                          )}
                        </td>
                      </tr>

                      {/* Expanded detail row */}
                      {expandedId === a.id && (
                        <tr>
                          <td colSpan={6} className="p-0">
                            <AlumniDetail alumni={a} />
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ── Pagination ── */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
              <p className="text-sm text-gray-500">
                Showing <span className="font-medium">{from}</span>–
                <span className="font-medium">{to}</span> of{" "}
                <span className="font-medium">{total}</span> results
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-xs text-gray-500">Per page</label>
                  <select
                    value={pageSize}
                    onChange={(e) => handlePageSize(Number(e.target.value))}
                    className="border border-gray-300 rounded px-2 py-1 text-xs"
                  >
                    {PAGE_SIZES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    ← Prev
                  </button>
                  <span className="text-xs text-gray-500">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Next →
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ViewAlumni;
