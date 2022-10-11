import { Component } from "react";
import moment from "moment";
import { timer } from "rxjs";

class processUptime extends Component {
	constructor(props) {
		super(props);
		this.startTs = null;
		this.offset = null;
	}

	// componentDidMount() {}

	// componentWillUnmount() {}

	clock() {
		if (!this.value) {
			return null;
		}
		const duration = moment.duration(this.value + this.offset);
		return `${Math.floor(
			duration.asDays()
		)}d ${duration.hours()}h ${duration.minutes()}m ${duration.seconds()}s`;
	}

	createSubsctiption() {
		if (this.value) {
			const vm = this;
			vm.startTs = moment();
			vm.offset = 0;
			return timer(0, 1000).subscribe({
				next: () => {
					vm.offset = moment().valueOf() - vm.startTs.valueOf();
				},
			});
		}
	}

    render(){
        return this.clock()
    }
}

export default processUptime;
