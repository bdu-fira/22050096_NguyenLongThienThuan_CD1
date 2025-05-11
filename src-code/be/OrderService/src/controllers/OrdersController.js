const OrdersService = require('../services/OrdersService');

const create = async (req, res, next) => {
  try {
    const order = await OrdersService.createOrder(req.body, res.locals.user);
    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

const findAll = async (req, res, next) => {
  try {
    const orders = await OrdersService.getAllOrders(req.query, res.locals.user);
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

const findOne = async (req, res, next) => {
  try {
    const order = await OrdersService.getOrderById(req.params.id, res.locals.user);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    next(error);
  }
};

const findByCustomer = async (req, res, next) => {
  try {
    const orders = await OrdersService.getOrdersByCustomerId(req.params.customerId, res.locals.user);
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

const findBySalesRep = async (req, res, next) => {
  try {
    const orders = await OrdersService.getOrdersBySalesRepId(req.params.salesRepId, res.locals.user);
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const order = await OrdersService.updateOrder(req.params.id, req.body, res.locals.user);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    next(error);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const order = await OrdersService.updateOrderStatus(req.params.id, req.body.status, res.locals.user);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const order = await OrdersService.deleteOrder(req.params.id, res.locals.user);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(204).send(); // No content
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create,
  findAll,
  findOne,
  findByCustomer,
  findBySalesRep,
  update,
  updateStatus,
  remove,
};
