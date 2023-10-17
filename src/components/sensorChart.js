import React, { Component } from 'react';
import CanvasJSReact from '@canvasjs/react-charts';
 
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
class Chart extends Component {
	constructor() {
		super();
		this.updateChart = this.updateChart.bind(this);
        this.state = {
			dps: [], // dataPoints for this chart
		};
		this.xVal = this.state.dps.length;
		this.updateInterval = 1;
	}
  componentDidUpdate(prevProps, prevState) {
    if (this.props.time !== prevProps.time) {
    //   console.log(this.props.name, this.props.value);
		  setInterval(this.updateChart(this.props.value), this.updateInterval);
    }
	}

	updateChart(yVal) {
		this.setState((prevState) => {
			const newDps = [...prevState.dps];
			newDps.push({ x: this.xVal, y: yVal });
			this.xVal += 1;

			if (newDps.length > 200) {
				newDps.shift();
			}
			return { dps: newDps };
		});
	}
	render() {

		const options = {
      creditText: "",
      creditHref: "",
      zoomEnabled:true,
      width: 600,
      height: 150,
			title :{
				text: this.props.name
			},
			data: [{
				type: "line",
        lineColor:this.props.lineColor,
				dataPoints : this.state.dps
			}]
		}
		return (
		<div className='mt-2 mx-10'>
			<CanvasJSChart key={this.props.name} options = {options}
				 onRef={ref => this.chart = ref}
			/>
		</div>
		);
	}
}

export default Chart;