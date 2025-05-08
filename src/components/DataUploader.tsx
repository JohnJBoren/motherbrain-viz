import { useState } from 'react';
import styled from 'styled-components';
import QdrantService from '../services/qdrantService';

const UploaderContainer = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 100;
`;

const UploadButton = styled.button`
  background-color: #0f3460;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 15px;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    background-color: #e94560;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: #0f3460;
  padding: 20px;
  border-radius: 8px;
  width: 600px;
  max-width: 90%;
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ModalTitle = styled.h2`
  color: white;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  
  &:hover {
    color: #e94560;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Label = styled.label`
  color: white;
  font-size: 14px;
`;

const Input = styled.input`
  padding: 10px;
  border: none;
  border-radius: 4px;
  background-color: #16213e;
  color: white;
  
  &:focus {
    outline: 2px solid #e94560;
  }
`;

const TextArea = styled.textarea`
  padding: 10px;
  border: none;
  border-radius: 4px;
  background-color: #16213e;
  color: white;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: 2px solid #e94560;
  }
`;

const Select = styled.select`
  padding: 10px;
  border: none;
  border-radius: 4px;
  background-color: #16213e;
  color: white;
  
  &:focus {
    outline: 2px solid #e94560;
  }
`;

const SubmitButton = styled.button`
  background-color: #e94560;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 12px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;
  
  &:hover {
    background-color: #c73e54;
  }
  
  &:disabled {
    background-color: #8d99ae;
    cursor: not-allowed;
  }
`;

const KeyFindingsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const KeyFindingItem = styled.div`
  display: flex;
  gap: 10px;
`;

const RemoveButton = styled.button`
  background-color: #e94560;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 12px;
  
  &:hover {
    background-color: #c73e54;
  }
`;

const AddButton = styled.button`
  background-color: #4ecdc4;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 12px;
  align-self: flex-start;
  
  &:hover {
    background-color: #3db9b0;
  }
`;

const Message = styled.div<{ type: 'success' | 'error' }>`
  padding: 10px;
  border-radius: 4px;
  margin-top: 10px;
  background-color: ${props => props.type === 'success' ? '#06d6a0' : '#e94560'};
  color: white;
`;

interface DataUploaderProps {
  onDataAdded: () => void;
}

const DataUploader = ({ onDataAdded }: DataUploaderProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    category: 'Foundation Models',
    abstract: '',
    keyFindings: [''],
    relatedPapers: '',
    val: 2
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  
  const categories = [
    'Foundation Models',
    'Reinforcement Learning',
    'Fine-Tuning',
    'Distillation',
    'AI Agents',
    'Generative AI',
    'Multimodal AI',
    'AI Ethics',
    'RAG',
    'Quantum ML',
    'Neuromorphic',
    'Embodied AI',
    'Federated Learning',
    'Domain-Specific'
  ];
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleKeyFindingChange = (index: number, value: string) => {
    const newKeyFindings = [...formData.keyFindings];
    newKeyFindings[index] = value;
    setFormData(prev => ({
      ...prev,
      keyFindings: newKeyFindings
    }));
  };
  
  const addKeyFinding = () => {
    setFormData(prev => ({
      ...prev,
      keyFindings: [...prev.keyFindings, '']
    }));
  };
  
  const removeKeyFinding = (index: number) => {
    const newKeyFindings = [...formData.keyFindings];
    newKeyFindings.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      keyFindings: newKeyFindings
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    
    try {
      const qdrantService = new QdrantService();
      
      // Format the data
      const paperData = {
        ...formData,
        relatedPapers: formData.relatedPapers.split(',').map(paper => paper.trim()).filter(Boolean)
      };
      
      // Add to Qdrant
      await qdrantService.addPaper(paperData);
      
      // Show success message
      setMessage({
        text: 'Paper added successfully to the knowledge graph!',
        type: 'success'
      });
      
      // Reset form
      setFormData({
        id: '',
        name: '',
        category: 'Foundation Models',
        abstract: '',
        keyFindings: [''],
        relatedPapers: '',
        val: 2
      });
      
      // Notify parent component
      onDataAdded();
    } catch (error) {
      console.error('Error adding paper:', error);
      setMessage({
        text: 'Failed to add paper. Please try again.',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <UploaderContainer>
      <UploadButton onClick={() => setIsModalOpen(true)}>
        Add New Paper
      </UploadButton>
      
      {isModalOpen && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Add New Research Paper</ModalTitle>
              <CloseButton onClick={() => setIsModalOpen(false)}>&times;</CloseButton>
            </ModalHeader>
            
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label htmlFor="id">Paper ID (e.g., arXiv ID)</Label>
                <Input
                  id="id"
                  name="id"
                  value={formData.id}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="name">Paper Title</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="category">Category</Label>
                <Select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </Select>
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="abstract">Abstract</Label>
                <TextArea
                  id="abstract"
                  name="abstract"
                  value={formData.abstract}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Key Findings</Label>
                <KeyFindingsList>
                  {formData.keyFindings.map((finding, index) => (
                    <KeyFindingItem key={index}>
                      <Input
                        value={finding}
                        onChange={(e) => handleKeyFindingChange(index, e.target.value)}
                        placeholder={`Key finding ${index + 1}`}
                        required
                      />
                      {formData.keyFindings.length > 1 && (
                        <RemoveButton 
                          type="button" 
                          onClick={() => removeKeyFinding(index)}
                        >
                          Remove
                        </RemoveButton>
                      )}
                    </KeyFindingItem>
                  ))}
                  <AddButton type="button" onClick={addKeyFinding}>
                    Add Key Finding
                  </AddButton>
                </KeyFindingsList>
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="relatedPapers">Related Papers (comma separated)</Label>
                <Input
                  id="relatedPapers"
                  name="relatedPapers"
                  value={formData.relatedPapers}
                  onChange={handleInputChange}
                  placeholder="e.g., BERT, GPT-3, AlphaGo"
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="val">Importance (1-3)</Label>
                <Input
                  id="val"
                  name="val"
                  type="number"
                  min="1"
                  max="3"
                  step="0.1"
                  value={formData.val}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
              
              <SubmitButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Adding Paper...' : 'Add to Knowledge Graph'}
              </SubmitButton>
              
              {message && (
                <Message type={message.type}>
                  {message.text}
                </Message>
              )}
            </Form>
          </ModalContent>
        </Modal>
      )}
    </UploaderContainer>
  );
};

export default DataUploader;