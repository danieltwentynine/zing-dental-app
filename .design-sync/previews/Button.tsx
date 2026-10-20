import { Button } from 'zing-ds';

const noop = () => {};
const stack = { display: 'flex', flexDirection: 'column', gap: 12, width: 320 } as const;

export const Primary = () => <div style={stack}><Button label="Start brushing" size="lg" onPress={noop} /></div>;

export const Variants = () => (
  <div style={stack}>
    <Button label="See my progress" onPress={noop} />
    <Button label="Brush again" variant="secondary" onPress={noop} />
    <Button label="Brush again" variant="soft" onPress={noop} />
    <Button label="Continue with Google" variant="outline" onPress={noop} />
    <Button label="I already have an account" variant="ghost" onPress={noop} />
  </div>
);

export const Sizes = () => (
  <div style={stack}>
    <Button label="Try saving again" size="sm" fullWidth={false} onPress={noop} />
    <Button label="See results" size="md" onPress={noop} />
    <Button label="Create account" size="lg" onPress={noop} />
  </div>
);

export const States = () => (
  <div style={stack}>
    <Button label="Log in" size="lg" loading onPress={noop} />
    <Button label="Start brushing adventure" size="lg" disabled onPress={noop} />
  </div>
);
