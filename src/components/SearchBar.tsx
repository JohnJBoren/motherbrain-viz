import { useState } from 'react';
import styled from 'styled-components';
import QdrantService from '../services/qdrantService';

const SearchContainer = styled.div`
  position: absolute;
  top: 20px;
  left: 320px; /* Position next to sidebar */
  z-index: 100;
  width: 400px;
  background-color: #0f3460;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  padding: 10px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  background-color: #16213e;
  color: white;
  font-size: 16px;
  
  &:focus {
    outline: 2px solid #e94560;
  }
  
  &::placeholder {
    color: #8d99ae;
  }
`;

const ResultsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 10px 0 0 0;
  max-height: 300px;
  overflow-y: auto;
`;

const ResultItem = styled.li`
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 5px;
  background-color: #16213e;
  
  &:hover {
    background-color: #1a1a2e;
  }
`;

const ResultTitle = styled.div`
  font-weight: bold;
  color: #e94560;
  margin-bottom: 5px;
`;

const ResultCategory = styled.div`
  font-size: 12px;
  color: #8d99ae;
`;

const ResultScore = styled.div`
  font-size: 12px;
  color: #4ecdc4;
  margin-top: 5px;
`;

interface SearchResult {
  id: string;
  payload: {
    name: string;
    category: string;
    abstract?: string;
    [key: string]: any;
  };
  score?: number;
}

interface SearchBarProps {
  onResultClick: (nodeId: string) => void;
}

const SearchBar = ({ onResultClick }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const qdrantService = new QdrantService();
  
  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchQuery = e.target.value;
    setQuery(searchQuery);
    
    if (searchQuery.length < 3) {
      setResults([]);
      return;
    }
    
    setIsSearching(true);
    
    try {
      const searchResults = await qdrantService.search({
        query: searchQuery,
        limit: 5
      });
      
      setResults(searchResults);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setIsSearching(false);
    }
  };
  
  const handleResultClick = (result: SearchResult) => {
    onResultClick(result.id);
    setQuery('');
    setResults([]);
  };
  
  return (
    <SearchContainer>
      <SearchInput
        type="text"
        placeholder={isSearching ? "Searching..." : "Search papers..."}
        value={query}
        onChange={handleSearch}
      />
      
      {results.length > 0 && (
        <ResultsList>
          {results.map((result) => (
            <ResultItem 
              key={result.id} 
              onClick={() => handleResultClick(result)}
            >
              <ResultTitle>{result.payload.name}</ResultTitle>
              <ResultCategory>{result.payload.category}</ResultCategory>
              {result.score && <ResultScore>Relevance: {(result.score * 100).toFixed(1)}%</ResultScore>}
            </ResultItem>
          ))}
        </ResultsList>
      )}
    </SearchContainer>
  );
};

export default SearchBar;