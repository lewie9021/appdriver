const transformBounds = (x) => {
  const coordinates = x.match(/(\d|\.)+/g);

  return {
    x1: parseFloat(coordinates[0]),
    y1: parseFloat(coordinates[1]),
    x2: parseFloat(coordinates[2]),
    y2: parseFloat(coordinates[3])
  };
};

module.exports = {
  transformBounds
};