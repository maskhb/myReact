import _ from 'lodash';

const AUTHORITYKEY = 'ht-authority';

export function getAuthority() {
  let auth;
  try {
    auth = _.compact(JSON.parse(localStorage.getItem(AUTHORITYKEY)));
    if (auth.length === 0) {
      // localstorage没有值，未登录状态
      auth = ['guest'];
    } else {
      // localstorage有值，登录状态
      auth = _.uniq(_.concat(auth, ['user']));
    }
  } catch (e) {
    auth = ['guest'];
    setAuthority(auth);
  }

  return auth;
}

export function setAuthority(authority) {
  let auth = [];
  if (authority?.constructor.name === 'Array') {
    auth = authority;
  } else if (authority?.constructor.name === 'String') {
    auth = [authority];
  }
  auth = _.uniq(_.compact(auth));
  localStorage.setItem(AUTHORITYKEY, JSON.stringify(auth));
}
