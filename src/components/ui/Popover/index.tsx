import { cn } from "@/utils/cn";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./styles.module.scss";

interface PopoverProps {
  content?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  placement?: "top" | "bottom";
  /**
   * Como o popover é acionado:
   * - "hover": Abre no hover, fecha quando mouse sai (do trigger E do popover)
   * - "click": Abre/fecha no clique, fecha ao clicar fora
   */
  trigger?: "hover" | "click";
  /**
   * Delay em ms antes de fechar no mouse leave (só para trigger="hover")
   * Útil para dar tempo do usuário mover o mouse até o popover
   */
  closeDelay?: number;
  contentClassName?: string;
  interactive?: boolean;
  triggerClassName?: string;
}

interface PopoverPosition {
  top: number;
  left: number;
  arrowLeft: number;
  placement: "top" | "bottom";
}

export const Popover = ({
  content,
  children,
  className,
  placement = "top",
  trigger = "hover",
  closeDelay = 100,
  contentClassName,
  interactive = false,
  triggerClassName,
}: PopoverProps) => {
  const triggerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isVisible, setIsVisible] = useState(false);
  const [isPositioned, setIsPositioned] = useState(false);
  const [position, setPosition] = useState<PopoverPosition>({
    top: 0,
    left: 0,
    arrowLeft: 0,
    placement: "top",
  });

  // Limpa timeout ao desmontar
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  const calculatePosition = useCallback(() => {
    if (!triggerRef.current || !popoverRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const popoverRect = popoverRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    const gap = 8;

    // Calcula posição horizontal centralizada
    let left =
      triggerRect.left +
      scrollX +
      triggerRect.width / 2 -
      popoverRect.width / 2;

    // Limita aos bounds da viewport
    const minLeft = gap;
    const maxLeft = viewportWidth - popoverRect.width - gap;
    left = Math.max(minLeft, Math.min(left, maxLeft));

    // Calcula posição vertical
    let actualPlacement = placement;
    let top: number;

    if (placement === "top") {
      top = triggerRect.top + scrollY - popoverRect.height - gap;
      if (triggerRect.top - popoverRect.height - gap < 0) {
        top = triggerRect.bottom + scrollY + gap;
        actualPlacement = "bottom";
      }
    } else {
      top = triggerRect.bottom + scrollY + gap;
      if (triggerRect.bottom + popoverRect.height + gap > viewportHeight) {
        top = triggerRect.top + scrollY - popoverRect.height - gap;
        actualPlacement = "top";
      }
    }

    // Calcula posição da arrow relativa ao popover
    const triggerCenter = triggerRect.left + scrollX + triggerRect.width / 2;
    const arrowLeft = Math.max(
      12,
      Math.min(triggerCenter - left, popoverRect.width - 12)
    );

    setPosition({ top, left, arrowLeft, placement: actualPlacement });
    setIsPositioned(true);
  }, [placement]);

  // Calcula posição quando ficar visível
  useEffect(() => {
    if (isVisible && content) {
      setIsPositioned(false);
      requestAnimationFrame(() => {
        calculatePosition();
      });
    }
  }, [isVisible, content, calculatePosition]);

  // Event listeners para resize/scroll
  useEffect(() => {
    if (!isVisible) return;

    const handleResize = () => calculatePosition();
    const handleScroll = () => calculatePosition();

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, { capture: true });

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll, { capture: true });
    };
  }, [isVisible, calculatePosition]);

  // Click outside para trigger="click"
  useEffect(() => {
    if (!isVisible || trigger !== "click") return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isOutsideTrigger = !triggerRef.current?.contains(target);
      const isOutsidePopover = !popoverRef.current?.contains(target);

      if (isOutsideTrigger && isOutsidePopover) {
        setIsVisible(false);
      }
    };

    const timeoutId = setTimeout(() => {
      document.addEventListener("click", handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isVisible, trigger]);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const cancelClose = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const scheduleClose = () => {
    if (!interactive) {
      setIsVisible(false);
      return;
    }

    cancelClose();
    closeTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, closeDelay);
  };

  const handleTriggerMouseEnter = () => {
    if (trigger === "hover") {
      cancelClose();
      setIsVisible(true);
    }
  };

  const handlePopoverClick = () => {
    if (trigger === "click") {
      setIsVisible((prev) => !prev);
    }
  };

  const handleTriggerMouseLeave = () => {
    if (trigger === "hover") {
      scheduleClose();
    }
  };

  const handlePopoverMouseEnter = () => {
    if (trigger === "hover" && interactive) {
      cancelClose();
    }
  };

  const handlePopoverMouseLeave = () => {
    if (trigger === "hover") {
      scheduleClose();
    }
  };

  const handleTriggerClick = () => {
    if (trigger === "click") {
      setIsVisible((prev) => !prev);
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  if (!content) return <>{children}</>;

  const popoverElement = isVisible && (
    <div
      ref={popoverRef}
      className={cn(
        styles.popover,
        styles[position.placement],
        { [styles.visible]: isPositioned },
        className
      )}
      style={{
        top: position.top,
        left: position.left,
        visibility: isPositioned ? "visible" : "hidden",
      }}
      onMouseEnter={handlePopoverMouseEnter}
      onMouseLeave={handlePopoverMouseLeave}
      onClick={handlePopoverClick}
    >
      <div className={cn(styles.content, contentClassName)}>{content}</div>
      <div className={styles.arrow} style={{ left: position.arrowLeft }} />
    </div>
  );

  return (
    <>
      <div
        ref={triggerRef}
        className={cn(styles.trigger, triggerClassName)}
        onMouseEnter={handleTriggerMouseEnter}
        onMouseLeave={handleTriggerMouseLeave}
        onClick={handleTriggerClick}
      >
        {children}
      </div>
      {createPortal(
        popoverElement,
        document.getElementById("root") as HTMLElement
      )}
    </>
  );
};
