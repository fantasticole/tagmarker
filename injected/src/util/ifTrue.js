// Based on ifLike by Jay Zawrotny, the most metal humanoid
export class RenderIfTrue {
  constructor (condition) {
    // update condition value based on what's passed in
    this.condition = condition ? condition : false;
  }

  render (cb) {
    // if the condition is true, return the callback
    if (this.condition) return cb(this.condition);
  }
}

// Only runs callback function if condition is true
export default function ifTrue (condition) {
  return new RenderIfTrue(condition);
}
