const EmployeesService = require('../services/EmployeesService');

const create = async (req, res, next) => {
  try {
    const employee = await EmployeesService.createEmployee(req.body);
    res.status(201).json(employee);
  } catch (error) {
    next(error);
  }
};

const findAll = async (req, res, next) => {
  try {
    const employees = await EmployeesService.getAllEmployees(req.query);
    res.json(employees);
  } catch (error) {
    next(error);
  }
};

const findOne = async (req, res, next) => {
  try {
    const employee = await EmployeesService.getEmployeeById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee);
  } catch (error) {
    next(error);
  }
};

const findOneByIdUser = async (req, res, next) => {
  try {
    let idUser=res.locals.user.iduser;
    const employee = await EmployeesService.getEmployeeByIdUser(idUser);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const employee = await EmployeesService.updateEmployee(req.params.id, req.body);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee);
  } catch (error) {
    next(error);
  }
};

// const delete = async (req, res, next) => {
//   try {
//     const deleted = await EmployeesService.deleteEmployee(req.params.id);
//     if (!deleted) {
//       return res.status(404).json({ message: 'Employee not found' });
//     }
//     res.status(204).send(); // No content
//   } catch (error) {
//     next(error);
//   }
// };

module.exports = {
  create,
  findAll,
  findOne,
  findOneByIdUser,
  update,
};
