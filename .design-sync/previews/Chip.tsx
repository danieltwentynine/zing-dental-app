import { useState } from 'react';
import { Chip } from 'zing-ds';

export const AgePicker = () => {
  const [age, setAge] = useState(7);
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, width: 340 }}>
      {[4, 5, 6, 7, 8, 9, 10, 11, 12].map((a) => (
        <Chip key={a} label={String(a)} accessibilityLabel={`Age ${a}`} selected={age === a} onPress={() => setAge(a)} />
      ))}
    </div>
  );
};

export const States = () => (
  <div style={{ display: 'flex', gap: 8 }}>
    <Chip label="Morning" selected />
    <Chip label="Evening" />
  </div>
);
