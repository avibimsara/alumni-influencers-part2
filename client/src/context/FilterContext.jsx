import { createContext, useContext, useState } from 'react';

const FilterContext = createContext(null);

export const FilterProvider = ({ children }) => {
  const [filters, setFilters] = useState({
    programme:      '',
    graduationYear: '',
    industrySector: ''
  });

  // Update a specific filter key with a new value
  const setFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Clear all filters back to empty
  const clearFilters = () => {
    setFilters({ programme: '', graduationYear: '', industrySector: '' });
  };

  return (
    <FilterContext.Provider value={{ filters, setFilter, clearFilters }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilters = () => useContext(FilterContext);