const transformBounds = (x) => {
  const coordinates = x.match(/(\d|\.)+/g);

  return {
    x1: coordinates[0],
    y1: coordinates[1],
    x2: coordinates[2],
    y2: coordinates[3]
  };
};

module.exports = {
  transformBounds
};