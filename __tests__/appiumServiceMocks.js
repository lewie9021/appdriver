const createFindElementMock = ({ elementId = "elementId" } = {}) => ({
  "element-6066-11e4-a52e-4f735466cecf": elementId,
  "ELEMENT": elementId
});

const createFindElementsMock = ({ elementIds = [] } = {}) => {
  return elementIds.map((elementId) => createFindElementMock({ elementId }));
};

module.exports = {
  createFindElementMock,
  createFindElementsMock
};