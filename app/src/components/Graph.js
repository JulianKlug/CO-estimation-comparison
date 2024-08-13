import React, {Fragment, useEffect, useState} from "react";
import { line, scaleLinear, scaleTime } from "d3";
import * as d3 from "d3";
import { makeStyles } from 'tss-react/mui';
import {isMobile} from "../utils";



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
    legend: {
        fill: 'rgba(141,140,140,0.75)',
        fontSize: '12px',
    },
    legend_title: {
        fill: 'rgba(141,140,140,0.75)',
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
        stroke: '#8080804d',
        alpha: 0.1
    }


}));

const Graph = ({ DDPlusData, DDMinusData, measuredCO, mPAP, PAWP, PVRLimit, upperBoundCO }) => {
    const {classes} = useStyles();
    const [activeIndex, setActiveIndex] = React.useState(null)

    measuredCO = parseFloat(measuredCO);

    const COatPVRLimit = (mPAP - PAWP) / PVRLimit;

    const layout = {
        width: 500,
        height: 200
    };
    const joinedData = [...DDPlusData, ...DDMinusData];

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
    const [lineJoin, setLineJoin] = useState(() => {
        if (DDPlusData.length === 0 || DDMinusData.length === 0 || DDPlusData === undefined || DDMinusData === undefined) {
            return []
        } else {
            // create line from last point of DDPlusData to first point of DDMinusData
            const DDPlusDataLastPoint = DDPlusData[DDPlusData.length - 1];
            const DDMinusDataFirstPoint = DDMinusData[0];
            const joinLine = [{x: DDPlusDataLastPoint.x, y: DDPlusDataLastPoint.y}, {
                x: DDMinusDataFirstPoint.x,
                y: DDMinusDataFirstPoint.y
            }];
            return graphDetails.lineGenerator(joinLine)
        }

    });

    useEffect(() => {
        if (DDPlusData) {
            // Calculate the DDPlusData line
            const newLine = graphDetails.lineGenerator(DDPlusData);
            setLineDDPlus(newLine);
            if (DDPlusData.length !== 0 && DDMinusData.length !== 0) {
                 // create line from last point of DDPlusData to first point of DDMinusData
                const DDPlusDataLastPoint = DDPlusData[DDPlusData.length - 1];
                const DDMinusDataFirstPoint = DDMinusData[0];
                const joinLine = [{x: DDPlusDataLastPoint.x, y: DDPlusDataLastPoint.y}, {x: DDMinusDataFirstPoint.x, y: DDMinusDataFirstPoint.y}];
                const newLine = graphDetails.lineGenerator(joinLine);
                setLineJoin(newLine);
            } else {
                setLineJoin([])
            }
        }
    }, [DDPlusData]);

    useEffect(() => {
        if (DDMinusData) {
            // Calculate the DDMinusData line
            const newLine = graphDetails.lineGenerator(DDMinusData);
            setLineDDMinus(newLine);
            if (DDPlusData.length !== 0 && DDMinusData.length !== 0) {
                // create line from last point of DDPlusData to first point of DDMinusData
                const DDPlusDataLastPoint = DDPlusData[DDPlusData.length - 1];
                const DDMinusDataFirstPoint = DDMinusData[0];
                const joinLine = [{x: DDPlusDataLastPoint.x, y: DDPlusDataLastPoint.y}, {x: DDMinusDataFirstPoint.x, y: DDMinusDataFirstPoint.y}];
                const newLine = graphDetails.lineGenerator(joinLine);
                setLineJoin(newLine);
            } else {
                setLineJoin([])
            }
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
                index = bisect(joinedData, x0, 1);
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
            <path className={classes.graph_join_line} d={lineJoin} stroke-dasharray="4 1"/>


            // Site label (upper right)
            <text
                className={classes.legend_title}
                transform={isMobile() ? `translate(${layout.width - 100}, 20)` : `translate(${layout.width - 100}, 40)`}
            >
                {"Probability of"}
                {isMobile() ? <tspan x="0" dy="1.2em">{"diagnostic error"}</tspan> : " diagnostic error"}
            </text>

            // y-axis label
          <text
                className={classes.text}
                transform={`rotate(-90)`}
                x={0 - 3 * layout.height / 4} y={0} dy="1em"
          >
              {"Probability"}
          </text>

            // x-axis label
            <text
                className={classes.text}
                transform={`translate(${layout.width / 2 + layout.width /4}, ${layout.height + 40})`}
            >
                {"Cardiac Output (L/min)"}
            </text>

            // Add legend
            <text
                className={classes.legend}
                transform={`translate(${layout.width - 100}, 60)`}
            >
                {"P(PVR < "  +PVRLimit +") with direct Fick"}
            </text>
            <text
                className={classes.legend}
                transform={`translate(${layout.width - 100}, 80)`}
            >
                {"P(PVR ≤ "  +PVRLimit +") with direct Fick"}
            </text>

            <line
                className={classes.graph_DDplus_data}
                x1={isMobile() ?  layout.width + 50 : layout.width + 70} y1={56}
                x2={isMobile() ?  layout.width + 58 : layout.width + 60} y2={56}
            />
            <line
                className={classes.graph_DDminus_data}
                x1={isMobile() ?  layout.width + 50 : layout.width + 60} y1={76}
                x2={isMobile() ?  layout.width + 58 : layout.width + 70} y2={76}
            />

            // Axes
             <g className={classes.yaxis} ref={getYAxis} />
             <g
                  className={classes.xaxis}
                  ref={getXAxis}
                  transform={`translate(0,${layout.height})`}
              />


    {/* add fine line at CO at PVR Limit*/}
            {typeof COatPVRLimit === 'number' && isNaN(COatPVRLimit) === false
                            ? (
            <g>
            <line
                x1={graphDetails.xScale(COatPVRLimit)}
                y1={graphDetails.yScale(0)}
                x2={graphDetails.xScale(COatPVRLimit)}
                // y2={graphDetails.yScale(-0.1)}
                y2={graphDetails.yScale(-0)}
                stroke="#666"
                strokeWidth={0.2}
                style={{ transition: "ease-out .1s" }}
            />
            <text
                fill="#666"
                fontSize={8}
                x={graphDetails.xScale(COatPVRLimit) - 15}
                // y={graphDetails.yScale(-0.15)}
                y={graphDetails.yScale(0.55)}
            >
                PVR = {PVRLimit}
            </text>
            </g>
            ) : null
            }

    {/*// display measured CO as line with dot on x-axis if inf to max of x-axis*/}
            {typeof measuredCO === 'number' && isNaN(measuredCO) === false
                            ? (
            <g>
            <line
                x1={graphDetails.xScale(measuredCO)}
                y1={graphDetails.yScale(0)}
                x2={graphDetails.xScale(measuredCO)}
                y2={graphDetails.yScale(0.1)}
                stroke="#666"
                strokeWidth={0.5}
                style={{ transition: "ease-out .1s" }}
            />
            <circle
                cx={graphDetails.xScale(measuredCO)}
                cy={graphDetails.yScale(0.1)}
                r={2}
                fill='black'
                strokeWidth={2}
                stroke="#fff"
                style={{ transition: "ease-out .1s" }}
            />
             <text
                fill="#666"
                // half of text size of dosis
                fontSize={8}
                x={graphDetails.xScale(measuredCO + 0.1)}
                y={graphDetails.yScale(0.1)}
                textAnchor="left"
            >
                 {measuredCO.toFixed(1)}
            </text>
            </g>
            )
            : null
            }



            // Hovering
            {joinedData.map((item, index) => {
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
                                ? item.x.toFixed(2)
                                : ""}
                        </text>                    
                  </g>
              );
          })}
        </svg>
    );
};

export default Graph;