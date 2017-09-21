import eventHub from './eventHub';

const currFilters = {};
const uniqueFields = {
  topic: false,
  trends: false,
  date: true,
  term: false,
  selection: false,
};


export function getAll() {
  let ftemp = [];
  Object.keys(currFilters).forEach((type) => {
    ftemp = [...ftemp, ...currFilters[type]];
  });
  return ftemp;
}

function broadcast() {
  console.log('emitting via the event hub...');
  console.log(getAll());
  eventHub.$emit('filters', getAll());
}

// Filters should be in the form {type, term}
export function add(f) {
  if (uniqueFields[f.type]) {
    currFilters[f.type] = [f];
  }
  else {
    if (!currFilters[f.type] || !currFilters.length) {
      currFilters[f.type] = [];
    }
    currFilters[f.type].push(f);
  }
  broadcast();
}

// the filter to remove is the object itself
export function remove(who) {
  const thisFilter = currFilters[who.type];
  const newFilters = [];
  for (let i = 0; i < thisFilter.length; i += 1) {
    const f = thisFilter[i];
    if (f.term !== who.term) {
      newFilters.push(f);
    }
  }

  if (newFilters.length) {
    currFilters[who.type] = newFilters;
  }
  else {
    delete currFilters[who.type];
  }
  broadcast();
}

