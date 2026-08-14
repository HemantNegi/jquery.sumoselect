'use strict';

const assert = require('node:assert/strict');
const { afterEach, beforeEach, test } = require('node:test');
const { JSDOM } = require('jsdom');

let dom;
let $;
const originalNavigator = Object.getOwnPropertyDescriptor(global, 'navigator');

beforeEach(() => {
  dom = new JSDOM('<!doctype html><html><body></body></html>', {
    pretendToBeVisual: true,
    url: 'https://example.test/'
  });

  global.window = dom.window;
  global.document = dom.window.document;
  Object.defineProperty(global, 'navigator', {
    configurable: true,
    value: dom.window.navigator
  });
  global.Event = dom.window.Event;
  global.NodeList = dom.window.NodeList;

  delete require.cache[require.resolve('jquery')];
  delete require.cache[require.resolve('../jquery.sumoselect.js')];
  $ = require('jquery');
  require('../jquery.sumoselect.js');
});

afterEach(() => {
  dom.window.close();
  delete global.window;
  delete global.document;
  if (originalNavigator) {
    Object.defineProperty(global, 'navigator', originalNavigator);
  } else {
    delete global.navigator;
  }
  delete global.Event;
  delete global.NodeList;
});

function createSelect({ multiple = false, options = {} } = {}) {
  document.body.innerHTML = `
    <select id="country" ${multiple ? 'multiple' : ''}>
      <option value="fr">France</option>
      <option value="de">Germany</option>
      <option value="es">Spain</option>
    </select>
  `;

  const select = $('#country');
  select.SumoSelect(options);
  return { select, sumo: select[0].sumo };
}

test('initializes a single select without replacing the form control', () => {
  const { select, sumo } = createSelect();

  assert.equal(select[0].tagName, 'SELECT');
  assert.equal(select.parent().hasClass('SumoSelect'), true);
  assert.equal(sumo.caption.text().trim(), 'France');
});

test('keeps elementary multiple-select behavior', () => {
  const { select, sumo } = createSelect({ multiple: true });
  const germany = sumo.ul.find('li.opt').eq(1);

  germany.trigger('click');

  assert.equal(select.find('option').eq(1).prop('selected'), true);
  assert.equal(germany.hasClass('selected'), true);
});

test('uses the native select on configured mobile devices unless custom rendering is forced', () => {
  const { select, sumo } = createSelect({
    options: {
      forceCustomRendering: false,
      nativeOnDevice: ['jsdom']
    }
  });

  assert.equal(sumo.mob, true);
  assert.equal(select.hasClass('SelectClass'), true);
  assert.equal(sumo.optDiv, '');
});
