const ContractService = require('../services/ContractService');

const getAllContracts = async (req, res, next) => {
  try {
    const contracts = await ContractService.findAllContracts(req.query);
    res.status(200).json(contracts);
  } catch (error) {
    next(error);
  }
};

const getContractById = async (req, res, next) => {
  try {
    const contractId = req.params.contract_id;
    const contract = await ContractService.findContractById(contractId);
    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }
    res.status(200).json(contract);
  } catch (error) {
    next(error);
  }
};

const getContractByOrderId = async (req, res, next) => {
  try {
    const orderId = req.params.order_id;
    const contract = await ContractService.findContractByOrderId(orderId);
    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }
    res.status(200).json(contract);
  } catch (error) {
    next(error);
  }
};

const updateContractStatus = async (req, res, next) => {
  try {
    const contractId = req.params.contract_id;
    const { contract_status } = req.body;
    const updatedContract = await ContractService.updateContract(contractId, { contract_status });
    if (!updatedContract) {
      return res.status(404).json({ message: 'Contract not found' });
    }
    res.status(200).json({ message: 'Contract status updated successfully', contract: updatedContract });
  } catch (error) {
    next(error);
  }
};

const updateContractDetails = async (req, res, next) => {
  try {
    const contractId = req.params.contract_id;
    const updateData = req.body;
    const updatedContract = await ContractService.updateContract(contractId, updateData);
    if (!updatedContract) {
      return res.status(404).json({ message: 'Contract not found' });
    }
    res.status(200).json({ message: 'Contract details updated successfully', contract: updatedContract });
  } catch (error) {
    next(error);
  }
};

const deleteContract = async (req, res, next) => {
  try {
    const contractId = req.params.contract_id;
    await ContractService.removeContract(contractId);
    res.status(200).json({ message: 'Contract deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllContracts,
  getContractById,
  getContractByOrderId,
  updateContractStatus,
  updateContractDetails,
  deleteContract
};