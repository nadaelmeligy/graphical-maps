import type { NodeData } from '../types/graph';

export type Topology = 'free' | 'star' | 'ring' | 'grid' | 'tree' | 'sphere' | 'cube' | 'helix' | 'spiral' | 'clusters';

export function applyTopology(nodes: NodeData[], topology: Topology): Partial<NodeData>[] {
  const centerX = 0, centerY = 0, centerZ = 0;
  const radius = nodes.length * 30;

  switch (topology) {
    case 'star':
      return nodes.map((node, i) => {
        if (i === 0) return { x: centerX, y: centerY, z: centerZ }; // Center node
        const angle = ((i - 1) / (nodes.length - 1)) * Math.PI * 2;
        return {
          x: centerX + radius * Math.cos(angle),
          y: centerY + radius * Math.sin(angle),
          z: centerZ
        };
      });

    case 'ring':
      return nodes.map((_, i) => {
        const angle = (i / nodes.length) * Math.PI * 2;
        return {
          x: centerX + radius * Math.cos(angle),
          y: centerY + radius * Math.sin(angle),
          z: centerZ
        };
      });

    case 'grid':
      const gridSize = Math.ceil(Math.sqrt(nodes.length));
      const spacing = radius / gridSize;
      return nodes.map((_, i) => ({
        x: centerX + (i % gridSize) * spacing - (radius / 2),
        y: centerY,
        z: centerZ + Math.floor(i / gridSize) * spacing - (radius / 2)
      }));

    case 'tree':
      const levels = Math.ceil(Math.log2(nodes.length + 1));
      const verticalSpacing = radius / levels;
      return nodes.map((_, i) => {
        const level = Math.floor(Math.log2(i + 1));
        const nodesInLevel = Math.pow(2, level);
        const position = i - Math.pow(2, level) + 1;
        const horizontalSpacing = radius / nodesInLevel;
        return {
          x: centerX + position * horizontalSpacing - (radius / 2),
          y: centerY - level * verticalSpacing,
          z: centerZ
        };
      });

    case 'sphere':
      return nodes.map((_, i) => {
        const phi = Math.acos(-1 + (2 * i) / nodes.length);
        const theta = Math.sqrt(nodes.length * Math.PI) * phi;
        return {
          x: radius * Math.cos(theta) * Math.sin(phi),
          y: radius * Math.sin(theta) * Math.sin(phi),
          z: radius * Math.cos(phi)
        };
      });

    case 'cube':
      const cubeSize = Math.ceil(Math.cbrt(nodes.length));
      const cubeSpacing = radius / cubeSize;
      return nodes.map((_, i) => ({
        x: (i % cubeSize) * cubeSpacing - radius / 2,
        y: (Math.floor(i / cubeSize) % cubeSize) * cubeSpacing - radius / 2,
        z: Math.floor(i / (cubeSize * cubeSize)) * cubeSpacing - radius / 2
      }));

    case 'helix':
      return nodes.map((_, i) => {
        const angle = (i / nodes.length) * Math.PI * 10;
        return {
          x: radius * Math.cos(angle),
          y: (i / nodes.length) * radius - radius / 2,
          z: radius * Math.sin(angle)
        };
      });

    case 'spiral':
      return nodes.map((_, i) => {
        const angle = (i / nodes.length) * Math.PI * 10;
        const spiralRadius = (i / nodes.length) * radius;
        return {
          x: spiralRadius * Math.cos(angle),
          y: 0,
          z: spiralRadius * Math.sin(angle)
        };
      });

    case 'clusters':
      const clustersCount = Math.ceil(Math.sqrt(nodes.length));
      return nodes.map((_, i) => {
        const cluster = Math.floor(i / (nodes.length / clustersCount));
        const angleInCluster = (i % (nodes.length / clustersCount)) / (nodes.length / clustersCount) * Math.PI * 2;
        const clusterAngle = (cluster / clustersCount) * Math.PI * 2;
        const clusterRadius = radius * 0.4;
        return {
          x: radius * Math.cos(clusterAngle) + clusterRadius * Math.cos(angleInCluster),
          y: radius * Math.sin(clusterAngle) + clusterRadius * Math.sin(angleInCluster),
          z: 0
        };
      });

    default: // 'free'
      return nodes.map(node => ({ x: node.x, y: node.y, z: node.z }));
  }
}
