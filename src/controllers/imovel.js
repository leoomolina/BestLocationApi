// importação módulo mongoose
const mongoose = require('mongoose');

// atribuição do model registrado à variável modelImovel
const modelImovel = mongoose.model('Imovel');

// inicializando objeto imovelController
let imovelController = {};

imovelController.getImoveis = (req, res) => {
    if (req.params.filter) {
        const id = req.params.filter;
        modelImovel.findById(id)
            .then(result => res.json(result))
            .catch(err => res.send(err));
    }
    else {
        modelImovel.find()
            .then(results => res.json(results))
            .catch(err => res.send(err));
    }
}

imovelController.getImoveisUsuario = (req, res) => {
    idUsuario = req.params.idUsuario;
    if (idUsuario) {
        modelImovel.find({ usuarioId: idUsuario })
            .then(results => res.json(results))
            .catch(err => res.send(err));;
    }
    else {
        res.json({
            success: false,
            message: "Usuário inválido.",
            statusCode: 500
        })
    }
}

imovelController.deleteImovel = (req, res) => {
    modelImovel.findByIdAndRemove(req.params.imovel_id, (err, imovel) => {
        if (err) return res.status(500).send(err);

        const response = {
            message: "Imovel removido com sucesso",
            id: imovel.id
        };
        return res.status(200).send(response);
    });
}

imovelController.updateImovel = (req, res) => {
    const id = req.params.imovel_id;

    modelImovel.findById(id, (err, imovel) => {
        if (err) {
            res.status(500).json({
                message: "Erro ao encontrar o imóvel: ID incorreto"
            });
        }
        else if (imovel == null) {
            res.status(400).json({
                message: "Imóvel não encontrado"
            });
        }
        else {
            if (req.session.user) {
                imovel.titulo = req.body.titulo;
                imovel.status = req.body.status;
                imovel.area = req.body.area;
                imovel.descricao = req.body.descricao;
                imovel.cep = req.body.cep;
                imovel.endereco = req.body.endereco;
                imovel.numEndereco = req.body.numEndereco;
                imovel.complementoEndereco = req.body.complementoEndereco;
                imovel.bairro = req.body.bairro;
                imovel.uf = req.body.uf;
                imovel.cidade = req.body.cidade;
                imovel.numQuartos = req.body.numQuartos;
                imovel.numBanheiros = req.body.numBanheiros;
                imovel.preco = req.body.preco;

                imovel.save(function (error) {
                    if (error)
                        res.send("Erro ao atualizar o imóvel: " + error);

                    res.status(200).json({
                        message: "Imóvel atualizado com sucesso"
                    });
                });
            }
            else {
                res.json({
                    success: false,
                    message: "Usuário sem permissão para atualizar imóvel.",
                    statusCode: 400
                })
            }
        }

    });
}

imovelController.newImovel = (req, res) => {
    if (req.session.user) {
        let newImovel = new modelImovel({
            titulo: req.body.titulo,
            status: req.body.status,
            endereco: req.body.endereco,
            numEndereco: req.body.numEndereco,
            complementoEndereco: req.body.complementoEndereco,
            cidade: req.body.cidade,
            cep: req.body.cep,
            bairro: req.body.bairro,
            uf: req.body.uf,
            area: req.body.area,
            descricao: req.body.descricao,
            numQuartos: req.body.numQuartos,
            numBanheiros: req.body.numBanheiros,
            preco: req.body.preco,
            usuarioId: req.session.user.id
        });

        newImovel.save()
            .then(() => res.json({
                success: true,
                message: 'Imóvel inserido com sucesso',
                statusCode: 201
            }))
            .catch(err => res.json({
                success: false,
                message: err,
                statusCode: 500
            }));
    }
    else {
        res.json({
            success: false,
            message: "Usuário sem permissão para cadastrar imóvel.",
            statusCode: 400
        })
    }
}

imovelController.searchImovel = (req, res, next) => {
    var searchParams = req.query.query;
    modelImovel.find({ cidade: { $regex: '.*' + searchParams + '.*' } }, function (e, docs) {
        res.json({
            results: true,
            search: req.query.query,
            list: docs
        });
    });
}

// exporta o módulo
module.exports = imovelController;