// importação módulo mongoose
var mongoose = require('mongoose');

// guardando valor de mongoose.Schema (apenas para facilitar na hora de escrever)
const Schema = mongoose.Schema;

var imoveisFavorites = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Imovel' }
});

// objeto instância do Schema
let UserSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        trim: true
    },
    cpf: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    tipo: {
        type: String,
        required: true,
        trim: true
    },
    dtNascimento: {
        type: Date,
        required: false,
        trim: true
    },
    sexo: {
        type: String,
        required: false,
        trim: true
    },
    telefone: {
        type: String,
        required: false,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    imoveisFavorites: [imoveisFavorites],
    passResetKey: String,
    passKeyExpires: Number,
    createdAt: {
        type: Date,
        required: false
    },
    updateAt: {
        type: Number,
        required: false
    }
    // 'runSettersOnQuery' usado para implementar as especificações no esquema de modelo
}, { runSttersOnQuery: true });

UserSchema.pre('save', function (next) {
    this.email = this.email.toLowerCase(); // ensure email are in lowercase

    var currentDate = new Date().getTime();
    this.updatedAt = currentDate;
    if (!this.createdAt) {
        this.createdAt = currentDate;
    }
    next();
})

// registrando model utilizando objeto criado
mongoose.model('User', UserSchema);