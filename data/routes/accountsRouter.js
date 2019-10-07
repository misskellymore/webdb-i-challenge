const express = require('express');

const router = express.Router();

const db = require('../dbConfig.js');


router.get('/', (req, res) => {
    db('accounts').select()
    .then(accounts => {
        res.status(200).json(accounts)
    })
    .catch(err => {
        res.status(500).json(err)
    })
});


router.get('/:id', validateAccountID, (req, res) => {
    const {id} = req.params;
    db('accounts').where('id', id).first().select()
    .then(account => {
        res.status(200).json(account)
    })

    .catch(err => {
        res.status(500).json(err)
    })
});


function validateAccountID (req, res, next) {
    const accountBody = req.body;
    const {id} = req.params

    db('accounts').where('id', id).first().select()
    .then(res => {
        if (res) {
            req.account = accountBody;
            next();
        } else {
            res.status(404).json({message: 'Cannot find account with this ID'})
        }
    })
}

module.exports = router;