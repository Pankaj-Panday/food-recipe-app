import React from "react";
import { parseISO, formatDistanceToNow } from "date-fns";

const TimeAgo = ({ timestamp, className }) => {
	if (!timestamp) return null;
	let relativeTime = "";
	const date = parseISO(timestamp);
	const timePeriod = formatDistanceToNow(date);
	relativeTime = `${timePeriod} ago`;

	return <span className={className}>{relativeTime}</span>;
};

export default TimeAgo;
