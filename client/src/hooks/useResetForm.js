import { useEffect, useRef } from 'react';

export const useResetForm = (reset, defaultValues) => {
	const initialValuesRef = useRef(defaultValues);

	useEffect(() => {
		if (typeof reset === 'function') {
			reset(initialValuesRef.current);
		}
	}, [reset]);
};

