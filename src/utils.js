const isArrayString = array => array.every(elem => (typeof elem === 'string' || elem instanceof String));

module.exports = {
  isArrayString,
};
