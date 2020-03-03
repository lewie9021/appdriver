class Gesture {
  constructor(ticks) {
    this.ticks = ticks;
  }

  resolve() {
    const maxInputs = this.ticks.reduce((result, inputs) => {
      if (inputs.length <= result) {
        return result;
      }

      return inputs.length;
    }, 0);

    let result = [];
    for (let i = 0; i < maxInputs; i += 1) {
      result[i] = {
        id: `finger${i + 1}`,
        type: "pointer",
        parameters: {
          pointerType: "touch"
        },
        actions: this.ticks.map((inputs) => {
          return inputs[i]
            ? inputs[i]
            : { type: "pause" };
        })
      };
    }

    if (!result.length) {
      throw new Error("Gesture is empty.");
    }

    return result;
  }
}

module.exports = Gesture;
