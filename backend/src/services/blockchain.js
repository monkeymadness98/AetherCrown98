const Web3 = require('web3');
const logger = require('../utils/logger');

class BlockchainService {
  constructor() {
    this.enabled = process.env.BLOCKCHAIN_ENABLED === 'true';
    this.web3 = null;
    
    if (this.enabled) {
      const providerUrl = process.env.WEB3_PROVIDER_URL || 'http://localhost:8545';
      this.web3 = new Web3(new Web3.providers.HttpProvider(providerUrl));
    }
  }

  /**
   * Track product on blockchain
   */
  async trackProduct(productId, metadata) {
    if (!this.enabled) {
      logger.info('Blockchain is disabled');
      return { success: false, message: 'Blockchain disabled' };
    }

    try {
      const accounts = await this.web3.eth.getAccounts();
      const account = accounts[0];

      // Create a simple product tracking transaction
      const data = this.web3.utils.utf8ToHex(JSON.stringify({
        productId,
        metadata,
        timestamp: new Date().toISOString()
      }));

      const transaction = {
        from: account,
        to: account, // In production, this would be a smart contract address
        data: data,
        gas: 100000
      };

      const receipt = await this.web3.eth.sendTransaction(transaction);

      logger.info(`Product ${productId} tracked on blockchain: ${receipt.transactionHash}`);

      return {
        success: true,
        transactionHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber
      };
    } catch (error) {
      logger.error(`Error tracking product on blockchain: ${error.message}`);
      throw error;
    }
  }

  /**
   * Verify product authenticity
   */
  async verifyProduct(productId, transactionHash) {
    if (!this.enabled) {
      return { verified: false, message: 'Blockchain disabled' };
    }

    try {
      const transaction = await this.web3.eth.getTransaction(transactionHash);
      
      if (!transaction) {
        return { verified: false, message: 'Transaction not found' };
      }

      const data = this.web3.utils.hexToUtf8(transaction.input);
      const productData = JSON.parse(data);

      const verified = productData.productId === productId;

      logger.info(`Product ${productId} verification: ${verified}`);

      return {
        verified,
        data: productData,
        blockNumber: transaction.blockNumber
      };
    } catch (error) {
      logger.error(`Error verifying product: ${error.message}`);
      throw error;
    }
  }

  /**
   * Track payment on blockchain
   */
  async trackPayment(paymentId, amount, currency) {
    if (!this.enabled) {
      return { success: false, message: 'Blockchain disabled' };
    }

    try {
      const accounts = await this.web3.eth.getAccounts();
      const account = accounts[0];

      const data = this.web3.utils.utf8ToHex(JSON.stringify({
        paymentId,
        amount,
        currency,
        timestamp: new Date().toISOString()
      }));

      const transaction = {
        from: account,
        to: account,
        data: data,
        gas: 100000
      };

      const receipt = await this.web3.eth.sendTransaction(transaction);

      logger.info(`Payment ${paymentId} tracked on blockchain: ${receipt.transactionHash}`);

      return {
        success: true,
        transactionHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber
      };
    } catch (error) {
      logger.error(`Error tracking payment on blockchain: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get blockchain status
   */
  async getStatus() {
    if (!this.enabled) {
      return { enabled: false, connected: false };
    }

    try {
      const blockNumber = await this.web3.eth.getBlockNumber();
      const networkId = await this.web3.eth.net.getId();

      return {
        enabled: true,
        connected: true,
        blockNumber,
        networkId
      };
    } catch (error) {
      logger.error(`Error getting blockchain status: ${error.message}`);
      return { enabled: true, connected: false, error: error.message };
    }
  }
}

module.exports = BlockchainService;
