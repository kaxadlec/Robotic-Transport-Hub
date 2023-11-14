import React, { useState, useEffect, useRef } from 'react';
import ROSLIB from 'roslib';
import { Viewer, Grid, OccupancyGridClient, Pose } from 'ros3d';
import * as ROS3D from 'ros3d';
import Connection from './components/Connection';
import Logs from './components/Logs';
import Commands from './components/Commands';
import './App.css';
import robotImage from './images/robot.png'; // 이미지 import
import * as THREE from 'three';


function App() {
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);
  const [wsAddress, setWsAddress] = useState('ws://192.168.43.132:9090');
  const [ros, setRos] = useState(null);
  const [topic, setTopicState] = useState(null);

  const addLog = (log) => {
    setLogs((prevLogs) => [log, ...prevLogs]);
  };

  const connect = () => {
    setLoading(true);
    const rosInstance = new ROSLIB.Ros({
      url: wsAddress,
    });

    rosInstance.on('connection', () => {
      addLog(`${new Date().toTimeString()} - Connected!`);
      initializeTopic();
      setConnected(true);
      setLoading(false);
    });

    rosInstance.on('error', (error) => {
      addLog(`${new Date().toTimeString()} - Error: ${error}`);
    });

    rosInstance.on('close', () => {
      addLog(`${new Date().toTimeString()} - Disconnected!`);
      setConnected(false);
      setLoading(false);
    });

    setRos(rosInstance);
  };

  const disconnect = () => {
    if (ros) {
      ros.close();
    }
  };

  const initializeTopic = () => {
    const topicInstance = new ROSLIB.Topic({
      ros: ros,
      name: '/cmd_vel',
      messageType: 'geometry_msgs/Twist',
    });
    setTopicState(topicInstance);
  };

  const move = (linear, angular) => {
    if (!topic) {
      console.log("Topic is not initialized yet.");
      return;
    }
    const message = new ROSLIB.Message({
      linear,
      angular,
    });

    topic.publish(message);
  };

  const forward = () => move({ x: 0.1, y: 0, z: 0 }, { x: 0, y: 0, z: 0 });
  const stop = () => move({ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 });
  const backward = () => move({ x: -1, y: 0, z: 0 }, { x: 0, y: 0, z: 0 });
  const turnLeft = () => move({ x: 0.5, y: 0, z: 0 }, { x: 0, y: 0, z: 0.5 });
  const turnRight = () => move({ x: 0.5, y: 0, z: 0 }, { x: 0, y: 0, z: -0.5 });

  const visualizationRef = useRef(null);
  const viewerRef = useRef(null);

  useEffect(() => {
    const ros = new ROSLIB.Ros({ url: 'ws://192.168.43.132:9090' });

    setTimeout(() => {
      if (!viewerRef.current) {
        viewerRef.current = new ROS3D.Viewer({
          divID: 'visualization',
          width: 800,
          height: 500,
          antialias: true,
        });
  
        const gridClient = new OccupancyGridClient({
          ros: ros,
          rootObject: viewerRef.current.scene,
          continuous: true,
          topic: '/map',
          color: {r:255, g:255, b:255, a:1.0},
        });
  
        let pose;
        if (!pose) {
          pose = new Pose({
            ros: ros,
            rootObject: viewerRef.current.scene,
            topic: '/odom',
            color: '#ff0000',
            scale: { x: 3, y: 3, z: 3 },
          });
        }
  
        viewerRef.current.start();
  
        return () => {
          if (pose) {
            pose.unsubscribe();
          }
          if (gridClient) {
            gridClient.unsubscribe();
          }
          if (ros && ros.isConnected) {
            ros.close();
          }
        };
      }
    }, 0);
  }, []);

  return (
    <div className="App">
      <div className="header">
      <img src={robotImage} className="header-image" alt="로봇" />
        <h2 className="title">Robotic transportation services</h2>
      </div>
      <div className="app-container">
        <div className="left-panel">
          <Connection
            connected={connected}
            loading={loading}
            wsAddress={wsAddress}
            setWsAddress={setWsAddress}
            connect={connect}
            disconnect={disconnect}
          />
          <Logs logs={logs} />
        </div>
        <Commands
          className="Commands"
          loading={loading}
          connected={connected}
          // forward={forward}
          // stop={stop}
          // backward={backward}
          // turnLeft={turnLeft}
          // turnRight={turnRight}
        />
      </div>
      <div ref={visualizationRef} id="visualization"></div>
    </div>
  );
}

export default App;
