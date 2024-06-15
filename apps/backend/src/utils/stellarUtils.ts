import StellarSdk from 'stellar-sdk';

const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
const sourceSecretKey = process.env.STELLAR_SECRET_KEY; // Ensure this is set in your environment
const sourceKeypair = StellarSdk.Keypair.fromSecret(sourceSecretKey);

export const donateToOrg = async (destinationAddress: string, amount: number) => {
  try {
    const sourceAccount = await server.loadAccount(sourceKeypair.publicKey());

    const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: StellarSdk.Networks.TESTNET,
    })
      .addOperation(StellarSdk.Operation.payment({
        destination: destinationAddress,
        asset: StellarSdk.Asset.native(),
        amount: amount.toString(),
      }))
      .setTimeout(30)
      .build();

    transaction.sign(sourceKeypair);
    const result = await server.submitTransaction(transaction);
    console.log('Transaction successful:', result);
    return result;
  } catch (error) {
    console.error('Error submitting transaction:', error);
    throw error;
  }
};
