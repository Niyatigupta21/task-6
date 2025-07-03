import React, { useState, useCallback, memo } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onClear: () => void;
  placeholder?: string;
}

const SearchBar = memo<SearchBarProps>(({ onSearch, onClear, placeholder = "Search movies..." }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  }, [query, onSearch]);

  const handleClear = useCallback(() => {
    setQuery('');
    onClear();
  }, [onClear]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    // Debounced search - search as user types
    if (value.trim()) {
      const timeoutId = setTimeout(() => {
        onSearch(value.trim());
      }, 500);
      
      return () => clearTimeout(timeoutId);
    } else {
      onClear();
    }
  }, [onSearch, onClear]);

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder={placeholder}
            className="pl-12 pr-12 h-14 text-lg bg-search-bg border-border focus:border-primary focus:ring-primary rounded-xl"
          />
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>
      </form>
    </div>
  );
});

SearchBar.displayName = 'SearchBar';

export default SearchBar;