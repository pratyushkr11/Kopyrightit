const ComputerSchema = require('../model/ComputerData');

const handleFormData = async (req, res) => {
    try {
        const result = new ComputerSchema(req.body);
        await result.save();
        res.status(201).json({ 'success': `Data Saved Successfully` });
        console.log(result);
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

module.exports = { handleFormData };