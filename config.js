'use strict';

const WIT_TOKEN = process.env.WIT_TOKEN || '532SMYDNILXEVS7CRD37ZLP2D6KLAGI4';
if (!WIT_TOKEN) {
  throw new Error('Missing WIT_TOKEN. Go to https://wit.ai/docs/quickstart to get one.')
}

//EAATPOypj3vwBAIfuW9qOxWiEgUL1ebSij52C3zTZCcnwwcSiKJ4D5YuHgz35G6uDrZBtOEtZCMFWQpyjScWMQrFK1p16EcEny83i7LZAY1W7d6YHuPvCIchqY44USXH39mgSvzZBgEFswVKRNaMcOJFJ0g3zi3ArEi18GjlYIaQZDZD

var FB_PAGE_TOKEN = process.env.FB_PAGE_TOKEN || 'EAATPOypj3vwBAIfuW9qOxWiEgUL1ebSij52C3zTZCcnwwcSiKJ4D5YuHgz35G6uDrZBtOEtZCMFWQpyjScWMQrFK1p16EcEny83i7LZAY1W7d6YHuPvCIchqY44USXH39mgSvzZBgEFswVKRNaMcOJFJ0g3zi3ArEi18GjlYIaQZDZD';

if (!FB_PAGE_TOKEN) {
	throw new Error('Missing FB_PAGE_TOKEN. Go to https://developers.facebook.com/docs/pages/access-tokens to get one.')
}

var FB_VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN || 'just_do_it'

module.exports = {
  WIT_TOKEN: WIT_TOKEN,
  FB_PAGE_TOKEN: FB_PAGE_TOKEN,
  FB_VERIFY_TOKEN: FB_VERIFY_TOKEN,
}
