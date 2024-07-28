// src/components/WordCloudChart.tsx
import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import cloud from "d3-cloud";
import { schemeCategory10 } from "d3-scale-chromatic";
import { scaleOrdinal } from "d3-scale";

interface WordEvent {
  id: number;
  user_id: number;
  word: string;
  previous_word: string | null;
  timestamp: string;
}

interface WordCloudChartProps {
  wordEvents: WordEvent[];
}

const WordCloudChart: React.FC<WordCloudChartProps> = ({ wordEvents }) => {
  const wordCloudRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wordCloudRef.current) return; // Ensure ref is not null

    // Clear the previous SVG content
    d3.select(wordCloudRef.current).selectAll("*").remove();

    // Calculate word frequencies
    const wordFrequencyMap: { [key: string]: number } = {};

    wordEvents.forEach((event) => {
      if (wordFrequencyMap[event.word]) {
        wordFrequencyMap[event.word]++;
      } else {
        wordFrequencyMap[event.word] = 1;
      }
    });

    // Convert word frequencies to the format expected by d3-cloud
    const words = Object.keys(wordFrequencyMap).map((word) => ({
      text: word,
      size: Math.log2(wordFrequencyMap[word] + 1) * 10,
    }));

    console.log("Words for word cloud:", words);

    const customColors = scaleOrdinal(schemeCategory10);

    const layout = cloud()
      .size([800, 600])
      .words(words)
      .padding(5)
      .rotate(() => ~~(Math.random() * 2) * 90)
      .font("Impact")
      .fontSize((d: any) => d.size)
      .on("end", draw);

    layout.start();

    function draw(words: any) {
      console.log("Drawing word cloud with words:", words);
      if (wordCloudRef.current) {
        const svg = d3
          .select(wordCloudRef.current)
          .append("svg")
          .attr("width", layout.size()[0])
          .attr("height", layout.size()[1])
          // .style("border", "1px solid black") // Add border for visibility
          .append("g")
          .attr(
            "transform",
            "translate(" +
              layout.size()[0] / 2 +
              "," +
              layout.size()[1] / 2 +
              ")"
          );

        svg
          .selectAll("text")
          .data(words)
          .enter()
          .append("text")
          .style("font-size", (d: any) => d.size + "px")
          .style("font-family", "Impact")
          .style("fill", (d: any, i: number) => customColors(i.toString()))
          .attr("text-anchor", "middle")
          .attr(
            "transform",
            (d: any) => "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")"
          )
          .text((d: any) => d.text)
          .on("mouseover", function (event: any, d: any) {
            d3.select(this).style("fill", "red");
          })
          .on("mouseout", function (event: any, d: any) {
            d3.select(this).style("fill", (d: any, i: number) =>
              customColors(i.toString())
            );
          });
      }
    }
  }, [wordEvents]);

  return <div ref={wordCloudRef} />;
};

export default WordCloudChart;
