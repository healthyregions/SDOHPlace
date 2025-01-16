import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSearchAndRelatedResults } from '@/store/slices/searchSlice';
import { RootState, store } from "@/store";

const SpellCheckMessage = () => {
  const dispatch = useDispatch<typeof store.dispatch>();
  const {
    originalQuery,
    usedQuery,
    usedSpellCheck,
    filterQueries,
    schema,
    sortBy,
    sortOrder
  } = useSelector((state: RootState) => state.search);
  if (!usedSpellCheck) return null;
  const handleOriginalSearch = () => {
    // When searching with original term, explicitly bypass spell check
    dispatch(
      fetchSearchAndRelatedResults({
        query: originalQuery,
        filterQueries,
        schema,
        sortBy,
        sortOrder,
        bypassSpellCheck: true
      })
    );
  };

  return (
    <div className="bg-blue-50 rounded-md p-4 mb-4">
      <p className="text-sm text-blue-800">
        Showing results for <i>{usedQuery}</i>.{' '}
        <button
          onClick={handleOriginalSearch}
          className="ml-2 text-blue-600 hover:text-blue-800 underline"
        >
          Search instead for <i>{originalQuery}</i>
        </button>
      </p>
    </div>
  );
};

export default SpellCheckMessage;