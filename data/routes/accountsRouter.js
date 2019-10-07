const express = require('express');

const router = express.Router();

const db = require('../dbConfig.js');

// Get

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

// Post

router.post('/', validateAccount, (req,res) => {
    const account = req.body;

    db('accounts').insert(account)
    .then(added => {
        res.status(201).json(added[0]);
    })
    .catch(err => {
        res.status(500).json(err);
    })
})



// middlewares


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


function validateAccount (req, res, next) {
    const accountBody = req.body;

    if(!Object.keys(accountBody).length) {
        res.status(400).json({message: 'missing account fields'})
    } else if (!accountBody.name || !accountBody.budget) {
        res.status(400).json({message: 'missing name and budget fields'})

    } else {
        next();
    }
}

module.exports = router;