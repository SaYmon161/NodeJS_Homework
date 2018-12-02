const express = require('express');
const router = express.Router();

const ctrlIndex = require('../controllers/index');
const ctrlLogin = require('../controllers/login');
const ctrlAdmin = require('../controllers/admin');

router.get('/', ctrlIndex.getIndex);
router.post('/', ctrlIndex.sendEmail);

router.get('/login', ctrlLogin.getLogin);
router.post('/login', ctrlLogin.login);

router.get('/admin', ctrlAdmin.getAdmin);
router.post('/admin/skills', ctrlAdmin.sendSkills);
router.post('/admin/upload', ctrlAdmin.sendProduct);

module.exports = router;