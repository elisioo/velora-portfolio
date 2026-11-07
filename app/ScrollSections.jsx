"use client";

import { useEffect, useRef } from "react";

export function ScrollSection({ children, ...props }) {
  return <div className="scroll-panel"><div className="scroll-outer"><div className="scroll-inner"><div className="scroll-content"><section {...props}>{children}</section></div></div></div></div>;
}

export function ScrollSections({ children }) {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    const panels = [...root.querySelectorAll(".scroll-panel")];
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let current = 0;
    let busy = false;
    let disposed = false;
    let animations = [];
    let touchY = null;
    let wheelTime = 0;
    let wheelAmount = 0;
    const content = (panel) => panel.querySelector(".scroll-content");
    const show = (index) => panels.forEach((panel, i) => {
      panel.inert = i !== index;
      panel.classList.toggle("is-active", i === index);
    });
    const blocked = () => !!document.querySelector("dialog[open]");
    const canScroll = (direction) => {
      const el = content(panels[current]);
      return direction > 0 ? el.scrollTop + el.clientHeight < el.scrollHeight - 2 : el.scrollTop > 2;
    };
    async function go(index, direction = 1) {
      if (busy || index === current || index < 0 || index >= panels.length) return;
      busy = true;
      const previous = panels[current];
      const next = panels[index];
      const hadFocus = previous.contains(document.activeElement);
      content(next).scrollTop = direction > 0 ? 0 : content(next).scrollHeight;
      next.classList.add("is-active");
      next.style.zIndex = "2";
      previous.inert = true;
      next.inert = false;
      if (!motion.matches) {
        const timing = { duration: 1100, easing: "cubic-bezier(.65, 0, .35, 1)" };
        animations = [
          next.querySelector(".scroll-outer").animate([{ transform: `translateY(${100 * direction}%)` }, { transform: "translateY(0)" }], timing),
          next.querySelector(".scroll-inner").animate([{ transform: `translateY(${-100 * direction}%)` }, { transform: "translateY(0)" }], timing),
          content(next).animate([{ transform: `translateY(${15 * direction}%)` }, { transform: "translateY(0)" }], timing),
          content(previous).animate([{ transform: "translateY(0)" }, { transform: `translateY(${-15 * direction}%)` }], timing),
        ];
        const heading = next.querySelector("h1, h2");
        if (heading) animations.push(heading.animate([{ opacity: 0, transform: `translateY(${80 * direction}px)` }, { opacity: 1, transform: "translateY(0)" }], { ...timing, delay: 150, duration: 800, fill: "backwards" }));
        await Promise.allSettled(animations.map((animation) => animation.finished));
      }
      if (disposed) return;
      next.style.zIndex = "";
      current = index;
      show(current);
      if (hadFocus) content(next).focus({ preventScroll: true });
      wheelAmount = 0;
      wheelTime = performance.now();
      busy = false;
    }
    function wheel(event) {
      if (blocked() || event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      const direction = Math.sign(event.deltaY);
      if (!direction) return;
      if (busy) { event.preventDefault(); return; }
      if (canScroll(direction)) { wheelAmount = 0; return; }
      event.preventDefault();
      const now = performance.now();
      const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1);
      if (now - wheelTime > 180 || Math.sign(wheelAmount) !== direction) wheelAmount = 0;
      wheelTime = now;
      wheelAmount += delta;
      if (Math.abs(wheelAmount) >= 45) void go(current + direction, direction);
    }
    function touchStart(event) {
      touchY = event.touches.length === 1 ? event.touches[0].clientY : null;
    }
    function touchMove(event) {
      if (blocked() || touchY === null || event.touches.length !== 1) return;
      const delta = touchY - event.touches[0].clientY;
      const direction = Math.sign(delta);
      if (busy || (direction && !canScroll(direction))) {
        event.preventDefault();
        if (!busy && Math.abs(delta) > 55) {
          touchY = null;
          void go(current + direction, direction);
        }
      } else touchY = event.touches[0].clientY;
    }
    function keydown(event) {
      if (blocked() || event.target.closest("input, textarea, select, button, a, video, [contenteditable]")) return;
      const direction = ["ArrowDown", "PageDown", " "].includes(event.key) ? (event.shiftKey ? -1 : 1) : ["ArrowUp", "PageUp"].includes(event.key) ? -1 : 0;
      if (direction && (busy || !canScroll(direction))) {
        event.preventDefault();
        void go(current + direction, direction);
      }
    }
    function click(event) {
      const link = event.target.closest('a[href^="#"]');
      if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      const id = link.getAttribute("href").slice(1);
      const index = id === "top" ? 0 : panels.findIndex((panel) => [...panel.querySelectorAll("[id]")].some((el) => el.id === id));
      if (index < 0) return;
      event.preventDefault();
      if (index === current) content(panels[current]).scrollTo({ top: 0, behavior: motion.matches ? "instant" : "smooth" });
      else void go(index, index > current ? 1 : -1);
      history.replaceState(null, "", `#${id}`);
    }
    const initial = panels.findIndex((panel) => [...panel.querySelectorAll("[id]")].some((el) => `#${el.id}` === location.hash));
    if (initial >= 0) current = initial;
    panels.forEach((panel) => { content(panel).tabIndex = -1; });
    show(current);
    root.classList.add("scroll-ready");
    document.documentElement.classList.add("section-scroll-enabled");
    window.addEventListener("wheel", wheel, { passive: false });
    window.addEventListener("touchstart", touchStart, { passive: true });
    window.addEventListener("touchmove", touchMove, { passive: false });
    window.addEventListener("keydown", keydown);
    root.addEventListener("click", click);
    return () => {
      disposed = true;
      animations.forEach((animation) => animation.cancel());
      window.removeEventListener("wheel", wheel);
      window.removeEventListener("touchstart", touchStart);
      window.removeEventListener("touchmove", touchMove);
      window.removeEventListener("keydown", keydown);
      root.removeEventListener("click", click);
      root.classList.remove("scroll-ready");
      document.documentElement.classList.remove("section-scroll-enabled");
      panels.forEach((panel) => { panel.inert = false; });
    };
  }, []);

  return <main id="top" ref={rootRef}>{children}</main>;
}
