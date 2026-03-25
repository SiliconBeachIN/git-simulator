const runningAnim = new WeakMap();

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function animateScroll(container, to, { duration = 160 } = {}) {
  if (!container) return Promise.resolve();
  if (runningAnim.has(container)) {
    const prev = runningAnim.get(container);
    cancelAnimationFrame(prev.raf);
  }

  return new Promise((resolve) => {
    const start = performance.now();
    const from = container.scrollTop;
    const max = Math.max(to, from);
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = easeOutCubic(t);
      const value = from + (to - from) * eased;
      try { container.scrollTop = Math.round(value); } catch (e) {}
      if (t < 1) {
        const raf = requestAnimationFrame(tick);
        runningAnim.set(container, { raf });
      } else {
        runningAnim.delete(container);
        resolve();
      }
    };
    const raf = requestAnimationFrame(tick);
    runningAnim.set(container, { raf });
  });
}

export function safeScrollToBottom(container, { smooth = false, duration } = {}) {
  if (!container) return;
  const prevY = typeof window !== 'undefined' ? window.scrollY : 0;

  // Wait a couple frames for layout to stabilise (images/fonts/layout)
  requestAnimationFrame(() => requestAnimationFrame(async () => {
    try {
      const to = container.scrollHeight;
      if (smooth) {
        await animateScroll(container, to, { duration: duration ?? 160 });
      } else {
        try { container.scrollTop = to; } catch (e) {}
      }
    } catch (e) {
      try { container.scrollTop = container.scrollHeight; } catch (er) {}
    }
    try { window.scrollTo(window.scrollX, prevY); } catch (e) {}
  }));
}

export function safeFocus(el) {
  if (!el) return;
  try {
    if (typeof el.focus === 'function') el.focus({ preventScroll: true });
  } catch (e) {
    try { el.focus(); } catch (er) {}
  }
}
