export function safeScrollToBottom(container, { smooth = false } = {}) {
  if (!container) return;
  const prevY = typeof window !== 'undefined' ? window.scrollY : 0;
  // Wait two frames so layout is stable before scrolling the pane.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      try {
        if (smooth && typeof container.scrollTo === 'function') {
          container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
        } else {
          container.scrollTop = container.scrollHeight;
        }
      } catch (e) {
        try { container.scrollTop = container.scrollHeight; } catch (er) {}
      }
      try { window.scrollTo(window.scrollX, prevY); } catch (e) {}
    });
  });
}

export function safeFocus(el) {
  if (!el) return;
  try {
    if (typeof el.focus === 'function') el.focus({ preventScroll: true });
  } catch (e) {
    try { el.focus(); } catch (er) {}
  }
}
