const getRelativePoint = ({ x = 0, y = 0, direction, distance }) => {
  const radians = direction * (Math.PI / 180);
  const x2 = Math.round(Math.sin(radians) * distance);
  const y2 = Math.round(Math.cos(radians) * distance);

  return {
    x: x + x2,
    y: y + (y2 === -0 ? 0 : y2 * -1)
  };
};

module.exports = {
  getRelativePoint
};