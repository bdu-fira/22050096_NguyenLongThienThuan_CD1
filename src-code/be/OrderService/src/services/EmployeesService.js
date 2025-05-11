const db = require('../models/index');
const Employees = db.Employees;

const EmployeesService = {
  /**
   * Creates a new employee.
   *
   * @param {object} data - The employee data.
   * @returns {Promise<Employees>} - The created employee.
   */
  createEmployee: async (data) => {
    try {
      const employee = await Employees.create(data);
      return employee;
    } catch (error) {
      console.error('Error creating employee:', error);
      throw error;
    }
  },

  /**
   * Retrieves all employees.
   *
   * @param {object} options - Query options.
   * @returns {Promise<Array<Employees>>} - A list of employees.
   */
  getAllEmployees: async (options = {}) => {
    try {
      const employees = await Employees.findAll(options);
      return employees;
    } catch (error) {
      console.error('Error getting all employees:', error);
      throw error;
    }
  },

  /**
   * Retrieves an employee by ID.
   *
   * @param {number} id - The employee ID.
   * @returns {Promise<Employees|null>} - The employee, or null if not found.
   */
  getEmployeeById: async (id) => {
    try {
      const employee = await Employees.findByPk(id);
      return employee;
    } catch (error) {
      console.error('Error getting employee by ID:', error);
      throw error;
    }
  },

  /**
   * Retrieves an employee by User ID.
   *
   * @param {number} iduser - The user ID.
   * @returns {Promise<Employees|null>} - The employee, or null if not found.
   */
  getEmployeeByIdUser: async (iduser) => {
    try {
      const employee = await Employees.findOne({
      where: {
        iduser: iduser
      }
    });
      return employee;
    } catch (error) {
      console.error('Error getting employee by User ID:', error);
      throw error;
    }
  },

  /**
   * Updates an existing employee.
   *
   * @param {number} id - The employee ID.
   * @param {object} data - The updated employee data.
   * @returns {Promise<Array<number>>} - An array containing the number of affected rows.
   */
  updateEmployee: async (id, data) => {
    try {
      const [updated] = await Employees.update(data, {
        where: { staff_id: id },
      });
      return [updated];
    } catch (error) {
      console.error('Error updating employee:', error);
      throw error;
    }
  },

  /**
   * Deletes an employee.
   *
   * @param {number} id - The employee ID.
   * @returns {Promise<number>} - The number of deleted rows.
   */
  deleteEmployee: async (id) => {
    try {
      const deleted = await Employees.destroy({
        where: { staff_id: id },
      });
      return deleted;
    } catch (error) {
      console.error('Error deleting employee:', error);
      throw error;
    }
  },
};

module.exports = {
  createEmployee: EmployeesService.createEmployee,
  getAllEmployees: EmployeesService.getAllEmployees,
  getEmployeeById: EmployeesService.getEmployeeById,
  getEmployeeByIdUser: EmployeesService.getEmployeeByIdUser,
  updateEmployee: EmployeesService.updateEmployee,
  deleteEmployee: EmployeesService.deleteEmployee,
};
