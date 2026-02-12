import { describe, expect, it } from 'vitest';
import {
  sequelize,
  User,
  Channel,
  Video,
} from '../src/models/index.js';

describe('models smoke', () => {
  it('syncs and creates basic relational records', async () => {
    await sequelize.sync({ force: true });

    const user = await User.create({
      email: 'smoke@example.com',
      name: 'Smoke User',
      password_hash: 'hash',
      country: 'Brasil',
    });

    const channel = await Channel.create({
      owner_id: user.user_id,
      channel_name: 'Smoke Channel',
      description: 'Canal de teste',
    });

    const video = await Video.create({
      channel_id: channel.channel_id,
      title: 'Video de teste',
      description: 'Descricao',
      duration_seconds: 30,
      video_url: 'https://example.com/video.mp4',
      category: 'Teste',
    });

    expect(user.user_id).toBeDefined();
    expect(channel.channel_id).toBeDefined();
    expect(video.video_id).toBeDefined();

    await sequelize.close();
  });
});
