// Mock data (temporary, no database)
let vehicles = [];

// GET all vehicles
exports.getAllVehicles = (req, res) => {
  res.status(200).json(vehicles);
};

// GET vehicle by ID
exports.getVehicleById = (req, res) => {
  const vehicle = vehicles.find(v => v.id === req.params.id);

  if (!vehicle) {
    return res.status(404).json({ message: 'Vehicle not found' });
  }

  res.status(200).json(vehicle);
};

// POST create vehicle
exports.createVehicle = (req, res) => {
  const { make, model, year } = req.body;

  if (!make || !model || !year) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const newVehicle = {
    id: Date.now().toString(),
    make,
    model,
    year
  };

  vehicles.push(newVehicle);

  res.status(201).json(newVehicle);
};

// PUT update vehicle
exports.updateVehicle = (req, res) => {
  const index = vehicles.findIndex(v => v.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: 'Vehicle not found' });
  }

  vehicles[index] = {
    ...vehicles[index],
    ...req.body
  };

  res.status(200).json(vehicles[index]);
};

// DELETE vehicle
exports.deleteVehicle = (req, res) => {
  const index = vehicles.findIndex(v => v.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: 'Vehicle not found' });
  }

  vehicles.splice(index, 1);

  res.status(200).json({ message: 'Vehicle deleted successfully' });
};
