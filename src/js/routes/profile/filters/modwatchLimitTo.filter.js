export default ModwatchLimitTo;

function ModwatchLimitTo() {
  return (input, limit) => {
    return (input && input.length > limit) ? (input.substr(0, limit) + "...") : input;
  };
}
