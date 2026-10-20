import { Avatar, AVATAR_IDS } from 'zing-ds';

const row = { display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', width: 360 } as const;

export const AllAvatars = () => (
  <div style={row}>
    {AVATAR_IDS.map((id: string) => <Avatar key={id} avatarId={id} size={56} />)}
  </div>
);

export const Sizes = () => (
  <div style={row}>
    <Avatar avatarId="shark" size={40} />
    <Avatar avatarId="shark" size={62} />
    <Avatar avatarId="shark" size={88} />
  </div>
);

export const Ring = () => (
  <div style={row}>
    <Avatar avatarId="butterfly" size={62} ring />
    <Avatar avatarId="robot" size={62} ring />
  </div>
);
