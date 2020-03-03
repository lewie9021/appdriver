class Gesture {
  constructor(inputs) {
    this.inputs = inputs;
  }

  resolve() {
    const maxInputs = this.inputs.reduce((result, actions) => {
      if (actions.length <= result) {
        return result;
      }

      return actions.length;
    }, 0);

    let result = [];
    for (let i = 0; i < maxInputs; i += 1) {
      result[i] = {
        id: `finger${i + 1}`,
        type: "pointer",
        parameters: {
          pointerType: "touch"
        },
        actions: this.inputs.map((actions) => {
          return actions[i]
            ? actions[i]
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
