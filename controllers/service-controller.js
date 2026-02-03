// Mock data (temporary, no database)
let services = [];

// GET all services
exports.getAllServices = (req, res) => {
  res.status(200).json(services);
};

// GET service by ID
exports.getServiceById = (req, res) => {
  const service = services.find(s => s.id === req.params.id);

  if (!service) {
    return res.status(404).json({ message: 'Service not found' });
  }

  res.status(200).json(service);
};

// POST create service
exports.createService = (req, res) => {
  const { name, description, durationMinutes } = req.body;

  if (!name || durationMinutes === undefined) {
    return res.status(400).json({
      message: 'Name and durationMinutes are required'
    });
  }

  const newService = {
    id: Date.now().toString(),
    name,
    description: description || '',
    durationMinutes
  };

  services.push(newService);

  res.status(201).json(newService);
};

// PUT update service
exports.updateService = (req, res) => {
  const index = services.findIndex(s => s.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: 'Service not found' });
  }

  services[index] = {
    ...services[index],
    ...req.body
  };

  res.status(200).json(services[index]);
};

// DELETE service
exports.deleteService = (req, res) => {
  const index = services.findIndex(s => s.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: 'Service not found' });
  }

  services.splice(index, 1);

  res.status(200).json({ message: 'Service deleted successfully' });
};
