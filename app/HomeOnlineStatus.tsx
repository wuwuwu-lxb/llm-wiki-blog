"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { OnlineStatus } from "./client-types";
import type { TailscaleStatusSummary } from "@/lib/tailscale";

type HomeOnlineStatusProps = {
  onlineStatus: OnlineStatus | null;
  tailscaleStatus: TailscaleStatusSummary;
};

type PopoverPosition = {
  left: number;
  top: number;
  width: number;
};

export function HomeOnlineStatus({ onlineStatus, tailscaleStatus }: HomeOnlineStatusProps) {
  const dotRef = useRef<HTMLSpanElement>(null);
  const closeTimerRef = useRef<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<PopoverPosition>({ left: 0, top: 0, width: 300 });

  useLayoutEffect(() => {
    if (!isOpen) {
      return;
    }

    function updatePosition() {
      const dot = dotRef.current;
      if (!dot) {
        return;
      }

      const rect = dot.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const popoverWidth = Math.min(300, viewportWidth - 32);

      if (viewportWidth < 560) {
        setPosition({
          left: 16,
          top: rect.bottom + 14,
          width: popoverWidth,
        });
        return;
      }

      const rightSideLeft = rect.right + 16;
      const hasRightSpace = rightSideLeft + popoverWidth <= viewportWidth - 16;
      const left = hasRightSpace ? rightSideLeft : Math.max(16, rect.left - popoverWidth - 16);

      setPosition({
        left,
        top: Math.max(82, rect.top - 18),
        width: popoverWidth,
      });
    }

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isOpen]);

  function openPopover() {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setIsOpen(true);
  }

  function closePopoverSoon() {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
    }
    closeTimerRef.current = window.setTimeout(() => setIsOpen(false), 120);
  }

  const popover = isOpen
    ? createPortal(
        <span
          className="home-online-popover"
          onMouseEnter={openPopover}
          onMouseLeave={closePopoverSoon}
          style={{ left: position.left, top: position.top, width: position.width }}
        >
          <span className="profile-status-line">
            <strong>状态</strong>
            <span>{onlineStatus?.message ?? "暂无状态"}</span>
          </span>
          <span className="device-status-summary">
            <strong>在线 {tailscaleStatus.onlineCount} / {tailscaleStatus.totalCount}</strong>
          </span>
          {tailscaleStatus.devices.length > 0 ? (
            <span className="device-status-list">
              {tailscaleStatus.devices.map((device) => (
                <span className="device-status-row" key={device.id}>
                  <i data-online={device.online} />
                  <span>{device.name}</span>
                  <em>{device.os}</em>
                </span>
              ))}
            </span>
          ) : (
            <small>{tailscaleStatus.configured ? "暂时没有可展示设备" : "Tailscale API 未配置"}</small>
          )}
        </span>,
        document.body,
      )
    : null;

  return (
    <>
      <span
        ref={dotRef}
        className="home-online-dot"
        aria-label="在线状态"
        onBlur={closePopoverSoon}
        onFocus={openPopover}
        onMouseEnter={openPopover}
        onMouseLeave={closePopoverSoon}
        tabIndex={0}
      />
      {popover}
    </>
  );
}
