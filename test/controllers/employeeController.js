const employees = require("../data/employees");
const bcrypt = require("bcrypt");
const departments = require("../data/departments");
const locations = require("../data/locations");
const projects = require("../data/projects");
const roles = require('../data/roles');
const { getManagers } = require("./dropdownController");

const addEmployee = (req, res) => {
  const employee = req.body;
  employee.id = employees.length + 1; // Simple ID increment, not suitable for production
  employee.password = bcrypt.hashSync(employee.password, 12);
  employees.push(employee);
  res.status(201).json({
    status: "SUCCESS",
    data: employee,
  });
};

const updateEmployee = (req, res) => {
  const { id } = req.params;
  const employeeUpdates = req.body;
  const employeeIndex = employees.findIndex((emp) => emp.id == id);

  if (employeeIndex === -1) {
    return res.status(404).json({
      status: "ERROR",
      errorCode: "EMPLOYEE_NOT_FOUND",
    });
  }

  const updatedEmployee = { ...employees[employeeIndex], ...employeeUpdates };
  employees[employeeIndex] = updatedEmployee;
  res.status(200).json({
    status: "SUCCESS",
    data: updatedEmployee,
  });
};

const deleteEmployee = (req, res) => {
  const { ids } = req.query;
  const idsArray = ids.split(",").map((id) => parseInt(id));
  const initialLength = employees.length;

  for (let id of idsArray) {
    const index = employees.findIndex((emp) => emp.id === id);
    if (index > -1) {
      employees.splice(index, 1);
    }
  }

  if (initialLength === employees.length) {
    return res.status(404).json({
      status: "ERROR",
      errorCode: "EMPLOYEE_NOT_FOUND",
    });
  }

  res.status(200).json({
    status: "SUCCESS",
    data: `Deleted ${initialLength - employees.length} employees`,
  });
};

const getEmployees = async (req, res) => {
  const {
    EmployeeId,
    RoleId,
    DepartmentId,
    ModeStatusId,
    Search,
    PageNumber = 1,
    PageSize = employees.length,
    GroupBy,
  } = req.query;

  let filteredEmployees = employees;

  if (EmployeeId) {
    filteredEmployees = filteredEmployees.filter((emp) => emp.id == EmployeeId);
  }

  if (RoleId) {
    filteredEmployees = filteredEmployees.filter((emp) => emp.roleId == RoleId);
  }

  if (DepartmentId) {
    filteredEmployees = filteredEmployees.filter(
      (emp) => emp.departmentId == DepartmentId
    );
  }

  if (ModeStatusId) {
    filteredEmployees = filteredEmployees.filter(
      (emp) => emp.modeStatusId == ModeStatusId
    );
  }

 if (Search) {
  const searchLower = Search.toLowerCase();
   filteredEmployees = filteredEmployees.filter(
     (emp) =>
      emp.firstName.toLowerCase().includes(searchLower) ||
      emp.lastName.toLowerCase().includes(searchLower) ||
      emp.email.toLowerCase().includes(searchLower)
  );
}

  if (GroupBy && GroupBy.toLowerCase() === "department") {
    const grouped = filteredEmployees.reduce((result, emp) => {
      (result[emp.departmentId] = result[emp.departmentId] || []).push(emp);
      return result;
    }, {});
    return res.status(200).json({
      status: "SUCCESS",
      data: grouped,
    });
  }

  try {
    // Get all managers
    const allManagers = employees.filter(emp => emp.isManager);
    
    filteredEmployees = filteredEmployees.map((emp) => {
      // Find the manager for each employee
      const manager = allManagers.find(manager => manager.id === emp.managerId);
      // If manager is found, add ManagerName to the employee object
      const managerName = manager ? `${manager.firstName} ${manager.lastName}` : 'N/A';
      
      return {
        ...emp,
        roleName: roles.find((role) => role.id === emp.roleId)?.name,
        departmentName: departments.find((dept) => dept.id === emp.departmentId)?.name,
        managerName: managerName,
        projectName: projects.find((project) => project.id === emp.projectId)?.name,
        locationName: locations.find((location) => location.id === emp.locationId)?.name,
      };
    });

    const totalRecords = filteredEmployees.length;
    const paginatedEmployees = filteredEmployees.slice(
      (PageNumber - 1) * PageSize,
      PageNumber * PageSize
    );

    res.status(200).json({
      status: "SUCCESS",
      data: paginatedEmployees,
      totalRecords: totalRecords,
    });
  } catch (error) {
    console.error("Error fetching managers:", error);
    res.status(500).json({
      status: "ERROR",
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  addEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployees,
};
