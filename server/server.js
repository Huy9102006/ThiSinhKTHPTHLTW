const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

const mongoURI = 'mongodb+srv://DATA:741852%40A@cluster0.nytsgyz.mongodb.net/admission_system?retryWrites=true&w=majority&authSource=admin';

mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB Atlas Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Schema cho file (ảnh/pdf)
const FileModel = mongoose.models.File || mongoose.model('File', new mongoose.Schema({
  name: String,
  contentType: String,
  data: Buffer,
  size: Number,
  uploadDate: { type: Date, default: Date.now }
}));

// Schema cho hồ sơ ứng tuyển - Sử dụng Mixed để tránh lỗi CastError
const applicationSchema = new mongoose.Schema({
  userId: String,
  fullName: String,
  email: String,
  phone: String,
  idCard: String,
  dob: String,
  universityId: String,
  universityName: String,
  majorId: String,
  majorName: String,
  subjectGroup: String,
  scores: mongoose.Schema.Types.Mixed,
  priorityGroup: String,
  priorityArea: String,
  files: mongoose.Schema.Types.Mixed,
  applicationNumber: { type: String, unique: true, sparse: true, default: () => `APP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` },
  status: { type: String, default: 'pending' },
  submittedAt: { type: Date, default: Date.now },
  note: String
}, { strict: false });

const Application = mongoose.models.Application || mongoose.model('Application', applicationSchema);

const upload = multer({ storage: multer.memoryStorage() });

app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).send('No file uploaded.');

    const newFile = new FileModel({
      name: req.file.originalname,
      contentType: req.file.mimetype,
      data: req.file.buffer,
      size: req.file.size
    });

    const savedFile = await newFile.save();

    res.json({
      id: savedFile._id,
      name: savedFile.name,
      type: savedFile.contentType,
      url: `http://localhost:5000/api/files/${savedFile._id}`
    });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/files/:id', async (req, res) => {
  try {
    const file = await FileModel.findById(req.params.id);
    if (!file) return res.status(404).send('File not found');

    res.set('Content-Type', file.contentType);
    res.send(file.data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post('/api/applications', async (req, res) => {
  try {
    console.log('Body received:', JSON.stringify(req.body, null, 2));

    if (mongoose.connection.readyState !== 1) {
      throw new Error('Database not connected.');
    }

    const application = new Application(req.body);
    const saved = await application.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error('Submit Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/applications/:userId', async (req, res) => {
  try {
    const apps = await Application.find({ userId: req.params.userId }).sort({ submittedAt: -1 });
    res.json(apps);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
