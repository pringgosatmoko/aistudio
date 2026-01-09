
export const notificationService = {
  sendTelegramAlert: async (message: string) => {
    // Mengambil config dari environment variables
    const token = (process.env as any).TELEGRAM_BOT_TOKEN;
    const chatId = (process.env as any).TELEGRAM_CHAT_ID;
    
    if (!token || !chatId) {
      console.warn("Konfigurasi Telegram (Token/ChatID) belum diset di Environment Variables.");
      return;
    }

    try {
      const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML'
        })
      });
      
      if (!response.ok) {
        throw new Error('Gagal mengirim ke Telegram API');
      }
    } catch (err) {
      console.error("Notification Error:", err);
    }
  }
};
