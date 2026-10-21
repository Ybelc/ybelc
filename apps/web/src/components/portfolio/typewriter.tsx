"use client";

import { useEffect, useRef, useState } from "react";

import { useReducedMotion } from "./hooks";

type TypewriterProps = {
	text: string;
	/** Quando verdadeiro, a digitação avança. Se ficar falso no meio, ela pausa (não reinicia). */
	play: boolean;
	/** Mostra o texto completo imediatamente (ex.: já foi digitado antes). */
	complete?: boolean;
	onComplete?: () => void;
	className?: string;
	/** Velocidade base em ms por caractere. */
	speed?: number;
	startDelay?: number;
	as?: "p" | "span" | "div";
};

/**
 * Efeito de máquina de escrever acessível.
 *  - O texto completo fica disponível para leitores de tela e buscadores (sr-only).
 *  - A camada visual é aria-hidden e reserva o espaço final (sem mudança de layout).
 *  - Não reinicia em pequenos movimentos do cursor: pausa e retoma de onde parou.
 */
export function Typewriter({
	text,
	play,
	complete = false,
	onComplete,
	className = "",
	speed = 34,
	startDelay = 280,
	as: Tag = "p",
}: TypewriterProps) {
	const reduced = useReducedMotion();
	const [count, setCount] = useState(complete ? text.length : 0);
	const countRef = useRef(count);
	const doneRef = useRef(complete);
	const onCompleteRef = useRef(onComplete);
	useEffect(() => {
		onCompleteRef.current = onComplete;
	}, [onComplete]);

	const finished = reduced || complete || count >= text.length;

	useEffect(() => {
		if (finished || !play) return;
		let timer: ReturnType<typeof setTimeout>;
		const tick = () => {
			const next = countRef.current + 1;
			countRef.current = next;
			setCount(next);
			if (next >= text.length) return;
			const ch = text[next - 1];
			const pause = /[.,;:!?—]/.test(ch)
				? speed * 6
				: ch === " "
					? speed * 1.6
					: speed;
			timer = setTimeout(tick, pause + Math.random() * speed * 0.6);
		};
		timer = setTimeout(tick, countRef.current === 0 ? startDelay : speed);
		return () => clearTimeout(timer);
	}, [play, finished, text, speed, startDelay]);

	useEffect(() => {
		if (finished && !doneRef.current) {
			doneRef.current = true;
			onCompleteRef.current?.();
		}
	}, [finished]);

	const shown = finished ? text : text.slice(0, count);

	return (
		<Tag
			className={`pf-type ${className}`}
			data-typing={!finished && play ? "true" : "false"}
		>
			<span className="sr-only">{text}</span>
			<span aria-hidden="true" className="pf-type-stack">
				<span className="pf-type-ghost">{text}</span>
				<span className="pf-type-live">
					{shown}
					<span className="pf-caret" data-visible={play ? "true" : "false"} />
				</span>
			</span>
		</Tag>
	);
}
