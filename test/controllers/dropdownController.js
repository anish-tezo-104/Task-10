const departments = require("../data/departments");
const employees = require("../data/employees");
const locations = require("../data/locations");
const projects = require("../data/projects");

const getDepartments = (req, res) => {
  res.status(200).json({
    status: "SUCCESS",
    data: departments,
  });
};

const getProjects = (req, res) => {
  res.status(200).json({
    status: "SUCCESS",
    data: projects,
  });
};

const getLocations = (req, res) => {
  res.status(200).json({
    status: "SUCCESS",
    data: locations,
  });
};

const getManagers = async (req, res) => {
  try {
    // Simulate asynchronous behavior with a Promise
    const managersData = await new Promise((resolve, reject) => {
      // Filter employees to get managers
      const managers = employees.filter(emp => emp.isManager);

      // Map to format data as required
      const managersFormatted = managers.map(manager => {
        return {
          id: manager.id,
          name: `${manager.firstName} ${manager.lastName}`
        };
      });

      resolve(managersFormatted);
    });

    res.status(200).json({
      status: "SUCCESS",
      data: managersData,
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
  getDepartments,
  getProjects,
  getLocations,
  getManagers,
};
