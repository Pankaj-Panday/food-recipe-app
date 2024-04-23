import React from "react";
import { parseISO, formatDistanceToNow } from "date-fns";

const TimeAgo = ({ timestamp }) => {
	let relativeTime = "";
	if (timestamp) {
		const date = parseISO(timestamp);
		const timePeriod = formatDistanceToNow(date);
		relativeTime = `${timePeriod} ago`;
	}
	return <span>{relativeTime}</span>;
};

export default TimeAgo;
