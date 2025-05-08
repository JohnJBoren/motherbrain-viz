import styled from 'styled-components';

const SidebarContainer = styled.div`
  width: 300px;
  background-color: #0f3460;
  color: white;
  padding: 20px;
  overflow-y: auto;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.2);
`;

const Title = styled.h1`
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #e94560;
`;

const NodeInfo = styled.div`
  margin-bottom: 20px;
`;

const NodeTitle = styled.h2`
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: #e94560;
`;

const NodeCategory = styled.p`
  font-size: 0.9rem;
  color: #ccc;
  margin-bottom: 15px;
`;

const NodeDetails = styled.div`
  background-color: #16213e;
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 15px;
`;

const DetailTitle = styled.h3`
  font-size: 1rem;
  margin-bottom: 8px;
  color: #e94560;
`;

const DetailText = styled.p`
  font-size: 0.9rem;
  line-height: 1.4;
  margin-bottom: 10px;
`;

const RelatedPapers = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const RelatedPaper = styled.li`
  padding: 8px 0;
  border-bottom: 1px solid #16213e;
  font-size: 0.9rem;
  
  &:last-child {
    border-bottom: none;
  }
`;

const PaperLink = styled.a`
  color: #4ecdc4;
  text-decoration: none;
  display: block;
  margin-top: 10px;
  
  &:hover {
    text-decoration: underline;
    color: #e94560;
  }
`;

const ExternalLinkIcon = styled.span`
  margin-left: 5px;
  font-size: 0.8rem;
`;

interface SidebarProps {
  selectedNode: any;
}

const Sidebar = ({ selectedNode }: SidebarProps) => {
  // Function to generate paper URL based on ID
  const getPaperUrl = (id: string) => {
    // First check if the node has a direct URL
    if (selectedNode && selectedNode.url) {
      return selectedNode.url;
    }
    
    // Check if ID looks like an arXiv ID (e.g., 2501.11067)
    if (id && /^\d{4}\.\d{5}$/.test(id)) {
      return `https://arxiv.org/abs/${id}`;
    }
    
    // For other IDs, we could implement additional logic
    // For example, if it's a DOI, Nature paper, etc.
    return null;
  };
  
  return (
    <SidebarContainer>
      <Title>Motherbrain Knowledge Graph</Title>
      
      {selectedNode ? (
        <NodeInfo>
          <NodeTitle>{selectedNode.name}</NodeTitle>
          <NodeCategory>{selectedNode.category}</NodeCategory>
          
          {/* Paper Link */}
          {selectedNode.id && getPaperUrl(selectedNode.id) && (
            <PaperLink 
              href={getPaperUrl(selectedNode.id)} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              View Paper <ExternalLinkIcon>↗</ExternalLinkIcon>
            </PaperLink>
          )}
          
          {selectedNode.abstract && (
            <NodeDetails>
              <DetailTitle>Abstract</DetailTitle>
              <DetailText>{selectedNode.abstract}</DetailText>
            </NodeDetails>
          )}
          
          {selectedNode.keyFindings && (
            <NodeDetails>
              <DetailTitle>Key Findings</DetailTitle>
              <DetailText>
                {selectedNode.keyFindings.map((finding: string, index: number) => (
                  <p key={index}>• {finding}</p>
                ))}
              </DetailText>
            </NodeDetails>
          )}
          
          {selectedNode.relatedPapers && selectedNode.relatedPapers.length > 0 && (
            <NodeDetails>
              <DetailTitle>Related Papers</DetailTitle>
              <RelatedPapers>
                {selectedNode.relatedPapers.map((paper: string, index: number) => (
                  <RelatedPaper key={index}>{paper}</RelatedPaper>
                ))}
              </RelatedPapers>
            </NodeDetails>
          )}
        </NodeInfo>
      ) : (
        <DetailText>Select a node to view details</DetailText>
      )}
    </SidebarContainer>
  );
};

export default Sidebar;