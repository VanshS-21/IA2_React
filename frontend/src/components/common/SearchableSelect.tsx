import { useEffect, useMemo, useState } from 'react';

interface SearchableSelectProps<T> {
  label: string;
  options: T[];
  value: T | null;
  onChange: (value: T | null) => void;
  getKey: (option: T) => string;
  getLabel: (option: T) => string;
  isOptionDisabled?: (option: T) => boolean;
  placeholder?: string;
  disabled?: boolean;
  helpText?: string;
}

export function SearchableSelect<T>({ label, options, value, onChange, getKey, getLabel, isOptionDisabled, placeholder = 'Search options', disabled, helpText }: SearchableSelectProps<T>): JSX.Element {
  const [query, setQuery] = useState(value ? getLabel(value) : '');
  const [open, setOpen] = useState(false);
  const id = `searchable-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  const filtered = useMemo(() => options.filter((option) => getLabel(option).toLowerCase().includes(query.toLowerCase())), [options, query, getLabel]);

  useEffect(() => { setQuery(value ? getLabel(value) : ''); }, [value, getLabel]);

  const choose = (option: T) => {
    if (isOptionDisabled?.(option)) return;
    onChange(option);
    setQuery(getLabel(option));
    setOpen(false);
  };

  return <div className="searchable-select">
    <label className="field-label" htmlFor={id}>{label}</label>
    <div className="combobox-shell">
      <input id={id} role="combobox" aria-autocomplete="list" aria-expanded={open} aria-controls={`${id}-listbox`} aria-describedby={helpText ? `${id}-hint` : undefined} disabled={disabled} value={query} placeholder={placeholder} onFocus={() => setOpen(true)} onChange={(event) => { setQuery(event.target.value); setOpen(true); if (value) onChange(null); }} onKeyDown={(event) => { if (event.key === 'Escape') setOpen(false); if (event.key === 'Enter' && filtered[0]) { event.preventDefault(); choose(filtered[0]); } }} />
      {value && <button className="clear-choice" type="button" onClick={() => { onChange(null); setQuery(''); setOpen(true); }} aria-label={`Clear ${label}`}>Clear</button>}
    </div>
    {helpText && <span id={`${id}-hint`} className="field-hint">{helpText}</span>}
    {open && !disabled && <ul id={`${id}-listbox`} className="option-list" role="listbox">{filtered.length > 0 ? filtered.slice(0, 8).map((option) => { const unavailable = isOptionDisabled?.(option) ?? false; return <li key={getKey(option)}><button type="button" role="option" aria-selected={value ? getKey(value) === getKey(option) : false} disabled={unavailable} onMouseDown={(event) => event.preventDefault()} onClick={() => choose(option)}>{getLabel(option)}{unavailable && <span>Unavailable</span>}</button></li>; }) : <li className="no-options">No matches. Try another search.</li>}</ul>}
  </div>;
}
