const LAYER_TYPE = {
  RESTORE: "restore",
  CROP: "crop",
  RECTANGLE: "rectangle",
  TEXT: "text",
  BUTTON: "button",
};

const getOverlapArea = (startPoint, endPoint, rect, ratio) => {
  // 计算顶点
  const startX = Math.min(startPoint.x, endPoint.x);
  const startY = Math.min(startPoint.y, endPoint.y);
  const endX = Math.max(startPoint.x, endPoint.x);
  const endY = Math.max(startPoint.y, endPoint.y);

  const rectRight = rect.left + rect.width;
  const rectBottom = rect.top + rect.height;

  // 计算重叠区域顶点
  let overlapLeft = Math.max(startX, rect.left);
  let overlapTop = Math.max(startY, rect.top);
  let overlapRight = Math.min(endX, rectRight);
  let overlapBottom = Math.min(endY, rectBottom);

  // 重叠区域宽高
  let overlapWidth = Math.max(0, overlapRight - overlapLeft);
  let overlapHeight = Math.max(0, overlapBottom - overlapTop);

  if (overlapWidth === 0 || overlapHeight === 0) {
    return null;
  }

  // 比例约束
  if (ratio) {
    const currentRatio = overlapWidth / overlapHeight;
    let width;
    let height;
    if (currentRatio < ratio) {
      height = overlapHeight;
      width = Math.round(height * ratio);
    } else {
      width = overlapWidth;
      height = Math.round(width / ratio);
    }

    if (endPoint.y < startPoint.y) {
      // 固定底部
      const overlapBottom = overlapTop + overlapHeight;
      overlapTop = overlapBottom - height;
    }

    if (endPoint.x < startPoint.x) {
      // 固定右侧
      const overlapRight = overlapLeft + overlapWidth;
      overlapLeft = overlapRight - width;
    }

    overlapHeight = height;
    overlapWidth = width;
  }

  return {
    top: overlapTop,
    left: overlapLeft,
    width: overlapWidth,
    height: overlapHeight,
  };
};

export { LAYER_TYPE, getOverlapArea };
