import React, {Fragment, useEffect, useState} from "react";
import { line, scaleLinear, scaleTime } from "d3";
import * as d3 from "d3";
import { makeStyles } from 'tss-react/mui';



const useStyles = makeStyles()((theme, _params, classes) => ({
    root: {
    },

    xaxis: {
        color: 'black',
    },

    yaxis: {
        color: 'black',
    },

    text: {
      fill: 'gainsboro',
      color: 'gainsboro',
      fontSize: '16px',
    },
    // Set the border for the whole graph
    graph: {
        height: '30vh',
      overflow: 'visible',
    },

    // Set the colour of the line (and remove any default "fill" our line may have)
    graph_DDplus_data: {
        fill: 'none',
        stroke: 'blue'
    },
    graph_DDminus_data: {
        fill: 'none',
        stroke: 'purple'
    },
    graph_join_line: {
        fill: 'none',
        stroke: 'grey',
        alpha: 0.1
    }


}));

const Graph = ({ DDPlusData, DDMinusData, upperBoundCO }) => {
    const {classes} = useStyles();
    const [activeIndex, setActiveIndex] = React.useState(null)

    const layout = {
        width: 500,
        height: 200
    };
    const yMinValue = d3.min(DDPlusData, (d) => d.y);
    const yMaxValue = d3.max(DDPlusData, (d) => d.y);
    const xMinValue = d3.min(DDPlusData, (d) => d.x);
    const xMaxValue = d3.max(DDPlusData, (d) => d.x);


    const graphDetails = {
        xScale: scaleLinear().domain([0, upperBoundCO]).range([0, layout.width]),
        yScale: scaleLinear().domain([0, 1]).range([layout.height, 0]),
        lineGenerator: line()
    };
    const [lineDDPlus, setLineDDPlus] = useState(() =>
        graphDetails.lineGenerator(DDPlusData)
    );
    const [lineDDMinus, setLineDDMinus] = useState(() =>
        graphDetails.lineGenerator(DDMinusData)
    );
    // const [lineJoin, setLineJoin] = useState(() => {
    //     // create line from last point of DDPlusData to first point of DDMinusData
    //     const DDPlusDataLastPoint = DDPlusData[DDPlusData.length - 1];
    //     const DDMinusDataFirstPoint = DDMinusData[0];
    //     const joinLine = [{x: DDPlusDataLastPoint.x, y: DDPlusDataLastPoint.y}, {
    //         x: DDMinusDataFirstPoint.x,
    //         y: DDMinusDataFirstPoint.y
    //     }];
    //     return graphDetails.lineGenerator(joinLine)
    // });

    useEffect(() => {
        if (DDPlusData) {
            // Calculate the DDPlusData line
            const newLine = graphDetails.lineGenerator(DDPlusData);
            setLineDDPlus(newLine);
        }
        if (DDMinusData) {
             // create line from last point of DDPlusData to first point of DDMinusData
            // const DDPlusDataLastPoint = DDPlusData[DDPlusData.length - 1];
            // const DDMinusDataFirstPoint = DDMinusData[0];
            // const joinLine = [{x: DDPlusDataLastPoint.x, y: DDPlusDataLastPoint.y}, {x: DDMinusDataFirstPoint.x, y: DDMinusDataFirstPoint.y}];
            // const newLine = graphDetails.lineGenerator(joinLine);
            // setLineJoin(newLine);
        }
    }, [DDPlusData]);

    useEffect(() => {
        if (DDMinusData) {
            // Calculate the DDMinusData line
            const newLine = graphDetails.lineGenerator(DDMinusData);
            setLineDDMinus(newLine);
        }
        if (DDPlusData) {
             // create line from last point of DDPlusData to first point of DDMinusData
            // const DDPlusDataLastPoint = DDPlusData[DDPlusData.length - 1];
            // const DDMinusDataFirstPoint = DDMinusData[0];
            // const joinLine = [{x: DDPlusDataLastPoint.x, y: DDPlusDataLastPoint.y}, {x: DDMinusDataFirstPoint.x, y: DDMinusDataFirstPoint.y}];
            // const newLine = graphDetails.lineGenerator(joinLine);
            // setLineJoin(newLine);
        }
    }, [DDMinusData]);

    graphDetails.lineGenerator.x(d => graphDetails.xScale(d["x"]));
    graphDetails.lineGenerator.y(d => graphDetails.yScale(d["y"]));

    const getXAxis = (ref) => {
        const xAxis = d3.axisBottom(graphDetails.xScale);
        d3.select(ref).call(xAxis);
    };

    const getYAxis = (ref) => {
        const yAxis = d3.axisLeft(graphDetails.yScale);
        d3.select(ref).call(yAxis);
    };


    // Mouse handlers
    const handleMouseMove = (e) => {
        const bisect = d3.bisector((d) => d.x).left,
                x0 = graphDetails.xScale.invert(d3.pointer(e, this)[0]),
                index = bisect(DDPlusData, x0, 1);
        setActiveIndex(index);
    };

    const handleMouseLeave = () => {
        setActiveIndex(null);
    };

    return (
        <svg
            className={classes.graph}
            width={"100%"}
            height={layout.height}
            viewBox={`0 0 ${layout.width} ${layout.height}`}
            preserveAspectRatio="xMidYMid meet"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
        >
            // DDPlusData
            <path className={classes.graph_DDplus_data} d={lineDDPlus} />
            // DDMinusData
            <path className={classes.graph_DDminus_data} d={lineDDMinus} />
            // join line
            {/*<path className={classes.graph_join_line} d={lineJoin} />*/}


            // Site label (upper right)
            <text
                className={classes.text}
                transform={`translate(${layout.width - 100}, 20)`}
            >
                {"Probability of DD"}
            </text>

            // y-axis label
          <text
                className={classes.text}
                transform={`rotate(-90)`}
                x={0 - 3 * layout.height / 4} y={0} dy="1em"
          >
              {"Probability"}
          </text>

            // Axes
             <g className={classes.yaxis} ref={getYAxis} />
             <g
                  className={classes.xaxis}
                  ref={getXAxis}
                  transform={`translate(0,${layout.height})`}
              />

    {/*// display current time (new Date()) as dot on x-axis if current time inf to max of x-axis*/}
    {/*        <circle*/}
    {/*            cx={graphDetails.xScale(new Date())}*/}
    {/*            cy={layout.height}*/}
    {/*            r={new Date() < graphDetails.xScale.domain()[1] ? 2 : 0}*/}
    {/*            fill='#666'*/}
    {/*            strokeWidth={new Date() < graphDetails.xScale.domain()[1] ? 2 : 0}*/}
    {/*            stroke="#fff"*/}
    {/*            style={{ transition: "ease-out .1s" }}*/}
    {/*        />*/}

            // Hovering
            {DDPlusData.map((item, index) => {
              return (
                  <g key={index}>
                  // hovering text 
                      <text
                          fill="#666"
                          x={graphDetails.xScale(item.x)}
                          y={graphDetails.yScale(item.y) - 20}
                          textAnchor="middle"
                      >
                          {index === activeIndex ? item.y.toFixed(2) : ""}
                      </text>
                     // hovering circle
                      <circle
                          cx={graphDetails.xScale(item.x)}
                          cy={graphDetails.yScale(item.y)}
                          r={index === activeIndex ? 2 : 0}
                          fill='black'
                          strokeWidth={index === activeIndex ? 2 : 0}
                          stroke="#fff"
                          style={{ transition: "ease-out .1s" }}
                      />
                    // line to indicate the point on x-axis
                        <line
                            x1={graphDetails.xScale(item.x)}
                            y1={graphDetails.yScale(item.y)}
                            x2={graphDetails.xScale(item.x)}
                            y2={layout.height}
                            stroke="#666"
                            strokeWidth={index === activeIndex ? 0.2 : 0}
                            style={{ transition: "ease-out .1s" }}
                        /> 
                    // display the time value on hovering
                        <text
                            fill="#666"
                            // half of text size of dosis
                            fontSize={8}
                            x={graphDetails.xScale(item.x)}
                            y={graphDetails.yScale(item.y) - 10}
                            textAnchor="left"
                        >
                            {index === activeIndex
                                ? item.x
                                : ""}
                        </text>                    
                  </g>
              );
          })}
        </svg>
    );
};

export default Graph;