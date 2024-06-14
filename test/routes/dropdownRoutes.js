const express = require('express');
const router = express.Router();
const dropdownController = require('../controllers/dropdownController');

router.get('/Departments', dropdownController.getDepartments);
router.get('/Projects', dropdownController.getProjects);
router.get('/Locations', dropdownController.getLocations);
router.get('/Managers', dropdownController.getManagers);

module.exports = router;
