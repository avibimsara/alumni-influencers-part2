import { useEffect, useState } from "react";
import { useFilters } from "../context/FilterContext.jsx";
import api from "../api/axios.js";

const FilterBar = () => {
  const { filters, setFilter, clearFilters } = useFilters();
  const [options, setOptions] = useState({
    programmes: [],
    graduationYears: [],
    industrySectors: [],
  });

  // Fetch distinct filter options from Part 1 via Part 2 proxy
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await api.get("/alumni");
        const alumni = res.data.alumni || res.data;

        // Extract distinct values from alumni data
        const programmes = [
          ...new Set(alumni.map((a) => a.field_of_study).filter(Boolean)),
        ].sort();

        const graduationYears = [
          ...new Set(
            alumni
              .flatMap((a) => (a.degrees || []).map((d) => d.graduation_year))
              .filter(Boolean),
          ),
        ].sort((a, b) => b - a); // newest first

        const industrySectors = [
          ...new Set(
            alumni
              .flatMap((a) => (a.employment || []).map((e) => e.industry))
              .filter(Boolean),
          ),
        ].sort();

        setOptions({ programmes, graduationYears, industrySectors });
      } catch (err) {
        console.error("Failed to load filter options:", err);
      }
    };

    fetchOptions();
  }, []);

  const hasActiveFilters =
    filters.programme || filters.graduationYear || filters.industrySector;

  return (
    <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 mb-6">
      {/* Stack vertically on mobile, row on larger screens */}
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col min-w-0 w-full sm:w-auto">
          <label className="text-xs text-gray-500 mb-1">Programme</label>
          <select
            value={filters.programme}
            onChange={(e) => setFilter("programme", e.target.value)}
            className="border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-36"
          >
            <option value="">All Programmes</option>
            {options.programmes.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col min-w-0 w-full sm:w-auto">
          <label className="text-xs text-gray-500 mb-1">Graduation Year</label>
          <select
            value={filters.graduationYear}
            onChange={(e) => setFilter("graduationYear", e.target.value)}
            className="border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-36"
          >
            <option value="">All Years</option>
            {options.graduationYears.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col min-w-0 w-full sm:w-auto">
          <label className="text-xs text-gray-500 mb-1">Industry Sector</label>
          <select
            value={filters.industrySector}
            onChange={(e) => setFilter("industrySector", e.target.value)}
            className="border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-36"
          >
            <option value="">All Sectors</option>
            {options.industrySectors.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Active badges */}
        <div className="flex flex-wrap gap-2">
          {filters.programme && (
            <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">
              {filters.programme}
              <button
                onClick={() => setFilter("programme", "")}
                className="hover:text-indigo-900"
              >
                ✕
              </button>
            </span>
          )}
          {filters.graduationYear && (
            <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">
              {filters.graduationYear}
              <button
                onClick={() => setFilter("graduationYear", "")}
                className="hover:text-indigo-900"
              >
                ✕
              </button>
            </span>
          )}
          {filters.industrySector && (
            <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">
              {filters.industrySector}
              <button
                onClick={() => setFilter("industrySector", "")}
                className="hover:text-indigo-900"
              >
                ✕
              </button>
            </span>
          )}
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-red-500 hover:text-red-700 font-medium w-full sm:w-auto text-left sm:ml-auto"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
