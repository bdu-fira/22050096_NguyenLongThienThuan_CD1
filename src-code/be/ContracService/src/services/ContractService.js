const db = require('../models/index');

/**
 * Contract Service
 * Provides core business logic for managing contracts.
 */

/**
 * Retrieves all contracts based on provided options.
 *
 * @param {object} options - Options for filtering, sorting, and pagination.
 * @returns {Promise<Array<Contract>>} - A promise that resolves to an array of contracts.
 */
async function findAllContracts(options) {
  try {
    return await db.Contracts.findAll(options);
  } catch (error) {
    console.error('Error finding all contracts:', error);
    throw error;
  }
}

/**
 * Retrieves a contract by its ID.
 *
 * @param {number} contractId - The ID of the contract to retrieve.
 * @returns {Promise<Contract|null>} - A promise that resolves to the contract or null if not found.
 */
async function findContractById(contractId) {
  try {
    return await db.Contracts.findByPk(contractId);
  } catch (error) {
    console.error('Error finding contract by ID:', error);
    throw error;
  }
}

/**
 * Retrieves a contract by its order ID.
 *
 * @param {number} orderId - The order ID associated with the contract.
 * @returns {Promise<Contract|null>} - A promise that resolves to the contract or null if not found.
 */
async function findContractByOrderId(orderId) {
  try {
    return await db.Contracts.findOne({ where: { order_id: orderId } });
  } catch (error) {
    console.error('Error finding contract by order ID:', error);
    throw error;
  }
}

/**
 * Creates a new contract based on data received from a Kafka event.
 *
 * @param {object} eventData - The data received from the Kafka event.
 * @returns {Promise<Contract>} - A promise that resolves to the newly created contract.
 */
async function createContractFromEvent(eventData) {
  try {
    return await db.Contracts.create(eventData);
  } catch (error) {
    console.error('Error creating contract from event:', error);
    throw error;
  }
}

/**
 * Updates an existing contract.
 *
 * @param {number} contractId - The ID of the contract to update.
 * @param {object} updateData - The data to update the contract with.
 * @returns {Promise<[number, Contract[]]>} - A promise that resolves to an array containing the number of affected rows and the updated contracts.
 */
async function updateContract(contractId, updateData) {
  try {
    const [numberOfAffectedRows, affectedRows] = await db.Contracts.update(updateData, {
      where: { contract_id: contractId },
      returning: true // This option makes sure that affectedRows are populated with updated instances
    });

    if (numberOfAffectedRows > 0) {
      return [numberOfAffectedRows, affectedRows];
    } else {
      return [0, []]; // Indicate that no rows were updated
    }
  } catch (error) {
    console.error('Error updating contract:', error);
    throw error;
  }
}

/**
 * Removes a contract.
 *
 * @param {number} contractId - The ID of the contract to remove.
 * @returns {Promise<number>} - A promise that resolves to the number of affected rows.
 */
async function removeContract(contractId) {
  try {
    return await db.Contracts.destroy({ where: { contract_id: contractId } });
  } catch (error) {
    console.error('Error removing contract:', error);
    throw error;
  }
}

module.exports = {
  findAllContracts,
  findContractById,
  findContractByOrderId,
  createContractFromEvent,
  updateContract,
  removeContract
};
