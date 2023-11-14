// Logs.js
import React from 'react';

const Logs = ({ logs }) => (
  <div>
    <h3>Log messages</h3>
    <div>
      {logs.map((log, index) => (
        <p key={index}>{log}</p>
      ))}
    </div>
  </div>
);

export default Logs;
