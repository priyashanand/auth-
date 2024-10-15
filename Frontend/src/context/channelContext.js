import React, { createContext, useState } from 'react';

// Create a context for channels
export const ChannelContext = createContext();

// ChannelProvider component to wrap around components that need channel data
export const ChannelProvider = ({ children }) => {
  const [channels, setChannels] = useState([]);  // Shared state for channels

  return (
    <ChannelContext.Provider value={{ channels, setChannels }}>
      {children}
    </ChannelContext.Provider>
  );
};
