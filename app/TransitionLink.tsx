"use client";

import { Link } from "next-view-transitions";
import type { ComponentProps, MouseEvent } from "react";

type TransitionLinkProps = ComponentProps<typeof Link> & {
  sharedScope?: string;
};

export function TransitionLink({ sharedScope, onClick, className, ...props }: TransitionLinkProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (sharedScope && !event.defaultPrevented) {
      const source = event.currentTarget;
      const transitionToken = `${sharedScope}-${Date.now()}`;
      source.classList.add("transition-source");
      document.documentElement.dataset.sharedTransition = sharedScope;
      document.documentElement.dataset.sharedTransitionToken = transitionToken;
      window.setTimeout(() => {
        if (document.documentElement.dataset.sharedTransitionToken !== transitionToken) {
          return;
        }

        source.classList.remove("transition-source");
        delete document.documentElement.dataset.sharedTransition;
        delete document.documentElement.dataset.sharedTransitionToken;
      }, 6200);
    }

    onClick?.(event);
  }

  return <Link className={className} onClick={handleClick} {...props} />;
}
