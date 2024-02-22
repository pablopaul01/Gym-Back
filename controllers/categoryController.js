const Category = require('../models/categorySchema')

const createCategory = async (req, res) => {
    const { name } = req.body;
    const category = await Category.findOne({ name });
    try {
        if (category) {
            return res.status(400).json({
                mensaje: "La categoria ya se encuentra creada",
                status: 400
            })
        }
        const newCategory = new Category({
            name
        })
        await newCategory.save();
        return res.status(201).json({
            mensaje: "Categoria creada correctamente",
            status: 201,
            newCategory
        })
        
    } catch (error) {
        return res.status(500).json({
            mensaje: "Hubo un error, intente más tarde",
            status: 500,
            error: error.message
        })
    }
}

const getAllCategories = async (req, res) => {
    const categories = await Category.find()
    try {
        if (!categories) {
            return res.status(404).json({
                mensaje: "No se encontraron las categorias",
                status: 404
            })
        }
        return res.status(201).json({
            mensaje: "Las categorias se encontraron exitosamente",
            status: 201,
            categories
        })
    } catch (error) {
        return res.status(500).json({
            mensaje: "Hubo un error, intente más tarde",
            status: 500
        })
    }
}

const getCategory = async (req, res) => {
    const { id } = req.params;

    const categorie = await Category.findById(id);
    try {
        if (!categorie) {
            return res.status(400).json({
                mensaje: "Categoria no encontrado",
                status: 400
            })
        }
        return res.status(201).json({
            mensaje: "Categoria encontrado",
            status: 201,
            categorie
        })

    } catch (error) {
        return res.status(500).json({
            mensaje: "Hubo un error, intente más tarde",
            status: 500
        })
    }
}

const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body
    try {
        const category = await Category.findByIdAndUpdate(id,{
            name,
        }, {new: true})

        if (!category){
                return res.status(404).json({
                    mensaje: "Categoria no encontrado",
                    status:404
                })
            }
        return res.status(200).json({
            mensaje: "Categoria actualizada correctamente",
            status: 200,
            category
        })
    } catch (error) {
        return  res.status(500).json({
            mensaje: "hubo un error, intentelo mas tarde fijate que onda",
            status: 500
        })
    }
}

const deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const category = await Category.findByIdAndDelete(id)
        if (!category){
                return res.status(404).json({
                    mensaje: "Categoria no encontrado",
                    status:404
                })
            }
        return res.status(200).json({
            mensaje: "Categoria eliminada correctamente",
            status: 200,
            category
        })
    } catch (error) {
        return  res.status(500).json({
            mensaje: "hubo un error, intentelo mas tarde fijate que onda",
            status: 500
        })
    }
}

module.exports = {
    createCategory,
    getAllCategories,
    updateCategory,
    deleteCategory
  }