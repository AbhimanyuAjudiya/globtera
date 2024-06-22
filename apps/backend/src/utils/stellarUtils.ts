import fetch from 'node-fetch'; 

const friendbotUrl = 'https://friendbot.stellar.org';

export const fundStellarAccount = async (publicKey: string): Promise<void> => {
  try {
    const response = await fetch(`${friendbotUrl}?addr=${publicKey}`);
    if (!response.ok) {
      throw new Error('Failed to fund Stellar account with Friendbot');
    }
    console.log(`Successfully funded Stellar account ${publicKey} with test XLM`);
  } catch (error) {
    console.error('Error funding Stellar account:', error);
    throw error;
  }
};
