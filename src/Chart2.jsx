import React from "react";
import * as d3 from "d3";

class Chart2 extends React.Component {
	constructor(props) {
		super(props);
		this.myRef = React.createRef();
	}

	componentDidMount() {
		console.log(this.myRef.current.getBoundingClientRect().width);
		const data = [12, 36, 6, 25, 35, 10, 20];

		const w = 500;
		const h = 400;
		const accessToRef = d3
			.select(this.myRef.current)
			.append("svg")
			.attr("width", w)
			.attr("height", h)
			.style("background-color", "#cccccc")
			.style("padding", 10)
			.style("margin-left", 50);

		accessToRef
			.append("g")
			.attr("transform", `translate(50,5)`);

		accessToRef
			.selectAll("rect")
			.data(data)
			.enter()
			.append("rect")
			.attr("x", (d, i) => i * 70)
			.attr("y", (d, i) => h - 10 * d)
			.attr("width", 65)
			.attr("height", (d, i) => d * 10)
			.attr("fill", "tomato");
	}

	render() {
		return (
			<>
				<div ref={this.myRef}></div>
			</>
		);
	}
}

export default Chart2;
