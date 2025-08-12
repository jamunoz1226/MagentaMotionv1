export type Placement = "top" | "bottom" | "left" | "right";

export interface PlacementOptions {
  preferred?: Placement;
  offset?: number;
  containerPadding?: number;
  // When true, try to avoid covering the anchor point by keeping
  // popover's rectangle away from anchor center with extra offset
  avoidAnchorCover?: boolean;
}

export interface RectLike {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PlacementResult {
  left: number;
  top: number;
  placement: Placement;
}

/**
 * Calculates popover coordinates relative to the viewport, clamped within the container and viewport.
 */
export function calcPopoverPlacement(
  anchorRect: RectLike,
  containerRect: RectLike,
  popoverSize: { width: number; height: number },
  options: PlacementOptions = {}
): PlacementResult {
  const preferred: Placement = options.preferred ?? "top";
  const offset = options.offset ?? 8;
  const padding = options.containerPadding ?? 8;

  // Candidate placements in priority order
  const candidates: Placement[] = [preferred, ...["top", "right", "bottom", "left"].filter(p => p !== preferred)];

  const anchorCenterX = anchorRect.x + anchorRect.width / 2;
  const anchorCenterY = anchorRect.y + anchorRect.height / 2;

  // Compute viewport constraints
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  function within(v: number, min: number, max: number) {
    return Math.max(min, Math.min(max, v));
  }

  for (const placement of candidates) {
    let left = 0;
    let top = 0;
    if (placement === "top") {
      left = anchorCenterX - popoverSize.width / 2;
      top = anchorRect.y - popoverSize.height - offset;
    } else if (placement === "bottom") {
      left = anchorCenterX - popoverSize.width / 2;
      top = anchorRect.y + anchorRect.height + offset;
    } else if (placement === "left") {
      left = anchorRect.x - popoverSize.width - offset;
      top = anchorCenterY - popoverSize.height / 2;
    } else {
      // right
      left = anchorRect.x + anchorRect.width + offset;
      top = anchorCenterY - popoverSize.height / 2;
    }

    // Clamp to container
    const minLeft = containerRect.x + padding;
    const maxLeft = containerRect.x + containerRect.width - padding - popoverSize.width;
    const minTop = containerRect.y + padding;
    const maxTop = containerRect.y + containerRect.height - padding - popoverSize.height;

    let clampedLeft = within(left, minLeft, maxLeft);
    let clampedTop = within(top, minTop, maxTop);

    // Also ensure on screen (viewport) as final clamp
    clampedLeft = within(clampedLeft, 0 + padding, viewportWidth - padding - popoverSize.width);
    clampedTop = within(clampedTop, 0 + padding, viewportHeight - padding - popoverSize.height);

    // If avoidAnchorCover is requested, ensure the popover doesn't cover the anchor center point
    if (options.avoidAnchorCover) {
      const coversAnchor =
        clampedLeft <= anchorCenterX &&
        anchorCenterX <= clampedLeft + popoverSize.width &&
        clampedTop <= anchorCenterY &&
        anchorCenterY <= clampedTop + popoverSize.height;

      if (coversAnchor) {
        // Nudge further away along the main axis if possible
        switch (placement) {
          case "top":
            clampedTop = Math.min(clampedTop, anchorRect.y - popoverSize.height - offset);
            break;
          case "bottom":
            clampedTop = Math.max(clampedTop, anchorRect.y + anchorRect.height + offset);
            break;
          case "left":
            clampedLeft = Math.min(clampedLeft, anchorRect.x - popoverSize.width - offset);
            break;
          case "right":
            clampedLeft = Math.max(clampedLeft, anchorRect.x + anchorRect.width + offset);
            break;
        }
      }
    }

    // Basic visibility check: at least 60% of popover visible within container
    const visibleWidth = Math.min(clampedLeft + popoverSize.width, containerRect.x + containerRect.width) - Math.max(clampedLeft, containerRect.x);
    const visibleHeight = Math.min(clampedTop + popoverSize.height, containerRect.y + containerRect.height) - Math.max(clampedTop, containerRect.y);
    const visibleArea = Math.max(0, visibleWidth) * Math.max(0, visibleHeight);
    const area = popoverSize.width * popoverSize.height;

    if (visibleArea >= area * 0.6) {
      return { left: clampedLeft, top: clampedTop, placement };
    }
  }

  // Fallback: center within container
  const fallbackLeft = containerRect.x + (containerRect.width - popoverSize.width) / 2;
  const fallbackTop = containerRect.y + (containerRect.height - popoverSize.height) / 2;
  return {
    left: within(fallbackLeft, 0, viewportWidth - popoverSize.width),
    top: within(fallbackTop, 0, viewportHeight - popoverSize.height),
    placement: preferred,
  };
}
