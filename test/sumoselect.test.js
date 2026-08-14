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

function press(target, which, key, modifiers = {}) {
  const event = $.Event('keydown', {
    bubbles: true,
    key,
    which,
    ...modifiers
  });
  $(target).trigger(event);
  return event;
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

test('opens, exposes an active descendant and closes without a focus trap', () => {
  const { sumo } = createSelect();

  press(sumo.select, 13, 'Enter');
  assert.equal(sumo.is_opened, true);
  assert.equal(sumo.select.attr('aria-expanded'), 'true');
  assert.equal(sumo.select.attr('aria-activedescendant'), sumo.ul.find('li.opt').eq(0).attr('id'));

  press(sumo.select, 27, 'Escape');
  assert.equal(sumo.is_opened, false);
  assert.equal(sumo.select.attr('aria-expanded'), 'false');
  assert.equal(sumo.select.attr('aria-activedescendant'), undefined);
  assert.equal(document.activeElement, sumo.select[0]);
});

test('navigates enabled options with arrows, Home and End', () => {
  const { sumo } = initialize(`
    <select>
      <option>France</option>
      <option disabled>Germany</option>
      <option>Italy</option>
      <option>Spain</option>
    </select>
  `);

  press(sumo.select, 13, 'Enter');
  press(sumo.select, 40, 'ArrowDown');
  assert.equal(sumo.ul.find('li.sel').text(), 'Italy');

  press(sumo.select, 35, 'End');
  assert.equal(sumo.ul.find('li.sel').text(), 'Spain');

  press(sumo.select, 36, 'Home');
  assert.equal(sumo.ul.find('li.sel').text(), 'France');

  press(sumo.select, 38, 'ArrowUp');
  assert.equal(sumo.ul.find('li.sel').text(), 'France');
});

test('typeahead activates a multi-character prefix without changing the select', () => {
  const { select, sumo } = initialize(`
    <select>
      <option value="de" selected>Germany</option>
      <option value="fr">France</option>
      <option value="fi">Finland</option>
    </select>
  `);
  let changes = 0;
  select.on('change', () => changes++);

  press(sumo.select, 70, 'F');
  press(sumo.select, 82, 'r');

  assert.equal(sumo.is_opened, true);
  assert.equal(sumo.ul.find('li.sel').text(), 'France');
  assert.equal(sumo.select.attr('aria-activedescendant'), sumo.ul.find('li.sel').attr('id'));
  assert.equal(select.val(), 'de');
  assert.equal(changes, 0);

  press(sumo.select, 13, 'Enter');
  assert.equal(select.val(), 'fr');
  assert.equal(changes, 1);
  assert.equal(sumo.is_opened, false);
  assert.equal(sumo.ul.find('li.opt').eq(1).attr('aria-selected'), 'true');
});

test('letter A reaches typeahead instead of the multiple-select Ctrl+A shortcut', () => {
  const { select, sumo } = initialize(`
    <select>
      <option value="de" selected>Germany</option>
      <option value="al">Allemagne</option>
    </select>
  `);
  let changes = 0;
  select.on('change', () => changes++);

  press(sumo.select, 65, 'A');

  assert.equal(sumo.is_opened, true);
  assert.equal(sumo.ul.find('li.sel').text(), 'Allemagne');
  assert.equal(select.val(), 'de');
  assert.equal(changes, 0);

  press(sumo.select, 13, 'Enter');
  assert.equal(select.val(), 'al');
  assert.equal(changes, 1);
});

test('Space validates the active option exactly once', () => {
  const { select, sumo } = initialize(`
    <select>
      <option value="de" selected>Germany</option>
      <option value="fr">France</option>
    </select>
  `);
  let changes = 0;
  select.on('change', () => changes++);

  press(sumo.select, 70, 'F');
  press(sumo.select, 32, ' ');

  assert.equal(select.val(), 'fr');
  assert.equal(changes, 1);
  assert.equal(sumo.is_opened, false);
});

test('mouse selection synchronizes all states and emits one change', () => {
  const { select, sumo } = createSelect();
  let changes = 0;
  select.on('change', () => changes++);

  sumo.showOpts();
  sumo.ul.find('li.opt').eq(1).trigger('click');

  assert.equal(select.val(), 'de');
  assert.equal(sumo.caption.text().trim(), 'Germany');
  assert.equal(sumo.ul.find('li.opt').eq(0).hasClass('selected'), false);
  assert.equal(sumo.ul.find('li.opt').eq(0).attr('aria-selected'), 'false');
  assert.equal(sumo.ul.find('li.opt').eq(1).hasClass('selected'), true);
  assert.equal(sumo.ul.find('li.opt').eq(1).attr('aria-selected'), 'true');
  assert.equal(changes, 1);
});

test('restores the option contract when renderLi returns a replacement element', () => {
  const { select, sumo } = initialize(`
    <select>
      <option value="fr" selected>France</option>
      <option value="de">Germany</option>
    </select>
  `, 'select', {
    renderLi(_li, option) {
      return $('<li class="replacement"><strong></strong></li>')
        .find('strong')
        .text(option.text())
        .end();
    }
  });
  let changes = 0;
  select.on('change', () => changes++);

  const germany = sumo.ul.find('li.opt').eq(1);
  assert.equal(germany.hasClass('replacement'), true);
  assert.equal(germany.attr('role'), 'option');
  assert.match(germany.attr('id'), /^sumoselect-\d+-option-\d+$/);
  assert.equal(germany.data('opt')[0], select.find('option').eq(1)[0]);

  germany.trigger('click');
  assert.equal(select.val(), 'de');
  assert.equal(germany.attr('aria-selected'), 'true');
  assert.equal(changes, 1);
});

test('Escape and Tab close without committing an active-only option', () => {
  const { select, sumo } = initialize(`
    <select>
      <option value="de" selected>Germany</option>
      <option value="fr">France</option>
    </select>
  `);
  let changes = 0;
  select.on('change', () => changes++);

  press(sumo.select, 70, 'F');
  press(sumo.select, 27, 'Escape');
  assert.equal(select.val(), 'de');
  assert.equal(changes, 0);

  press(sumo.select, 70, 'F');
  press(sumo.select, 9, 'Tab');
  assert.equal(select.val(), 'de');
  assert.equal(changes, 0);
  assert.equal(sumo.is_opened, false);
});

test('repeated characters cycle matches and skip disabled options', () => {
  const { sumo } = initialize(`
    <select>
      <option selected>Germany</option>
      <option>France</option>
      <option disabled>Fiji</option>
      <option>Finland</option>
    </select>
  `);

  press(sumo.select, 70, 'f');
  assert.equal(sumo.ul.find('li.sel').text(), 'France');
  press(sumo.select, 70, 'f');
  assert.equal(sumo.ul.find('li.sel').text(), 'Finland');
  assert.equal(sumo.ul.find('li.sel').hasClass('disabled'), false);
});

test('typeahead normalizes accents and resets after its configured delay', async () => {
  const { sumo } = initialize(`
    <select>
      <option selected>Germany</option>
      <option>École</option>
      <option>Romania</option>
      <option>France</option>
    </select>
  `, 'select', { typeaheadDelay: 20 });

  press(sumo.select, 69, 'e');
  assert.equal(sumo.ul.find('li.sel').text(), 'École');

  press(sumo.select, 70, 'f');
  await new Promise(resolve => setTimeout(resolve, 30));
  press(sumo.select, 82, 'r');
  assert.equal(sumo.ul.find('li.sel').text(), 'Romania');
});

test('gives visible search an accessible name and keeps active focus visible', () => {
  const { select, sumo } = initialize(`
    <select>
      <option value="fr" selected>France</option>
      <option value="de">Germany</option>
      <option value="es">Spain</option>
    </select>
  `, 'select', { search: true, searchLabel: 'Search countries' });

  press(sumo.select, 13, 'Enter');
  assert.equal(sumo.ftxt.attr('aria-label'), 'Search countries');
  assert.equal(sumo.ftxt.attr('aria-controls'), sumo.ul.attr('id'));
  assert.equal(document.activeElement, sumo.ftxt[0]);

  sumo.ftxt.val('sp').trigger('input.sumo');
  const active = sumo.ul.find('li.sel');
  assert.equal(active.text(), 'Spain');
  assert.equal(active.hasClass('hidden'), false);
  assert.equal(active.hasClass('disabled'), false);
  assert.equal(sumo.ftxt.attr('aria-activedescendant'), active.attr('id'));
  assert.equal(select.find('option').eq(0).prop('hidden'), false);
});

test('keeps search focus when the source select is wrapped by a label', () => {
  const { sumo } = initialize(`
    <label>
      <span>Country</span>
      <select>
        <option>France</option>
        <option>Germany</option>
      </select>
    </label>
  `, 'select', { search: true });

  press(sumo.select, 13, 'Enter');
  sumo.ftxt.trigger('click');

  assert.equal(document.activeElement, sumo.ftxt[0]);
  assert.equal(sumo.select.attr('aria-label'), 'Country');
});

test('search never commits a stale hidden option', () => {
  const { select, sumo } = initialize(`
    <select>
      <option value="fr" selected>France</option>
      <option value="de">Germany</option>
      <option value="es">Spain</option>
    </select>
  `, 'select', { search: true });
  let changes = 0;
  select.on('change', () => changes++);

  press(sumo.select, 13, 'Enter');
  sumo.ftxt.val('sp').trigger('input.sumo');
  press(sumo.ftxt, 13, 'Enter');

  assert.equal(select.val(), 'es');
  assert.equal(changes, 1);
  assert.equal(sumo.ul.find('li.opt').eq(2).attr('aria-selected'), 'true');
});

test('announces no search results and clears the active descendant', () => {
  const { sumo } = initialize(`
    <select>
      <option>France</option>
      <option>Germany</option>
    </select>
  `, 'select', { search: true });

  press(sumo.select, 13, 'Enter');
  sumo.ftxt.val('zzz').trigger('input.sumo');
  const status = sumo.optDiv.find('.no-match');

  assert.equal(status.attr('role'), 'status');
  assert.equal(status.attr('aria-live'), 'polite');
  assert.match(status.text(), /zzz/);
  assert.notEqual(status.css('display'), 'none');
  assert.equal(sumo.ul.find('li.sel').length, 0);
  assert.equal(sumo.select.attr('aria-activedescendant'), undefined);
  assert.equal(sumo.ftxt.attr('aria-activedescendant'), undefined);
});

test('navigation and typeahead ignore options hidden by the source markup', () => {
  const { sumo } = initialize(`
    <select>
      <option selected>Germany</option>
      <option hidden>France</option>
      <option>Finland</option>
    </select>
  `);

  press(sumo.select, 70, 'f');
  assert.equal(sumo.ul.find('li.sel').text(), 'Finland');
  assert.equal(sumo.ul.find('li.opt').eq(1).attr('aria-hidden'), 'true');
});

test('keeps elementary multiple-select behavior', () => {
  const { select, sumo } = createSelect({ multiple: true });
  const germany = sumo.ul.find('li.opt').eq(1);

  germany.trigger('click');

  assert.equal(select.find('option').eq(1).prop('selected'), true);
  assert.equal(germany.hasClass('selected'), true);
  assert.equal(sumo.select.attr('role'), 'button');
  assert.equal(sumo.ul.attr('role'), undefined);
  assert.equal(germany.attr('role'), undefined);
  assert.equal(germany.attr('aria-selected'), undefined);
  assert.equal(select.attr('aria-hidden'), undefined);

  press(sumo.select, 65, 'a', { ctrlKey: true });
  assert.equal(select.find('option:checked').length, 3);
});

test('keeps a disabled multiple select out of the tab order', () => {
  const { select, sumo } = initialize(`
    <select multiple disabled>
      <option selected>France</option>
      <option>Germany</option>
    </select>
  `);

  assert.equal(sumo.select.attr('role'), 'button');
  assert.equal(sumo.select.attr('tabindex'), undefined);
  assert.equal(select.attr('aria-hidden'), undefined);
});

test('synchronizes disabled state and restores native attributes on unload', () => {
  const { select, sumo } = initialize(`
    <select tabindex="3"><option>France</option></select>
  `);

  sumo.showOpts();
  sumo.disable();
  assert.equal(sumo.select.attr('aria-disabled'), 'true');
  assert.equal(sumo.select.attr('tabindex'), undefined);
  assert.equal(sumo.select.attr('aria-expanded'), 'false');

  sumo.enable();
  assert.equal(sumo.select.attr('aria-disabled'), 'false');
  assert.equal(sumo.select.attr('tabindex'), '0');

  sumo.unload();
  assert.equal(select.attr('tabindex'), '3');
  assert.equal(select.attr('aria-hidden'), undefined);
});

test('synchronizes public selection APIs and reload', () => {
  const { select, sumo } = createSelect();
  const listboxId = sumo.ul.attr('id');
  let changes = 0;
  select.on('change', () => changes++);

  sumo.selectItem(1);
  assert.equal(select.val(), 'de');
  assert.equal(sumo.ul.find('li.opt').eq(1).hasClass('selected'), true);
  assert.equal(sumo.ul.find('li.opt').eq(1).attr('aria-selected'), 'true');
  assert.equal(changes, 1);

  sumo.unSelectItem(1);
  assert.equal(sumo.ul.find('li.opt').eq(1).attr('aria-selected'), 'false');
  assert.equal(changes, 2);

  sumo.reload();
  const reloaded = select[0].sumo;
  assert.equal(reloaded.select.attr('role'), 'combobox');
  assert.equal(reloaded.select.attr('aria-controls'), reloaded.ul.attr('id'));
  assert.equal(reloaded.ul.attr('id'), listboxId);
  assert.equal(select.attr('aria-hidden'), 'true');
});

test('synchronizes dynamically added, disabled and removed options', () => {
  const { select, sumo } = createSelect();

  sumo.add('it', 'Italy');
  const italy = sumo.ul.find('li.opt').last();
  assert.equal(italy.attr('role'), 'option');
  assert.match(italy.attr('id'), /^sumoselect-\d+-option-\d+$/);

  sumo.selectItem('it');
  assert.equal(select.val(), 'it');
  assert.equal(italy.attr('aria-selected'), 'true');

  sumo.disableItem(3);
  assert.equal(select.find('option').eq(3).prop('disabled'), true);
  assert.equal(italy.attr('aria-disabled'), 'true');
  assert.equal(italy.hasClass('selected'), false);

  sumo.enableItem(3);
  assert.equal(italy.attr('aria-disabled'), 'false');

  sumo.remove(3);
  assert.equal(select.find('option[value="it"]').length, 0);
  assert.equal(sumo.ul.find('li.opt').length, 3);
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

test('keeps the accessible custom control when mobile rendering is forced', () => {
  const { select, sumo } = createSelect({
    options: {
      forceCustomRendering: true,
      nativeOnDevice: ['jsdom']
    }
  });

  assert.equal(sumo.mob, false);
  assert.equal(sumo.select.attr('role'), 'combobox');
  assert.equal(select.attr('aria-hidden'), 'true');
});
