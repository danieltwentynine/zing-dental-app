import { Input } from 'zing-ds';

const stack = { display: 'flex', flexDirection: 'column', gap: 16, width: 340 } as const;

export const LoginFields = () => (
  <div style={stack}>
    <Input label="Email" placeholder="you@example.com" autoCapitalize="none" keyboardType="email-address" />
    <Input label="Password" placeholder="Your password" autoCapitalize="none" secureTextEntry />
  </div>
);

export const Filled = () => (
  <div style={stack}>
    <Input label="Child's name" placeholder="e.g. Leo" value="Maya" />
  </div>
);

export const WithError = () => (
  <div style={stack}>
    <Input label="Email" value="parent@" error="That email doesn't look quite right." />
  </div>
);

export const Disabled = () => (
  <div style={stack}>
    <Input label="Email" value="parent@example.com" editable={false} />
  </div>
);
