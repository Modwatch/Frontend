const test = require("tape");
const proxyquire = require("proxyquire");

const { rawState, store, actions } = proxyquire("../../src/store/index", {
  "unistore/devtools": store => store,
  "./local": {
    clearLocalState: () => undefined,
    setLocalState: state => state,
    getLocalState: () => undefined
  }
});

function sum(a, b) {
  return a + b;
}

test('sum should return the addition of two numbers', t => {
  t.equal(3, sum(1, 2)); // make this test pass by completing the add function!
  t.end();
});