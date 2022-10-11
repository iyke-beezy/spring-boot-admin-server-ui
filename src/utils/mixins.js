import React, { Component } from "react";
import processUptime from "./process-uptime";

class mixins extends processUptime {
	constructor(props) {
		super(props);
		this.subscription = null;
	}

	async subscribe() {
		if (!this.subscription) {
			this.subscription = await this.createSubscription();
		}
	}

	unsubscribe() {
		if (this.subscription) {
			try {
				!this.subscription.closed && this.subscription.unsubscribe();
			} finally {
				this.subscription = null;
			}
		}
	}

	componentDidMount() {
		this.subscribe();
	}

	componentWillUnmount() {
		this.unsubscribe();
	}
}

export default mixins;
