/* eslint-disable react-hooks/rules-of-hooks */

import { useState, useEffect } from 'react';

export function useRefreshOnInterval(interval = 100) {
	if (!__DEV__) {
		return;
	}

	const [key, setKey] = useState(0);
	useEffect(() => {
		const id = setInterval(() => {
			setKey((prev) => prev + 1);
		}, interval);
		return () => clearInterval(id);
	}, [interval]);

	return key;
}
