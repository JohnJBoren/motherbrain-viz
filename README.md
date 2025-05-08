# Motherbrain Knowledge Graph Visualization

An interactive 3D visualization tool for exploring the Motherbrain AI Research Knowledge Graph.

## Features

- **Interactive 3D Graph**: Explore relationships between AI research papers across various categories
- **Search Functionality**: Find papers by title, category, or content
- **Paper Details**: View abstracts, key findings, and related papers
- **Qdrant Integration**: Vector database for semantic search capabilities
- **Add New Papers**: Contribute to the knowledge graph with new research papers
- **Responsive UI**: Smooth interaction with the knowledge graph

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Qdrant (optional, for full vector search functionality)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/JohnJBoren/motherbrain-viz.git
   cd motherbrain-viz
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update the variables as needed

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Technology Stack

- React 19 with TypeScript
- Vite for build tooling
- react-force-graph-3d for 3D network visualization
- Three.js for 3D rendering
- Styled-components for styling
- Axios for API requests
- Qdrant for vector database storage

## License

This project is licensed under the MIT License - see the LICENSE file for details.