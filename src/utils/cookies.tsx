import { serialize, CookieSerializeOptions } from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest } from 'next/server';
 
/**
 * 
 * @param res NextApiResponse
 * @param name Name of the Cookie
 * @param value Value of the Cookie
 * @param options Options
 */
export const setCookie = (
  res: NextApiResponse,
  name: string,
  value: unknown,
  options: CookieSerializeOptions = {},
) => {
  const stringValue =
    typeof value === 'object' ? 'j:' + JSON.stringify(value) : String(value);
 
  if (typeof options.maxAge === 'number') {
    options.expires = new Date(Date.now() + options.maxAge * 1000);
  }
 
  res.setHeader('Set-Cookie', serialize(name, stringValue, options));
};

/**
 * 
 * @param req NextApiReqeust
 * @param name Name of the Cookie
 * @returns Returns the Value of the Cookie or undefined
 */
export const getCookie = (
    req: NextApiRequest,
    name: string,
) => {
    const cookie = req.headers.cookie;
    var cookies = cookie? cookie.split(';') : [];
    for (var i = 0; i < cookies.length; i++) {
        var c = cookies[i];
        var eqPos = c.indexOf('=');
        var n = eqPos > -1? c.substr(0, eqPos) : c;
        if (n.trim() == name) {
            return decodeURIComponent(c.substr(eqPos + 1));
        }
    }
    if (!cookie) {
      return undefined;
    }
    return undefined;
};

