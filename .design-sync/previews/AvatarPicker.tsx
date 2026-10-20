import { useState } from 'react';
import { AvatarPicker } from 'zing-ds';

export const Picker = () => {
  const [avatar, setAvatar] = useState('dog');
  return (
    <div style={{ width: 340 }}>
      <AvatarPicker value={avatar} onChange={setAvatar} />
    </div>
  );
};

export const RocketSelected = () => (
  <div style={{ width: 340 }}>
    <AvatarPicker value="rocket" />
  </div>
);
