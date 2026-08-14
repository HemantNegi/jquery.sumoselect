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

function initialize(markup, selector = 'select', options = {}) {
  document.body.innerHTML = markup;
  const select = $(selector);
  select.SumoSelect(options);
  return { select, sumo: select[0].sumo };
}

test('initializes a single select without replacing the form control', () => {
  const { select, sumo } = createSelect();

  assert.equal(select[0].tagName, 'SELECT');
  assert.equal(select.parent().hasClass('SumoSelect'), true);
  assert.equal(sumo.caption.text().trim(), 'France');
});

test('creates the combobox, listbox and option accessibility model', () => {
  const { select, sumo } = createSelect();
  const options = sumo.ul.find('li.opt');

  assert.equal(sumo.select.attr('role'), 'combobox');
  assert.equal(sumo.select.attr('aria-expanded'), 'false');
  assert.equal(sumo.select.attr('aria-haspopup'), 'listbox');
  assert.equal(sumo.select.attr('aria-controls'), sumo.ul.attr('id'));
  assert.equal(sumo.ul.attr('role'), 'listbox');
  assert.equal(options.eq(0).attr('role'), 'option');
  assert.equal(options.eq(0).attr('aria-selected'), 'true');
  assert.equal(options.eq(1).attr('aria-selected'), 'false');
  assert.equal(select.attr('aria-hidden'), 'true');
  assert.equal(select.attr('tabindex'), '-1');
});

test('uses unique listbox and option ids for every instance', () => {
  document.body.innerHTML = `
    <select class="country"><option>France</option></select>
    <select class="country"><option>Germany</option></select>
  `;

  $('select.country').SumoSelect();
  const first = $('select.country')[0].sumo;
  const second = $('select.country')[1].sumo;

  assert.notEqual(first.ul.attr('id'), second.ul.attr('id'));
  assert.notEqual(first.ul.find('[role="option"]').attr('id'), second.ul.find('[role="option"]').attr('id'));
});

test('derives the accessible name in explicit ARIA then label order', () => {
  const explicit = initialize(`
    <span id="explicit-name">Explicit country</span>
    <label for="country">Associated country</label>
    <select id="country" aria-labelledby="explicit-name" aria-label="Fallback country">
      <option>France</option>
    </select>
  `).sumo;
  assert.equal(explicit.select.attr('aria-labelledby'), 'explicit-name');
  assert.equal(explicit.select.attr('aria-label'), undefined);

  explicit.unload();
  document.body.innerHTML = `
    <label for="country">Associated country</label>
    <select id="country" aria-label="ARIA country"><option>France</option></select>
  `;
  const ariaLabel = $('#country');
  ariaLabel.SumoSelect();
  assert.equal(ariaLabel[0].sumo.select.attr('aria-label'), 'ARIA country');

  ariaLabel[0].sumo.unload();
  document.body.innerHTML = `
    <label for="country">Associated country</label>
    <select id="country"><option>France</option></select>
  `;
  const associated = $('#country');
  associated.SumoSelect();
  assert.equal(associated[0].sumo.select.attr('aria-label'), 'Associated country');
});

test('propagates form state and descriptions to the custom control', () => {
  const { sumo } = initialize(`
    <span id="hint">Choose one country</span>
    <select required aria-invalid="true" aria-describedby="hint">
      <option>France</option>
    </select>
  `);

  assert.equal(sumo.select.attr('aria-required'), 'true');
  assert.equal(sumo.select.attr('aria-invalid'), 'true');
  assert.equal(sumo.select.attr('aria-describedby'), 'hint');
  assert.equal(sumo.select.attr('aria-disabled'), 'false');
});

test('redirects an associated label click to the visible focus target', () => {
  const { sumo } = initialize(`
    <label for="country">Country</label>
    <select id="country"><option>France</option></select>
  `);

  document.querySelector('label').dispatchEvent(new window.MouseEvent('click', { bubbles: true }));

  assert.equal(document.activeElement, sumo.select[0]);
});

test('keeps elementary multiple-select behavior', () => {
  const { select, sumo } = createSelect({ multiple: true });
  const germany = sumo.ul.find('li.opt').eq(1);

  germany.trigger('click');

  assert.equal(select.find('option').eq(1).prop('selected'), true);
  assert.equal(germany.hasClass('selected'), true);
  assert.equal(sumo.select.attr('role'), 'button');
  assert.equal(sumo.ul.attr('role'), 'listbox');
  assert.equal(sumo.ul.attr('aria-multiselectable'), 'true');
  assert.equal(germany.attr('aria-selected'), 'true');
});

test('synchronizes disabled state and restores native attributes on unload', () => {
  const { select, sumo } = initialize(`
    <select tabindex="3"><option>France</option></select>
  `);

  sumo.disable();
  assert.equal(sumo.select.attr('aria-disabled'), 'true');
  assert.equal(sumo.select.attr('tabindex'), undefined);

  sumo.enable();
  assert.equal(sumo.select.attr('aria-disabled'), 'false');
  assert.equal(sumo.select.attr('tabindex'), '0');

  sumo.unload();
  assert.equal(select.attr('tabindex'), '3');
  assert.equal(select.attr('aria-hidden'), undefined);
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
  assert.equal(sumo.select.attr('role'), undefined);
  assert.equal(sumo.select.attr('tabindex'), undefined);
  assert.equal(select.attr('aria-hidden'), undefined);
});
