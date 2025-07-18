import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from "@/store";
import { setAISearch, clearError } from '@/store/slices/searchSlice';
import { Alert, Button, Box } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import SearchIcon from '@mui/icons-material/Search';

const SearchErrorMessage = () => {
  const dispatch = useDispatch();
  const { hasError, errorMessage, errorType, aiSearch } = useSelector((state: RootState) => state.search);
  if (!hasError) return null;
  const handleSwitchToKeywordSearch = () => {
    dispatch(setAISearch(false));
    dispatch(clearError());
  };
  const handleDismissError = () => {
    dispatch(clearError());
  };
  const getErrorIcon = () => {
    switch (errorType) {
      case 'server':
        return <ErrorOutlineIcon className="text-red-500" />;
      case 'network':
        return <ErrorOutlineIcon className="text-orange-500" />;
      default:
        return <ErrorOutlineIcon className="text-red-500" />;
    }
  };
  const getErrorSeverity = () => {
    switch (errorType) {
      case 'network':
        return 'warning';
      case 'server':
        return 'error';
      default:
        return 'error';
    }
  };
  const getErrorTitle = () => {
    switch (errorType) {
      case 'server':
        return 'AI Search Service Unavailable';
      case 'network':
        return 'Connection Issue';
      default:
        return 'Search Error';
    }
  };
  return (
    <Alert 
      severity={getErrorSeverity()}
      icon={getErrorIcon()}
      className="mb-4"
      action={
        <Button 
          onClick={handleDismissError}
          size="small"
          color="inherit"
        >
          Dismiss
        </Button>
      }
    >
      <div className="flex flex-col space-y-3">
        <div>
          <strong>{getErrorTitle()}</strong>
          <div className="text-sm mt-1">
            {errorMessage}
          </div>
        </div>
        
        {aiSearch && (
          <Box className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outlined"
              size="small"
              startIcon={<SearchIcon />}
              onClick={handleSwitchToKeywordSearch}
              className="bg-white hover:bg-gray-50"
            >
              Try Keyword Search Instead
            </Button>
            <div className="text-xs text-gray-600 self-center">
              Keyword search lets you search for specific terms directly in our database
            </div>
          </Box>
        )}
        
        {!aiSearch && (
          <div className="text-sm text-gray-600">
            You can try rephrasing your search terms or check the filters you have applied.
          </div>
        )}
      </div>
    </Alert>
  );
};

export default SearchErrorMessage; 