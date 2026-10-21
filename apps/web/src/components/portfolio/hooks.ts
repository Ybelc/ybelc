"use client";

import { useEffect, useState } from "react";

function useMediaQuery(query: string, initial = false) {
	const [matches, setMatches] = useState(initial);
	useEffect(() => {
		const mq = window.matchMedia(query);
		const update = () => setMatches(mq.matches);
		update();
		mq.addEventListener("change", update);
		return () => mq.removeEventListener("change", update);
	}, [query]);
	return matches;
}

export function useReducedMotion() {
	return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/** Dispositivo com cursor preciso e hover real (mouse/trackpad). */
export function useFinePointer() {
	return useMediaQuery("(hover: hover) and (pointer: fine)");
}

export function useInView<T extends Element>(
	ref: React.RefObject<T | null>,
	rootMargin = "0px 0px -15% 0px",
) {
	const [inView, setInView] = useState(false);
	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		const io = new IntersectionObserver(
			([entry]) => setInView(entry.isIntersecting),
			{ rootMargin, threshold: 0.15 },
		);
		io.observe(el);
		return () => io.disconnect();
	}, [ref, rootMargin]);
	return inView;
}
