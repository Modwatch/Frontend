const test = require("tape");
const proxyquire = require("proxyquire");
const { encode } = require("jwt-simple");
const jwtDecode = require("jwt-decode");

const { rawState, store, actions } = proxyquire("../../src/store/index", {
  "unistore/devtools": store => store,
  "./local": {
    clearLocalState: () => undefined,
    setLocalState: state => state,
    getLocalState: () => undefined
  }
});

test('login should decode the given token and update state.user with the contents', t => {
  const token = {
    sub: "Peanut",
    scopes: ["user"]
  };
  const encodedToken = encode(token, "SECRET");

  t.deepEqual(actions(store).login(rawState, encodedToken), {
    ...rawState,
    user: {
      token: encodedToken,
      authenticated: true,
      username: token.sub,
      scopes: token.scopes
    }
  });
  t.end();
});

test('logout should reset state.user to undefined', t => {
  t.deepEqual(actions(store).logout(rawState), {
    ...rawState,
    user: undefined
  });
  t.end();
});

test('loadAdsenseAds should short circuit if adsense has loaded or failed', async t => {
  t.deepEqual(await actions(store).loadAdsenseAds({
    ...rawState,
    adsense: {
      loaded: true
    }
  }), {
    ...rawState,
    adsense: {
      loaded: true
    }
  });
  t.deepEqual(await actions(store).loadAdsenseAds({
    ...rawState,
    adsense: {
      failed: true
    }
  }), {
    ...rawState,
    adsense: {
      failed: true
    }
  });
  t.end();
});