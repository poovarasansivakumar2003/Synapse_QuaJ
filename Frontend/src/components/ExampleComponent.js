import React, { useState, useEffect } from 'react';

const ExampleComponent = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Avoid infinite re-renders by ensuring dependencies are correct
    fetch('/api/data')
      .then((response) => response.json())
      .then((result) => setData(result));
  }, []); // Dependency array ensures this runs only once

  return <div>{data ? JSON.stringify(data) : 'Loading...'}</div>;
};

export default ExampleComponent;
