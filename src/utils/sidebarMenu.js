const sideBarMenu = [
	{
		label: "Insight",
		key: "1",
		children: [
			{
				label: "Details",
				key: "sub1",
				link: "/instance",
			},
			{
				label: "Metrics",
				key: "sub2",
				link: "/instance/metrics",
			},
			{
				label: "Environment",
				key: "sub3",
				link: "/instance/environment",
			},
			{
				label: "Beans",
				key: "sub4",
				link: "/instance/beans",
			},
			{
				label: "Configuration Properties",
				key: "sub5",
				link: "/instance/config",
			},
			{
				label: "Scheduled Tasks",
				key: "sub6",
				link: "/instance/scheduled",
			},
		],
	},

	{
		label: "Logging",
		key: "2",
		children: [
			{
				label: "Logfile",
				key: "2sub1",
				link: "/instance/logfile",
			},
			{
				label: "Loggers",
				key: "2sub2",
				link: "/instance/loggers",
			},
			{
				label: "Startup",
				key: "2sub3",
				link: "/instance/startup",
			},
		],
	},

	{
		label: "JVM",
		key: "3",
		children: [
			{
				label: "JMX",
				key: "3sub1",
				link: "/instance/jmx",
			},
			{
				label: "Thread Dump",
				key: "3sub2",
				link: "/instance/threadDump",
			},
			{
				label: "Head Dump",
				key: "3sub3",
				link: "/instance/headDump",
			},
		],
	},

	{
		label: "Web",
		key: "4",
		children: [
			{
				label: "Mappings",
				key: "4sub1",
				link: "/instance/mappings",
			},
			{
				label: "HTTP Traces",
				key: "4sub2",
				link: "/intances/httpTrace",
			},
		],
	},
];

export default sideBarMenu;
