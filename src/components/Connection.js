//Connection.js
import React from 'react';

const Connection = ({ connected, loading, wsAddress, setWsAddress, connect, disconnect }) => (
  <div>
    <h3 className="connection-status">Connection status</h3>
    <p className={connected ? 'text-success' : 'text-danger'}>
      {connected ? 'Connected!' : 'Not connected!'}
    </p>
    <label>Websocket server address </label>
    <input type="text" value={wsAddress} onChange={(e) => setWsAddress(e.target.value)} />
    <button disabled={loading} onClick={disconnect} className="btn btn-danger connection-button">
      Disconnect!
    </button>
    <button disabled={loading} onClick={connect} className="btn btn-success connection-button">
      Connect!
    </button>
  </div>
);

export default Connection;