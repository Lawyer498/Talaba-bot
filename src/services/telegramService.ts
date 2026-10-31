import { PaymentReceipt } from '../types';

export const TELEGRAM_CONFIG = {
  botToken: '8766646881:AAH6gW0WhGjkikK4Pxih2EUj10PLSKjRWro',
  adminUsername: '@Yurist_617',
  adminId: 8652976161,
  apiUrl: 'https://api.telegram.org/bot8766646881:AAH6gW0WhGjkikK4Pxih2EUj10PLSKjRWro'
};

export interface TelegramBotInfo {
  ok: boolean;
  result?: {
    id: number;
    is_bot: boolean;
    first_name: string;
    username: string;
    can_join_groups: boolean;
    can_read_all_group_messages: boolean;
    supports_inline_queries: boolean;
  };
  error?: string;
}

/**
 * Fetch information about the connected bot using getMe
 */
export async function getBotInfo(): Promise<TelegramBotInfo> {
  try {
    const res = await fetch(`${TELEGRAM_CONFIG.apiUrl}/getMe`);
    const data = await res.json();
    return data;
  } catch (error: any) {
    return {
      ok: false,
      error: error?.message || 'Telegram API ga ulanishda xatolik'
    };
  }
}

/**
 * Send receipt verification alert to Telegram Bot/Admin
 */
export async function notifyAdminNewReceipt(receipt: PaymentReceipt, chatId?: string | number): Promise<boolean> {
  const targetChatId = chatId || TELEGRAM_CONFIG.adminId;
  const text = `🚨 *YANGI TO'LOV CHEKI (Talaba Slide Bot)*\n\n` +
    `👤 *Foydalanuvchi:* ${receipt.userName} (${receipt.userPhone || 'Raqam kiritilmagan'})\n` +
    `💰 *Summa:* ${receipt.amount.toLocaleString('uz-UZ')} so'm\n` +
    `💳 *Karta:* ${receipt.targetCard} (${receipt.targetCardHolder})\n` +
    `🔢 *Tranzaksiya ID:* \`${receipt.txnId}\`\n` +
    `⏱️ *Vaqt farqi:* ${receipt.fraudAnalysis.timeDiffMinutes} daqiqa\n` +
    `🛡️ *Xavf darajasi:* ${receipt.fraudAnalysis.riskScore}% (${receipt.fraudAnalysis.isSuspicious ? '⚠️ SHUBHALI' : '✅ XAVFSIZ'})\n\n` +
    `🔎 *Admin panel orqali tasdiqlash uchun:* @Yurist_617`;

  try {
    const res = await fetch(`${TELEGRAM_CONFIG.apiUrl}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: targetChatId,
        text,
        parse_mode: 'Markdown'
      })
    });
    const result = await res.json();
    return result.ok;
  } catch (err) {
    console.warn('Telegram notification attempt completed:', err);
    return false;
  }
}
