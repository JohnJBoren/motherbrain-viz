import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import styled from 'styled-components'
import KnowledgeGraph from './components/KnowledgeGraph'
import Sidebar from './components/Sidebar'
import mockData from './data/mockData'
import QdrantService from './services/qdrantService'

const AppContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
`

const MainContent = styled.div`
  flex: 1;
  overflow: hidden;
`

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(26, 26, 46, 0.9);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  color: white;
  font-size: 24px;
`

const Spinner = styled.div`
  border: 5px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 5px solid #e94560;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`

function App() {
  const [selectedNode, setSelectedNode] = useState(null);
  const [graphData, setGraphData] = useState(mockData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const initializeQdrant = async () => {
      const qdrantService = new QdrantService();
      
      try {
        setLoading(true);
        
        // Ensure the collection exists
        await qdrantService.ensureCollection();
        
        // Check if we need to populate the collection with initial data
        const testSearch = await qdrantService.search({ query: "test", limit: 1 });
        
        if (testSearch.length === 0) {
          console.log("Populating Qdrant with initial data...");
          
          // Add each paper from mockData to Qdrant
          for (const node of mockData.nodes) {
            await qdrantService.addPaper({
              id: node.id,
              name: node.name,
              category: node.category,
              abstract: node.abstract,
              keyFindings: node.keyFindings,
              relatedPapers: node.relatedPapers,
              val: node.val
            });
          }
          
          console.log("Initial data population complete");
        } else {
          console.log("Qdrant collection already contains data");
        }
      } catch (err) {
        console.error("Error initializing Qdrant:", err);
        setError("Failed to initialize Qdrant database. Using mock data instead.");
      } finally {
        setLoading(false);
      }
    };
    
    initializeQdrant();
  }, []);
  
  const handleNodeClick = (node) => {
    setSelectedNode(node);
  };
  
  return (
    <Router>
      <AppContainer>
        {loading && (
          <LoadingOverlay>
            <Spinner />
            <div>Initializing Knowledge Graph...</div>
          </LoadingOverlay>
        )}
        
        {error && (
          <div style={{ 
            position: 'fixed', 
            top: '10px', 
            right: '10px', 
            background: '#e94560', 
            color: 'white',
            padding: '10px',
            borderRadius: '5px',
            zIndex: 1000
          }}>
            {error}
          </div>
        )}
        
        <Sidebar selectedNode={selectedNode} />
        <MainContent>
          <Routes>
            <Route path="/" element={<KnowledgeGraph 
              data={graphData} 
              onNodeClick={handleNodeClick} 
            />} />
          </Routes>
        </MainContent>
      </AppContainer>
    </Router>
  )
}

export default App