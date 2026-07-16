Text field for forms and the contact/newsletter flows. Theme-aware.

```jsx
<Input ariaLabel="Email" type="email" placeholder="you@studio.com" value={v} onChange={e => setV(e.target.value)} />
<Input multiline rows={5} placeholder="Tell me about the project…" />
```

Set `multiline` for a textarea. Border brightens on hover/focus.
