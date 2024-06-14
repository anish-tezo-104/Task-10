const departments = require("../data/departments");
const roles = require("../data/roles");

const getRoles = async (req, res) => {
  try {
    const { departmentId, roleId, pageNumber = 1, pageSize = roles.length } = req.query;
    
    let filteredRoles = roles;

    if (departmentId) {
      filteredRoles = filteredRoles.filter(role => role.departmentId == departmentId);
    }

    if (roleId) {
      filteredRoles = filteredRoles.filter(role => role.id == roleId);
    }

    const totalRecords = filteredRoles.length;
    const paginatedRoles = filteredRoles.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);

    // Transform roles data to add DepartmentName
    const rolesWithDepartmentNames = paginatedRoles.map(role => {
      const department = departments.find(dept => dept.id === role.departmentId);
      const departmentName = department ? department.name : 'N/A';
      return {
        roleId: role.id,
        roleName: role.name,
        departmentId: role.departmentId,
        departmentName: departmentName,
      };
    });

    res.status(200).json({
      status: 'SUCCESS',
      data: rolesWithDepartmentNames,
      totalRecords: totalRecords,
    });
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Internal Server Error',
    });
  }
};


const addRole = async (req, res) => {
  try {
    const newRole = req.body;
    newRole.id = roles.length + 1; // Simple ID increment, not suitable for production
    roles.push(newRole);
    res.status(201).json({
      status: "SUCCESS",
      data: newRole,
    });
  } catch (error) {
    console.error("Error adding role:", error);
    res.status(500).json({
      status: "ERROR",
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  getRoles,
  addRole,
};
