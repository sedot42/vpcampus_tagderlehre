import React, { useRef, useEffect, useState } from "react";
import { DataSet, Network } from "vis-network/standalone";
import "vis-network/styles/vis-network.css";

export const Graph = ({ data, startNodeId, depth, onNodeClick }) => {
  const containerRef = useRef(null);
  const [networkData, setNetworkData] = useState({ nodes: [], edges: [] });

  const generateGraphData = (data, startId, maxDepth) => {
    const nodes = [];
    const edges = [];
    const visited = new Set();
    const nodeQueue = [{ id: startId, level: 0 }];
    const nodesById = new Map();

    while (nodeQueue.length > 0) {
      const { id, level } = nodeQueue.shift();

      if (level > maxDepth) continue;
      if (visited.has(id)) continue;

      const node = data.find((n) => n.id === id);
      if (node) {
        nodesById.set(id, node);
        nodes.push({ id: node.id, label: node.anchor_name });
        visited.add(id);

        (node.anchor_ref || []).forEach((refId) => {
          if (!visited.has(refId)) {
            edges.push({ from: id, to: refId });
            nodeQueue.push({ id: refId, level: level + 1 });
          }
        });
      }
    }

    // Collect data to ensure only nodes within the desired depth are included
    const filteredNodes = nodes.filter((node) => {
      const nodeLevel = nodeQueue.find((item) => item.id === node.id)?.level ?? 0;
      return nodeLevel <= maxDepth;
    });

    setNetworkData({ nodes: filteredNodes, edges });
  };

  useEffect(() => {
    if (data.length) {
      if (startNodeId) {
        generateGraphData(data, startNodeId, depth);
      } else {
        const allNodes = data.map((node) => ({
          id: node.id,
          label: node.anchor_name,
        }));
        const allEdges = data.flatMap((node) =>
          (node.anchor_ref || []).map((refId) => ({ from: node.id, to: refId }))
        );
        setNetworkData({ nodes: allNodes, edges: allEdges });
      }
    }
  }, [data, startNodeId, depth]);

  useEffect(() => {
    if (containerRef.current && networkData.nodes.length > 0) {
      const { nodes, edges } = networkData;

      const networkDataSet = {
        nodes: new DataSet(nodes),
        edges: new DataSet(edges),
      };

      const options = {
        nodes: {
          shape: "box",
        },
        edges: {
          arrows: {
            to: { enabled: true, scaleFactor: 0.5 },
          },
        },
        physics: {
          stabilization: false,
        },
      };

      const network = new Network(containerRef.current, networkDataSet, options);

      // Add click event handler
      network.on("selectNode", (event) => {
        const nodeId = event.nodes[0];
        const node = data.find((n) => n.id === nodeId);
        if (node) {
          onNodeClick(node);
        }
      });
    }
  }, [networkData, data, onNodeClick]);

  return <div ref={containerRef} style={{ height: "800px", width: "100%" }} />;
};
