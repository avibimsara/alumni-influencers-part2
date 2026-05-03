import { useState, useEffect } from 'react'
import axios from 'axios';

function App() {
  const [health, setHealth] = useState(null);

  useEffect(() => {
    axios.get('/api/health')
      .then(response => setHealth(response.data))
      .catch(err => console.error('Health check failed:', err));
  }, []); 

  return (
    <div>
      <h1>Test</h1>
      <p>{JSON.stringify(health)}</p>
    </div>
  );
}

export default App
