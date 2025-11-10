import { useEffect, useState } from 'react';

const TestBackend = () => {
  const [result, setResult] = useState('');

  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log('🧪 Testing backend connection...');
        const response = await fetch('http://localhost:5001/api/admin/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'ayarirayen539@gmail.com',
            password: 'admin123'
          }),
        });
        
        console.log('📊 Response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          setResult(`✅ Success: ${JSON.stringify(data, null, 2)}`);
        } else {
          const errorText = await response.text();
          setResult(`❌ Error ${response.status}: ${errorText}`);
        }
      } catch (error) {
        console.error('💥 Connection error:', error);
        setResult(`💥 Connection error: ${error.message}`);
      }
    };

    testConnection();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Backend Connection</h1>
      <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap">
        {result || 'Testing...'}
      </pre>
    </div>
  );
};

export default TestBackend;