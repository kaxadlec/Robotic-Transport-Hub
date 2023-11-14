// Commands.js
import React from 'react';
import './Commands.css';

const Commands = ({ loading, connected, forward, stop, backward, turnLeft, turnRight }) => (
  <div className="Commands">
    <h5>Commands</h5>
    <div className="controls">
      <button onClick={forward} disabled={loading || !connected} className="btn btn-primary">
        Go forward
      </button>
      <div className="horizontal-controls">
        <button onClick={turnLeft} disabled={loading || !connected} className="btn btn-primary">
          Turn left
        </button>
        <button onClick={stop} disabled={loading || !connected} className="btn btn-danger">
          Stop
        </button>
        <button onClick={turnRight} disabled={loading || !connected} className="btn btn-primary">
          Turn right
        </button>
      </div>
      <button onClick={backward} disabled={loading || !connected} className="btn btn-primary">
        Go backward
      </button>
    </div>
  </div>
);

export default Commands;