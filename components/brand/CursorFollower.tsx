'use client';

import { useEffect, useRef } from 'react';

export function CursorFollower() {
    const dotRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (window.matchMedia('(pointer: coarse)').matches) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        let raf = 0;
        const pos = { x: 0, y: 0 };
        const target = { x: 0, y: 0 };
        let targetSize = 8;
        let currentSize = 8;
        let stolen = false;
        let stolenEl: Element | null = null;

        const onMove = (e: MouseEvent) => {
            if (!stolen) {
                target.x = e.clientX;
                target.y = e.clientY;
                const el = e.target as HTMLElement;
                const interactive = el.closest('a, button, [role="button"], input, textarea');
                targetSize = interactive ? 24 : 8;
            }
        };

        const onNodeEnter = (e: Event) => {
            const detail = (e as CustomEvent<{ el: Element }>).detail;
            stolenEl = detail.el;
            stolen = true;
            targetSize = 56;
        };

        const onNodeLeave = () => {
            stolen = false;
            stolenEl = null;
            targetSize = 8;
        };

        const tick = () => {
            if (stolen && stolenEl) {
                const rect = stolenEl.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                pos.x += (cx - pos.x) * 0.2;
                pos.y += (cy - pos.y) * 0.2;
            } else {
                pos.x += (target.x - pos.x) * 0.15;
                pos.y += (target.y - pos.y) * 0.15;
            }

            currentSize += (targetSize - currentSize) * 0.18;

            if (dotRef.current) {
                const half = currentSize / 2;
                dotRef.current.style.width = `${currentSize}px`;
                dotRef.current.style.height = `${currentSize}px`;
                dotRef.current.style.transform = `translate3d(${pos.x - half}px, ${pos.y - half}px, 0)`;
            }

            raf = requestAnimationFrame(tick);
        };

        window.addEventListener('mousemove', onMove);
        window.addEventListener('cursor-node-enter', onNodeEnter as EventListener);
        window.addEventListener('cursor-node-leave', onNodeLeave);
        raf = requestAnimationFrame(tick);

        return () => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('cursor-node-enter', onNodeEnter as EventListener);
            window.removeEventListener('cursor-node-leave', onNodeLeave);
            cancelAnimationFrame(raf);
        };
    }, []);

    return (
        <div
            ref={dotRef}
            aria-hidden="true"
            className="pointer-events-none fixed left-0 top-0 z-50 rounded-full bg-lime mix-blend-difference"
            style={{ width: '8px', height: '8px' }}
        />
    );
}
