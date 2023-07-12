import { useState, useEffect } from 'react';

const isClientSide = () => typeof window !== 'undefined';

export const useDrawerState = (initialState) => {
	const [mounted, setMounted] = useState(false);
	const [drawerState, setDrawerState] = useState(initialState);

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		if (mounted && isClientSide()) {
			const savedState = localStorage.getItem('drawerOpen');
			setDrawerState(
				savedState !== null ? JSON.parse(savedState) : initialState
			);
		}
	}, [mounted]);

	const updateDrawerState = (newState) => {
		setDrawerState(newState);
		if (isClientSide()) {
			localStorage.setItem('drawerOpen', JSON.stringify(newState));
		}
	};

	return [drawerState, updateDrawerState];
};
