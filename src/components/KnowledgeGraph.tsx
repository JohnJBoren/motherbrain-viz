import { useRef, useEffect, useState } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import styled from 'styled-components';
import * as THREE from 'three';
import SearchBar from './SearchBar';
import DataUploader from './DataUploader';

const GraphContainer = styled.div`
  width: 100%;
  height: 100vh;
  background-color: #1a1a2e;
  position: relative;
`;

const Controls = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  gap: 10px;
  z-index: 100;
`;

const ControlButton = styled.button`
  background-color: #0f3460;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    background-color: #e94560;
  }
`;

interface Node {
  id: string;
  name: string;
  category: string;
  val?: number;
  color?: string;
  x?: number;
  y?: number;
  z?: number;
}

interface Link {
  source: string;
  target: string;
  type: string;
}

interface GraphData {
  nodes: Node[];
  links: Link[];
}

interface KnowledgeGraphProps {
  data: GraphData;
  onNodeClick: (node: any) => void;
}

const categoryColors = {
  'Foundation Models': '#ff6b6b',
  'Reinforcement Learning': '#4ecdc4',
  'Fine-Tuning': '#ffd166',
  'Distillation': '#06d6a0',
  'AI Agents': '#118ab2',
  'Generative AI': '#9b5de5',
  'Multimodal AI': '#f15bb5',
  'AI Ethics': '#00bbf9',
  'RAG': '#00f5d4',
  'Quantum ML': '#fee440',
  'Neuromorphic': '#8338ec',
  'Embodied AI': '#fb5607',
  'Federated Learning': '#3a86ff',
  'Domain-Specific': '#8ac926'
};

const KnowledgeGraph = ({ data, onNodeClick }: KnowledgeGraphProps) => {
  const graphRef = useRef<any>();
  const [highlightNodes, setHighlightNodes] = useState<Set<string>>(new Set());
  const [highlightLinks, setHighlightLinks] = useState<Set<string>>(new Set());
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [graphData, setGraphData] = useState<GraphData>(data);

  useEffect(() => {
    setGraphData(data);
  }, [data]);

  useEffect(() => {
    // Wait for the component to fully initialize
    setTimeout(() => {
      if (graphRef.current) {
        try {
          // Custom node rendering with color based on category
          graphRef.current.nodeThreeObject((node: Node) => {
            const color = categoryColors[node.category as keyof typeof categoryColors] || '#ffffff';
            const isHighlighted = highlightNodes.has(node.id);
            const isSelected = selectedNode?.id === node.id;
            
            const sprite = new THREE.Sprite(
              new THREE.SpriteMaterial({ 
                map: new THREE.TextureLoader().load('/brain.svg'),
                color: isHighlighted || isSelected ? '#ffffff' : color,
                opacity: isHighlighted || isSelected ? 1 : 0.8
              })
            );
            
            // Make selected or highlighted nodes larger
            const scale = isSelected ? 15 : (isHighlighted ? 12 : 10);
            sprite.scale.set(scale, scale, 1);
            
            return sprite;
          });
          
          // Set node size based on importance
          if (typeof graphRef.current.nodeVal === 'function') {
            graphRef.current.nodeVal((node: Node) => {
              return node.val || 1;
            });
          }
          
          // Custom link rendering
          graphRef.current.linkColor((link: Link) => {
            const linkId = `${link.source}-${link.target}`;
            return highlightLinks.has(linkId) ? '#e94560' : '#ffffff';
          });
          
          // Set link width based on highlight
          graphRef.current.linkWidth((link: Link) => {
            const linkId = `${link.source}-${link.target}`;
            return highlightLinks.has(linkId) ? 2 : 0.5;
          });
        } catch (error) {
          console.error("Error configuring graph:", error);
        }
      }
    }, 100);
  }, [graphData, highlightNodes, highlightLinks, selectedNode]);

  const handleNodeClick = (node: Node) => {
    // Clear previous highlights
    setHighlightNodes(new Set());
    setHighlightLinks(new Set());
    setSelectedNode(node);
    
    // Set this node as selected
    const newHighlightNodes = new Set<string>();
    const newHighlightLinks = new Set<string>();
    
    // Add the clicked node
    newHighlightNodes.add(node.id);
    
    // Find all connected nodes and links
    graphData.links.forEach(link => {
      const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
      const targetId = typeof link.target === 'object' ? link.target.id : link.target;
      
      if (sourceId === node.id) {
        newHighlightNodes.add(targetId);
        newHighlightLinks.add(`${sourceId}-${targetId}`);
      } else if (targetId === node.id) {
        newHighlightNodes.add(sourceId);
        newHighlightLinks.add(`${sourceId}-${targetId}`);
      }
    });
    
    setHighlightNodes(newHighlightNodes);
    setHighlightLinks(newHighlightLinks);
    
    // Call the parent's onNodeClick handler
    onNodeClick(node);
  };

  const handleSearchResultClick = (nodeId: string) => {
    const node = graphData.nodes.find(n => n.id === nodeId);
    if (node) {
      // Focus camera on the node
      graphRef.current.centerAt(node.x, node.y, node.z, 1000);
      graphRef.current.zoom(1.5, 1000);
      
      // Select the node
      handleNodeClick(node);
    }
  };

  const resetView = () => {
    if (graphRef.current) {
      graphRef.current.zoomToFit(1000);
      setHighlightNodes(new Set());
      setHighlightLinks(new Set());
      setSelectedNode(null);
    }
  };

  const toggleDimensions = () => {
    if (graphRef.current) {
      const is3D = graphRef.current.numDimensions() === 3;
      graphRef.current.numDimensions(is3D ? 2 : 3);
    }
  };

  const handleDataAdded = () => {
    // Refresh the graph data
    // In a real implementation, you would fetch the updated data from Qdrant
    // For now, we'll just reset the view
    resetView();
  };

  return (
    <GraphContainer>
      <SearchBar onResultClick={handleSearchResultClick} />
      <DataUploader onDataAdded={handleDataAdded} />
      
      <ForceGraph3D
        ref={graphRef}
        graphData={graphData}
        nodeLabel={(node: Node) => `${node.name} (${node.category})`}
        linkLabel={(link: Link) => link.type}
        onNodeClick={handleNodeClick}
        linkDirectionalParticles={2}
        linkDirectionalParticleWidth={1.5}
        backgroundColor="#1a1a2e"
        cooldownTicks={100}
        linkDirectionalArrowLength={3.5}
        linkDirectionalArrowRelPos={1}
      />
      
      <Controls>
        <ControlButton onClick={resetView}>Reset View</ControlButton>
        <ControlButton onClick={toggleDimensions}>Toggle 2D/3D</ControlButton>
      </Controls>
    </GraphContainer>
  );
};

export default KnowledgeGraph;