const Category = require("../models/category");
const { validateCategory } = require("../validator");

exports.createCategory = async (req, res) => {
    try {
        const { error } = validateCategory(req.body);
        if (error) {
            return res.json(error.details[0].message);
        }

        const newCategory = new Category({
            name: req.body.name,
            description: req.body.description
        });

        const savedCategory = await newCategory.save();
        res.json(savedCategory);
    } catch (error) {
        res.json({ message: error.message });
    }
};
