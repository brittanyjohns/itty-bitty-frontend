// src/components/WordNetworkGraph.tsx
import React, { useEffect, useRef } from "react";
import { DataSet, Network } from "vis-network/standalone/esm/vis-network";

interface WordEvent {
  id: number;
  user_id: number;
  word: string;
  previous_word: string | null;
  timestamp: string;
}

interface WordNetworkGraphProps {
  wordEvents: WordEvent[];
}

const WordNetworkGraph: React.FC<WordNetworkGraphProps> = ({ wordEvents }) => {
  const networkRef = useRef<HTMLDivElement>(null);
  const wordMap = new Map<string, number>(); // Declare wordMap variable

  useEffect(() => {
    if (networkRef.current) {
      const edges = new DataSet<{ id?: string; from: string; to: string }>();
      const nodes = new DataSet<{ id: string; label: string }>(); // Declare nodes variable

      wordEvents.forEach((event) => {
        if (event.previous_word) {
          const from = event.previous_word;
          const to = event.word;

          if (!wordMap.has(from)) {
            wordMap.set(from, wordMap.size + 1);
            nodes.add({ id: from, label: from });
          }

          if (!wordMap.has(to)) {
            wordMap.set(to, wordMap.size + 1);
            nodes.add({ id: to, label: to });
          }

          edges.add({ from, to });
        } else {
          if (!wordMap.has(event.word)) {
            wordMap.set(event.word, wordMap.size + 1);
            nodes.add({ id: event.word, label: event.word });
          }
        }
      });

      const data = { nodes, edges };
      const options = {
        nodes: {
          shape: "dot",
          size: 10,
        },
        edges: {
          arrows: {
            to: {
              enabled: true,
              scaleFactor: 1,
            },
          },
        },
        physics: {
          enabled: true,
          barnesHut: {
            gravitationalConstant: -8000,
            centralGravity: 0.3,
            springLength: 95,
            springConstant: 0.04,
            damping: 0.09,
          },
          stabilization: {
            enabled: true,
            iterations: 2000,
            updateInterval: 25,
          },
        },
      };

      new Network(networkRef.current, data, options);
    }
  }, [wordEvents]);

  return <div ref={networkRef} style={{ height: "600px" }} />;
};

export default WordNetworkGraph;
