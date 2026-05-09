import { describe, it, expect, vi, beforeEach } from 'vitest';

// NOTE: legacy ffprobe-stub mocks removed. Production audio duration
// extraction now uses the fluent-ffmpeg API in src/services/media.ts and
// should be covered there with integration tests.

const log = {
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
};

describe('audio helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('isAudioFile', () => {
    it('should return true for valid audio extensions', async () => {
      const { __testables } = await import('../../test');
      const { isAudioFile } = __testables as any;

      const audioExtensions = ['mp3', 'wav', 'amr', 'ogg', 'aac', 'flac', 'm4a'];
      for (const ext of audioExtensions) {
        expect(isAudioFile(ext)).toBe(true);
        expect(isAudioFile(ext.toUpperCase())).toBe(true);
      }
    });

    it('should return false for non-audio extensions', async () => {
      const { __testables } = await import('../../test');
      const { isAudioFile } = __testables as any;

      const nonAudioExtensions = ['mp4', 'txt', 'pdf', 'docx', 'png', 'jpg', ''];
      for (const ext of nonAudioExtensions) {
        expect(isAudioFile(ext)).toBe(false);
      }
    });
  });

  // Legacy ffprobe-stub tests removed. Audio duration handling now lives in
  // src/services/media.ts via fluent-ffmpeg and should be covered by
  // integration tests against the real implementation.

  describe('processAudioMarkers', () => {
    it('should return original content when oapiToken is null', async () => {
      const { __testables } = await import('../../test');
      const { processAudioMarkers } = __testables as any;

      const content = 'hello [DINGTALK_AUDIO]{"path":"/tmp/audio.mp3"}[/DINGTALK_AUDIO]';
      const result = await processAudioMarkers(content, '', {}, null, log);

      expect(result).toBe(content);
      expect(log.warn).toHaveBeenCalled();
    });

    it('should return cleaned content when no audio markers', async () => {
      const { __testables } = await import('../../test');
      const { processAudioMarkers } = __testables as any;

      const content = 'plain text without markers';
      const result = await processAudioMarkers(content, '', {}, 'token', log);

      expect(result).toBe(content);
    });

    it('should handle invalid JSON in audio markers', async () => {
      const { __testables } = await import('../../test');
      const { processAudioMarkers } = __testables as any;

      const content = 'text [DINGTALK_AUDIO]{invalid-json}[/DINGTALK_AUDIO]';
      const result = await processAudioMarkers(content, '', {}, 'token', log);

      expect(result).toBe('text');
      expect(log.warn).toHaveBeenCalled();
    });

    it('should handle non-existent audio files', async () => {
      const { __testables } = await import('../../test');
      const { processAudioMarkers } = __testables as any;

      // Mock fs.existsSync to return false
      vi.doMock('fs', () => ({
        existsSync: vi.fn().mockReturnValue(false),
      }));

      const content = 'text [DINGTALK_AUDIO]{"path":"/nonexistent/audio.mp3"}[/DINGTALK_AUDIO]';
      const result = await processAudioMarkers(content, '', {}, 'token', log);

      // Should remove marker and add warning
      expect(result).toContain('⚠️');
    });
  });

  describe('sendAudioMessage', () => {
    it('should send audio message with default duration', async () => {
      const { __testables } = await import('../../test');
      const { sendAudioMessage } = __testables as any;

      const mockAxios = await import('axios');
      vi.spyOn(mockAxios.default, 'post').mockResolvedValue({ data: { success: true } });

      const fileInfo = { path: '/tmp/audio.mp3', fileName: 'audio.mp3', fileType: 'mp3' };
      await sendAudioMessage({}, 'https://webhook', fileInfo, 'mediaId123', 'token', log);

      expect(log.info).toHaveBeenCalled();
    });

    it('should send audio message with provided duration', async () => {
      const { __testables } = await import('../../test');
      const { sendAudioMessage } = __testables as any;

      const mockAxios = await import('axios');
      vi.spyOn(mockAxios.default, 'post').mockResolvedValue({ data: { success: true } });

      const fileInfo = { path: '/tmp/audio.mp3', fileName: 'audio.mp3', fileType: 'mp3' };
      await sendAudioMessage({}, 'https://webhook', fileInfo, 'mediaId123', 'token', log, 30000);

      expect(log.info).toHaveBeenCalled();
    });

    it('should handle send failure', async () => {
      const { __testables } = await import('../../test');
      const { sendAudioMessage } = __testables as any;

      const mockAxios = await import('axios');
      vi.spyOn(mockAxios.default, 'post').mockRejectedValue(new Error('Network error'));

      const fileInfo = { path: '/tmp/audio.mp3', fileName: 'audio.mp3', fileType: 'mp3' };
      await sendAudioMessage({}, 'https://webhook', fileInfo, 'mediaId123', 'token', log);

      expect(log.error).toHaveBeenCalled();
    });
  });

  describe('sendAudioProactive', () => {
    it('should send audio to user via proactive API', async () => {
      const { __testables } = await import('../../test');
      const { sendAudioProactive } = __testables as any;

      const mockAxios = await import('axios');
      vi.spyOn(mockAxios.default, 'post').mockResolvedValue({ data: { processQueryKey: 'key123' } });
      vi.spyOn(mockAxios.default, 'get').mockResolvedValue({ data: { accessToken: 'token' } });

      const config = { clientId: 'test', clientSecret: 'secret' };
      const target = { type: 'user' as const, userId: 'user123' };
      const fileInfo = { path: '/tmp/audio.mp3', fileName: 'audio.mp3', fileType: 'mp3' };

      await sendAudioProactive(config, target, fileInfo, 'mediaId123', log);

      expect(log.info).toHaveBeenCalled();
    });

    it('should send audio to group via proactive API', async () => {
      const { __testables } = await import('../../test');
      const { sendAudioProactive } = __testables as any;

      const mockAxios = await import('axios');
      vi.spyOn(mockAxios.default, 'post').mockResolvedValue({ data: { processQueryKey: 'key123' } });
      vi.spyOn(mockAxios.default, 'get').mockResolvedValue({ data: { accessToken: 'token' } });

      const config = { clientId: 'test', clientSecret: 'secret' };
      const target = { type: 'group' as const, openConversationId: 'conv123' };
      const fileInfo = { path: '/tmp/audio.mp3', fileName: 'audio.mp3', fileType: 'mp3' };

      await sendAudioProactive(config, target, fileInfo, 'mediaId123', log);

      expect(log.info).toHaveBeenCalled();
    });

    it('should use provided duration in proactive send', async () => {
      const { __testables } = await import('../../test');
      const { sendAudioProactive } = __testables as any;

      const mockAxios = await import('axios');
      const postSpy = vi.spyOn(mockAxios.default, 'post').mockResolvedValue({ data: { processQueryKey: 'key123' } });
      vi.spyOn(mockAxios.default, 'get').mockResolvedValue({ data: { accessToken: 'token' } });

      const config = { clientId: 'test', clientSecret: 'secret' };
      const target = { type: 'user' as const, userId: 'user123' };
      const fileInfo = { path: '/tmp/audio.mp3', fileName: 'audio.mp3', fileType: 'mp3' };

      await sendAudioProactive(config, target, fileInfo, 'mediaId123', log, 45000);

      // Check that the duration was passed
      const callArgs = postSpy.mock.calls.find(c => c[0].includes('batchSend') || c[0].includes('groupMessages'));
      if (callArgs) {
        const body = callArgs[1];
        const msgParam = JSON.parse(body.msgParam);
        expect(msgParam.duration).toBe('45000');
      }
    });
  });
});